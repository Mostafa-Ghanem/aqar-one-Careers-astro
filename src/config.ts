const rawEndpoint = (import.meta.env.PUBLIC_APPLY_ENDPOINT ?? '').trim();

export const isValidApplyEndpoint = (url: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

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

  // PUBLIC_APPLY_ENDPOINT configured via Cloudflare Pages or .env
  applyEndpoint: rawEndpoint,

  application: {
    maxCvBytes: 50 * 1024 * 1024,
    allowedCvExtensions: ['pdf', 'doc', 'docx'],
  },
} as const;
