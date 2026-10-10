/**
 * 콘텐츠 컬렉션. 업종을 추가할 때는 코드가 아니라 src/content/industries/<slug>.md 를 추가한다 (CLAUDE.md 7.3, 31장).
 * 파일 이름이 URL이 된다: accountant.md → /industries/accountant/
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const titledText = z.object({
  title: z.string(),
  description: z.string(),
});

const industries = defineCollection({
  loader: glob({ base: './src/content/industries', pattern: '*.md' }),
  schema: ({ image }) =>
    z.object({
      /** 목록 정렬 순서 */
      order: z.number(),
      /** 표시 이름 (예: 변호사 · 법률사무소) */
      name: z.string(),

      seo: z.object({
        title: z.string(),
        description: z.string(),
      }),

      /** 메인·업종별 안내 페이지 카드 */
      card: z.object({
        sampleQuestion: z.string(),
        description: z.string(),
      }),

      hero: z.object({
        titleLines: z.array(z.string()).min(1),
        lead: z.string(),
        image: image(),
        imageAlt: z.string(),
      }),

      problem: z.object({
        title: z.string(),
        lead: z.string(),
        quotes: z.array(z.string()).min(2),
      }),

      /** 손님이 AI에게 묻는 질문 (업종별 검색 의도) */
      questions: z.object({
        title: z.string(),
        lead: z.string(),
        items: z.array(z.object({ category: z.string(), question: z.string() })).min(3),
      }),

      whyNow: z.object({
        title: z.string(),
        paragraphs: z.array(z.string()).min(1),
      }),

      /** 업종에 맞춰 정리하는 내용 */
      organize: z.object({
        title: z.string(),
        lead: z.string(),
        items: z.array(titledText).min(3),
      }),

      faqs: z
        .array(
          z.object({
            question: z.string(),
            answer: z.array(z.string()).min(1),
          }),
        )
        .min(3),

      finalCta: z.object({
        title: z.string(),
        lead: z.string(),
      }),

      /** 완성 예시 사이트 (가상 사무소). 있는 업종만 "정리하는 내용" 아래에 링크를 보여 준다 */
      example: z
        .object({
          title: z.string(),
          lead: z.string(),
          href: z.url(),
          /** 함께 보여 줄 예시 자료 (진단 요약, 정리 전·후) */
          extras: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
        })
        .optional(),
    }),
});

/**
 * 가이드: 정기 연재 블로그가 아니라 "고쳐 쓰는 가이드" (CLAUDE.md Phase 4 메모).
 * 새 글은 실제 진단·상담에서 나온 주제로만 추가하고, 분기마다 점검해 updatedAt을 갱신한다.
 */
const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '*.md' }),
  schema: z.object({
    /** 목록 정렬 순서 (주제 순, 날짜순 아님) */
    order: z.number(),
    title: z.string(),
    /** meta description 겸 목록 카드 설명 */
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    /** 관련 업종 랜딩 slug (예: lawyer) */
    relatedIndustries: z.array(z.string()).default([]),
    /** 글 하단 FAQ. 있으면 FAQPage 구조화 데이터도 함께 낸다 */
    faqs: z
      .array(
        z.object({
          question: z.string(),
          answer: z.array(z.string()).min(1),
        }),
      )
      .default([]),
  }),
});

export const collections = { industries, guides };
