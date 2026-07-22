import { defineConfig } from 'tinacms';

// Branch for Cloudflare / GitHub integration
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.CLOUDFLARE_EMBEDDED_GIT_BRANCH ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,

  // Get this from app.tina.io for cloud features (optional for local dev)
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'assets',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      {
        name: 'jobs',
        label: 'Job Listings',
        path: 'src/content/jobs',
        format: 'md',
        ui: {
          router: ({ document }) => `/jobs/${document._sys.filename}`,
        },
        fields: [
          { type: 'string', name: 'title', label: 'Job Title', isTitle: true, required: true },
          { type: 'string', name: 'dept', label: 'Department', required: true },
          { type: 'string', name: 'code', label: 'Role Code (e.g. AQ1-SALES-001)', required: true },
          { type: 'string', name: 'location', label: 'Location', required: true },
          {
            type: 'string',
            name: 'type',
            label: 'Employment Type',
            options: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'],
            required: true,
          },
          {
            type: 'string',
            name: 'mode',
            label: 'Work Mode',
            options: ['On-site', 'Hybrid', 'Remote'],
            required: true,
          },
          { type: 'string', name: 'experience', label: 'Experience Level' },
          { type: 'string', name: 'summary', label: 'Role Summary', ui: { component: 'textarea' }, required: true },
          { type: 'string', name: 'responsibilities', label: 'Key Responsibilities', list: true, required: true },
          { type: 'string', name: 'requirements', label: 'Requirements', list: true, required: true },
          {
            type: 'string',
            name: 'status',
            label: 'Posting Status',
            options: [
              { label: 'Open', value: 'open' },
              { label: 'Closing Soon', value: 'closing-soon' },
              { label: 'Closed', value: 'closed' },
            ],
            required: true,
          },
          { type: 'string', name: 'datePosted', label: 'Date Posted (YYYY-MM-DD)', required: true },
          { type: 'string', name: 'validThrough', label: 'Valid Through (YYYY-MM-DD)' },
          { type: 'rich-text', name: 'body', label: 'About the Role (Body Content)', isBody: true },
        ],
      },
      {
        name: 'pages',
        label: 'Pages',
        path: 'src/content/pages',
        format: 'json',
        fields: [
          {
            type: 'object',
            name: 'hero',
            label: 'Hero Section',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow Tag' },
              { type: 'string', name: 'title', label: 'Hero Title' },
              { type: 'string', name: 'description', label: 'Hero Description', ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'primaryCta',
                label: 'Primary Button',
                fields: [
                  { type: 'string', name: 'label', label: 'Label' },
                  { type: 'string', name: 'href', label: 'Link URL' },
                ],
              },
              {
                type: 'object',
                name: 'secondaryCta',
                label: 'Secondary Button',
                fields: [
                  { type: 'string', name: 'label', label: 'Label' },
                  { type: 'string', name: 'href', label: 'Link URL' },
                ],
              },
              {
                type: 'object',
                name: 'seal',
                label: 'Seal Badge',
                fields: [
                  { type: 'string', name: 'class', label: 'Grade/Class' },
                  { type: 'string', name: 'label', label: 'Badge Label' },
                ],
              },
              {
                type: 'object',
                name: 'stats',
                label: 'Statistics Bar',
                list: true,
                fields: [
                  { type: 'string', name: 'value', label: 'Value / Number' },
                  { type: 'string', name: 'label', label: 'Description' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'values',
            label: 'Why Join Us Section',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow Tag' },
              { type: 'string', name: 'title', label: 'Section Title' },
              {
                type: 'object',
                name: 'items',
                label: 'Value Cards',
                list: true,
                fields: [
                  { type: 'string', name: 'icon', label: 'Icon Name (star, building, trending-up)' },
                  { type: 'string', name: 'title', label: 'Card Title' },
                  { type: 'string', name: 'description', label: 'Card Description', ui: { component: 'textarea' } },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'jobs',
            label: 'Open Roles Section Header',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow Tag' },
              { type: 'string', name: 'title', label: 'Section Title' },
              { type: 'string', name: 'emptyText', label: 'No Roles Fallback Text' },
            ],
          },
          {
            type: 'object',
            name: 'process',
            label: 'Hiring Process Section',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow Tag' },
              { type: 'string', name: 'title', label: 'Section Title' },
              {
                type: 'object',
                name: 'steps',
                label: 'Steps',
                list: true,
                fields: [
                  { type: 'string', name: 'title', label: 'Step Title' },
                  { type: 'string', name: 'description', label: 'Step Description', ui: { component: 'textarea' } },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'faq',
            label: 'FAQ Section',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow Tag' },
              { type: 'string', name: 'title', label: 'Section Title' },
              {
                type: 'object',
                name: 'items',
                label: 'FAQ Accordion Items',
                list: true,
                fields: [
                  { type: 'string', name: 'question', label: 'Question' },
                  { type: 'string', name: 'answer', label: 'Answer', ui: { component: 'textarea' } },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'cta',
            label: 'Bottom CTA Strip',
            fields: [
              { type: 'string', name: 'title', label: 'CTA Title' },
              { type: 'string', name: 'description', label: 'CTA Subtitle', ui: { component: 'textarea' } },
            ],
          },
        ],
      },
      {
        name: 'settings',
        label: 'Site Settings',
        path: 'src/content/settings',
        format: 'json',
        fields: [
          { type: 'string', name: 'name', label: 'Company Name', required: true },
          { type: 'string', name: 'careersName', label: 'Careers Site Name', required: true },
          { type: 'string', name: 'url', label: 'Careers Site URL', required: true },
          { type: 'string', name: 'mainSite', label: 'Main Website URL', required: true },
          { type: 'string', name: 'hrEmail', label: 'HR Email Address', required: true },
          { type: 'string', name: 'phone', label: 'Raw Phone Number (tel: format)', required: true },
          { type: 'string', name: 'phoneDisplay', label: 'Formatted Phone Number', required: true },
          { type: 'string', name: 'offices', label: 'Office Locations', list: true },
          {
            type: 'object',
            name: 'defaultSeo',
            label: 'Default SEO Metadata',
            fields: [
              { type: 'string', name: 'title', label: 'SEO Title' },
              { type: 'string', name: 'description', label: 'SEO Description', ui: { component: 'textarea' } },
            ],
          },
        ],
      },
    ],
  },
});
