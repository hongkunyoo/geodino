// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://geodino.io',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // CSS 인라인('always')은 측정해 보니 메인이 더 느려져(공통 CSS를 페이지마다 다시 받음) 기본값(auto)을 쓴다
  },
  // 업종 목록 페이지는 메인 업종 섹션으로 통합 (CLAUDE.md 4.1)
  redirects: {
    '/industries': '/#industries',
  },
  markdown: {
    // 가이드의 코드 상자를 사이트 톤(흰 바탕)에 맞춘다
    shikiConfig: { theme: 'github-light' },
  },
  integrations: [
    sitemap({
      // 문의 제출 후 감사 페이지는 검색 노출 대상이 아니다
      filter: (page) => !page.endsWith('/contact/thanks/'),
    }),
  ],
});
