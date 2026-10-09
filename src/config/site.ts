/**
 * 사이트 전역 설정. 브랜드·연락처·메뉴·CTA 문구는 여기서만 관리한다.
 * 상세 브랜드 기준: docs/brand.md
 */

export interface NavItem {
  label: string;
  href: string;
  /** 이 경로로 시작하는 페이지에서 메뉴를 활성 표시한다 (href가 앵커일 때) */
  activePrefix?: string;
}

export const siteConfig = {
  name: 'GeoDino',
  /** 한글 이름. 이름이 비슷한 해외 서비스(GeoDin)와 구분되도록 구조화 데이터·푸터·llms.txt에 함께 쓴다 */
  nameKo: '지오디노',
  url: 'https://geodino.io',
  lang: 'ko',
  locale: 'ko_KR',

  tagline: 'AI가 한입에 이해하도록, GeoDino가 요리해 드립니다.',
  /** 구조화 데이터(Organization)·llms.txt에 쓰는 요약. AI가 그대로 가져다 쓰기 쉬워 차별점(필요한 것만, 다시 확인)을 함께 넣는다 */
  description:
    '우리 비즈니스가 AI 답변에 잘 인용될 수 있도록 도와드립니다. 진단에서 막힌 곳만 골라 정리하고(홈페이지가 필요 없으면 만들지 않습니다), 3개월 뒤 같은 질문으로 무엇이 달라졌는지 다시 확인합니다.',

  email: 'help@geodino.io',
  operator: {
    name: '유홍근',
  },
  copyrightYear: 2026,

  /** public/ 기준 경로 */
  logo: '/icon-512.png',
  ogImage: {
    src: '/og/og-default.jpg',
    width: 1200,
    height: 630,
    alt: 'GeoDino — AI가 한입에 이해하도록, GeoDino가 요리해 드립니다.',
  },

  nav: [
    { label: '업종별', href: '/#industries', activePrefix: '/industries/' },
  ] satisfies NavItem[],

  /** 페이지의 primary CTA는 하나로 통일한다 (CLAUDE.md 24장) */
  primaryCta: {
    label: '무료 AI 노출 진단',
    href: '/contact/',
    action: 'free_ai_diagnosis',
  },

  legal: {
    privacyHref: '/privacy/',
  },

  /** 푸터 링크 (헤더 메뉴는 최소로 유지한다) */
  footerLinks: [{ label: '가이드', href: '/guides/' }] satisfies NavItem[],

  contact: {
    /**
     * 문의 폼 전송 주소: form-to-ntfy (Cloud Run, 서울). 받은 내용을 ntfy 알림으로 보낸다 (CLAUDE.md 16장)
     * 서비스의 ALLOWED_ORIGINS에 siteConfig.url이 있어야 하고, 제출 후 thanksPath로 리다이렉트한다.
     */
    formAction: 'https://submit-ntfy-15254663860.asia-northeast3.run.app/submit',
    formSubject: '[GeoDino] 무료 AI 노출 진단 신청',
    thanksPath: '/contact/thanks/',
  },

  /** 검색엔진 사이트 소유 확인 값 (공개 값). Google·GitHub은 DNS TXT로 확인해서 여기 없음 */
  siteVerification: {
    naver: 'cf823543698828e69097bf58ce6649772a922939',
  },

  analytics: {
    /** 비어 있으면 GA 스크립트를 로드하지 않는다 */
    gaId: import.meta.env.PUBLIC_GA_ID ?? '',
  },
} as const;
