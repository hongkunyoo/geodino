interface ImportMetaEnv {
  /** Google Analytics 4 측정 ID (예: G-XXXXXXXXXX). 비어 있으면 GA를 로드하지 않는다. */
  readonly PUBLIC_GA_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
