import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react({
			jsxImportSource: '@emotion/react',
		}),
		tsconfigPaths({
			parseNative: false,
		}),
		svgrPlugin(),
		{
			name: 'custom-hmr-control',
			handleHotUpdate({ file, server }) {
				if (file.endsWith('src/app/core/routing/routesConfig.tsx') || file.endsWith('src/app/core/navigation/navigationConfig.ts')) {
					server.ws.send({
						type: 'full-reload',
					});
					return [];
				}
				return;
			},
		},
	],
	build: {
		outDir: 'build',
	},
	server: {
		open: true,
		port: 3000
	},
	define:{
		global: 'window',
	},
	resolve: {
		alias: {
			'@': '/src',
			"@schema": "/src/@schema",
			"app/shared/components": "/src/app/shared/components",
			"app/core": "/src/app/core"
		},
	},
	"optimizeDeps": {
		"include": ['@mui/icons-material','@mui/material','@mui/base','@mui/styles','@mui/system','@mui/utils','@emotion/cache','@emotion/react','@emotion/styled'],
		"exclude": [],
		"esbuildOptions": {
			"loader": {
				".js": "jsx",
			},
		},
	}
});
