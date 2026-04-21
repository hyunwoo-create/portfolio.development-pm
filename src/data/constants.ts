import { GameHistory, ResumeData, Project, SkillTab, ToolItem, Skill } from '../types';

export const HERO_CONTENT_DEFAULT = {
  titleLine1: "기획의도를 알고",
  titleLine2: "목차를 쓸줄 아는 기획자",
  description: "사용자의 경험을 논리적으로 설계하고, 명확한 문서화를 통해 팀의 비전을 구체화합니다. 데이터와 심리학을 기반으로 한 깊이 있는 기획을 지향합니다."
};

export const ABOUT_CONTENT_DEFAULT = {
  titleLeft: "Q. 누구를 채용해야 할까요?",
  titleRight: "A. 저 입니다. 지원자 양 현우",
  videoTitle: "크롤러 동영상",
  chartTitle: "막대형 그래프 채용 지원자격 top3",
  skill1Name: "기획력",
  skill1Value: 80,
  skill2Name: "커뮤니케이션",
  skill2Value: 60,
  skill3Name: "기술 이해도",
  skill3Value: 40,
  chartTotal: 100,
  descTitle1: "기획력 및 문제해결 능력",
  descText1: "채용 공고에서 요구하는 최우선 역량을 완벽하게 충족하며, 실무에서 즉시 성과를 창출할 수 있는 기획력과 문제해결 능력을 보유하고 있습니다.",
  descTitle2: "협업 지향적 리더십",
  descText2: "다양한 직군과의 협업 경험을 통해 커뮤니케이션 비용을 줄이고, 복잡한 프로젝트를 리드하여 성공적인 런칭을 이끌어냅니다.",
  descTitle3: "기술적 이해도",
  descText3: "데이터 수집 및 분석 자동화(크롤링) 경험을 바탕으로, 높은 수준의 기술적 이해도를 지니고 있어 개발팀과 매끄럽게 소통합니다.",
};

export const GAME_HISTORY: GameHistory = {
  online: [
    { id: '1', name: 'League of Legends', hours: 500 },
  ],
  mobile: [
    { id: '2', name: 'Genshin Impact', hours: 200 },
  ],
  package: [
    { id: '3', name: 'Elden Ring', hours: 150 },
  ],
};

export const RESUME_DATA: ResumeData = {
  name: '양현우',
  role: 'Game PM / Product Manager',
  birthDate: '1995.05.20',
  address: '서울특별시 양천구',
  phone: '010-4034-1154',
  email: 'yhw154@naver.com',
  linkedin: 'linkedin.com/in/yhw154',
  github: 'github.com/yhw154',
  summary: '10년의 조율 감각으로 협업을 완성하고 결과로 증명하는 PM입니다.',
  selfIntroduction: '성장 과정 및 가치관...',
  selfIntroTabs: [
    { id: 'intro-1', title: '성장 과정', content: '내용...' }
  ],
  techStack: [
    { id: 'ts-1', label: 'Engines', items: ['Unity', 'UE5'] },
    { id: 'ts-2', label: 'Others', items: ['Python', 'SQL'] }
  ],
  coreCompetencies: [
    '수치 기반 밸런싱',
    '시스템 구조 설계'
  ],
  totalExperience: '총 경력 6년',
  education: [
    { title: 'OO대학교 게임공학과', period: '2014.03 - 2020.02', description: '학사 졸업', details: ['전공 평점 4.2/4.5'] }
  ],
  leftExperience: [
    { title: 'OO게임즈', period: '2020.03 - 현재', description: '게임 기획 및 PM', details: ['라이브 서비스 운영'] }
  ],
  experience: [
    { title: '신규 프로젝트 런칭', period: '2021.01 - 2022.06', description: '프로젝트 총괄 PM', details: ['매출 목표 120% 달성'] }
  ],
  awards: [
    { title: '우수 사원상', organization: 'OO게임즈', year: '2022' }
  ],
};

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Interactive Portfolio',
    category: 'WEB',
    description: 'React와 Framer Motion을 이용한 고도화된 포트폴리오',
    image: 'https://picsum.photos/seed/p1/800/600',
    color: 'from-blue-500 to-cyan-400',
    tags: ['React', 'TypeScript'],
    details: ['UI/UX 설계', '애니메이션 최적화'],
    content: '# Project Content\n\nDetailed description here.',
    chartPoints: [
      { x: 30, y: 80, label: "Planning", detail: "초기 기획" },
      { x: 120, y: 50, label: "Design", detail: "디자인" },
      { x: 200, y: 60, label: "Execution", detail: "개발" },
      { x: 280, y: 30, label: "Troubleshoot", detail: "디버깅" },
      { x: 370, y: 15, label: "Impact", detail: "런칭" },
    ]
  }
];

export const SKILLS: Skill[] = [
  { name: 'React', level: 90, icon: 'Cpu', caption: '고급 수준' }
];

export const INITIAL_SKILL_TABS: SkillTab[] = [
  { id: 'tab1', name: '개발', skills: SKILLS }
];

export const INITIAL_TOOLS: ToolItem[] = [
  { id: 'tool1', name: 'VS Code', iconUrl: '', description: 'Main IDE' }
];
