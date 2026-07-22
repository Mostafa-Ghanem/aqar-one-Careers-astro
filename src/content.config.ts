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

const pages = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/pages' }),
  schema: z.object({
    hero: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      primaryCta: z.object({ label: z.string(), href: z.string() }),
      secondaryCta: z.object({ label: z.string(), href: z.string() }),
      seal: z.object({ class: z.string(), label: z.string() }),
      stats: z.array(z.object({ value: z.string(), label: z.string() })),
    }),
    values: z.object({
      eyebrow: z.string(),
      title: z.string(),
      items: z.array(z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string(),
      })),
    }),
    jobs: z.object({
      eyebrow: z.string(),
      title: z.string(),
      emptyText: z.string(),
    }),
    process: z.object({
      eyebrow: z.string(),
      title: z.string(),
      steps: z.array(z.object({
        title: z.string(),
        description: z.string(),
      })),
    }),
    faq: z.object({
      eyebrow: z.string(),
      title: z.string(),
      items: z.array(z.object({
        question: z.string(),
        answer: z.string(),
      })),
    }),
    cta: z.object({
      title: z.string(),
      description: z.string(),
    }),
  }),
});

const settings = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/settings' }),
  schema: z.object({
    name: z.string(),
    careersName: z.string(),
    url: z.string().url(),
    mainSite: z.string().url(),
    hrEmail: z.string().email(),
    phone: z.string(),
    phoneDisplay: z.string(),
    offices: z.array(z.string()),
    defaultSeo: z.object({
      title: z.string(),
      description: z.string(),
    }),
  }),
});

export const collections = { jobs, pages, settings };
