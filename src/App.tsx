/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Gamepad2, 
  Layers, 
  ScrollText, 
  Target, 
  Cpu, 
  Code2, 
  ExternalLink, 
  Mail, 
  Github, 
  Linkedin,
  ChevronRight,
  Terminal,
  Zap,
  ArrowUpRight,
  Sparkles,
  Gamepad,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Wrench,
  ArrowLeft,
  Menu,
  X,
  ArrowUp,
  Monitor,
  Smartphone,
  Package as PackageIcon,
  Clock,
  Save,
  Edit3,
  Lock,
  Plus,
  Video,
  Settings,
  Trash2,
  Upload,
  Image as ImageIcon,
  FolderOpen,
  Download,
  FileText
} from 'lucide-react';

// --- Types ---
interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  color: string;
  content: string;
}

interface Skill {
  name: string;
  level: number;
  icon: string;
  caption?: string;
}

interface SkillTab {
  id: string;
  name: string;
  skills: Skill[];
}

interface ToolItem {
  id: string;
  name: string;
  iconUrl: string;
  description: string;
}

interface GamePlay {
  id: string;
  name: string;
  hours: number;
}

interface GameHistory {
  online: GamePlay[];
  mobile: GamePlay[];
  package: GamePlay[];
}

interface SelfIntroTab {
  id: string;
  title: string;
  content: string;
}

interface TechStackCategory {
  id: string;
  label: string;
  items: string[];
}

interface ResumeData {
  name: string;
  role: string;
  email: string;
  linkedin: string;
  github: string;
  summary: string;
  selfIntroduction: string;
  selfIntroTabs?: SelfIntroTab[];
  techStack?: TechStackCategory[];
  coreCompetencies?: string[];
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
}

// --- Mock Data ---
const GAME_HISTORY: GameHistory = {
  online: [
    { id: 'o1', name: "League of Legends", hours: 3500 },
    { id: 'o2', name: "Lost Ark", hours: 1200 },
    { id: 'o3', name: "MapleStory", hours: 2000 },
    { id: 'o4', name: "Overwatch 2", hours: 800 }
  ],
  mobile: [
    { id: 'm1', name: "Genshin Impact", hours: 900 },
    { id: 'm2', name: "Blue Archive", hours: 500 },
    { id: 'm3', name: "Fate/Grand Order", hours: 700 },
    { id: 'm4', name: "Arknights", hours: 400 }
  ],
  package: [
    { id: 'p1', name: "Elden Ring", hours: 180 },
    { id: 'p2', name: "The Legend of Zelda: BotW", hours: 300 },
    { id: 'p3', name: "Monster Hunter: World", hours: 600 },
    { id: 'p4', name: "Cyberpunk 2077", hours: 120 }
  ]
};

const RESUME_DATA: ResumeData = {
  name: "이민호",
  role: "Game System Designer",
  email: "minho.dev@email.com",
  linkedin: "linkedin.com/in/minho-game",
  github: "github.com/minho-dev",
  summary: "\"재미\"를 수치와 논리로 증명하는 게임 기획자입니다. 단순한 아이디어 나열이 아닌, 유기적으로 연결된 시스템과 플레이어의 감정 곡선을 고려한 설계를 지향합니다. 데이터 기반의 의사결정과 끊임없는 프로토타이핑을 통해 최상의 사용자 경험을 만들어냅니다.",
  selfIntroduction: `
# 자기소개서

## 1. 성장 과정 및 가치관
어린 시절부터 게임은 저에게 단순한 오락 이상의 의미였습니다. 다양한 장르의 게임을 접하며 '왜 이 게임은 재미있을까?'라는 질문을 끊임없이 던졌고, 이는 자연스럽게 게임 기획이라는 꿈으로 이어졌습니다. 저는 "논리 없는 재미는 우연이지만, 설계된 재미는 필연이다"라는 가치관을 가지고 있습니다.

## 2. 강점 및 핵심 역량
저의 가장 큰 강점은 데이터와 논리에 기반한 사고력입니다. 밸런싱 작업 시 단순한 감에 의존하지 않고, 엑셀 시뮬레이션과 확률 통계를 활용하여 의도한 수치 결과가 나오도록 정밀하게 설계합니다. 또한, 개발팀과의 원활한 소통을 위해 기술적 이해도를 높이려 노력하며, 기획 의도를 명확하게 전달하는 문서를 작성하는 데 탁월합니다.

## 3. 지원 동기 및 포부
플레이어의 심리를 꿰뚫는 정교한 시스템 설계를 통해, 전 세계 게이머들에게 잊지 못할 경험을 선사하고 싶습니다. 귀사에서 저의 기획 역량을 발휘하여 시장을 선도하는 혁신적인 게임을 만드는 데 기여하겠습니다. 끊임없이 배우고 성장하는 기획자로서, 팀의 핵심 인재로 거듭나겠습니다.
  `,
  selfIntroTabs: [
    {
      id: 'intro-1',
      title: '성장 과정 및 가치관',
      content: '어린 시절부터 게임은 저에게 단순한 오락 이상의 의미였습니다. 다양한 장르의 게임을 접하며 \'왜 이 게임은 재미있을까?\'라는 질문을 끊임없이 던졌고, 이는 자연스럽게 게임 기획이라는 꿈으로 이어졌습니다. 저는 "논리 없는 재미는 우연이지만, 설계된 재미는 필연이다"라는 가치관을 가지고 있습니다.'
    },
    {
      id: 'intro-2',
      title: '강점 및 핵심 역량',
      content: '저의 가장 큰 강점은 데이터와 논리에 기반한 사고력입니다. 밸런싱 작업 시 단순한 감에 의존하지 않고, 엑셀 시뮬레이션과 확률 통계를 활용하여 의도한 수치 결과가 나오도록 정밀하게 설계합니다. 또한, 개발팀과의 원활한 소통을 위해 기술적 이해도를 높이려 노력하며, 기획 의도를 명확하게 전달하는 문서를 작성하는 데 탁월합니다.'
    },
    {
      id: 'intro-3',
      title: '지원 동기 및 포부',
      content: '플레이어의 심리를 꿰뚫는 정교한 시스템 설계를 통해, 전 세계 게이머들에게 잊지 못할 경험을 선사하고 싶습니다. 귀사에서 저의 기획 역량을 발휘하여 시장을 선도하는 혁신적인 게임을 만드는 데 기여하겠습니다. 끊임없이 배우고 성장하는 기획자로서, 팀의 핵심 인재로 거듭나겠습니다.'
    }
  ],
  techStack: [
    { id: 'ts-1', label: 'Engines & Languages', items: ['Unity', 'UE5', 'C#', 'C++', 'Blueprints'] },
    { id: 'ts-2', label: 'Design Tools', items: ['Excel', 'Python', 'Jira', 'Figma', 'Confluence'] }
  ],
  coreCompetencies: [
    '수치 기반의 밸런싱 시뮬레이션',
    '논리적인 시스템 구조 설계',
    '플레이어 심리 분석 및 UX 설계'
  ],
  education: [
    {
      title: "게임 기획 전문가 부트캠프 (6개월)",
      period: "2024.01 - 2024.06",
      description: "실무 중심의 게임 기획 프로세스 전반을 이수했습니다.",
      details: [
        "시스템 기획: 캐릭터 성장 곡선 및 경제 밸런싱 설계",
        "레벨 디자인: UE5를 활용한 수직적 구조의 3D 레벨 제작",
        "GDD 작성: 50페이지 분량의 상세 기획서 3종 작성"
      ]
    },
    {
      title: "한국대학교 게임공학과",
      period: "2019.03 - 2023.02",
      description: "게임 엔진 기초 및 컴퓨터 그래픽스, 확률과 통계 등 게임 개발의 공학적 기초를 다졌습니다.",
      details: []
    }
  ],
  experience: [
    {
      title: "네온 프로토콜 (Neon Protocol)",
      period: "2024.03 - 2024.05",
      description: "사이버펑크 RPG 시스템 기획 및 프로토타이핑",
      details: [
        "엑셀을 활용한 1~50레벨 구간의 경험치 및 스탯 성장 테이블 설계",
        "모듈형 스킬 트리 시스템 설계 (20종 이상의 액티브/패시브 스킬)",
        "Python 스크립트를 활용한 전투 밸런싱 시뮬레이션 1,000회 수행"
      ]
    },
    {
      title: "잊혀진 첨탑 (The Forgotten Spire)",
      period: "2024.02 - 2024.03",
      description: "UE5 기반 3D 플랫포머 레벨 디자인",
      details: [
        "플레이어 동선을 고려한 랜드마크 배치 및 시각적 가이드 설계",
        "환경 스토리텔링 요소를 활용한 내러티브 전달 방식 구현"
      ]
    }
  ],
  awards: [
    { title: "게임기획전문가 자격증", organization: "한국콘텐츠진흥원", year: "2023" },
    { title: "부트캠프 우수 수료생 선정", organization: "OO 교육기관", year: "2024" }
  ]
};
const PROJECTS: Project[] = [
  {
    id: 1,
    title: "네온 프로토콜 (Neon Protocol)",
    category: "시스템 디자인",
    description: "모듈형 어빌리티 트리와 동적 경제 밸런싱에 중점을 둔 사이버펑크 테마의 RPG 시스템입니다. 핵심 루프와 진행 방식을 다루는 50페이지 분량의 기획서를 작성했습니다.",
    tags: ["시스템 기획", "GDD 작성", "밸런싱"],
    image: "https://picsum.photos/seed/cyberpunk/800/600",
    color: "from-indigo-500/20 to-purple-500/20",
    content: `
# 네온 프로토콜 (Neon Protocol) 기획 상세

## 1. 프로젝트 개요
네온 프로토콜은 사이버펑크 세계관을 배경으로 한 하이퍼-캐주얼 RPG입니다. 플레이어는 해커가 되어 거대 기업의 메인프레임을 해킹하고, 그 과정에서 얻은 자원으로 자신의 '어빌리티 트리'를 커스터마이징합니다.

## 2. 핵심 시스템 디자인
### 2.1 모듈형 어빌리티 트리
- **자유도**: 100개 이상의 모듈을 조합하여 자신만의 전투 스타일을 구축합니다.
- **시너지**: 특정 모듈 조합 시 숨겨진 '오버클럭' 효과가 발동됩니다.

### 2.2 동적 경제 시스템
- **인플레이션 제어**: 게임 내 재화인 '크레딧'의 가치를 유지하기 위한 소모처(Sink)를 다각화했습니다.
- **보상 루프**: 리스크가 클수록 보상이 기하급수적으로 늘어나는 '하이 리스크 하이 리턴' 구조입니다.

## 3. 기획 의도
플레이어에게 "성장의 즐거움"과 "선택의 중요성"을 동시에 전달하는 것을 목표로 했습니다. 복잡한 수치 계산은 시스템이 처리하되, 플레이어는 직관적인 UI를 통해 결과값을 체감할 수 있도록 설계했습니다.

## 4. 기대 효과
- 높은 리플레이 가치 (다양한 빌드 구성 가능)
- 커뮤니티 활성화 (최적의 빌드 공유 및 토론)
`
  },
  {
    id: 2,
    title: "잊혀진 첨탑 (The Forgotten Spire)",
    category: "레벨 디자인",
    description: "언리얼 엔진 5로 제작된 3D 플랫포머 레벨입니다. 수직적 구조, 조명을 활용한 플레이어 가이드, 환경 스토리텔링에 집중했습니다.",
    tags: ["레벨 디자인", "UE5", "스토리텔링"],
    image: "https://picsum.photos/seed/castle/800/600",
    color: "from-emerald-500/20 to-teal-500/20",
    content: `
# 잊혀진 첨탑 (The Forgotten Spire) 레벨 디자인

## 1. 디자인 컨셉
고대 문명의 유적을 탐험하는 수직적 구조의 레벨입니다. 플레이어는 첨탑의 하층부에서 시작하여 최상층의 '천공의 방'까지 도달해야 합니다.

## 2. 레벨 디자인 핵심 요소
### 2.1 수직적 동선 설계
- **고저차 활용**: 점프와 등반을 통해 공간의 입체감을 극대화했습니다.
- **숏컷(Shortcut)**: 특정 구간 돌파 시 이전 지역으로 빠르게 돌아갈 수 있는 문을 배치하여 편의성을 높였습니다.

### 2.2 시각적 가이드 (Lighting)
- **빛의 인도**: 플레이어가 가야 할 방향에 강렬한 빛이나 대조적인 색상을 배치하여 자연스러운 유도를 꾀했습니다.
- **랜드마크**: 멀리서도 보이는 거대한 조각상을 배치하여 현재 위치를 파악하기 쉽게 했습니다.

## 3. 환경 스토리텔링
벽면의 벽화, 부서진 가구의 배치 등을 통해 과거 이곳에서 어떤 일이 일어났는지 플레이어가 추측할 수 있도록 디테일을 추가했습니다.

## 4. 사용 툴
- Unreal Engine 5 (Lumen, Nanite 활용)
- Blender (커스텀 에셋 제작)
`
  },
  {
    id: 3,
    title: "택티컬 에코 (Tactical Echoes)",
    category: "전투 디자인",
    description: "턴제 전략 프로토타입입니다. 유닛이 마지막 행동을 낮은 효율로 반복하는 독특한 '에코' 메커니즘을 설계했습니다.",
    tags: ["전투 기획", "프로토타이핑", "전략"],
    image: "https://picsum.photos/seed/strategy/800/600",
    color: "from-orange-500/20 to-rose-500/20",
    content: `
# 택티컬 에코 (Tactical Echoes) 전투 디자인

## 1. 핵심 메커니즘: 에코(Echo)
유닛이 턴을 종료할 때, 이전 턴에 수행한 행동(공격, 이동, 방어 등)을 50%의 위력으로 자동 반복합니다. 이 '잔상' 효과를 어떻게 배치하느냐가 승패의 핵심입니다.

## 2. 전략적 깊이
### 2.1 위치 선정의 중요성
- 에코는 유닛의 현재 위치가 아닌, '행동이 수행되었던 위치'에서 발생합니다.
- 이를 이용해 적을 유인하거나, 아군을 보호하는 겹겹의 방어선을 구축할 수 있습니다.

### 2.2 콤보 시스템
- 특정 유닛의 에코가 다른 유닛의 행동과 연쇄 반응을 일으켜 강력한 광역 공격을 퍼부을 수 있습니다.

## 3. 밸런싱 전략
에코 시스템이 너무 강력해지지 않도록 '에코 게이지'를 도입했습니다. 게이지가 가득 차야만 에코가 발동되며, 발동 후에는 유닛이 일시적으로 약화됩니다.

## 4. 개발 현황
- Unity 엔진을 활용한 핵심 루프 프로토타이핑 완료
- 10종의 유닛 클래스 설계 및 밸런스 시뮬레이션 진행 중
`
  },
  {
    id: 4,
    title: "크로노 바운드 (Chrono Bound)",
    category: "시스템 디자인",
    description: "시간 역행 메커니즘을 활용한 퍼즐 액션 게임의 시스템 기획서입니다.",
    tags: ["시간 역행", "퍼즐 기획", "시스템"],
    image: "https://picsum.photos/seed/time/800/600",
    color: "from-blue-500/20 to-cyan-500/20",
    content: "# 크로노 바운드 상세 기획..."
  },
  {
    id: 5,
    title: "스타더스트 아레나 (Stardust Arena)",
    category: "전투 디자인",
    description: "무중력 환경에서의 3:3 팀 전투 밸런싱 및 유닛 스킬 설계 프로젝트입니다.",
    tags: ["무중력", "팀 전투", "밸런싱"],
    image: "https://picsum.photos/seed/space/800/600",
    color: "from-indigo-500/20 to-blue-500/20",
    content: "# 스타더스트 아레나 상세 기획..."
  }
];

const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: 101,
    title: "UI/UX 개선 제안서",
    category: "UI/UX",
    description: "기존 모바일 RPG의 복잡한 상점 UI를 직관적으로 개선한 디자인 제안서입니다.",
    tags: ["UI 개선", "UX 분석", "피그마"],
    image: "https://picsum.photos/seed/ui/800/600",
    color: "from-blue-500/10 to-indigo-500/10",
    content: "# UI/UX 개선 제안 상세..."
  },
  {
    id: 102,
    title: "신규 캐릭터 컨셉 아트",
    category: "아트 컨셉",
    description: "스팀펑크 세계관의 기계공 캐릭터 비주얼 컨셉 및 스킬 이펙트 가이드입니다.",
    tags: ["스팀펑크", "캐릭터", "가이드"],
    image: "https://picsum.photos/seed/steampunk/800/600",
    color: "from-amber-500/10 to-orange-500/10",
    content: "# 캐릭터 컨셉 상세..."
  },
  {
    id: 103,
    title: "게임 시장 분석 보고서",
    category: "시장 분석",
    description: "2024년 상반기 서브컬처 게임 시장 트렌드 및 향후 전망 분석 보고서입니다.",
    tags: ["시장 조사", "트렌드", "데이터"],
    image: "https://picsum.photos/seed/chart/800/600",
    color: "from-emerald-500/10 to-teal-500/10",
    content: "# 시장 분석 보고서 상세..."
  },
  {
    id: 104,
    title: "퀘스트 스크립트 샘플",
    category: "내러티브",
    description: "다중 선택지에 따른 분기형 퀘스트 스크립트 및 대사 연출 가이드입니다.",
    tags: ["스크립트", "내러티브", "분기"],
    image: "https://picsum.photos/seed/book/800/600",
    color: "from-rose-500/10 to-pink-500/10",
    content: "# 퀘스트 스크립트 상세..."
  }
];

const SKILLS: Skill[] = [
  { name: "시스템 디자인", level: 90, icon: 'Cpu', caption: "복잡한 수치 체계 및 밸런싱 설계 가능" },
  { name: "레벨 디자인", level: 85, icon: 'Layers', caption: "UE5 기반 수직적 동선 및 라이팅 가이드 설계" },
  { name: "내러티브 디자인", level: 80, icon: 'ScrollText', caption: "세계관 설정 및 퀘스트 스크립트 작성" },
  { name: "밸런싱 & QA", level: 95, icon: 'Target', caption: "시뮬레이션을 통한 정밀한 수치 검증" },
  { name: "C# / Blueprint", level: 75, icon: 'Code2', caption: "기능 구현 및 프로토타이핑 가능" },
];

const INITIAL_SKILL_TABS: SkillTab[] = [
  {
    id: 'tab-1',
    name: '기획 역량',
    skills: [
      { name: "시스템 디자인", level: 90, icon: 'Cpu', caption: "복잡한 수치 체계 및 밸런싱 설계 가능" },
      { name: "레벨 디자인", level: 85, icon: 'Layers', caption: "UE5 기반 수직적 동선 및 라이팅 가이드 설계" },
      { name: "내러티브 디자인", level: 80, icon: 'ScrollText', caption: "세계관 설정 및 퀘스트 스크립트 작성" },
    ]
  },
  {
    id: 'tab-2',
    name: '기술 역량',
    skills: [
      { name: "밸런싱 & QA", level: 95, icon: 'Target', caption: "시뮬레이션을 통한 정밀한 수치 검증" },
      { name: "C# / Blueprint", level: 75, icon: 'Code2', caption: "기능 구현 및 프로토타이핑 가능" },
    ]
  }
];

const INITIAL_TOOLS: ToolItem[] = [
  {
    id: 'tool-1',
    name: 'Figma',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
    description: 'UI/UX 디자인 및 프로토타이핑. 와이어프레임부터 고해상도 목업까지 전반적인 디자인 작업에 활용합니다.'
  },
  {
    id: 'tool-2',
    name: 'Jira',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg',
    description: '애자일 프로젝트 관리 및 이슈 트래킹. 스프린트 계획, 백로그 관리, 버그 추적 등에 활용합니다.'
  },
  {
    id: 'tool-3',
    name: 'Unity',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg',
    description: '게임 프로토타이핑 및 인터랙티브 시뮬레이션 제작. 핵심 루프 검증용 프로토타입 빌드에 사용합니다.'
  }
];

// --- Supabase Content API ---
const SUPABASE_CONTENT_API = 'https://bovxanwamgbhlubrndyl.supabase.co/functions/v1/content-api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvdnhhbndhbWdiaGx1YnJuZHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ0NDAsImV4cCI6MjA5MTM1MDQ0MH0.b4MvsylK--ZJrkjWZnkzcSHpjHxYiyJTA-lYsI8Ij4Y';

let _contentCache: Record<string, any> | null = null;
let _contentPromise: Promise<Record<string, any>> | null = null;

const fetchAllContent = (): Promise<Record<string, any>> => {
  if (_contentCache) return Promise.resolve(_contentCache);
  if (_contentPromise) return _contentPromise;
  _contentPromise = fetch(SUPABASE_CONTENT_API, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      _contentCache = data;
      return data;
    })
    .catch(() => {
      _contentCache = {};
      return {};
    });
  return _contentPromise;
};

const saveContentToSupabase = async (key: string, value: any) => {
  try {
    await fetch(SUPABASE_CONTENT_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ password: 'qwer154', key, value }),
    });
  } catch (e) {
    console.error('Failed to save content:', e);
  }
};

// --- Editable Content Hook ---
const useEditableContent = (initialData: any, key: string) => {
  const [data, setData] = useState(initialData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchAllContent().then(allContent => {
      if (allContent[key] !== undefined) {
        setData(allContent[key]);
      }
      setLoaded(true);
    });
  }, [key]);

  const updateData = (newData: any) => {
    setData(newData);
    saveContentToSupabase(key, newData);
  };

  return [data, updateData];
};

// --- Components ---

const EditableText = ({ 
  value, 
  onSave, 
  isEditing, 
  className = "", 
  multiline = false 
}: { 
  value: string, 
  onSave: (v: string) => void, 
  isEditing: boolean, 
  className?: string,
  multiline?: boolean
}) => {
  if (!isEditing) return <span className={className}>{value}</span>;

  return multiline ? (
    <textarea
      className={`w-full max-w-full bg-white/5 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-indigo-500 ${className}`}
      value={value}
      onChange={(e) => onSave(e.target.value)}
      rows={3}
    />
  ) : (
    <input
      className={`w-full max-w-full bg-white/5 border border-white/20 rounded px-2 py-1 text-white focus:outline-none focus:border-indigo-500 ${className}`}
      value={value}
      onChange={(e) => onSave(e.target.value)}
    />
  );
};

const PasswordModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: (pw: string) => void }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(password);
    setPassword('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-md w-full glass rounded-[2rem] p-8"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">관리자 인증</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">비밀번호를 입력하세요</label>
                <input
                  type="password"
                  autoFocus
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-center text-2xl tracking-widest"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 glass rounded-xl text-white font-bold hover:bg-white/10 transition-all"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/25"
                >
                  확인
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ setView, currentView, onNavClick, isEditing, setIsEditing }: { setView: (v: 'home' | 'resume' | 'project-detail' | 'portfolio' | 'all-projects') => void, currentView: string, onNavClick: (id: string) => void, isEditing: boolean, setIsEditing: (v: boolean) => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    onNavClick(id);
    setIsMenuOpen(false);
  };

  const handleResumeClick = () => {
    setView('resume');
    setIsMenuOpen(false);
  };

  const handlePortfolioClick = () => {
    setView('portfolio');
    setIsMenuOpen(false);
  };

  const handleAdminClick = () => {
    if (isEditing) {
      setIsEditing(false);
      alert("관리자 모드가 비활성화되었습니다.");
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  const handlePasswordConfirm = (pw: string) => {
    if (pw === 'qwer154') {
      setIsEditing(true);
      setIsPasswordModalOpen(false);
      alert("관리자 모드가 활성화되었습니다. 내용을 클릭하여 수정하세요.");
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 glass rounded-2xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMenuOpen(false); }}>
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <User className="text-white w-5 h-5" />
          </div>
          <span className="font-bold tracking-tight text-lg">지원자 양현우</span>
          {isEditing && (
            <div className="ml-2 px-2 py-0.5 bg-amber-500/20 border border-amber-500/50 rounded text-[10px] text-amber-500 font-bold uppercase animate-pulse">
              Edit Mode
            </div>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="hover:text-white transition-colors">소개</a>
          <a href="#portfolio-section" onClick={(e) => handleLinkClick(e, 'portfolio-section')} className="hover:text-white transition-colors">포트폴리오</a>
          <a href="#skills" onClick={(e) => handleLinkClick(e, 'skills')} className="hover:text-white transition-colors">핵심역량</a>
          <a href="#my-tools" onClick={(e) => handleLinkClick(e, 'my-tools')} className="hover:text-white transition-colors">사용 Tool</a>
          <button 
            onClick={handleResumeClick} 
            className={`hover:text-white transition-colors cursor-pointer ${currentView === 'resume' ? 'text-white' : ''}`}
          >
            이력서
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleAdminClick}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
              title="관리자 모드"
            >
              <Lock className={`w-4 h-4 transition-colors ${isEditing ? 'text-amber-500' : 'text-slate-400 group-hover:text-white'}`} />
            </button>
            <a href="#contact" onClick={(e) => handleLinkClick(e, 'contact')} className="glass px-4 py-2 rounded-xl text-white hover:bg-white/10 transition-all">문의하기</a>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button 
            onClick={handleAdminClick}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Lock className={`w-5 h-5 ${isEditing ? 'text-amber-500' : 'text-slate-400'}`} />
          </button>
          <button 
            className="text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-0 w-full glass rounded-2xl p-6 flex flex-col gap-4 lg:hidden"
            >
              <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="text-lg font-medium text-slate-400 hover:text-white">소개</a>
              <a href="#portfolio-section" onClick={(e) => handleLinkClick(e, 'portfolio-section')} className="text-lg font-medium text-slate-400 hover:text-white">포트폴리오</a>
              <a href="#skills" onClick={(e) => handleLinkClick(e, 'skills')} className="text-lg font-medium text-slate-400 hover:text-white">핵심역량</a>
              <a href="#my-tools" onClick={(e) => handleLinkClick(e, 'my-tools')} className="text-lg font-medium text-slate-400 hover:text-white">사용 Tool</a>
              <button 
                onClick={handleResumeClick} 
                className={`text-left text-lg font-medium text-slate-400 hover:text-white ${currentView === 'resume' ? 'text-white' : ''}`}
              >
                이력서
              </button>
              <a href="#contact" onClick={(e) => handleLinkClick(e, 'contact')} className="glass px-4 py-3 rounded-xl text-white text-center font-bold">문의하기</a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <PasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        onConfirm={handlePasswordConfirm} 
      />
    </>
  );
};

// --- YouTube URL Helper ---
const convertToEmbedUrl = (url: string): string => {
  if (!url) return url;
  // Already an embed URL
  if (url.includes('/embed/')) return url;
  // youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${watchMatch[1]}`;
  // youtu.be/VIDEO_ID
  const shortMatch = url.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${shortMatch[1]}`;
  // youtube.com/shorts/VIDEO_ID
  const shortsMatch = url.match(/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${shortsMatch[1]}`;
  return url;
};

const isDirectVideoUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes('.mp4') || url.includes('.webm') || url.startsWith('data:video/') || url.startsWith('blob:');
};

// --- Hero Video Settings Modal ---
const HeroVideoSettingsModal = ({ isOpen, onClose, videoUrl, onSave }: { isOpen: boolean, onClose: () => void, videoUrl: string, onSave: (url: string) => void }) => {
  const [url, setUrl] = useState(videoUrl);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrl(videoUrl);
  }, [videoUrl]);

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Use URL.createObjectURL for video files (FileReader may fail with large videos)
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
  };

  const handleSave = () => {
    // Auto-convert YouTube URLs to embed format
    const processedUrl = isDirectVideoUrl(url) ? url : convertToEmbedUrl(url);
    onSave(processedUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass rounded-3xl p-8 w-full max-w-lg border border-white/10"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Hero 영상 설정</h3>
              <p className="text-xs text-slate-400">영상 파일을 업로드하거나 URL을 입력하세요</p>
            </div>
          </div>
          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">영상 파일 업로드</label>
              <button
                onClick={() => videoFileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-3 bg-white/5 border-2 border-dashed border-white/20 rounded-xl px-4 py-4 text-white hover:bg-white/10 hover:border-indigo-500/50 transition-all"
              >
                <Upload className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-bold">영상 파일 선택 (.mp4, .webm)</span>
              </button>
              <input
                ref={videoFileInputRef}
                type="file"
                accept="video/mp4,video/webm"
                className="hidden"
                onChange={handleVideoFileUpload}
              />
            </div>

            <div className="flex items-center gap-3 text-slate-500">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-xs font-bold">또는</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">영상 URL</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-600"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... 또는 youtu.be/..."
              />
            </div>
            <p className="text-xs text-slate-500">YouTube URL을 그대로 붙여넣으세요. 자동으로 변환됩니다. 직접 영상 파일(.mp4, .webm)도 지원됩니다.</p>

            {url && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-xs text-emerald-400 font-bold">✓ 영상이 설정되었습니다</p>
                <p className="text-[10px] text-slate-500 mt-1 truncate">{url.startsWith('data:') || url.startsWith('blob:') ? '업로드된 파일' : url}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 glass rounded-xl text-white font-bold hover:bg-white/10 transition-all"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/25"
              >
                저장
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Hero = ({ onPortfolioClick, onResumeClick, isEditing, content, setContent }: { onPortfolioClick: () => void, onResumeClick: () => void, isEditing: boolean, content: any, setContent: (c: any) => void }) => {
  const [isVideoSettingsOpen, setIsVideoSettingsOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleVideoPlayback = () => {
    const newState = !isVideoPlaying;
    setIsVideoPlaying(newState);
    if (videoRef.current) {
      newState ? videoRef.current.play() : videoRef.current.pause();
    }
  };

  // Determine if URL is a direct video file
  const isDirectVideo = isDirectVideoUrl(content.heroVideoUrl || '');

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ═══════ Layer 1: Video Background (70% of max-w-7xl container, from the right) ═══════ */}
      <div className="hidden lg:block absolute inset-0">
        <div className="relative w-full h-full max-w-7xl mx-auto">
          <div className="absolute top-0 right-0 h-full" style={{ width: '70%' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="relative w-full h-full"
            >
              {content.heroVideoUrl ? (
                isDirectVideo ? (
                  <video
                    ref={videoRef}
                    src={content.heroVideoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <iframe
                    src={content.heroVideoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Hero Video"
                    style={{ border: 'none' }}
                  />
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/50">
                  <Video className="w-20 h-20 mb-4 opacity-20" />
                  <p className="text-sm opacity-40">영상을 설정해주세요</p>
                </div>
              )}

              {/* ─── 10-step horizontal gradient: #0f172a → transparent (left to right) ─── */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: [
                  'linear-gradient(to right,',
                  '#0f172a 0%,',               // Step 1: 100% opaque
                  'rgba(15,23,42, 0.97) 3%,',  // Step 2
                  'rgba(15,23,42, 0.92) 7%,',  // Step 3
                  'rgba(15,23,42, 0.85) 12%,', // Step 4
                  'rgba(15,23,42, 0.74) 19%,', // Step 5
                  'rgba(15,23,42, 0.60) 28%,', // Step 6
                  'rgba(15,23,42, 0.44) 38%,', // Step 7
                  'rgba(15,23,42, 0.26) 50%,', // Step 8
                  'rgba(15,23,42, 0.12) 65%,', // Step 9
                  'rgba(15,23,42, 0.03) 82%,', // Step 10
                  'transparent 100%)'
                ].join(' ')
              }}></div>

              {/* ─── 10-step vertical gradient: top/bottom edges fade ─── */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: [
                  'linear-gradient(to bottom,',
                  'rgba(15,23,42, 0.50) 0%,',   // Step 1: top edge
                  'rgba(15,23,42, 0.35) 4%,',   // Step 2
                  'rgba(15,23,42, 0.20) 8%,',   // Step 3
                  'rgba(15,23,42, 0.10) 14%,',  // Step 4
                  'rgba(15,23,42, 0.03) 22%,',  // Step 5
                  'transparent 32%,',            // Steps 6-7: clear
                  'transparent 70%,',
                  'rgba(15,23,42, 0.10) 80%,',  // Step 8
                  'rgba(15,23,42, 0.40) 90%,',  // Step 9
                  'rgba(15,23,42, 0.95) 100%)'  // Step 10: bottom edge
                ].join(' ')
              }}></div>

              {/* Subtle decorative color wash */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>

              {/* Video Controls (inside video layer) */}
              <div className="absolute top-24 right-6 z-30 flex items-center gap-2">
                {content.heroVideoUrl && isDirectVideo && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleVideoPlayback}
                    className="px-4 py-2 glass rounded-xl flex items-center gap-2 text-sm font-bold text-white border border-white/20 hover:bg-white/10 transition-all"
                  >
                    {isVideoPlaying ? (
                      <><span className="w-4 h-4 flex items-center justify-center"><span className="inline-flex gap-[3px]"><span className="w-[3px] h-3 bg-white rounded-sm"></span><span className="w-[3px] h-3 bg-white rounded-sm"></span></span></span> 일시정지</>
                    ) : (
                      <><span className="w-4 h-4 flex items-center justify-center"><span className="w-0 h-0 border-l-[10px] border-l-white border-y-[6px] border-y-transparent"></span></span> 재생</>
                    )}
                  </motion.button>
                )}
                {isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsVideoSettingsOpen(true)}
                    className="px-4 py-2 glass rounded-xl flex items-center gap-2 text-sm font-bold text-white border border-white/20 hover:bg-white/10 transition-all"
                  >
                    <Settings className="w-4 h-4" /> 영상 설정
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══════ Layer 2: Text content (higher z-index, floats OVER video) ═══════ */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pt-20">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <h1 className="flex flex-col gap-3 mb-10">
            <EditableText 
              value={content.titleLine1 || "기획의도를 알고"} 
              onSave={(v) => setContent({...content, titleLine1: v})} 
              isEditing={isEditing} 
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-indigo-400 tracking-[0.3em] uppercase opacity-90"
            />
            <EditableText 
              value={content.titleLine2 || "목차를 쓸줄 아는 기획자"} 
              onSave={(v) => setContent({...content, titleLine2: v})} 
              isEditing={isEditing} 
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.05] drop-shadow-2xl"
            />
          </h1>
          <p className="max-w-xl text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-12">
            <EditableText 
              value={content.description} 
              onSave={(v) => setContent({...content, description: v})} 
              isEditing={isEditing} 
              multiline
            />
          </p>
          
          <div className="flex flex-wrap gap-4">
            <motion.button 
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onResumeClick}
              className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl flex items-center gap-2 shadow-xl shadow-indigo-500/25 hover:bg-indigo-500 transition-all"
            >
              이력서 보기 <ChevronRight className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onPortfolioClick}
              className="px-8 py-4 glass font-bold rounded-2xl hover:bg-white/5 transition-all flex items-center gap-2"
            >
              포트폴리오 보기 <ArrowUpRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ═══════ Mobile: Video block below text (not overlapping) ═══════ */}
      <div className="block lg:hidden w-full px-6 pb-8">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/10 aspect-video bg-slate-900/50 mt-8">
          {content.heroVideoUrl ? (
            isDirectVideo ? (
              <video
                src={content.heroVideoUrl}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <iframe
                src={content.heroVideoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Hero Video"
              />
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
              <Video className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-sm opacity-50">영상을 설정해주세요</p>
            </div>
          )}
          {isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVideoSettingsOpen(true)}
              className="absolute top-4 right-4 z-20 px-4 py-2 glass rounded-xl flex items-center gap-2 text-sm font-bold text-white border border-white/20 hover:bg-white/10 transition-all"
            >
              <Settings className="w-4 h-4" /> 영상 설정
            </motion.button>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/4 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
          />
        </div>
      </motion.div>

      <HeroVideoSettingsModal
        isOpen={isVideoSettingsOpen}
        onClose={() => setIsVideoSettingsOpen(false)}
        videoUrl={content.heroVideoUrl || ''}
        onSave={(url) => setContent({...content, heroVideoUrl: url})}
      />
    </section>
  );
};

const About = ({ isEditing, content, setContent }: { isEditing: boolean, content: any, setContent: (c: any) => void }) => (
  <section id="about" className="py-32 px-6 max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-12 gap-12 items-start">
      <div className="lg:col-span-7">
        <div className="inline-block px-4 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold mb-6">01_ABOUT ME</div>
        <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight leading-tight">
          <EditableText 
            value={content.title} 
            onSave={(v) => setContent({...content, title: v})} 
            isEditing={isEditing} 
            className="block text-white"
          />
          <EditableText 
            value={content.subtitle} 
            onSave={(v) => setContent({...content, subtitle: v})} 
            isEditing={isEditing} 
            className="block text-white"
          />
        </h2>
        <div className="space-y-6 text-slate-400 text-lg leading-relaxed font-medium">
          <p>
            <EditableText 
              value={content.p1} 
              onSave={(v) => setContent({...content, p1: v})} 
              isEditing={isEditing} 
              multiline
            />
          </p>
          <p>
            <EditableText 
              value={content.p2} 
              onSave={(v) => setContent({...content, p2: v})} 
              isEditing={isEditing} 
              multiline
            />
          </p>
        </div>
        
        <div className="mt-12">
          <div className="inline-block px-4 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold mb-6 uppercase tracking-widest">Point</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {content.stats.map((stat: any, idx: number) => (
              <div key={idx} className="bento-card !p-6">
                <div className="text-3xl font-bold text-indigo-400 mb-1">
                  <EditableText 
                    value={stat.value} 
                    onSave={(v) => {
                      const newStats = [...content.stats];
                      newStats[idx].value = v;
                      setContent({...content, stats: newStats});
                    }} 
                    isEditing={isEditing} 
                  />
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                  <EditableText 
                    value={stat.label} 
                    onSave={(v) => {
                      const newStats = [...content.stats];
                      newStats[idx].label = v;
                      setContent({...content, stats: newStats});
                    }} 
                    isEditing={isEditing} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-5 relative">
        <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 group shadow-2xl shadow-indigo-500/10">
          <img 
            src="https://picsum.photos/seed/designer/800/1000" 
            alt="Designer Profile" 
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-transparent opacity-60"></div>
          <div className="absolute bottom-8 left-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-emerald-400 tracking-widest">STATUS: READY_TO_BUILD</span>
            </div>
            <div className="text-white text-2xl font-bold">PM 지원자</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Projects = ({ onProjectClick, isEditing, projects, setProjects, limit, setView }: { onProjectClick: (p: Project) => void, isEditing: boolean, projects: Project[], setProjects: (p: Project[]) => void, limit?: number, setView?: (v: any) => void }) => {
  const displayedProjects = limit ? projects.slice(0, limit) : projects;
  const projectFileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const handleProjectImageUpload = (projectIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const newProjects = [...projects];
      newProjects[projectIdx].image = dataUrl;
      setProjects(newProjects);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="projects" className="py-32 px-6 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div>
            <div className="inline-block px-4 py-1 rounded-lg bg-pink-500/10 text-pink-400 text-xs font-bold mb-6">02_PORTFOLIO</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">포트폴리오.</h2>
          </div>
          <p className="text-slate-500 max-w-md text-lg font-medium">
            기획 및 연구를 통해 개발한 프로젝트 결과물입니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, idx) => (
            <motion.div 
              key={project.id}
              whileHover={{ y: -10 }}
              className="group relative flex flex-col glass rounded-[2rem] overflow-hidden transition-all duration-500"
            >
              {isEditing && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const newProjects = projects.filter(p => p.id !== project.id);
                    setProjects(newProjects);
                  }}
                  className="absolute top-4 right-4 z-20 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  title="삭제"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="aspect-[16/10] overflow-hidden relative">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-40`}></div>
                <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                  <EditableText 
                    value={project.category} 
                    onSave={(v) => {
                      const newProjects = [...projects];
                      newProjects[idx].category = v;
                      setProjects(newProjects);
                    }} 
                    isEditing={isEditing} 
                  />
                </div>
                {isEditing && (
                  <div className="absolute bottom-3 left-3 right-3 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        projectFileInputRefs.current[idx]?.click();
                      }}
                      className="w-full flex items-center justify-center gap-2 glass rounded-xl px-3 py-2.5 hover:bg-white/10 transition-all text-white"
                    >
                      <Upload className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold">이미지 업로드</span>
                    </button>
                    <input
                      ref={(el) => { projectFileInputRefs.current[idx] = el; }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleProjectImageUpload(idx, e)}
                    />
                  </div>
                )}
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-4 group-hover:text-indigo-400 transition-colors">
                  <EditableText 
                    value={project.title} 
                    onSave={(v) => {
                      const newProjects = [...projects];
                      newProjects[idx].title = v;
                      setProjects(newProjects);
                    }} 
                    isEditing={isEditing} 
                  />
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                  <EditableText 
                    value={project.description} 
                    onSave={(v) => {
                      const newProjects = [...projects];
                      newProjects[idx].description = v;
                      setProjects(newProjects);
                    }} 
                    isEditing={isEditing} 
                    multiline
                  />
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag, tagIdx) => (
                    <span key={tagIdx} className="text-[10px] font-bold px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-500 flex items-center gap-1">
                      #<EditableText 
                        value={tag} 
                        onSave={(v) => {
                          const newProjects = [...projects];
                          newProjects[idx].tags[tagIdx] = v;
                          setProjects(newProjects);
                        }} 
                        isEditing={isEditing} 
                      />
                      {isEditing && (
                        <button 
                          onClick={() => {
                            const newProjects = [...projects];
                            newProjects[idx].tags.splice(tagIdx, 1);
                            setProjects(newProjects);
                          }}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {isEditing && (
                    <button 
                      onClick={() => {
                        const newProjects = [...projects];
                        newProjects[idx].tags.push("새태그");
                        setProjects(newProjects);
                      }}
                      className="text-[10px] font-bold px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-400 hover:bg-indigo-500/30 transition-all"
                    >
                      + 태그 추가
                    </button>
                  )}
                </div>
                
                <button 
                  onClick={() => onProjectClick(project)}
                  className="w-full py-4 glass rounded-2xl text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-white group-hover:text-black transition-all"
                >
                  상세보기 <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {limit && projects.length > limit && setView && (
          <div className="mt-16 text-center">
            <button 
              onClick={() => setView('all-projects')}
              className="px-8 py-4 glass rounded-2xl font-bold hover:bg-white hover:text-black transition-all flex items-center gap-2 mx-auto"
            >
              더보기 <Plus className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const Portfolio = ({ onProjectClick, isEditing, projects, setProjects, setView }: { onProjectClick: (p: Project) => void, isEditing: boolean, projects: Project[], setProjects: (p: Project[]) => void, setView: (v: any) => void }) => {
  const categories = Array.from(new Set(projects.map(p => p.category)));

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-32 pb-24 px-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
        <div>
          <button 
            onClick={() => setView('home')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 돌아가기
          </button>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">포트폴리오 갤러리.</h2>
        </div>
      </div>

      <div className="space-y-24">
        {categories.map(category => (
          <div key={category}>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-indigo-400" /> {category}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.filter(p => p.category === category).map((project, idx) => (
                <motion.div 
                  key={project.id}
                  whileHover={{ y: -10 }}
                  className="group relative flex flex-col glass rounded-[2rem] overflow-hidden transition-all duration-500"
                >
                  {isEditing && (
                    <button 
                      onClick={() => {
                        if (confirm("이 포트폴리오 항목을 삭제하시겠습니까?")) {
                          const newProjects = projects.filter(p => p.id !== project.id);
                          setProjects(newProjects);
                        }
                      }}
                      className="absolute top-4 right-4 z-20 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      title="삭제"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-40`}></div>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <h4 className="text-xl font-bold mb-4 group-hover:text-indigo-400 transition-colors">
                      <EditableText 
                        value={project.title} 
                        onSave={(v) => {
                          const newProjects = [...projects];
                          const pIdx = newProjects.findIndex(p => p.id === project.id);
                          newProjects[pIdx].title = v;
                          setProjects(newProjects);
                        }} 
                        isEditing={isEditing} 
                      />
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                      <EditableText 
                        value={project.description} 
                        onSave={(v) => {
                          const newProjects = [...projects];
                          const pIdx = newProjects.findIndex(p => p.id === project.id);
                          newProjects[pIdx].description = v;
                          setProjects(newProjects);
                        }} 
                        isEditing={isEditing} 
                        multiline
                      />
                    </p>
                    
                    <button 
                      onClick={() => onProjectClick(project)}
                      className="w-full py-4 glass rounded-2xl text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-white group-hover:text-black transition-all"
                    >
                      상세보기 <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

const ICON_MAP: Record<string, React.ReactNode> = {
  'Cpu': <Cpu className="w-5 h-5" />,
  'Layers': <Layers className="w-5 h-5" />,
  'ScrollText': <ScrollText className="w-5 h-5" />,
  'Target': <Target className="w-5 h-5" />,
  'Code2': <Code2 className="w-5 h-5" />,
  'Zap': <Zap className="w-5 h-5" />,
  'Monitor': <Monitor className="w-5 h-5" />,
  'Smartphone': <Smartphone className="w-5 h-5" />,
  'Gamepad2': <Gamepad2 className="w-5 h-5" />,
  'Wrench': <Wrench className="w-5 h-5" />,
};

const resolveIcon = (iconName: string | React.ReactNode): React.ReactNode => {
  if (typeof iconName === 'string') {
    return ICON_MAP[iconName] || <Cpu className="w-5 h-5" />;
  }
  // Fallback for legacy data that might have JSX objects stored (they won't render, so use default)
  return <Cpu className="w-5 h-5" />;
};

const ICON_OPTIONS = [
  { name: 'Cpu', icon: <Cpu className="w-5 h-5" /> },
  { name: 'Layers', icon: <Layers className="w-5 h-5" /> },
  { name: 'ScrollText', icon: <ScrollText className="w-5 h-5" /> },
  { name: 'Target', icon: <Target className="w-5 h-5" /> },
  { name: 'Code2', icon: <Code2 className="w-5 h-5" /> },
  { name: 'Zap', icon: <Zap className="w-5 h-5" /> },
  { name: 'Monitor', icon: <Monitor className="w-5 h-5" /> },
  { name: 'Smartphone', icon: <Smartphone className="w-5 h-5" /> },
  { name: 'Gamepad2', icon: <Gamepad2 className="w-5 h-5" /> },
  { name: 'Wrench', icon: <Wrench className="w-5 h-5" /> }
];

const Skills = ({ isEditing, skillTabs, setSkillTabs }: { isEditing: boolean, skillTabs: SkillTab[], setSkillTabs: (s: SkillTab[]) => void }) => {
  const [activeTabId, setActiveTabId] = useState<string>(skillTabs[0]?.id || '');
  const [showIconPicker, setShowIconPicker] = useState<number | null>(null);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);

  // Make sure activeTabId is valid
  useEffect(() => {
    if (skillTabs.length > 0 && !skillTabs.find(t => t.id === activeTabId)) {
      setActiveTabId(skillTabs[0].id);
    }
  }, [skillTabs, activeTabId]);

  const activeTab = skillTabs.find(t => t.id === activeTabId);
  const activeSkills = activeTab?.skills || [];

  const updateTabSkills = (newSkills: Skill[]) => {
    const newTabs = skillTabs.map(t => t.id === activeTabId ? { ...t, skills: newSkills } : t);
    setSkillTabs(newTabs);
  };

  return (
    <section id="skills" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-block px-4 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-6">03_SKILLS</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">핵심 역량.</h2>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-2 mb-10 flex-wrap">
          {skillTabs.map((tab) => (
            <div key={tab.id} className="relative flex items-center">
              {isEditing && editingTabId === tab.id ? (
                <input
                  type="text"
                  className="px-4 py-2.5 bg-white/10 border border-indigo-500 rounded-xl text-sm font-bold text-white focus:outline-none min-w-[80px]"
                  value={tab.name}
                  autoFocus
                  onChange={(e) => {
                    const newTabs = skillTabs.map(t => t.id === tab.id ? { ...t, name: e.target.value } : t);
                    setSkillTabs(newTabs);
                  }}
                  onBlur={() => setEditingTabId(null)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setEditingTabId(null); }}
                />
              ) : (
                <button
                  onClick={() => setActiveTabId(tab.id)}
                  onDoubleClick={() => isEditing && setEditingTabId(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTabId === tab.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'glass text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.name}
                </button>
              )}
              {isEditing && skillTabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setSkillTabs(skillTabs.filter(t => t.id !== tab.id));
                  }}
                  className="ml-1 p-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="탭 삭제"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              onClick={() => {
                const newTab: SkillTab = {
                  id: `tab-${Date.now()}`,
                  name: '새 탭',
                  skills: []
                };
                setSkillTabs([...skillTabs, newTab]);
                setActiveTabId(newTab.id);
              }}
              className="px-4 py-2.5 border-2 border-dashed border-white/20 rounded-xl text-sm font-bold text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> 탭 추가
            </button>
          )}
        </div>

        {/* Active Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTabId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {isEditing && (
              <div className="mb-6 flex justify-end">
                <button
                  onClick={() => {
                    const newSkill: Skill = { name: "새 역량", level: 50, icon: 'Cpu', caption: "역량에 대한 설명을 입력하세요" };
                    updateTabSkills([...activeSkills, newSkill]);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-500 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> 역량 추가
                </button>
              </div>
            )}
            <div className="space-y-10">
              {activeSkills.length === 0 && (
                <div className="text-center py-16 text-slate-600">
                  <Zap className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">이 탭에 역량을 추가해주세요.</p>
                </div>
              )}
              {activeSkills.map((skill, idx) => (
                <div key={idx} className="relative group/skill">
                  {isEditing && (
                    <button 
                      onClick={() => {
                        const newSkills = [...activeSkills];
                        newSkills.splice(idx, 1);
                        updateTabSkills(newSkills);
                      }}
                      className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 text-red-500 opacity-0 group-hover/skill:opacity-100 transition-all hover:bg-red-500/10 rounded-lg"
                      title="삭제"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-10 h-10 glass rounded-xl flex items-center justify-center text-indigo-400 ${isEditing ? 'cursor-pointer hover:bg-white/10' : ''}`}
                        onClick={() => isEditing && setShowIconPicker(showIconPicker === idx ? null : idx)}
                      >
                        {resolveIcon(skill.icon)}
                      </div>
                      {isEditing && showIconPicker === idx && (
                        <div className="absolute top-12 left-0 z-30 glass p-3 rounded-2xl grid grid-cols-5 gap-2 shadow-2xl">
                          {ICON_OPTIONS.map((opt) => (
                            <button 
                              key={opt.name}
                              onClick={() => {
                                const newSkills = [...activeSkills];
                                newSkills[idx].icon = opt.name;
                                updateTabSkills(newSkills);
                                setShowIconPicker(null);
                              }}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-indigo-400"
                            >
                              {opt.icon}
                            </button>
                          ))}
                        </div>
                      )}
                      <span className="font-bold text-lg">
                        <EditableText 
                          value={skill.name} 
                          onSave={(v) => {
                            const newSkills = [...activeSkills];
                            newSkills[idx].name = v;
                            updateTabSkills(newSkills);
                          }} 
                          isEditing={isEditing} 
                        />
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-xs text-slate-500 bg-white/5 px-3 py-1 rounded-lg border border-white/10 italic">
                        <EditableText 
                          value={skill.caption || ""} 
                          onSave={(v) => {
                            const newSkills = [...activeSkills];
                            newSkills[idx].caption = v;
                            updateTabSkills(newSkills);
                          }} 
                          isEditing={isEditing} 
                        />
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-slate-500">
                          <EditableText 
                            value={skill.level.toString()} 
                            onSave={(v) => {
                              const newSkills = [...activeSkills];
                              newSkills[idx].level = parseInt(v) || 0;
                              updateTabSkills(newSkills);
                            }} 
                            isEditing={isEditing} 
                          />%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

const MyTools = ({ isEditing, tools, setTools }: { isEditing: boolean, tools: ToolItem[], setTools: (t: ToolItem[]) => void }) => {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleIconUpload = (toolId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const newTools = tools.map(t => t.id === toolId ? { ...t, iconUrl: dataUrl } : t);
      setTools(newTools);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="my-tools" className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="inline-block px-4 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold mb-6">04_TOOLS</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">나의 사용 Tool.</h2>
        </div>
        {isEditing && (
          <button
            onClick={() => {
              const newTool: ToolItem = {
                id: `tool-${Date.now()}`,
                name: '새 Tool',
                iconUrl: '',
                description: '툴에 대한 설명을 입력하세요.'
              };
              setTools([...tools, newTool]);
            }}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-500 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tool 추가
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <motion.div
            key={tool.id}
            whileHover={{ y: -6 }}
            className="group relative bento-card !rounded-[2rem] flex flex-col"
          >
            {isEditing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setTools(tools.filter(t => t.id !== tool.id));
                }}
                className="absolute top-4 right-4 z-20 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                title="삭제"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Icon area */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-16 h-16 glass rounded-2xl flex items-center justify-center overflow-hidden shrink-0 ${
                  isEditing ? 'cursor-pointer hover:bg-white/10 border-2 border-dashed border-white/20' : ''
                }`}
                onClick={() => {
                  if (isEditing) {
                    fileInputRefs.current[tool.id]?.click();
                  }
                }}
              >
                {tool.iconUrl ? (
                  <img src={tool.iconUrl} alt={tool.name} className="w-10 h-10 object-contain" />
                ) : (
                  <div className="flex flex-col items-center text-slate-500">
                    {isEditing ? (
                      <Upload className="w-6 h-6" />
                    ) : (
                      <Wrench className="w-6 h-6" />
                    )}
                  </div>
                )}
                {isEditing && (
                  <input
                    ref={(el) => { fileInputRefs.current[tool.id] = el; }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleIconUpload(tool.id, e)}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">
                  <EditableText
                    value={tool.name}
                    onSave={(v) => {
                      const newTools = tools.map(t => t.id === tool.id ? { ...t, name: v } : t);
                      setTools(newTools);
                    }}
                    isEditing={isEditing}
                  />
                </h3>
                {isEditing && (
                  <p className="text-[10px] text-slate-600 mt-1">아이콘을 클릭하여 이미지를 업로드하세요</p>
                )}
              </div>
            </div>

            {/* Icon URL input for editing */}
            {isEditing && (
              <div className="mb-4">
                <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <input
                    type="text"
                    className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-600 focus:outline-none"
                    value={tool.iconUrl}
                    placeholder="또는 아이콘 URL을 직접 입력..."
                    onChange={(e) => {
                      const newTools = tools.map(t => t.id === tool.id ? { ...t, iconUrl: e.target.value } : t);
                      setTools(newTools);
                    }}
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-slate-400 leading-relaxed flex-1">
              <EditableText
                value={tool.description}
                onSave={(v) => {
                  const newTools = tools.map(t => t.id === tool.id ? { ...t, description: v } : t);
                  setTools(newTools);
                }}
                isEditing={isEditing}
                multiline
              />
            </p>

            {/* Decorative bottom accent */}
            <div className="mt-6 h-1 w-full bg-gradient-to-r from-cyan-500/40 via-indigo-500/40 to-purple-500/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.div>
        ))}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-20 text-slate-600">
          <Wrench className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-sm">사용 중인 Tool을 추가해주세요.</p>
        </div>
      )}
    </section>
  );
};

const PlayHistory = ({ isEditing, history, setHistory }: { isEditing: boolean, history: GameHistory, setHistory: (h: GameHistory) => void }) => (
  <section id="play-history" className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
    <div className="inline-block px-4 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-bold mb-6">05_PLAY_HISTORY</div>
    <h2 className="text-4xl md:text-5xl font-bold mb-12 tracking-tight">게임 플레이 이력.</h2>
    
    <div className="grid md:grid-cols-3 gap-8">
      {/* Online */}
      <div className="bento-card !p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 text-indigo-400">
            <Monitor className="w-6 h-6" />
            <span className="font-bold uppercase tracking-wider">Online Games</span>
          </div>
          {isEditing && (
            <button 
              onClick={() => {
                const newHistory = {...history};
                newHistory.online.push({ id: Date.now().toString(), name: "새 게임", hours: 0 });
                setHistory(newHistory);
              }}
              className="p-1.5 glass rounded-lg text-indigo-400 hover:bg-white/10"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="space-y-4">
          {history.online.map((game, idx) => (
            <div key={game.id} className="flex justify-between items-center group">
              <div className="flex items-center gap-2">
                {isEditing && (
                  <button 
                    onClick={() => {
                      const newHistory = {...history};
                      newHistory.online.splice(idx, 1);
                      setHistory(newHistory);
                    }}
                    className="text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="text-slate-300 font-medium">
                  <EditableText 
                    value={game.name} 
                    onSave={(v) => {
                      const newHistory = {...history};
                      newHistory.online[idx].name = v;
                      setHistory(newHistory);
                    }} 
                    isEditing={isEditing} 
                  />
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 font-mono text-sm">
                <Clock className="w-3.5 h-3.5" /> 
                <EditableText 
                  value={game.hours.toString()} 
                  onSave={(v) => {
                    const newHistory = {...history};
                    newHistory.online[idx].hours = parseInt(v) || 0;
                    setHistory(newHistory);
                  }} 
                  isEditing={isEditing} 
                />h
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="bento-card !p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 text-emerald-400">
            <Smartphone className="w-6 h-6" />
            <span className="font-bold uppercase tracking-wider">Mobile Games</span>
          </div>
          {isEditing && (
            <button 
              onClick={() => {
                const newHistory = {...history};
                newHistory.mobile.push({ id: Date.now().toString(), name: "새 게임", hours: 0 });
                setHistory(newHistory);
              }}
              className="p-1.5 glass rounded-lg text-emerald-400 hover:bg-white/10"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="space-y-4">
          {history.mobile.map((game, idx) => (
            <div key={game.id} className="flex justify-between items-center group">
              <div className="flex items-center gap-2">
                {isEditing && (
                  <button 
                    onClick={() => {
                      const newHistory = {...history};
                      newHistory.mobile.splice(idx, 1);
                      setHistory(newHistory);
                    }}
                    className="text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="text-slate-300 font-medium">
                  <EditableText 
                    value={game.name} 
                    onSave={(v) => {
                      const newHistory = {...history};
                      newHistory.mobile[idx].name = v;
                      setHistory(newHistory);
                    }} 
                    isEditing={isEditing} 
                  />
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 font-mono text-sm">
                <Clock className="w-3.5 h-3.5" /> 
                <EditableText 
                  value={game.hours.toString()} 
                  onSave={(v) => {
                    const newHistory = {...history};
                    newHistory.mobile[idx].hours = parseInt(v) || 0;
                    setHistory(newHistory);
                  }} 
                  isEditing={isEditing} 
                />h
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package */}
      <div className="bento-card !p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 text-orange-400">
            <PackageIcon className="w-6 h-6" />
            <span className="font-bold uppercase tracking-wider">Package Games</span>
          </div>
          {isEditing && (
            <button 
              onClick={() => {
                const newHistory = {...history};
                newHistory.package.push({ id: Date.now().toString(), name: "새 게임", hours: 0 });
                setHistory(newHistory);
              }}
              className="p-1.5 glass rounded-lg text-orange-400 hover:bg-white/10"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="space-y-4">
          {history.package.map((game, idx) => (
            <div key={game.id} className="flex justify-between items-center group">
              <div className="flex items-center gap-2">
                {isEditing && (
                  <button 
                    onClick={() => {
                      const newHistory = {...history};
                      newHistory.package.splice(idx, 1);
                      setHistory(newHistory);
                    }}
                    className="text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="text-slate-300 font-medium">
                  <EditableText 
                    value={game.name} 
                    onSave={(v) => {
                      const newHistory = {...history};
                      newHistory.package[idx].name = v;
                      setHistory(newHistory);
                    }} 
                    isEditing={isEditing} 
                  />
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 font-mono text-sm">
                <Clock className="w-3.5 h-3.5" /> 
                <EditableText 
                  value={game.hours.toString()} 
                  onSave={(v) => {
                    const newHistory = {...history};
                    newHistory.package[idx].hours = parseInt(v) || 0;
                    setHistory(newHistory);
                  }} 
                  isEditing={isEditing} 
                />h
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

interface ResumeProps {
  setView: (v: 'home' | 'resume' | 'project-detail') => void;
  isEditing: boolean;
  data: ResumeData;
  setData: (d: ResumeData) => void;
}

const Resume = ({ setView, isEditing, data, setData }: ResumeProps) => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [activeIntroTab, setActiveIntroTab] = useState<string>(
    data.selfIntroTabs?.[0]?.id || 'intro-1'
  );
  const [editingIntroTabId, setEditingIntroTabId] = useState<string | null>(null);

  // Ensure active tab is valid
  useEffect(() => {
    const tabs = data.selfIntroTabs || [];
    if (tabs.length > 0 && !tabs.find(t => t.id === activeIntroTab)) {
      setActiveIntroTab(tabs[0].id);
    }
  }, [data.selfIntroTabs, activeIntroTab]);

  const techStack = data.techStack || [
    { id: 'ts-1', label: 'Engines & Languages', items: ['Unity', 'UE5', 'C#', 'C++', 'Blueprints'] },
    { id: 'ts-2', label: 'Design Tools', items: ['Excel', 'Python', 'Jira', 'Figma', 'Confluence'] }
  ];

  const coreCompetencies = data.coreCompetencies || [
    '수치 기반의 밸런싱 시뮬레이션',
    '논리적인 시스템 구조 설계',
    '플레이어 심리 분석 및 UX 설계'
  ];

  const selfIntroTabs: SelfIntroTab[] = data.selfIntroTabs || [
    { id: 'intro-1', title: '성장 과정 및 가치관', content: data.selfIntroduction || '' }
  ];

  const handleDownloadPdf = useCallback(async () => {
    if (!resumeRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = resumeRef.current;
      
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${data.name || '이력서'}_이력서.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          letterRendering: true,
          logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'] as any,
          before: '.pdf-page-break-before',
          after: '.pdf-page-break-after',
          avoid: ['.pdf-no-break', 'h3', 'h4']
        }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [data.name, isGeneratingPdf]);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-32 pb-24 px-6 max-w-5xl mx-auto print:pt-0 print:pb-0 print:max-w-none"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 print:hidden">
        <button 
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 돌아가기
        </button>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className={`px-6 py-3 glass rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all ${isGeneratingPdf ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isGeneratingPdf ? (
            <>
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              PDF 생성 중...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-indigo-400" /> PDF 이력서 다운로드
            </>
          )}
        </motion.button>
      </div>

      {/* PDF Target Area */}
      <div ref={resumeRef} className="pdf-resume-container" style={{ background: '#0f172a' }}>
        <div className="grid md:grid-cols-3 gap-12 print:grid-cols-3">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-12">
            <div className="text-center md:text-left pdf-no-break">
              <div className="w-32 h-32 rounded-3xl overflow-hidden mb-6 mx-auto md:mx-0 border border-white/10 shadow-2xl shadow-indigo-500/10 print:shadow-none">
                <img src="https://picsum.photos/seed/profile/300/300" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-3xl font-bold mb-2 print:text-black">
                <EditableText 
                  value={data.name} 
                  onSave={(v) => setData({...data, name: v})} 
                  isEditing={isEditing} 
                />
              </h1>
              <p className="text-indigo-400 font-medium mb-6 print:text-indigo-600">
                <EditableText 
                  value={data.role} 
                  onSave={(v) => setData({...data, role: v})} 
                  isEditing={isEditing} 
                />
              </p>
              <div className="space-y-4 text-sm text-slate-400 print:text-slate-600">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-500 print:border print:border-slate-200">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>
                    <EditableText 
                      value={data.email} 
                      onSave={(v) => setData({...data, email: v})} 
                      isEditing={isEditing} 
                    />
                  </span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-500 print:border print:border-slate-200">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <span>
                    <EditableText 
                      value={data.linkedin} 
                      onSave={(v) => setData({...data, linkedin: v})} 
                      isEditing={isEditing} 
                    />
                  </span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-500 print:border print:border-slate-200">
                    <Github className="w-4 h-4" />
                  </div>
                  <span>
                    <EditableText 
                      value={data.github} 
                      onSave={(v) => setData({...data, github: v})} 
                      isEditing={isEditing} 
                    />
                  </span>
                </div>
              </div>
            </div>

            {/* Tech Stack - Editable */}
            <div className="space-y-8">
              <div className="pdf-no-break">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 print:text-slate-800">
                    <Wrench className="w-4 h-4" /> 기술 스택
                  </h3>
                  {isEditing && (
                    <button
                      onClick={() => {
                        const newStack = [...techStack, { id: `ts-${Date.now()}`, label: '새 카테고리', items: ['항목'] }];
                        setData({...data, techStack: newStack});
                      }}
                      className="p-1.5 glass rounded-lg text-indigo-400 hover:bg-white/10 transition-all"
                      title="카테고리 추가"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {techStack.map((category, catIdx) => (
                    <div key={category.id} className="pdf-no-break">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-bold text-slate-600 uppercase">
                          <EditableText
                            value={category.label}
                            onSave={(v) => {
                              const newStack = [...techStack];
                              newStack[catIdx].label = v;
                              setData({...data, techStack: newStack});
                            }}
                            isEditing={isEditing}
                          />
                        </p>
                        {isEditing && (
                          <button
                            onClick={() => {
                              const newStack = techStack.filter(c => c.id !== category.id);
                              setData({...data, techStack: newStack});
                            }}
                            className="p-1 text-slate-600 hover:text-red-400 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {category.items.map((item, itemIdx) => (
                          <span key={itemIdx} className="px-3 py-1.5 glass rounded-lg text-xs font-medium text-slate-300 print:text-slate-700 print:border print:border-slate-200 flex items-center gap-1">
                            <EditableText
                              value={item}
                              onSave={(v) => {
                                const newStack = [...techStack];
                                newStack[catIdx].items[itemIdx] = v;
                                setData({...data, techStack: newStack});
                              }}
                              isEditing={isEditing}
                            />
                            {isEditing && (
                              <button
                                onClick={() => {
                                  const newStack = [...techStack];
                                  newStack[catIdx].items.splice(itemIdx, 1);
                                  setData({...data, techStack: newStack});
                                }}
                                className="text-slate-600 hover:text-red-400 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </span>
                        ))}
                        {isEditing && (
                          <button
                            onClick={() => {
                              const newStack = [...techStack];
                              newStack[catIdx].items.push('새 항목');
                              setData({...data, techStack: newStack});
                            }}
                            className="px-3 py-1.5 border border-dashed border-white/20 rounded-lg text-xs font-medium text-indigo-400 hover:border-indigo-500/50 transition-all"
                          >
                            + 추가
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Competencies - Editable */}
              <div className="pdf-no-break">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 print:text-slate-800">
                    <Zap className="w-4 h-4" /> 핵심 역량
                  </h3>
                  {isEditing && (
                    <button
                      onClick={() => {
                        const newComp = [...coreCompetencies, '새 역량'];
                        setData({...data, coreCompetencies: newComp});
                      }}
                      className="p-1.5 glass rounded-lg text-indigo-400 hover:bg-white/10 transition-all"
                      title="역량 추가"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <ul className="space-y-3 text-sm text-slate-400 print:text-slate-600">
                  {coreCompetencies.map((comp, idx) => (
                    <li key={idx} className="flex items-start gap-2 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                      <span className="flex-1">
                        <EditableText
                          value={comp}
                          onSave={(v) => {
                            const newComp = [...coreCompetencies];
                            newComp[idx] = v;
                            setData({...data, coreCompetencies: newComp});
                          }}
                          isEditing={isEditing}
                        />
                      </span>
                      {isEditing && (
                        <button
                          onClick={() => {
                            const newComp = coreCompetencies.filter((_, i) => i !== idx);
                            setData({...data, coreCompetencies: newComp});
                          }}
                          className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-16">
            {/* Summary */}
            <section className="pdf-no-break">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 print:text-black">
                <User className="text-indigo-400 w-6 h-6" /> 자기소개
              </h3>
              <p className="text-slate-400 leading-relaxed font-medium print:text-slate-700">
                <EditableText 
                  value={data.summary} 
                  onSave={(v) => setData({...data, summary: v})} 
                  isEditing={isEditing} 
                  multiline
                />
              </p>
            </section>

            {/* Education */}
            <section>
              <div className="flex items-center justify-between mb-8 pdf-no-break">
                <h3 className="text-xl font-bold flex items-center gap-3 print:text-black">
                  <GraduationCap className="text-emerald-400 w-6 h-6" /> 학력 및 교육
                </h3>
                {isEditing && (
                  <button 
                    onClick={() => {
                      const newEdu = [...data.education];
                      newEdu.push({ title: "새 교육", period: "기간", description: "설명", details: [] });
                      setData({...data, education: newEdu});
                    }}
                    className="p-2 glass rounded-xl text-emerald-400 hover:bg-white/10 transition-all flex items-center gap-2 text-xs font-bold"
                  >
                    <Plus className="w-4 h-4" /> 교육 추가
                  </button>
                )}
              </div>
              <div className="space-y-10">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="relative pl-8 border-l border-white/10 print:border-slate-200 pdf-no-break">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] print:shadow-none"></div>
                    {isEditing && (
                      <button 
                        onClick={() => {
                          const newEdu = [...data.education];
                          newEdu.splice(idx, 1);
                          setData({...data, education: newEdu});
                        }}
                        className="absolute -left-10 top-0 p-1 text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg print:text-black">
                        <EditableText 
                          value={edu.title} 
                          onSave={(v) => {
                            const newEdu = [...data.education];
                            newEdu[idx].title = v;
                            setData({...data, education: newEdu});
                          }} 
                          isEditing={isEditing} 
                        />
                      </h4>
                      <span className="text-xs font-mono text-slate-500">
                        <EditableText 
                          value={edu.period} 
                          onSave={(v) => {
                            const newEdu = [...data.education];
                            newEdu[idx].period = v;
                            setData({...data, education: newEdu});
                          }} 
                          isEditing={isEditing} 
                        />
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4 print:text-slate-600">
                      <EditableText 
                        value={edu.description} 
                        onSave={(v) => {
                          const newEdu = [...data.education];
                          newEdu[idx].description = v;
                          setData({...data, education: newEdu});
                        }} 
                        isEditing={isEditing} 
                      />
                    </p>
                    <ul className="text-xs text-slate-500 space-y-2 list-disc list-inside print:text-slate-500">
                      {edu.details.map((detail, dIdx) => (
                        <li key={dIdx} className="group flex items-center gap-2">
                          <EditableText 
                            value={detail} 
                            onSave={(v) => {
                              const newEdu = [...data.education];
                              newEdu[idx].details[dIdx] = v;
                              setData({...data, education: newEdu});
                            }} 
                            isEditing={isEditing} 
                          />
                          {isEditing && (
                            <button 
                              onClick={() => {
                                const newEdu = [...data.education];
                                newEdu[idx].details.splice(dIdx, 1);
                                setData({...data, education: newEdu});
                              }}
                              className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </li>
                      ))}
                      {isEditing && (
                        <button 
                          onClick={() => {
                            const newEdu = [...data.education];
                            newEdu[idx].details.push("새 상세 내용");
                            setData({...data, education: newEdu});
                          }}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> 항목 추가
                        </button>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Experience */}
            <section>
              <div className="flex items-center justify-between mb-8 pdf-no-break">
                <h3 className="text-xl font-bold flex items-center gap-3 print:text-black">
                  <Briefcase className="text-purple-400 w-6 h-6" /> 프로젝트 경험
                </h3>
                {isEditing && (
                  <button 
                    onClick={() => {
                      const newExp = [...data.experience];
                      newExp.push({ title: "새 프로젝트", period: "기간", description: "설명", details: [] });
                      setData({...data, experience: newExp});
                    }}
                    className="p-2 glass rounded-xl text-purple-400 hover:bg-white/10 transition-all flex items-center gap-2 text-xs font-bold"
                  >
                    <Plus className="w-4 h-4" /> 프로젝트 추가
                  </button>
                )}
              </div>
              <div className="space-y-10">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-8 border-l border-white/10 print:border-slate-200 pdf-no-break">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] print:shadow-none"></div>
                    {isEditing && (
                      <button 
                        onClick={() => {
                          const newExp = [...data.experience];
                          newExp.splice(idx, 1);
                          setData({...data, experience: newExp});
                        }}
                        className="absolute -left-10 top-0 p-1 text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg print:text-black">
                        <EditableText 
                          value={exp.title} 
                          onSave={(v) => {
                            const newExp = [...data.experience];
                            newExp[idx].title = v;
                            setData({...data, experience: newExp});
                          }} 
                          isEditing={isEditing} 
                        />
                      </h4>
                      <span className="text-xs font-mono text-slate-500">
                        <EditableText 
                          value={exp.period} 
                          onSave={(v) => {
                            const newExp = [...data.experience];
                            newExp[idx].period = v;
                            setData({...data, experience: newExp});
                          }} 
                          isEditing={isEditing} 
                        />
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-4 print:text-slate-600">
                      <EditableText 
                        value={exp.description} 
                        onSave={(v) => {
                          const newExp = [...data.experience];
                          newExp[idx].description = v;
                          setData({...data, experience: newExp});
                        }} 
                        isEditing={isEditing} 
                      />
                    </p>
                    <ul className="text-xs text-slate-500 space-y-2 list-disc list-inside print:text-slate-500">
                      {exp.details.map((detail, dIdx) => (
                        <li key={dIdx} className="group flex items-center gap-2">
                          <EditableText 
                            value={detail} 
                            onSave={(v) => {
                              const newExp = [...data.experience];
                              newExp[idx].details[dIdx] = v;
                              setData({...data, experience: newExp});
                            }} 
                            isEditing={isEditing} 
                          />
                          {isEditing && (
                            <button 
                              onClick={() => {
                                const newExp = [...data.experience];
                                newExp[idx].details.splice(dIdx, 1);
                                setData({...data, experience: newExp});
                              }}
                              className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </li>
                      ))}
                      {isEditing && (
                        <button 
                          onClick={() => {
                            const newExp = [...data.experience];
                            newExp[idx].details.push("새 상세 내용");
                            setData({...data, experience: newExp});
                          }}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> 항목 추가
                        </button>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Awards - with Add functionality */}
            <section>
              <div className="flex items-center justify-between mb-8 pdf-no-break">
                <h3 className="text-xl font-bold flex items-center gap-3 print:text-black">
                  <Award className="text-pink-400 w-6 h-6" /> 자격 및 수상
                </h3>
                {isEditing && (
                  <button 
                    onClick={() => {
                      const newAwards = [...data.awards, { title: "새 자격/수상", organization: "기관명", year: new Date().getFullYear().toString() }];
                      setData({...data, awards: newAwards});
                    }}
                    className="p-2 glass rounded-xl text-pink-400 hover:bg-white/10 transition-all flex items-center gap-2 text-xs font-bold"
                  >
                    <Plus className="w-4 h-4" /> 항목 추가
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.awards.map((award, idx) => (
                  <div key={idx} className="p-5 glass rounded-2xl border-l-4 border-pink-500/50 print:border-slate-200 print:text-black relative group pdf-no-break">
                    {isEditing && (
                      <button
                        onClick={() => {
                          const newAwards = data.awards.filter((_, i) => i !== idx);
                          setData({...data, awards: newAwards});
                        }}
                        className="absolute top-2 right-2 p-1.5 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <h4 className="font-bold text-sm mb-1">
                      <EditableText 
                        value={award.title} 
                        onSave={(v) => {
                          const newAwards = [...data.awards];
                          newAwards[idx].title = v;
                          setData({...data, awards: newAwards});
                        }} 
                        isEditing={isEditing} 
                      />
                    </h4>
                    <p className="text-xs text-slate-500">
                      <EditableText 
                        value={award.organization} 
                        onSave={(v) => {
                          const newAwards = [...data.awards];
                          newAwards[idx].organization = v;
                          setData({...data, awards: newAwards});
                        }} 
                        isEditing={isEditing} 
                      /> // <EditableText 
                        value={award.year} 
                        onSave={(v) => {
                          const newAwards = [...data.awards];
                          newAwards[idx].year = v;
                          setData({...data, awards: newAwards});
                        }} 
                        isEditing={isEditing} 
                      />
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Self Introduction - Tabbed */}
            <section className="pt-8 border-t border-white/5 print:border-slate-200">
              <div className="flex items-center justify-between mb-8 pdf-no-break">
                <h3 className="text-xl font-bold flex items-center gap-3 print:text-black">
                  <ScrollText className="text-indigo-400 w-6 h-6" /> 자기소개서
                </h3>
              </div>

              {/* Tab Bar */}
              <div className="flex items-center gap-2 mb-6 flex-wrap pdf-no-break">
                {selfIntroTabs.map((tab) => (
                  <div key={tab.id} className="relative flex items-center">
                    {isEditing && editingIntroTabId === tab.id ? (
                      <input
                        type="text"
                        className="px-4 py-2 bg-white/10 border border-indigo-500 rounded-xl text-sm font-bold text-white focus:outline-none min-w-[80px]"
                        value={tab.title}
                        autoFocus
                        onChange={(e) => {
                          const newTabs = selfIntroTabs.map(t => t.id === tab.id ? { ...t, title: e.target.value } : t);
                          setData({...data, selfIntroTabs: newTabs});
                        }}
                        onBlur={() => setEditingIntroTabId(null)}
                        onKeyDown={(e) => { if (e.key === 'Enter') setEditingIntroTabId(null); }}
                      />
                    ) : (
                      <button
                        onClick={() => setActiveIntroTab(tab.id)}
                        onDoubleClick={() => isEditing && setEditingIntroTabId(tab.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                          activeIntroTab === tab.id
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                            : 'glass text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {tab.title}
                      </button>
                    )}
                    {isEditing && selfIntroTabs.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newTabs = selfIntroTabs.filter(t => t.id !== tab.id);
                          setData({...data, selfIntroTabs: newTabs});
                          if (activeIntroTab === tab.id && newTabs.length > 0) {
                            setActiveIntroTab(newTabs[0].id);
                          }
                        }}
                        className="ml-1 p-1 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="탭 삭제"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button
                    onClick={() => {
                      const newTab: SelfIntroTab = {
                        id: `intro-${Date.now()}`,
                        title: '새 항목',
                        content: '내용을 입력하세요.'
                      };
                      const newTabs = [...selfIntroTabs, newTab];
                      setData({...data, selfIntroTabs: newTabs});
                      setActiveIntroTab(newTab.id);
                    }}
                    className="px-3 py-2 border-2 border-dashed border-white/20 rounded-xl text-sm font-bold text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> 탭 추가
                  </button>
                )}
              </div>

              {/* Tab Content */}
              <div className="glass rounded-[2rem] p-8 md:p-12 pdf-no-break">
                {selfIntroTabs.map((tab) => (
                  <div key={tab.id} style={{ display: activeIntroTab === tab.id ? 'block' : 'none' }}>
                    {isEditing ? (
                      <textarea
                        className="w-full h-[300px] bg-white/5 border border-white/20 rounded-2xl p-6 text-white text-sm leading-relaxed focus:outline-none focus:border-indigo-500 resize-y"
                        value={tab.content}
                        onChange={(e) => {
                          const newTabs = selfIntroTabs.map(t => t.id === tab.id ? { ...t, content: e.target.value } : t);
                          setData({...data, selfIntroTabs: newTabs});
                        }}
                        placeholder="자기소개 내용을 입력하세요..."
                      />
                    ) : (
                      <div className="text-slate-400 leading-relaxed whitespace-pre-wrap font-medium">
                        {tab.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

const Contact = () => (
  <section id="contact" className="py-32 px-6 max-w-7xl mx-auto text-center">
    <div className="inline-block px-4 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold mb-6">04_CONTACT</div>
    <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">함께 일하고 싶으신가요?</h2>
    <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto font-medium">
      새로운 프로젝트나 협업 제안은 언제나 환영입니다. <br />
      아래 이메일로 연락 주시면 빠르게 답변 드리겠습니다.
    </p>
    <a 
      href="mailto:minho.dev@email.com" 
      className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-white/10"
    >
      <Mail className="w-5 h-5" /> 메일 보내기
    </a>
  </section>
);

const Footer = () => (
  <footer className="py-16 px-6 text-center">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5 pt-12">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center">
          <User className="text-slate-400 w-4 h-4" />
        </div>
        <span className="font-bold text-slate-500">지원자 양현우</span>
      </div>
      <p className="text-slate-600 text-sm font-medium">© 2026 PM 지원자 포트폴리오. All rights reserved.</p>
      <div className="flex gap-6 text-slate-600 text-sm font-medium">
        <a href="#" className="hover:text-white transition-colors">Privacy</a>
        <a href="#" className="hover:text-white transition-colors">Terms</a>
      </div>
    </div>
  </footer>
);

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all shadow-2xl"
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const ImageModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-5xl w-full glass rounded-[2.5rem] overflow-hidden p-2"
          onClick={e => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-10 h-10 glass rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src="https://ais-dev-pk434uciagywugueajrdik-352024962937.asia-northeast1.run.app/api/file/ais-dev-pk434uciagywugueajrdik-352024962937.asia-northeast1.run.app/attachments/0194b635-f09d-7901-831d-853488730870" 
            alt="UI Reference" 
            className="w-full h-auto rounded-[2rem]"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ProjectDetail = ({ project, onBack, isEditing, onSaveContent }: { project: Project, onBack: () => void, isEditing: boolean, onSaveContent: (content: string) => void }) => (
  <motion.section 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="pt-32 pb-24 px-6 max-w-4xl mx-auto"
  >
    <button 
      onClick={onBack}
      className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group"
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 프로젝트 목록으로
    </button>

    <div className="glass rounded-[2.5rem] overflow-hidden mb-12">
      <div className="aspect-[21/9] relative">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-transparent`}></div>
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="glass px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
              {project.category}
            </span>
            <div className="flex gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold text-slate-400">#{tag}</span>
              ))}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">{project.title}</h1>
        </div>
      </div>
    </div>

    <div className="glass rounded-[2rem] p-8 md:p-12 markdown-body">
      {isEditing ? (
        <textarea
          className="w-full h-[600px] bg-white/5 border border-white/20 rounded-2xl p-6 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
          value={project.content}
          onChange={(e) => onSaveContent(e.target.value)}
        />
      ) : (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {project.content}
        </ReactMarkdown>
      )}
    </div>
  </motion.section>
);

export default function App() {
  const [view, setView] = useState<'home' | 'resume' | 'project-detail' | 'portfolio' | 'all-projects'>('home');
  const [prevView, setPrevView] = useState<'home' | 'resume' | 'project-detail' | 'portfolio' | 'all-projects'>('home');
  
  const changeView = (newView: 'home' | 'resume' | 'project-detail' | 'portfolio' | 'all-projects') => {
    setPrevView(view);
    setView(newView);
  };

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // --- Edit Mode Logic ---
  const [isEditing, setIsEditing] = useState(false);

  // --- Persistent Content ---
  const [heroContent, setHeroContent] = useEditableContent({
    titleLine1: "기획의도를 알고",
    titleLine2: "목차를 쓸줄 아는 기획자",
    description: "사용자의 경험을 논리적으로 설계하고, 명확한 문서화를 통해 팀의 비전을 구체화합니다. 데이터와 심리학을 기반으로 한 깊이 있는 기획을 지향합니다."
  }, 'hero_content');

  const [aboutContent, setAboutContent] = useEditableContent({
    title: "논리와 감성의 균형으로",
    subtitle: "최고의 재미를 설계합니다.",
    p1: "게임이 '작동'하는 원리를 깊이 있게 학습했습니다. 단순한 아이디어를 넘어, 수치로 증명되는 밸런싱과 플레이어의 심리를 관통하는 내러티브 설계를 지향합니다.",
    p2: "훌륭한 게임 디자인은 보이지 않아야 한다고 믿습니다. 플레이어가 자연스럽게 몰입하고, 성취감을 느끼며, 그 세계의 일부가 된 듯한 경험을 제공하는 것이 저의 목표입니다.",
    stats: [
      { label: "제작 프로토타입", value: "12+" },
      { label: "QA 테스트 시간", value: "200+" },
      { label: "최대 기획서 분량", value: "50p" }
    ]
  }, 'about_content');

  const [projectsData, setProjectsData] = useEditableContent(PROJECTS, 'projects_data');
  const [portfolioData, setPortfolioData] = useEditableContent(PORTFOLIO_PROJECTS, 'portfolio_data');
  const [skillsData, setSkillsData] = useEditableContent(SKILLS, 'skills_data');
  const [skillTabsData, setSkillTabsData] = useEditableContent(INITIAL_SKILL_TABS, 'skill_tabs_data');
  const [toolsData, setToolsData] = useEditableContent(INITIAL_TOOLS, 'tools_data');
  const [historyData, setHistoryData] = useEditableContent(GAME_HISTORY, 'history_data');
  const [resumeData, setResumeData] = useEditableContent(RESUME_DATA, 'resume_data');

  useEffect(() => {
    if (view === 'home' && scrollTarget) {
      const timer = setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) {
          const offset = 100;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = el.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          setScrollTarget(null);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else if (view === 'home' && !scrollTarget) {
      window.scrollTo(0, 0);
    } else if (view !== 'home') {
      window.scrollTo(0, 0);
    }
  }, [view, scrollTarget]);

  const handleNavClick = (id: string) => {
    if (view !== 'home') {
      setScrollTarget(id);
      changeView('home');
    } else {
      const el = document.getElementById(id);
      if (el) {
        const offset = 100;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    changeView('project-detail');
  };

  return (
    <div className="min-h-screen selection:bg-indigo-500/30">
      <Navbar 
        setView={changeView} 
        currentView={view} 
        onNavClick={handleNavClick} 
        isEditing={isEditing} 
        setIsEditing={setIsEditing}
      />
      <main>
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero 
                onPortfolioClick={() => changeView('portfolio')} 
                onResumeClick={() => changeView('resume')}
                isEditing={isEditing}
                content={heroContent}
                setContent={setHeroContent}
              />
              <About 
                isEditing={isEditing} 
                content={aboutContent} 
                setContent={setAboutContent} 
              />
              <section id="portfolio-section">
                <Projects 
                  onProjectClick={handleProjectClick} 
                  isEditing={isEditing} 
                  projects={portfolioData} 
                  setProjects={setPortfolioData}
                  limit={6}
                  setView={changeView}
                />
              </section>
              <Skills 
                isEditing={isEditing} 
                skillTabs={skillTabsData} 
                setSkillTabs={setSkillTabsData} 
              />
              <MyTools
                isEditing={isEditing}
                tools={toolsData}
                setTools={setToolsData}
              />
              <Contact />
            </motion.div>
          )}

          {view === 'resume' && (
            <Resume 
              key="resume"
              setView={changeView} 
              isEditing={isEditing} 
              data={resumeData} 
              setData={setResumeData} 
            />
          )}

          {view === 'portfolio' && (
            <Portfolio 
              key="portfolio"
              onProjectClick={handleProjectClick}
              isEditing={isEditing}
              projects={portfolioData}
              setProjects={setPortfolioData}
              setView={changeView}
            />
          )}

          {view === 'all-projects' && (
            <div key="all-projects" className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
              <button 
                onClick={() => changeView('home')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 돌아가기
              </button>
              <Projects 
                onProjectClick={handleProjectClick} 
                isEditing={isEditing} 
                projects={portfolioData} 
                setProjects={setPortfolioData}
              />
            </div>
          )}

          {view === 'project-detail' && selectedProject && (
            <ProjectDetail 
              key="project-detail"
              project={selectedProject} 
              onBack={() => changeView(prevView === 'project-detail' ? 'home' : prevView)} 
              isEditing={isEditing}
              onSaveContent={(content) => {
                const newProjects = [...projectsData];
                const idx = newProjects.findIndex(p => p.id === selectedProject.id);
                if (idx !== -1) {
                  newProjects[idx].content = content;
                  setProjectsData(newProjects);
                  setSelectedProject({...selectedProject, content});
                } else {
                  // Check portfolio projects
                  const newPortfolio = [...portfolioData];
                  const pIdx = newPortfolio.findIndex(p => p.id === selectedProject.id);
                  if (pIdx !== -1) {
                    newPortfolio[pIdx].content = content;
                    setPortfolioData(newPortfolio);
                    setSelectedProject({...selectedProject, content});
                  }
                }
              }}
            />
          )}
        </AnimatePresence>
      </main>
      <Footer />
      <BackToTop />
      <ImageModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} />
      
      {isEditing && (
        <div className="fixed bottom-24 left-8 z-50 flex flex-col gap-2">
          <div className="glass p-4 rounded-2xl flex items-center gap-3 border border-amber-500/30 shadow-2xl">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-black">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">Admin Mode</p>
              <p className="text-[10px] text-slate-400">내용을 클릭하여 직접 수정하세요. 자동 저장됩니다.</p>
            </div>
            <button 
              onClick={() => setIsEditing(false)}
              className="ml-4 p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Lock className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
