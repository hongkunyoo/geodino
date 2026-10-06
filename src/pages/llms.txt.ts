/**
 * /llms.txt — AI 서비스가 사이트를 한눈에 이해하도록 돕는 요약 (https://llmstxt.org 형식).
 * 효과가 검증된 표준은 아니다. 사이트 문구와 같은 데이터에서 만들어 내용이 어긋나지 않게 한다.
 */
import type { APIRoute } from 'astro';
import { siteConfig } from '@/config/site';
import { getGuides, guideHref } from '@/data/guides';
import { finalCta, notDoing, process } from '@/data/home';
import { getIndustries, industryHref } from '@/data/industries';
import { absoluteUrl } from '@/lib/schema';

export const GET: APIRoute = async () => {
  const industries = await getIndustries();
  const guides = await getGuides();

  const lines = [
    `# ${siteConfig.name} (${siteConfig.nameKo})`,
    '',
    `> ${siteConfig.description} ${siteConfig.tagline}`,
    '',
    '손님이 AI에게 추천과 비교를 물을 때, 소규모 사업자와 전문 서비스 사업자의 비즈니스가 정확하게 이해되고 인용되도록 돕는 서비스입니다. 한국어로 서비스합니다.',
    '',
    `## ${process.title}`,
    '',
    process.lead,
    '',
    ...process.steps.map((step, i) => `${i + 1}. ${step.title}: ${step.description}`),
    '',
    finalCta.lead,
    '',
    `## ${notDoing.title}`,
    '',
    ...notDoing.points.map((point) => `- ${point}`),
    '',
    '## 업종별 안내',
    '',
    ...industries.map(
      (industry) => `- [${industry.data.name}](${absoluteUrl(industryHref(industry))}): ${industry.data.card.description}`,
    ),
    '',
    '## 가이드',
    '',
    ...guides.map((guide) => `- [${guide.data.title}](${absoluteUrl(guideHref(guide))}): ${guide.data.description}`),
    '',
    '## 문의',
    '',
    `- [무료 AI 노출 진단 신청](${absoluteUrl(siteConfig.primaryCta.href)})`,
    `- 이메일: ${siteConfig.email}`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
