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
- **최신 커밋:** `5c8e78d` (리치 텍스트 에디터 통합 및 데이터 영속성 수정 완료)
- 어드민 텍스트 에디터 고도화 및 Supabase 데이터 동기화 로직이 안정화된 버전으로 롤백됨.

## 최근 작업 (2026-04-29)

### 1. UI 컴포넌트 최적화 및 네비게이션 스크롤 동작 개선
- **페이지 전환 스크롤 보장 로직**: 라우팅(AnimatePresence) 시 렌더링 지연으로 스크롤이 실패하는 문제를 막기 위해, DOM에 대상 요소가 나타날 때까지 최대 1.5초간 재시도(polling)하여 정확히 이동하는 로직을 `App.tsx`에 추가.
- **`소개` 버튼 스크롤 개선**: 타겟 ID가 아닌 화면 최상단(`top: 0`)으로 즉시 이동하도록 수정.
- **이력서 컴포넌트 디자인 일치화**: '사용 TOOL' 하단 More 버튼을 화살표 아이콘으로 세련되게 변경하고, 각 섹션의 구분선 색상(`border-[#DBE2EF]/60`)을 전체 톤앤매너와 완벽하게 일치시킴.

### 2. 불필요한 레거시 코드 완전히 제거 (번들/렌더링 최적화)
- **`StatBoard.tsx` 다이어트**: 기존 다각형 스탯 차트로 쓰였으나 개편 이후 방치된 거대 컴포넌트 `DraggableChart`를 삭제하고, 미사용 Props 전달을 끊어 렌더링 성능 향상.
- **디버깅 코드 정리**: 잦은 배열 연산 시마다 불필요하게 출력되던 `ResumeSelfIntro`의 `console.log` 문을 모두 제거하고 린트(Lint) 에러 수정.

## 이전 작업 (2026-04-28)

### 1. 포트폴리오 UI 최적화 및 갤러리 구조 개편
- **갤러리 레이아웃 표준화**: 갤러리 뷰를 더 직관적이고 일관된 아이콘 기반의 정렬된 섹션으로 재구조화하여 시각적 완성도 향상.
- **안정화 및 퍼포먼스 향상**: 포트폴리오 전반적인 사이트 로딩 및 렌더링 속도 최적화 진행.

### 2. 불필요한 레거시 기능 및 코드 정리
- **어드민 기능 간소화**: 중복된 기능이거나 유지보수에 불필요한 PDF 다운로드 등의 어드민 기능 제거.
- **StatBoard 최적화**: `StatBoard` 컴포넌트 내에서 사용되지 않는(dead) 상태 관리 로직 및 함수들을 모두 제거하여 코드베이스 정리 및 가독성 확보.

### 3. 이력서(Resume) 어드민 에디터 안정화
- **데이터 동기화 및 렌더링 수정**: 어드민 편집 모드와 읽기 모드 간의 줄간격(line-height/spacing) 렌더링 불일치 현상 해결.
- **데이터 백업 및 복원**: 데이터 손실을 방지하기 위해 백업 및 복원 기능 도입 및 동기화 안정성 개선.

## 이전 작업 (2026-04-23)

### 1. UI/UX 개선 및 디자인 반영
- **이력서 사이드바 디자인 변경**: '학력 및 교육', '경력 사항', '자격 및 수상' 섹션의 디자인을 제공된 레퍼런스 이미지와 동일하게 수정.
  - 경력 사항 타임라인에서 불릿 포인트를 제거하고 텍스트 정렬과 세로선(border)만으로 깔끔하게 구분.
  - '총 경력 N년' 필드를 경력 사항 섹션 제목 하단에 추가.
  - 텍스트 색상 및 굵기를 조정하여 시각적 위계를 개선.

### 2. 초기 렌더링(Flashing) 버그 수정
- **Zustand Store 로딩 상태 추가**: 데이터를 가져오기 전 초기 기본값(Dummy Data)이 화면에 렌더링되어 발생하는 충돌 방지.
- **App.tsx 로딩 스피너 적용**: `isLoading` 상태일 때 `AnimatePresence` 렌더링을 차단하고 로딩 화면("Loading Content...")을 표시하여 안정적인 데이터 로드 환경 구축.

## 이전 작업 (2026-04-22)

### 0. 버전 관리 (Rollback)
- **커밋 롤백**: 안정적인 리치 텍스트 에디터 환경을 위해 `5c8e78d` 버전으로 하드 리셋(`git restore` 방식 활용) 진행.
- 이후 추가된 기능들보다 현재 버전의 에디터 안정성을 우선시하여 작업을 재개함.

### 1. 이력서(Resume) 기능 고도화
- **멀티탭 자기소개서**: 자기소개서 섹션을 여러 탭으로 나누어 관리할 수 있는 기능 구현 (탭 추가/삭제/이름 변경 가능).
- **고품질 PDF 추출**: `html2canvas`와 `jspdf`를 활용한 전용 PDF 내보내기 기능(`pdf-generator.ts`) 추가.
- **프로젝트 경험 섹션 최적화**: 
  - 프로젝트 아이콘 업로드 및 삭제 기능 추가.
  - **Metrics 관리**: 출시 여부(`isReleased`)와 상관없이 프로젝트 성과 지표(사용자, 성과 등)를 관리할 수 있도록 UI 개선.
  - 출시 상태 토글 기능 및 출시 텍스트 커스텀 필드 추가.

### 2. 성능 및 데이터 안정성 최적화
- **렌더링 성능**: `useCallback`을 활용하여 이력서 내 주요 핸들러(메트릭 추가/삭제 등)를 안정화함으로써 불필요한 리렌더링 방지.
- **데이터 동기화**: `useEditableContent`의 디바운스(1.5s) 로직을 통해 편집 중 잦은 API 호출 방지 및 Supabase 데이터 정합성 유지.

### 3. UI/UX 개선
- **Sticky Tab Bar**: 자기소개서 탭이 스크롤 시 상단에 고정되도록 개선하여 긴 문서에서도 접근성 확보.
- **애니메이션**: `motion/react`를 활용한 부드러운 탭 전환 및 스크롤 연동 반영.

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
│   ├── Resume.tsx           (이력서 뷰 - 멀티탭/PDF 기능 포함)
│   └── StatBoard.tsx        (메인 인터랙티브 대시보드)
├── data/
│   └── constants.ts
├── hooks/
│   └── index.ts          (useEditableContent - 디바운스/Supabase 연동)
├── types/
│   └── index.ts
├── utils/
│   ├── index.ts
│   └── pdf-generator.ts  (PDF 추출 로직)
└── vite-env.d.ts
```

## 주요 주의사항
- **[환경변수]** 로컬 및 배포 환경에서 `VITE_ADMIN_PASSWORD` 설정 필수.
- **[데이터 입력]** 현재 Skill 및 Tool 데이터가 비어 있으므로, 어드민 모드에서 실제 데이터를 입력하여 포트폴리오를 채우는 과정이 필요함.
- **[PDF 추출]** PDF 추출 시 브라우저의 '인쇄' 대화상자가 아닌 전용 추출 버튼(`pdf-generator.ts`) 사용 권장.
- **[중요]** Tiptap 관련 패키지는 버전 `3.22.4`로 고정됨 (버전 변경 시 호환성 주의).

## 빌드 상태
- ✅ `npm run build` (Vite) 정상 완료 확인 (2026-04-22)
- ✅ 포트폴리오 사이트 완성도: 기능적 요구사항 100% 충족 및 고도화 완료 상태
