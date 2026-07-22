const envApplyEndpoint = (import.meta.env.PUBLIC_APPLY_ENDPOINT ?? '').trim();

export const SITE = {
  name: 'Aqar One',
  careersName: 'Aqar One Careers',
  url: 'https://jobs.aqar1.com',
  mainSite: 'https://aqar1.com',
  hrEmail: 'hr@aqar1.com',
  phone: '+966550595911',
  phoneDisplay: '+966 55 059 5911',
  offices: [
    'Al-Safa District, opposite the Notary Public, Jeddah',
    "Ash Shera'a District, Prince Nayef St., Obhur Al-Shamaliyah, Jeddah",
  ],

  // Recommended: set PUBLIC_APPLY_ENDPOINT in Cloudflare Pages.
  // It must be the deployed Google Apps Script Web App URL ending in /exec.
  applyEndpoint: envApplyEndpoint,

  application: {
    maxCvBytes: 5 * 1024 * 1024,
    allowedCvExtensions: ['pdf', 'doc', 'docx'],
  },
} as const;
