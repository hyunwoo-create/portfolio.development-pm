import { GameHistory, ResumeData, Project, SkillTab, ToolItem, Skill } from '../types';

/**
 * 이 파일은 Supabase에 데이터가 없을 때만 사용되는 최소 초기값입니다.
 * 실제 데이터는 모두 Supabase에 저장·관리됩니다.
 */

export const GAME_HISTORY: GameHistory = {
  online: [],
  mobile: [],
  package: [],
};

export const RESUME_DATA: ResumeData = {
  name: '',
  role: '',
  birthDate: '',
  address: '',
  phone: '',
  email: '',
  linkedin: '',
  github: '',
  summary: '',
  selfIntroduction: '',
  selfIntroTabs: [],
  techStack: [],
  coreCompetencies: [],
  totalExperience: '',
  leftEducation: [],
  education: [],
  experience: [],
  awards: [],
};

export const PROJECTS: Project[] = [];

export const PORTFOLIO_PROJECTS: Project[] = [];

export const SKILLS: Skill[] = [];

export const INITIAL_SKILL_TABS: SkillTab[] = [];

export const INITIAL_TOOLS: ToolItem[] = [];
