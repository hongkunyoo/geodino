/**
 * 분석 이벤트 추상화. GA4(gtag)가 없으면 아무 일도 하지 않는다.
 * 이벤트 정의: CLAUDE.md 14장
 *
 * 업종 귀속: 업종 랜딩을 본 세션에서는 이후 CTA 클릭·문의 시작·문의 완료에 같은 industry를 붙인다.
 * 업종 정보는 GA로만 보내고 문의 폼에는 넣지 않는다 (CLAUDE.md 16장: 업종 hidden field 없음).
 */

export const ANALYTICS_EVENTS = {
  pageView: 'page_view',
  ctaClick: 'cta_click',
  contactStart: 'contact_start',
  contactSubmit: 'contact_submit',
  videoPlay: 'video_play',
  videoComplete: 'video_complete',
  industryPageView: 'industry_page_view',
  /** 서비스 상세 페이지는 메인에 통합해 현재 쓰지 않는다 (CLAUDE.md 4.1) */
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

/** 세션 저장소 키. 탭을 닫으면 사라진다. */
const STORAGE_KEYS = {
  industry: 'geodino.industry',
  pendingSubmit: 'geodino.pendingSubmit',
} as const;

export function isAnalyticsEvent(name: string): name is AnalyticsEvent {
  return KNOWN_EVENTS.has(name);
}

export function track(event: AnalyticsEvent, params: EventParams = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', event, params);
}

// sessionStorage는 사생활 보호 모드 등에서 막힐 수 있어 실패해도 조용히 넘어간다.
function readSession(key: string): string | undefined {
  try {
    return sessionStorage.getItem(key) ?? undefined;
  } catch {
    return undefined;
  }
}

function writeSession(key: string, value: string | null): void {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {
    // 저장하지 못하면 업종 귀속만 빠진다.
  }
}

/** 지금 페이지의 업종, 없으면 이번 세션에서 마지막으로 본 업종 */
function currentIndustry(): string | undefined {
  return document.body.dataset.industry || readSession(STORAGE_KEYS.industry);
}

/** dataset 키(trackPlacement)를 GA 파라미터 이름(placement)으로 바꾼다. */
function toParamName(datasetKey: string): string {
  const rest = datasetKey.slice('track'.length);
  return rest.replace(/^[A-Z]/, (c) => c.toLowerCase()).replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

/**
 * 업종 랜딩(`<body data-industry="lawyer">`)이면 industry_page_view를 보내고 세션에 업종을 기억한다.
 * page_view는 GA4가 자동으로 보낸다.
 */
export function initPageTracking(): void {
  const industry = document.body.dataset.industry;
  if (!industry) return;
  writeSession(STORAGE_KEYS.industry, industry);
  track(ANALYTICS_EVENTS.industryPageView, { industry });
}

/**
 * `data-track` 속성이 달린 요소의 클릭을 기록한다.
 *
 *   <a data-track="cta_click" data-track-placement="hero" data-track-action="free_ai_diagnosis">
 *
 * industry는 currentIndustry()로 자동으로 붙는다.
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
    params.industry ??= currentIndustry();

    track(name, params);
  });
}

/**
 * 문의 폼: 처음 입력을 시작하면 contact_start(한 번), 제출하면 완료 확인용 표시를 남긴다.
 * contact_submit은 서버가 접수해 감사 페이지로 보냈을 때만 보낸다 (trackContactSubmitted).
 */
export function initContactFormTracking(form: HTMLFormElement): void {
  let started = false;
  form.addEventListener('focusin', () => {
    if (started) return;
    started = true;
    track(ANALYTICS_EVENTS.contactStart, { industry: currentIndustry() });
  });
  form.addEventListener('submit', () => {
    writeSession(STORAGE_KEYS.pendingSubmit, '1');
  });
}

/** 감사 페이지에서 호출한다. 이 탭에서 폼을 제출하고 넘어온 경우에만 한 번 기록한다 (새로고침·직접 접속 제외). */
export function trackContactSubmitted(): void {
  if (readSession(STORAGE_KEYS.pendingSubmit) !== '1') return;
  writeSession(STORAGE_KEYS.pendingSubmit, null);
  track(ANALYTICS_EVENTS.contactSubmit, { industry: currentIndustry() });
}
