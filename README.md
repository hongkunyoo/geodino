# GeoDino

**AI가 한입에 이해하도록, GeoDino가 요리해 드립니다.**

손님이 ChatGPT·Gemini 같은 AI에게 추천을 물을 때, 소규모 사업자와 전문 서비스업의 비즈니스가 정확하게 소개되고 인용되도록 돕는 서비스입니다.
이 저장소는 GeoDino 웹사이트 [geodino.io](https://geodino.io)의 소스 코드입니다.

## 기술 스택

- [Astro](https://astro.build) 정적 사이트 (Markdown 콘텐츠 컬렉션)
- GitHub Pages 배포 (`main` 브랜치 push 시 GitHub Actions)
- 구조화 데이터(JSON-LD), sitemap, `llms.txt`

## 로컬 실행

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ 에 정적 파일 생성
```

## 구성

```text
src/
├── content/      # 업종별 안내(industries)와 가이드(guides) Markdown
├── components/   # 섹션·공통 컴포넌트
├── pages/        # 라우트
├── data/         # 메인·FAQ 등 페이지 문구
└── config/       # 사이트 설정
```

## 문의

help@geodino.io
