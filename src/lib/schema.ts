/**
 * JSON-LD 구조화 데이터. 실제 페이지 내용과 일치할 때만 쓴다 (CLAUDE.md 11장).
 */
import { siteConfig } from '@/config/site';

export type JsonLd = Record<string, unknown>;

const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).href;
}

const AREA_SERVED = { '@type': 'Country', name: '대한민국' };

/** 운영자 개인 이름(founder)은 넣지 않는다 (2026-10 운영자 결정: 운영자 소개를 사이트에 쓸 때 다시 검토) */
export function organizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: siteConfig.name,
    alternateName: siteConfig.nameKo,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.logo),
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    email: siteConfig.email,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: siteConfig.email,
      availableLanguage: 'Korean',
    },
    areaServed: AREA_SERVED,
  };
}

/** 페이지에 실제로 보이는 영상일 때만 쓴다 */
export function videoSchema(input: {
  name: string;
  description: string;
  thumbnailPath: string;
  contentPath: string;
  uploadDate: string;
  durationISO: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: input.name,
    description: input.description,
    thumbnailUrl: absoluteUrl(input.thumbnailPath),
    contentUrl: absoluteUrl(input.contentPath),
    uploadDate: input.uploadDate,
    duration: input.durationISO,
    inLanguage: 'ko-KR',
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/** 화면에 보이는 브레드크럼(Breadcrumbs.astro)과 같은 항목으로 만든다 */
export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** 업종 랜딩이 설명하는 서비스. 페이지에 보이는 이름·설명과 같게 쓴다 */
export function industryServiceSchema(input: {
  name: string;
  description: string;
  path: string;
  audience: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    serviceType: 'AI 노출 진단 및 비즈니스 정보 정리',
    provider: { '@id': ORGANIZATION_ID },
    areaServed: AREA_SERVED,
    audience: { '@type': 'BusinessAudience', audienceType: input.audience },
  };
}

/** 페이지에 실제로 보이는 FAQ와 같은 내용일 때만 쓴다 */
export function faqSchema(items: { question: string; answer: string[] }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer.join('\n\n') },
    })),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  publishedAt: Date;
  updatedAt: Date;
}): JsonLd {
  const url = absoluteUrl(input.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    url,
    mainEntityOfPage: url,
    datePublished: input.publishedAt.toISOString(),
    dateModified: input.updatedAt.toISOString(),
    inLanguage: 'ko-KR',
    author: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    image: absoluteUrl(siteConfig.ogImage.src),
  };
}

export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: siteConfig.name,
    alternateName: siteConfig.nameKo,
    url: siteConfig.url,
    inLanguage: 'ko-KR',
    publisher: { '@id': ORGANIZATION_ID },
  };
}
