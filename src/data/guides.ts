/**
 * 가이드 목록 도우미. 내용은 src/content/guides/<slug>.md
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type GuideEntry = CollectionEntry<'guides'>;

export async function getGuides(): Promise<GuideEntry[]> {
  const entries = await getCollection('guides');
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export function guideHref(entry: GuideEntry): string {
  return `/guides/${entry.id}/`;
}

const dateFormatter = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}
