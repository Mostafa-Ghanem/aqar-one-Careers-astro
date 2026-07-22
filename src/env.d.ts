/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_APPLY_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
