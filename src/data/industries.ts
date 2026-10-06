/**
 * 업종 목록은 콘텐츠 컬렉션(src/content/industries/)에서 읽는다. 여기에는 공통 문구만 둔다.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type IndustryEntry = CollectionEntry<'industries'>;

export async function getIndustries(): Promise<IndustryEntry[]> {
  const entries = await getCollection('industries');
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export function industryHref(entry: IndustryEntry): string {
  return `/industries/${entry.id}/`;
}

export const otherIndustriesNote =
  '노무사, 병원, 부동산 등 손님이 AI에게 추천과 비교를 묻는 다른 업종도 상담할 수 있습니다.';
