// --- Types ---
export interface Project {
 id: number;
 title: string;
 category: string;
 description: string;
 tags: string[];
 image: string;
 color: string;
 content: string;
 downloadUrl?: string;
 downloadFileName?: string;
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

export interface GamePlay {
 id: string;
 name: string;
 hours: number;
}

export interface GameHistory {
 online: GamePlay[];
 mobile: GamePlay[];
 package: GamePlay[];
}

export interface SelfIntroTab {
 id: string;
 title: string;
 content: string;
 style?: any;
}

export interface TechStackCategory {
 id: string;
 label: string;
 items: string[];
}

export interface ResumeData {
 name: string;
 role: string;
 birthDate: string;
 address: string;
 phone: string;
 email: string;
 linkedin: string;
 github: string;
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
 period: string;
 description: string;
 details: string[];
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
 totalExperience?: string;
}

