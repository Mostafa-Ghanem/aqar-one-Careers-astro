import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const jobs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/jobs' }),
  schema: z.object({
    title: z.string(),
    dept: z.string(),            // e.g. "Sales"
    code: z.string(),            // e.g. "AQ1-SAL-001"
    location: z.string().default('Jeddah, Saudi Arabia'),
    type: z.string().default('Full-time'),
    mode: z.string().default('On-site'),
    experience: z.string().optional(),
    summary: z.string(),
    responsibilities: z.array(z.string()),
    requirements: z.array(z.string()),
    open: z.boolean().default(true),
    datePosted: z.string(),      // ISO date, used in JSON-LD
  }),
});

export const collections = { jobs };
