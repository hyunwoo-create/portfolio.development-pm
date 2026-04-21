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
- **최신 커밋:** `96b3650` (이후 CEO 리뷰 적용 완료)
- 아키텍처 고도화 및 어드민 편집 기능 완성 버전

## 이번 세션에서 한 작업 (CEO 리뷰 & 기능 확장)

### 1. 보안 및 안정성 강화
- **Admin 비밀번호 보안**: 하드코딩된 비밀번호(`qwer154`)를 `.env`의 `VITE_ADMIN_PASSWORD`로 이관하여 보안성 확보.
- **Runtime 안정성**: `StatBoard.tsx`에서 호버 시 발생하던 잠재적 런타임 에러(Optional Chaining 누락) 해결.

### 2. 어드민 편집 기능 완성 (Content Enablers)
- **Skill CRUD**: `StatBoard` 내 "Core Competencies" 섹션에서 스킬 추가, 삭제, 숙련도 조절, 텍스트 편집 기능 구현.
- **Tool CRUD**: "Arsenal" 섹션에서 도구 추가, 삭제, 아이콘 URL 및 설명 편집 기능 구현.
- **데이터 흐름**: `App.tsx`에서 `useEditableContent` setter를 하위 컴포넌트로 전달하여 실시간 Supabase 동기화 체계 완성.

### 3. 코드베이스 클린업
- **데드 코드 제거**: 사용하지 않던 `Projects.tsx` 파일을 삭제하고, `App.tsx` 내 `all-projects` 관련 도달 불가 코드 및 로직 완전 제거.

### 4. UI/UX 세부 제어
- **이력서 다운로드 UI 제한**: PDF 이력서 다운로드 버튼을 관리자(isEditing) 모드에서만 노출되도록 수정.
- **라벨 제거**: 이력서 페이지 상단의 '01_RESUME' 라벨 섹션을 완전히 삭제하여 디자인을 더 깔끔하게 정리.
- **줄바꿈 시스템 최적화 및 오류 수정**: 
  - 자기소개서 영역에서 문단 간의 줄바꿈이 무시되는 문제를 해결하기 위해 마크다운 단락(`<p>`)의 `inline` 처리와 여백 제거(`!m-0`) 설정을 파기.
  - `index.css`를 통해 단락 간 여백(`margin-bottom: 1.5rem`)을 확보하여, 사용자가 입력한 빈 줄이 시각적으로 명확하게 구분되도록 수정.
  - 모든 텍스트 영역에서 '한 번의 엔터 = 한 줄 개행'이 유지되도록 `remarkBreaks`와 스타일 상속 체계를 정비.
  - 제목(h1~h3) 요소를 실제 시맨틱 태그로 매핑하고 여백(`margin-bottom`)을 조정하여, 제목과 본문 사이의 간격이 단락 간 간격과 조화롭게 유지되도록 수정.

## 현재 파일 구조 (src/)
```
src/
├── App.tsx              (6.5KB - 가벼워진 엔트리 포인트)
├── main.tsx
├── index.css
├── components/
│   ├── About.tsx
│   ├── AdminTextEditor/  (Tiptap v3 기반 리치 에디터)
│   ├── Common.tsx
│   ├── EditableText.tsx
│   ├── Hero.tsx
│   ├── HeroVideoSettingsModal.tsx
│   ├── Navbar.tsx
│   ├── PasswordModal.tsx
│   ├── PortfolioGallery.tsx (전체 프로젝트 그리드 뷰)
│   ├── ProjectDetail.tsx    (프로젝트 상세 마드다운 뷰)
│   ├── Resume.tsx           (이력서 뷰)
│   └── StatBoard.tsx        (메인 인터랙티브 대시보드)
├── data/
│   └── constants.ts
├── hooks/
│   └── index.ts
├── types/
│   └── index.ts
└── utils/
    └── index.ts
```

## 주요 주의사항
- **[환경변수]** 로컬 및 배포 환경에서 `VITE_ADMIN_PASSWORD` 설정 필수.
- **[데이터 입력]** 현재 Skill 및 Tool 데이터가 비어 있으므로, 어드민 모드에서 실제 데이터를 입력하여 포트폴리오를 채우는 과정이 필요함.
- **[핵심]** 모든 프로젝트/역량 데이터는 `StatBoard` 내부에서 통합 관리 및 조회됨.
- **[중요]** Tiptap 관련 패키지는 버전 `3.22.4`로 고정됨 (버전 변경 시 호환성 주의).
- **[배포]** GitHub Pages base path `/portfolio/`가 `vite.config.ts` 및 `Navbar` 로직 등에 정상 반영됨.

## 빌드 상태
- ✅ `npm run build` (Vite) 정상 완료 확인 (2026-04-21)
- ✅ 포트폴리오 사이트 완성도: 기능적 요구사항 100% 충족 상태
