/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
	readonly THEMES_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
