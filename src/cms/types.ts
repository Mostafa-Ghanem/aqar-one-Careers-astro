export interface DefaultSEO {
  title: string;
  description: string;
}

export interface SiteSettings {
  name: string;
  careersName: string;
  url: string;
  mainSite: string;
  hrEmail: string;
  phone: string;
  phoneDisplay: string;
  offices: string[];
  defaultSeo: DefaultSEO;
  applyEndpoint: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface ActionLink {
  label: string;
  href: string;
}

export interface HeroBlock {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: ActionLink;
  secondaryCta: ActionLink;
  seal: {
    class: string;
    label: string;
  };
  stats: StatItem[];
}

export interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

export interface ValuesBlock {
  eyebrow: string;
  title: string;
  items: ValueItem[];
}

export interface JobsBlock {
  eyebrow: string;
  title: string;
  emptyText: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface ProcessBlock {
  eyebrow: string;
  title: string;
  steps: ProcessStep[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQBlock {
  eyebrow: string;
  title: string;
  items: FAQItem[];
}

export interface CTABlock {
  title: string;
  description: string;
}

export interface HomePageContent {
  hero: HeroBlock;
  values: ValuesBlock;
  jobs: JobsBlock;
  process: ProcessBlock;
  faq: FAQBlock;
  cta: CTABlock;
}

export type JobStatus = 'open' | 'closing-soon' | 'closed';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Temporary' | 'Internship';
export type WorkMode = 'On-site' | 'Hybrid' | 'Remote';

export interface JobData {
  title: string;
  dept: string;
  code: string;
  location: string;
  type: EmploymentType;
  mode: WorkMode;
  experience?: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  status: JobStatus;
  datePosted: string;
  validThrough?: string;
}

export interface Job {
  id: string;
  slug: string;
  data: JobData;
  body?: string;
}
