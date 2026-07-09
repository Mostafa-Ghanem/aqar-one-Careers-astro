/**
 * Aqar One Jobs — Google Apps Script backend
 * Receives applications (JSON POST) → saves CV to Drive → appends row to Sheet.
 *
 * SETUP (once, ~5 minutes):
 * 1. Open your sheet (already linked below). Add header row in row 1:
 *    Timestamp | Job | Code | Name | Email | Phone | LinkedIn | Cover Note | CV Link
 * 2. In the Sheet: Extensions → Apps Script. Paste this file.
 *    (SHEET_ID is already filled in; the CV folder is created automatically in Drive.)
 * 3. Deploy → New deployment → type "Web app":
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Copy the Web App URL into `applyEndpoint` in astro/src/config.ts, rebuild, redeploy.
 */

const SHEET_ID = '1P0r5sdt_PFQPP5y2fPQUILeGALS3whnUQmvAj_xiwas'; // Aqar One — Applications sheet
const FOLDER_NAME = 'Aqar One — CVs'; // Drive folder for CVs (auto-created on first application)
const NOTIFY_EMAIL = 'hr@aqar1.com'; // set to '' to disable email notifications

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // 1. Save CV to Drive
    let cvUrl = '';
    if (data.cvData) {
      const blob = Utilities.newBlob(
        Utilities.base64Decode(data.cvData),
        data.cvType || 'application/pdf',
        (data.code || 'CV') + ' — ' + (data.name || 'Applicant') + ' — ' + (data.cvName || 'cv.pdf')
      );
      const folders = DriveApp.getFoldersByName(FOLDER_NAME);
      const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(FOLDER_NAME);
      const file = folder.createFile(blob);
      cvUrl = file.getUrl();
    }

    // 2. Append row to Sheet
    SpreadsheetApp.openById(SHEET_ID).getSheets()[0].appendRow([
      new Date(),
      data.job || '',
      data.code || '',
      data.name || '',
      data.email || '',
      data.phone || '',
      data.linkedin || '',
      data.message || '',
      cvUrl,
    ]);

    // 3. Notify HR
    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: 'New application: ' + (data.job || '') + ' (' + (data.code || '') + ') — ' + (data.name || ''),
        body:
          'Name: ' + (data.name || '') + '\n' +
          'Email: ' + (data.email || '') + '\n' +
          'Phone: ' + (data.phone || '') + '\n' +
          'LinkedIn: ' + (data.linkedin || '-') + '\n\n' +
          'Cover note:\n' + (data.message || '-') + '\n\n' +
          'CV: ' + (cvUrl || '-'),
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
