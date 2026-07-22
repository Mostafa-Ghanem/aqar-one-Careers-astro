import { getCollection, getEntry, render } from 'astro:content';
import type { SiteSettings, HomePageContent, Job } from './types';
import { SITE as fallbackSiteConfig } from '../config';

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const entry = await getEntry('settings', 'site');
    if (entry && entry.data) {
      return {
        ...entry.data,
        applyEndpoint: fallbackSiteConfig.applyEndpoint,
      } as SiteSettings;
    }
  } catch (error) {
    console.warn('Could not load site settings from Content Collections, using fallback config:', error);
  }

  return {
    name: fallbackSiteConfig.name,
    careersName: fallbackSiteConfig.careersName,
    url: fallbackSiteConfig.url,
    mainSite: fallbackSiteConfig.mainSite,
    hrEmail: fallbackSiteConfig.hrEmail,
    phone: fallbackSiteConfig.phone,
    phoneDisplay: fallbackSiteConfig.phoneDisplay,
    offices: [...fallbackSiteConfig.offices],
    defaultSeo: {
      title: 'Careers at Aqar One — Real Estate Jobs in Jeddah',
      description: 'Join Aqar One — a Class A licensed Saudi real estate group in Jeddah, since 2011. Explore open roles in sales, marketing, and operations.',
    },
    applyEndpoint: fallbackSiteConfig.applyEndpoint,
  };
}

export async function getHomePageContent(): Promise<HomePageContent> {
  const entry = await getEntry('pages', 'home');
  if (!entry || !entry.data) {
    throw new Error('Home page content (src/content/pages/home.json) is missing or invalid.');
  }
  return entry.data as HomePageContent;
}

export async function getAllJobs(): Promise<Job[]> {
  const jobEntries = await getCollection('jobs');
  return jobEntries.map((entry) => ({
    id: entry.id,
    slug: entry.id,
    data: entry.data,
    body: entry.body,
  }));
}

export async function getOpenJobs(): Promise<Job[]> {
  const allJobs = await getAllJobs();
  return allJobs
    .filter((job) => job.data.status !== 'closed')
    .sort((a, b) => b.data.datePosted.localeCompare(a.data.datePosted));
}

export async function getJobBySlug(slug: string): Promise<{ job: Job; Content: any } | null> {
  const jobEntries = await getCollection('jobs');
  const entry = jobEntries.find((j) => j.id === slug);
  if (!entry || entry.data.status === 'closed') {
    return null;
  }

  const { Content } = await render(entry);
  return {
    job: {
      id: entry.id,
      slug: entry.id,
      data: entry.data,
      body: entry.body,
    },
    Content,
  };
}
