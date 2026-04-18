import { GameHistory, ResumeData, Project, SkillTab, ToolItem, Skill } from '../types';

// --- Mock Data ---
export const GAME_HISTORY: GameHistory = {
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

export const RESUME_DATA: ResumeData = {
 name: "이민호",
 role: "Game System Designer",
 birthDate: "2000.01.01",
 address: "서울특별시 OO구",
 phone: "010-0000-0000",
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
 totalExperience: "총 경력 6년",
 leftEducation: [
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
export const PROJECTS: Project[] = [
 {
 id: 1,
 title: "네온 프로토콜 (Neon Protocol)",
 category: "시스템 디자인",
 description: "모듈형 어빌리티 트리와 동적 경제 밸런싱에 중점을 둔 사이버펑크 테마의 RPG 시스템입니다. 핵심 루프와 진행 방식을 다루는 50페이지 분량의 기획서를 작성했습니다.",
 tags: ["시스템 기획", "GDD 작성", "밸런싱"],
 image: "https://picsum.photos/seed/cyberpunk/800/600",
 color: "from-[#112D4E]/20 to-[#0a1e36]/20",
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
 color: "from-[#3F72AF]/20 to-[#112D4E]/20",
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
 color: "from-[#112D4E]/20 to-[#3F72AF]/20",
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
 color: "from-[#DBE2EF]/20 to-[#3F72AF]/20",
 content: "# 크로노 바운드 상세 기획..."
 },
 {
 id: 5,
 title: "스타더스트 아레나 (Stardust Arena)",
 category: "전투 디자인",
 description: "무중력 환경에서의 3:3 팀 전투 밸런싱 및 유닛 스킬 설계 프로젝트입니다.",
 tags: ["무중력", "팀 전투", "밸런싱"],
 image: "https://picsum.photos/seed/space/800/600",
 color: "from-[#112D4E]/20 to-[#DBE2EF]/20",
 content: "# 스타더스트 아레나 상세 기획..."
 }
];

export const PORTFOLIO_PROJECTS: Project[] = [
 {
 id: 101,
 title: "UI/UX 개선 제안서",
 category: "UI/UX",
 description: "기존 모바일 RPG의 복잡한 상점 UI를 직관적으로 개선한 디자인 제안서입니다.",
 tags: ["UI 개선", "UX 분석", "피그마"],
 image: "https://picsum.photos/seed/ui/800/600",
 color: "from-[#DBE2EF]/10 to-[#112D4E]/10",
 content: "# UI/UX 개선 제안 상세..."
 },
 {
 id: 102,
 title: "신규 캐릭터 컨셉 아트",
 category: "아트 컨셉",
 description: "스팀펑크 세계관의 기계공 캐릭터 비주얼 컨셉 및 스킬 이펙트 가이드입니다.",
 tags: ["스팀펑크", "캐릭터", "가이드"],
 image: "https://picsum.photos/seed/steampunk/800/600",
 color: "from-[#112D4E]/10 to-[#0a1e36]/10",
 content: "# 캐릭터 컨셉 상세..."
 },
 {
 id: 103,
 title: "게임 시장 분석 보고서",
 category: "시장 분석",
 description: "2024년 상반기 서브컬처 게임 시장 트렌드 및 향후 전망 분석 보고서입니다.",
 tags: ["시장 조사", "트렌드", "데이터"],
 image: "https://picsum.photos/seed/chart/800/600",
 color: "from-[#3F72AF]/10 to-[#112D4E]/10",
 content: "# 시장 분석 보고서 상세..."
 },
 {
 id: 104,
 title: "퀘스트 스크립트 샘플",
 category: "내러티브",
 description: "다중 선택지에 따른 분기형 퀘스트 스크립트 및 대사 연출 가이드입니다.",
 tags: ["스크립트", "내러티브", "분기"],
 image: "https://picsum.photos/seed/book/800/600",
 color: "from-[#3F72AF]/10 to-pink-500/10",
 content: "# 퀘스트 스크립트 상세..."
 }
];

export const SKILLS: Skill[] = [
 { name: "시스템 디자인", level: 90, icon: 'Cpu', caption: "복잡한 수치 체계 및 밸런싱 설계 가능" },
 { name: "레벨 디자인", level: 85, icon: 'Layers', caption: "UE5 기반 수직적 동선 및 라이팅 가이드 설계" },
 { name: "내러티브 디자인", level: 80, icon: 'ScrollText', caption: "세계관 설정 및 퀘스트 스크립트 작성" },
 { name: "밸런싱 & QA", level: 95, icon: 'Target', caption: "시뮬레이션을 통한 정밀한 수치 검증" },
 { name: "C# / Blueprint", level: 75, icon: 'Code2', caption: "기능 구현 및 프로토타이핑 가능" },
];

export const INITIAL_SKILL_TABS: SkillTab[] = [
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

export const INITIAL_TOOLS: ToolItem[] = [
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

