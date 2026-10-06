# GeoDino 브랜드 가이드

> 상태: **확정** (Phase 0, 2026-10-01). 색상·캐치프레이즈·캐릭터는 운영자 선택안.

## 1. 브랜드 한 줄

> **AI가 한입에 이해하도록, GeoDino가 요리해 드립니다.** (확정 캐치프레이즈)

**GeoDino** — 고객님의 사업을 검색엔진과 AI가 이해하기 쉽게, 잘게 잘게 정리해 한입 크기로 보여드리는 서비스.

- 이름: GEO(Generative Engine Optimization) + Dino(saur)
- 표기: 항상 `GeoDino` (로고, title, schema name). 문장 안 한글 병기가 필요하면 "지오디노"
- 도메인: `geodino.io`

## 2. 색상

상태: **확정**.

원칙: **흰 바탕 + 검정 글씨·선 + 초록 포인트**. 초록은 강조에만 쓰고 면적을 넓게 칠하지 않는다.

| 토큰 | HEX | 용도 | 대비 (WCAG) |
|---|---|---|---|
| `--color-bg` | `#FFFFFF` | 페이지 배경 | — |
| `--color-surface` | `#F6F8F6` | 카드/섹션 구분 배경 | — |
| `--color-ink` | `#17191C` | 본문 글씨, 외곽선, 캐릭터 선 | 흰 바탕 17.6:1 |
| `--color-ink-muted` | `#5A615D` | 보조 글씨 | 흰 바탕 6.4:1 |
| `--color-line` | `#E2E6E3` | 구분선, 입력창 테두리 | 장식용 |
| `--color-green-50` | `#EEF7F0` | 강조 배경(배지, 하이라이트) | ink 16.1:1 |
| `--color-green-100` | `#DDF2E3` | 공룡 배, 연한 강조 | — |
| `--color-green-400` | `#6CC486` | **공룡 몸 색**, 일러스트·아이콘 장식 | ⚠ 흰 글씨 불가(2.1:1), 위에 검정 글씨만 |
| `--color-green-500` | `#2E9E5B` | 공룡 점박이, 큰 장식 요소 | 텍스트 사용 금지 |
| `--color-green-700` | `#18723E` | **Primary**: CTA 버튼 배경, 링크 | 흰 글씨 6.0:1 ✅ AA |
| `--color-green-800` | `#125A31` | 버튼 hover/active | — |
| `--color-bot` | `#2B2F36` | AI Bot 몸 | — |
| `--color-bot-light` | `#8A9099` | AI Bot 얼굴 패널 | 장식용 |

규칙:
- CTA 버튼은 `green-700` 배경 + 흰 글씨 한 가지로 통일한다 (페이지당 primary CTA 1개).
- 링크 텍스트는 `green-700`. 밝은 초록(`green-400/500`)을 글씨 색으로 쓰지 않는다.
- 다크 모드는 MVP 범위에서 제외한다.

## 3. 타이포그래피

- 폰트: **Pretendard** (한글·영문 공통). 웹폰트는 subset/dynamic subset으로 로드해 속도를 지킨다.
- 굵기: 본문 400, 강조 600, 제목 700. 그 이상은 쓰지 않는다.
- 본문 16–18px, 줄간격 1.7 (한글 가독성 기준).

## 4. 형태

- 모서리: 카드 16px, 버튼 999px(알약형), 입력창 12px — "동글동글한" 인상.
- 선: 1px `--color-line` 기본, 강조 카드는 2px `--color-ink` (캐릭터 외곽선과 같은 느낌).
- 그림자: 거의 쓰지 않는다. 쓰면 아주 옅게 한 단계만.
- 애니메이션: hover 시 살짝 이동(2px) 정도. 화려한 모션 금지.

## 5. 캐릭터

| 캐릭터 | 설명 | 역할 |
|---|---|---|
| **GEO** (공룡) | 초록 티라노, 통통한 몸, 연한 배, 등에 점박이와 둥근 뿔 | 사업 정보를 "요리"해주는 GeoDino 자신 |
| **AI Bot** | 짙은 회색, 둥근 몸, 큰 눈, 다리 없이 떠 있음, 안테나 끝 초록 점 | 검색엔진·AI (정보를 "먹는" 쪽) |

스타일: 플랫 2D 벡터, 두꺼운 검정 외곽선, 그라데이션 없음.

사용 규칙:
- 한 화면에 캐릭터는 최대 1–2회. 모든 섹션에 넣지 않는다.
- 캐릭터가 성과를 "약속"하는 말풍선을 쓰지 않는다 (예: "1위로 만들어 드려요" ✗).
- AI Bot은 특정 AI 서비스(ChatGPT 등) 로고/모양을 흉내 내지 않는다.

### 확정 이미지와 웹용 에셋

웹에서는 가공본만 쓴다 (배경 투명, 여백 정리, 긴 변 1200px, WebP): `src/assets/characters/`. 원본·후보는 `brand/characters/` (로컬 전용).

| 용도 | 웹용 (`src/assets/characters/`) | 원본 (`brand/characters/`) |
|---|---|---|
| GEO 공룡 기본 | `geo-dino.webp` | `edits/geo-dino-v3.png` |
| AI Bot 기본 | `ai-bot.webp` | `higgsfield/ai-bot-v2.png` |
| 함께: 요리 장면 (캐치프레이즈, Hero 후보) | `duo-chef.webp` | `fal-ai/duo-chef.png` |
| 공룡 정면 | `dino-front.webp` | `poses/fal-ai/pose-dino-front-v2.png` |
| 공룡 인사 (문의 완료, 환영) | `dino-bow.webp` | `edits/pose-dino-bow-v3.png` |
| 함께 쉬기 (404, 빈 상태) | `duo-rest.webp` | `poses/fal-ai/pose-duo-rest-v2.png` |
| 공룡 가리키기 (문구/버튼 옆 안내) | `dino-point.webp` | `edits/pose-dino-point-v2.png` |
| 공룡 엄지 척 (CTA, 완료 안내) | `dino-thumbsup.webp` | `edits/pose-dino-thumbsup-v2.png` |
| 공룡 돋보기 (무료 진단) | `dino-magnifier.webp` | `edits/pose-dino-magnifier-v2.png` |

괄호 안 용도는 제안이며 고정이 아니다.

인포그래픽 (`src/assets/guides/`):

| 용도 | 웹용 | 원본 (`brand/infographics/`) |
|---|---|---|
| 플랫폼 차단 vs 공식 안내 페이지 (메인 "세 가지" 섹션 예시 블록, 가이드 robots-txt 4번 섹션) | `platform-hub.webp` | `higgsfield/platform-hub-2.png` |

- 이미지에는 글자를 넣지 않고, 본문의 그림 설명 문장으로 의미를 보완한다.
- 새 인포그래픽도 확정 공룡·AI Bot을 레퍼런스로 넣고, 플랫폼 회사 로고·이름은 쓰지 않는다. 프롬프트: `brand/prompts.md` 4차.

그 밖의 에셋:
- 아이콘 (`public/`): `favicon.ico`(16/32/48), `favicon-32.png`, `apple-touch-icon.png`(180), `icon-192.png`, `icon-512.png`. 공룡 머리 + `green-50` 둥근 사각 배경.
- OG 이미지: `public/og/og-default.jpg` (1200×630). 원본 HTML은 `brand/og/og.html` (프로젝트 루트에서 로컬 서버를 띄워 스크린샷).
- 재생성 스크립트: `brand/scripts/process_characters.py`, `brand/scripts/make_icons.py` (`uv run --with pillow --with numpy ...`)
- git 커밋 범위: Astro가 사용하는 이미지(`src/assets/characters/*.webp`, `public/`의 아이콘·OG)만. 원본·후보(`brand/characters/`)와 PNG 중간 산출물은 로컬에서만 관리한다 (`.gitignore`).

새 포즈를 만들 때는 확정 원본(`edits/geo-dino-v3.png`, `higgsfield/ai-bot-v2.png`)을 레퍼런스 이미지로 넣는다. 공룡은 **등판 뿔이 머리 위까지 이어진다** (머리 위 뿔 2개). 기준 이미지: `poses/fal-ai/pose-dino-front-v2.png`. 프롬프트 기록: `brand/prompts.md`, 비교 보드: `brand/board.html`.

## 6. 캐치프레이즈

**확정: AI가 한입에 이해하도록, GeoDino가 요리해 드립니다.**

원문 콘셉트: *AI Bot이 잘 소화(이해/인용)할 수 있도록 GEO 공룡이 잘게 잘게 조리해 한입에 먹을 수 있게.*

보조 문구(서브 카피) — **확정** (OG 이미지에 사용):

> 우리 비즈니스가 AI 답변에 잘 인용될 수 있도록 도와드립니다.

서브 카피는 "홈페이지 제작"이 아니라 **AI의 이해·인용**을 말한다. 홈페이지·콘텐츠는 수단이므로 메인 메시지에 앞세우지 않는다. (포지셔닝 초안: `docs/positioning.md`)

긴 소개 문구 (소개 영상·About용):

> 고객님의 사업이 검색엔진과 AI에게 잘 이해될 수 있도록, GEO 공룡이 사업 정보를 잘게 잘게 손질하고 정리해 한입 크기로 차려 드립니다.

표현 점검: "추천 보장", "1위", "반드시" 등 보장성 표현 없음. "이해하도록/쉽게" 같은 방향성 표현만 사용.

## 7. 말투 (Voice)

- 고객의 사업은 "비즈니스"로 쓴다 ("사업자"·"개인사업자" 같은 용어는 유지, 업종 랜딩에서는 사무소·병원 등 업종 명사).
- 단, 손님·사장님이 직접 하는 말(공감 문구, FAQ 질문)에서는 "우리" 또는 "우리 사무소/가게"를 쓴다. 상세 규칙: CLAUDE.md 23장.
- 존댓말, 짧은 문장, 쉬운 단어. 기술 용어는 처음 나올 때 한 줄로 풀어서 설명.
- "~해 드립니다"보다 "~합니다/정리합니다"를 기본으로, 과한 겸양 표현 줄이기.
- 기술 이름(Astro, JSON-LD) 대신 결과("빠르게 열리는", "검색엔진이 읽기 쉬운")로 말한다.
