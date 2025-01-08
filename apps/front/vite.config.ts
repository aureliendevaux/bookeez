import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import unocss from 'unocss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import path from 'node:path';

export default defineConfig({
	server: {
		host: true,
	},
	resolve: {
		alias: {
			'~': path.resolve(__dirname, './src'),
		},
	},
	plugins: [
		TanStackRouterVite({
			virtualRouteConfig: './src/routes.ts',
		}),
		react(),
		unocss(),
	],
});
