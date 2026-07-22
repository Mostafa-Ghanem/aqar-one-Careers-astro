import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const jobs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/jobs' }),
  schema: z.object({
    title: z.string().min(1),
    dept: z.string().min(1),
    code: z.string().regex(/^AQ1-[A-Z0-9]{2,6}-\d{3}$/),
    location: z.string().default('Jeddah, Saudi Arabia'),
    type: z.enum(['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship']).default('Full-time'),
    mode: z.enum(['On-site', 'Hybrid', 'Remote']).default('On-site'),
    experience: z.string().optional(),
    summary: z.string().min(40),
    responsibilities: z.array(z.string().min(1)).min(1),
    requirements: z.array(z.string().min(1)).min(1),
    status: z.enum(['open', 'closing-soon', 'closed']).default('open'),
    datePosted: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    validThrough: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  }),
});

export const collections = { jobs };
