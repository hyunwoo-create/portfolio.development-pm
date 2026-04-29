// --- Types ---
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  color: string;
  content: string;
  downloadUrl?: string;
  downloadFileName?: string;
  details?: string[];
  linkUrls?: Record<string, string>;
  releaseTags?: { id: string; label: string; url: string; icon: string }[];
  videoUrl?: string;
  pdfDocuments?: { id: string; name: string; url: string }[];
}

export interface Skill {
 name: string;
 level: number;
 icon: string;
 caption?: string;
}

export interface SkillTab {
 id: string;
 name: string;
 skills: Skill[];
}

export interface ToolItem {
 id: string;
 name: string;
 iconUrl: string;
 description: string;
}


export interface IntroCard {
 id: string;
 title: string;
 description: string;
}

export interface SelfIntroTab {
 id: string;
 title: string;
 content: string;
 style?: any;
 cards?: IntroCard[]; // Legacy support
 vizBlocks?: { [markerIndex: number]: IntroCard[] }; // Support for multiple (시각화) markers
}

export interface TechStackCategory {
 id: string;
 label: string;
 items: string[];
}

export interface ResumeData {
 name: string;
 nameStyle?: any;
 role: string;
 roleStyle?: any;
 birthDate: string;
 address: string;
 phone: string;
 email: string;
 linkedin: string;
 github: string;
 militaryService?: string;
 summary: string;
 summaryStyle?: any;
 selfIntroduction: string;
 selfIntroTabs?: SelfIntroTab[];
 techStack?: TechStackCategory[];
 coreCompetencies?: string[];
 resumeImage?: string;
 education: {
 title: string;
 period: string;
 description: string;
 details: string[];
 }[];
 experience: {
    title: string;
    titleStyle?: any;
    period: string;
    description: string;
    details: string[];
    style?: any;
  }[];
 awards: {
 title: string;
 organization: string;
 year: string;
 }[];
 leftEducation?: {
   title: string;
   period: string;
   description: string;
   details: string[];
 }[];
 leftExperience?: {
   title: string;
   period: string;
   description: string;
   details: string[];
 }[];
 leftCertificates?: {
   title: string;
   organization: string;
   period: string;
 }[];
 usedTools?: any[];
 usedToolsBottom?: any[];
 keyActivities?: {
   title: string;
   description: string;
 }[];
 totalExperience?: string;
}

