/**
 * 분석 이벤트 추상화. GA4(gtag)가 없으면 아무 일도 하지 않는다.
 * 이벤트 정의: CLAUDE.md 14장
 */

export const ANALYTICS_EVENTS = {
  pageView: 'page_view',
  ctaClick: 'cta_click',
  contactStart: 'contact_start',
  contactSubmit: 'contact_submit',
  videoPlay: 'video_play',
  videoComplete: 'video_complete',
  industryPageView: 'industry_page_view',
  servicePageView: 'service_page_view',
} as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type EventParams = Record<string, string | number | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const KNOWN_EVENTS = new Set<string>(Object.values(ANALYTICS_EVENTS));

export function isAnalyticsEvent(name: string): name is AnalyticsEvent {
  return KNOWN_EVENTS.has(name);
}

export function track(event: AnalyticsEvent, params: EventParams = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', event, params);
}

/** dataset 키(trackPlacement)를 GA 파라미터 이름(placement)으로 바꾼다. */
function toParamName(datasetKey: string): string {
  const rest = datasetKey.slice('track'.length);
  return rest.replace(/^[A-Z]/, (c) => c.toLowerCase()).replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

/**
 * `data-track` 속성이 달린 요소의 클릭을 기록한다.
 *
 *   <a data-track="cta_click" data-track-placement="hero" data-track-action="free_ai_diagnosis">
 *
 * 업종은 `<body data-industry="lawyer">`에서 자동으로 붙는다.
 */
export function initClickTracking(): void {
  document.addEventListener('click', (e) => {
    const target = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-track]') : null;
    const name = target?.dataset.track;
    if (!target || !name || !isAnalyticsEvent(name)) return;

    const params: EventParams = {};
    for (const [key, value] of Object.entries(target.dataset)) {
      if (key !== 'track' && key.startsWith('track')) params[toParamName(key)] = value;
    }
    const industry = document.body.dataset.industry;
    if (industry && !params.industry) params.industry = industry;

    track(name, params);
  });
}
