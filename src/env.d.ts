/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_APPLY_ENDPOINT?: string;
  readonly PUBLIC_GTM_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
