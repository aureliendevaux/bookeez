import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	server: {
		host: true,
		allowedHosts: ['bookeez.aaa'],
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
		tailwindcss(),
	],
});
