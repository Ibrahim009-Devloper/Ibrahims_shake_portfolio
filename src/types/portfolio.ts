export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: 'Target' | 'Building2' | 'Search' | 'MapPin' | 'Database' | 'CheckCheck';
  tags?: string[];
}

export interface WorkStep {
  stepNumber: string;
  title: string;
  description: string;
}

export interface CaseStudyData {
  overview: string;
  objective: string;
  researchSource: string;
  dataFields: string[];
  process: string[];
  toolsUsed: string[];
  finalOutput: string;
  sampleRows?: Array<Record<string, string>>;
}

export interface ProjectItem {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  dataCollected: string;
  tools: string[];
  outputFormat: string;
  isDemoSample: boolean;
  coverBadge?: string;
  caseStudy: CaseStudyData;
}

export interface ToolItem {
  id: string;
  name: string;
  category: 'Automation Tool' | 'Core Capability';
  description: string;
  highlight?: boolean;
}

export interface BackgroundItem {
  degree: string;
  institution: string;
  period: string;
}

export interface PortfolioData {
  profile: {
    name: string;
    title: string;
    location: string;
    email: string;
    linkedIn: string;
    status: string;
    avatarUrl?: string;
  };
  hero: {
    headline: string;
    supportingHeadline: string;
    supportingParagraph: string;
    capabilities: string[];
    primaryCtaText: string;
    secondaryCtaText: string;
  };
  trustStrip: string[];
  services: ServiceItem[];
  howIWork: WorkStep[];
  projects: ProjectItem[];
  tools: ToolItem[];
  about: {
    title: string;
    statement: string;
    capabilities: string[];
    background: BackgroundItem;
  };
  cta: {
    headline: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
  };
  contact: {
    email: string;
    linkedIn: string;
    location: string;
    availabilityNote: string;
  };
}
