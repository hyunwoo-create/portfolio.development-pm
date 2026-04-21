# 포트폴리오 프로젝트 컨텍스트

## 프로젝트 정보
- **경로:** `c:\Users\c\Desktop\portfolio\portfolio.basic`
- **기술 스택:** React + TypeScript + Vite + TailwindCSS v4
- **배포:** GitHub Pages (`/portfolio/` base path)
- **데이터 저장:** Supabase Edge Function (`content-api`)

## Supabase 설정
- **API URL:** `https://bovxanwamgbhlubrndyl.supabase.co/functions/v1/content-api`
- **Admin 비밀번호:** `qwer154`
- **저장 키 목록:**
  - `hero_content` — 히어로 텍스트/스타일 (이미지 제외)
  - `hero_image` — 히어로 이미지 (base64, 별도 저장)
  - `about_content` — 소개 섹션 텍스트
  - `projects_data` — 포트폴리오 프로젝트 5개 (데이터 있음)
  - `resume_data` — 이력서 (name: "PM" 외 모두 빈 배열 → 미입력 상태)
  - `skill_tabs_data` — 역량 탭 (비어있음)
  - `tools_data` — 툴 목록 (비어있음)
  - `portfolio_data` — 포트폴리오 추가 데이터 (비어있음)

## 현재 Git 상태
- **최신 커밋:** `832aab2` — chore: optimize data transfer, clean up project structure, and update context
- 이 커밋이 안정 버전 기준

## 이번 세션에서 한 작업

### 1. 265b776 롤백
- `src/data/constants.ts`, `src/hooks/index.ts` 두 파일을 `git checkout --`로 복구

### 2. 토큰 과다 소비 & 데이터 유실 원인 파악 및 수정 (`src/hooks/index.ts`)
**원인:**
- `hero_content`에 base64 이미지(수백KB)가 텍스트와 함께 묶여 타이핑할 때마다 전송되었음
- `blob:` URL이 Supabase에 저장되어 새로고침 시 영상 URL이 소실되었음
- 글자 입력마다 즉시 POST 요청이 발생 (디바운스 없음)

**조치:**
- `heroImage` (base64)를 `hero_image` 키로 **분리 저장**
- 로딩 시 `hero_image`를 `hero_content`에 자동 병합 (merge-back 로직)
- `blob:` URL은 저장 시 **자동 제외**
- **1.5초 디바운스** 추가 → 연속 타이핑 중 한 번만 저장

### 3. 불필요한 파일 대규모 삭제
- 백업 tsx 파일 13개 (`016d139_App.tsx` 등)
- 분석 js 스크립트 25개 (`fix_json.js`, `deep_search.js` 등)
- 거대 json 파일 7개 (`db.json` 3.5MB, `db_cleanest.json` 1.7MB 등)
- **총 약 10MB+ 제거**

### 4. 더미 데이터 제거 (`src/data/constants.ts`)
- 17KB 분량의 한국어 더미 데이터 → **모든 배열을 빈 배열로 교체**
- Supabase 데이터가 있으면 Supabase 우선, 없으면 빈 상태로 표시

### 5. 커밋 및 배포
- `src/components/`, `claude.md`, `context.md` 포함 전원 커밋 및 `main` 브랜치 푸쉬
- GitHub Actions를 통한 자동 배포 완료

## 현재 파일 구조 (src/)
```
src/
├── App.tsx              (122KB - 메인 앱, 컴포넌트 인라인 포함)
├── main.tsx
├── index.css
├── components/
│   ├── About.tsx
│   ├── AdminTextEditor/  (Tiptap 기반 리치 에디터)
│   ├── Common.tsx
│   ├── EditableText.tsx
│   ├── Hero.tsx
│   ├── HeroVideoSettingsModal.tsx
│   ├── Navbar.tsx
│   ├── PasswordModal.tsx
│   ├── PlayHistory.tsx
│   ├── Projects.tsx
│   ├── Resume.tsx
│   ├── Skills.tsx
│   └── Tools.tsx
├── data/
│   └── constants.ts     (빈 초기값만 있음)
├── hooks/
│   └── index.ts         (Supabase 연동 훅)
├── types/
│   └── index.ts
└── utils/
    └── index.ts
```

## 주요 주의사항
- `App.tsx`는 123KB로 크지만 빌드는 정상 작동 중
- `AdminTextEditor`는 Tiptap 라이브러리를 사용하나 `package.json`에 없음 → 빌드 시 번들에 포함되는지 확인 필요
- `resume_data`의 대부분 필드가 비어있음 → 사용자가 아직 이력서를 입력하지 않은 상태
- CSS gzip 크기: 51KB (최적화 후), JS gzip: 174KB

## 빌드 상태
- ✅ `npx vite build` 정상 완료
- ⚠️ JS 번들 584KB (500KB 초과 경고) — 코드 스플리팅 미적용
