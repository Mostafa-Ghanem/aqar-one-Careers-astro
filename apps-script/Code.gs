/**
 * Aqar One Careers — Google Apps Script backend
 *
 * Receives a JSON POST from jobs.aqar1.com, validates it, stores the CV in
 * Google Drive, appends the application to Google Sheets, and emails HR.
 *
 * ONE-TIME SETUP
 * 1) Open the target Google Sheet → Extensions → Apps Script.
 * 2) Replace the editor contents with this file.
 * 3) Confirm SHEET_ID and NOTIFY_EMAIL below.
 * 4) Run setup() once and approve the requested permissions.
 * 5) Deploy → New deployment → Web app:
 *      Execute as: Me
 *      Who has access: Anyone
 * 6) Copy the /exec URL and set it as PUBLIC_APPLY_ENDPOINT in Cloudflare Pages.
 *
 * After code changes: Deploy → Manage deployments → Edit → New version → Deploy.
 */

const SHEET_ID = '1P0r5sdt_PFQPP5y2fPQUILeGALS3whnUQmvAj_xiwas';
const SHEET_NAME = 'Applications';
const FOLDER_NAME = 'Aqar One — CVs';
const NOTIFY_EMAIL = 'hr@aqar1.com'; // Set to '' to disable notifications.
const MAX_CV_BYTES = 5 * 1024 * 1024;
const MAX_BASE64_LENGTH = 7_100_000;
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'];


const LEGACY_HEADERS = [
  'Timestamp',
  'Job',
  'Code',
  'Name',
  'Email',
  'Phone',
  'LinkedIn',
  'Cover Note',
  'CV Link',
];

const HEADERS = [
  'Timestamp',
  'Submission ID',
  'Job',
  'Code',
  'Name',
  'Email',
  'Phone',
  'LinkedIn',
  'Cover Note',
  'CV Link',
  'Source URL',
  'User Agent',
];

function doGet() {
  return jsonOutput({ ok: true, service: 'Aqar One Careers', timestamp: new Date().toISOString() });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Empty request body.');
    }

    const data = JSON.parse(e.postData.contents);

    // Basic bot trap. Return success without storing anything so bots do not retry.
    if (cleanSingleLine(data && data.website, 200)) {
      return jsonOutput({ ok: true });
    }

    const validated = validateApplication(data);

    const cache = CacheService.getScriptCache();
    const cacheKey = 'submission:' + validated.submissionId;
    if (cache.get(cacheKey)) {
      return jsonOutput({ ok: true, duplicate: true, submissionId: validated.submissionId });
    }

    const cvFile = saveCv(validated);
    const cvUrl = cvFile.getUrl();

    try {
      appendApplication(validated, cvUrl);
    } catch (error) {
      // Avoid leaving an orphan CV when the spreadsheet write fails.
      try { cvFile.setTrashed(true); } catch (trashError) { console.error(trashError); }
      throw error;
    }

    cache.put(cacheKey, 'saved', 21600); // Six hours.
    sendHrNotification(validated, cvUrl);

    return jsonOutput({ ok: true, submissionId: validated.submissionId });
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return jsonOutput({ ok: false, error: 'The application could not be saved.' });
  }
}

/** Run manually once after pasting the script. */
function setup() {
  const sheet = getApplicationsSheet();
  ensureHeaders(sheet);
  const folder = getCvFolder();

  console.log('Sheet ready: ' + sheet.getParent().getUrl());
  console.log('CV folder ready: ' + folder.getUrl());
}

function validateApplication(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Invalid JSON payload.');
  }

  const application = {
    submissionId: cleanSingleLine(data.submissionId, 100),
    job: cleanSingleLine(data.job, 180),
    code: cleanSingleLine(data.code, 40),
    name: cleanSingleLine(data.name, 120),
    email: cleanSingleLine(data.email, 160).toLowerCase(),
    phone: cleanSingleLine(data.phone, 40),
    linkedin: cleanSingleLine(data.linkedin, 300),
    message: cleanMultiline(data.message, 3000),
    consent: data.consent === true,
    website: cleanSingleLine(data.website, 200),
    elapsedMs: Number(data.elapsedMs || 0),
    sourceUrl: cleanSingleLine(data.sourceUrl, 500),
    userAgent: cleanSingleLine(data.userAgent, 500),
    cvName: cleanSingleLine(data.cvName, 180),
    cvType: cleanSingleLine(data.cvType, 150),
    cvSize: Number(data.cvSize || 0),
    cvData: String(data.cvData || ''),
  };

  if (!/^[A-Za-z0-9._:-]{8,100}$/.test(application.submissionId)) {
    throw new Error('Invalid submission ID.');
  }
  if (!application.job || !/^AQ1-[A-Z0-9]{2,6}-\d{3}$/.test(application.code)) {
    throw new Error('Invalid job details.');
  }
  if (application.name.length < 2) throw new Error('Name is required.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(application.email)) throw new Error('Invalid email.');
  if ((application.phone.match(/\d/g) || []).length < 8) throw new Error('Invalid phone.');
  if (application.linkedin && !/^https?:\/\/[^\s]+$/i.test(application.linkedin)) throw new Error('Invalid LinkedIn URL.');
  if (!application.consent) throw new Error('Consent is required.');
  if (!application.cvData || !application.cvName) throw new Error('CV is required.');
  if (application.cvData.length > MAX_BASE64_LENGTH) throw new Error('CV payload is too large.');
  if (application.cvSize < 1 || application.cvSize > MAX_CV_BYTES) throw new Error('Invalid CV size.');

  const extension = getExtension(application.cvName);
  if (ALLOWED_EXTENSIONS.indexOf(extension) === -1) throw new Error('Unsupported CV file type.');

  // A human form cannot realistically be completed immediately after page load.
  if (application.elapsedMs && application.elapsedMs < 1000) {
    throw new Error('Submission completed too quickly.');
  }

  return application;
}

function saveCv(application) {
  const bytes = Utilities.base64Decode(application.cvData);
  if (!bytes || bytes.length < 1 || bytes.length > MAX_CV_BYTES) {
    throw new Error('Decoded CV size is invalid.');
  }

  const extension = getExtension(application.cvName);
  const mimeType = mimeTypeForExtension(extension);
  const safeName = sanitizeFilename(
    application.code + ' — ' + application.name + ' — ' + application.submissionId.slice(0, 12) + '.' + extension,
  );

  const blob = Utilities.newBlob(bytes, mimeType, safeName);
  const file = getCvFolder().createFile(blob);
  file.setDescription('Application for ' + application.job + ' (' + application.code + ')');
  return file;
}

function appendApplication(application, cvUrl) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) throw new Error('Could not obtain spreadsheet lock.');

  try {
    const sheet = getApplicationsSheet();
    ensureHeaders(sheet);
    sheet.appendRow([
      new Date(),
      safeSheetCell(application.submissionId),
      safeSheetCell(application.job),
      safeSheetCell(application.code),
      safeSheetCell(application.name),
      safeSheetCell(application.email),
      safeSheetCell(application.phone),
      safeSheetCell(application.linkedin),
      safeSheetCell(application.message),
      cvUrl,
      safeSheetCell(application.sourceUrl),
      safeSheetCell(application.userAgent),
    ]);
  } finally {
    lock.releaseLock();
  }
}

function sendHrNotification(application, cvUrl) {
  if (!NOTIFY_EMAIL) return;

  const subject = cleanSingleLine(
    'New application: ' + application.job + ' (' + application.code + ') — ' + application.name,
    240,
  );

  const body = [
    'A new job application has been received.',
    '',
    'Submission ID: ' + application.submissionId,
    'Job: ' + application.job,
    'Code: ' + application.code,
    'Name: ' + application.name,
    'Email: ' + application.email,
    'Phone: ' + application.phone,
    'LinkedIn: ' + (application.linkedin || '-'),
    '',
    'Cover note:',
    application.message || '-',
    '',
    'CV: ' + cvUrl,
    'Source: ' + (application.sourceUrl || '-'),
  ].join('\n');

  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      body: body,
      name: 'Aqar One Careers',
    });
  } catch (error) {
    // The application is already saved. Notification failure must not lose it.
    console.error('HR notification failed: ' + error);
  }
}

function getApplicationsSheet() {
  if (!SHEET_ID || SHEET_ID.indexOf('PASTE_') === 0) {
    throw new Error('SHEET_ID is not configured.');
  }

  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    const firstSheet = spreadsheet.getSheets()[0];
    sheet = firstSheet || spreadsheet.insertSheet(SHEET_NAME);
    if (sheet.getName() !== SHEET_NAME) sheet.setName(SHEET_NAME);
  }

  return sheet;
}

function ensureHeaders(sheet) {
  const current = sheet.getRange(1, 1, 1, Math.max(HEADERS.length, sheet.getLastColumn() || 1)).getValues()[0];

  if (headersMatch(current, HEADERS)) return;

  if (headersMatch(current, LEGACY_HEADERS)) {
    // Migrate the original 9-column version without losing existing applications.
    sheet.insertColumnAfter(1);
    sheet.getRange(1, 2).setValue('Submission ID');
    sheet.getRange(1, 11, 1, 2).setValues([['Source URL', 'User Agent']]);
    styleHeaderRow(sheet);
    return;
  }

  const firstRowIsEmpty = current.every(function (value) { return String(value || '') === ''; });
  if (sheet.getLastRow() === 0 || firstRowIsEmpty) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    styleHeaderRow(sheet);
    return;
  }

  throw new Error('The Applications sheet has unexpected headers.');
}

function headersMatch(current, expected) {
  return expected.every(function (header, index) {
    return String(current[index] || '') === header;
  });
}

function styleHeaderRow(sheet) {
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  sheet.autoResizeColumns(1, HEADERS.length);
}

function getCvFolder() {
  const properties = PropertiesService.getScriptProperties();
  const savedId = properties.getProperty('CV_FOLDER_ID');

  if (savedId) {
    try {
      return DriveApp.getFolderById(savedId);
    } catch (error) {
      properties.deleteProperty('CV_FOLDER_ID');
    }
  }

  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(FOLDER_NAME);
  properties.setProperty('CV_FOLDER_ID', folder.getId());
  return folder;
}

function safeSheetCell(value) {
  const text = String(value == null ? '' : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function cleanSingleLine(value, maxLength) {
  return String(value == null ? '' : value)
    .replace(/[\u0000-\u001F\u007F]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function cleanMultiline(value, maxLength) {
  return String(value == null ? '' : value)
    .replace(/\u0000/g, '')
    .replace(/\r\n?/g, '\n')
    .trim()
    .slice(0, maxLength);
}

function sanitizeFilename(value) {
  return String(value)
    .replace(/[\\/:*?"<>|\r\n]+/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
}

function getExtension(filename) {
  const parts = String(filename || '').toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
}

function mimeTypeForExtension(extension) {
  if (extension === 'pdf') return 'application/pdf';
  if (extension === 'doc') return 'application/msword';
  if (extension === 'docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  return 'application/octet-stream';
}

function jsonOutput(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
