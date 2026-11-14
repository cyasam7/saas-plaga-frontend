/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_MAP_KEY: string;
	readonly VITE_API_BASE_URL: string;
	readonly VITE_GOOGLE_API: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
