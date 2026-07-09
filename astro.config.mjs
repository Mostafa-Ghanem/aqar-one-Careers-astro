import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jobs.aqar1.com',
  integrations: [sitemap()],
});
