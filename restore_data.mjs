const API_URL = 'https://bovxanwamgbhlubrndyl.supabase.co/functions/v1/content-api';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvdnhhbndhbWdiaGx1YnJuZHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ0NDAsImV4cCI6MjA5MTM1MDQ0MH0.b4MvsylK--ZJrkjWZnkzcSHpjHxYiyJTA-lYsI8Ij4Y';
const ADMIN_PW = 'qwer154';

const headers = {
  'Content-Type': 'application/json',
  'apikey': ANON_KEY,
  'Authorization': `Bearer ${ANON_KEY}`,
};

// ── 복구할 resume_data ──
const resumeData = {
  name: "양현우",
  role: "사업 PM 지망생",
  email: "yhw154@naver.com",
  phone: "010-4034-1154",
  birthDate: "1992.07.11",
  address: "경기도 의정부시",
  github: "github.com/hyunwoo-create",
  militaryService: "수도 방위 사령부 헌병단 하사 제대",
  linkedin: "",
  summary: "",
  education: [],
  awards: [],
  leftExperience: [],
  selfIntroTabs: [],
  experience: [
    {
      title: "뽕송세신사",
      period: "2026.02 ~ 2026.04",
      isReleased: true,
      releasedText: "구글 스토어 출시",
      icon: null,
      platformIcon: null,
      subtitle: "",
      metrics: [
        { label: "역할", value: "팀장 & PM" },
        { label: "프로젝트 인원", value: "12명" },
        { label: "네이버 조회수", value: "1,306 건" },
        { label: "구글스토어 다운로드수", value: "63회" }
      ],
      details: [
        "GIT HUB 툴을 활용하여 기획 팀의 프로젝트 전반(기획, 아트, 사운드, QA, 출시, 마케팅) 일정 관리",
        "프로그래밍 팀과의 커뮤니케이션 및 프로젝트의 전체 방향성 수립",
        "마케팅 계획 수립 및 실행",
        "BM 제안서 작성"
      ]
    },
    {
      title: "별의 아이",
      period: "기간",
      isReleased: false,
      releasedText: "",
      icon: null,
      platformIcon: null,
      subtitle: "",
      metrics: [
        { label: "역할", value: "팀장 & PM" },
        { label: "프로젝트 인원", value: "9명" }
      ],
      details: [
        "JIRA 툴을 활용하여 기획 팀의 프로젝트 전반(기획, 아트, 사운드, QA) 일정 관리",
        "프로그래밍 팀과의 커뮤니케이션 및 프로젝트의 전체 방향성 수립",
        "전체 콘셉트 기획서 서브 제작"
      ]
    },
    {
      title: "ICE BREAKING",
      period: "기간",
      isReleased: true,
      releasedText: "메이플스토리 월드 출시",
      icon: null,
      platformIcon: null,
      subtitle: "",
      metrics: [
        { label: "역할", value: "팀장 & PM" },
        { label: "프로젝트 인원", value: "5명" },
        { label: "총 플레이수", value: "228 명" },
        { label: "플랫폼 내 좋아요수", value: "72개" }
      ],
      details: [
        "JIRA Tool을 활용하여 기획 팀의 프로젝트 전반(기획, 개발, 아트, 사운드, QA, 출시) 일정 관리",
        "프로젝트의 전체 방향성 수립",
        "새롭게 떠오르는 게임 게시",
        "시스템 기획서 제작",
        "밸런스 기획서 제작 (AI GEM 기능을 활용하여 게임의 밸런스 수치 기획)"
      ]
    },
    {
      title: "내가 아는 그날",
      period: "기간",
      isReleased: true,
      releasedText: "메이플스토리 월드 출시",
      icon: null,
      platformIcon: null,
      subtitle: "",
      metrics: [
        { label: "역할", value: "기획 전반" },
        { label: "프로젝트 인원", value: "4명" },
        { label: "총 플레이어수", value: "84 명" },
        { label: "플랫폼 내 좋아요수", value: "43 개" }
      ],
      details: [
        "프로젝트 내 기획 전반 담당",
        "콘텐츠 기획서 제작"
      ]
    }
  ]
};

async function save(key, value) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ password: ADMIN_PW, key, value }),
  });
  const json = await res.json();
  console.log(`[${key}] status=${res.status}`, JSON.stringify(json).slice(0, 100));
}

console.log('▶ resume_data 복구 시작...');
save('resume_data', resumeData).then(() => {
  console.log('✅ 완료!');
}).catch(e => console.error('❌ 오류:', e));
