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

## 최근 작업 (2026-04-22)

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
