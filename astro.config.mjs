// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * sitemap lastmod: 실제 수정일을 아는 가이드에만 넣는다 (frontmatter updatedAt).
 * 다른 페이지에 빌드 시각을 넣으면 매 배포마다 바뀌어 검색엔진이 lastmod를 믿지 않게 된다.
 */
const GUIDES_DIR = new URL('./src/content/guides/', import.meta.url);
/** @type {Record<string, string>} 가이드 경로 → updatedAt */
const guideLastmod = Object.fromEntries(
  readdirSync(GUIDES_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const updatedAt = readFileSync(new URL(file, GUIDES_DIR), 'utf8').match(/^updatedAt:\s*(\S+)/m)?.[1];
      return [`/guides/${file.replace(/\.md$/, '')}/`, updatedAt];
    })
    .filter(([, updatedAt]) => updatedAt),
);

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
      serialize(item) {
        const updatedAt = guideLastmod[new URL(item.url).pathname];
        if (updatedAt) item.lastmod = new Date(updatedAt).toISOString();
        return item;
      },
    }),
  ],
});
