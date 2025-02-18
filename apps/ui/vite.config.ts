import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	server: {
		host: true,
		allowedHosts: ['ui.bookeez.aaa'],
	},
	resolve: {
		alias: {
			'~': path.resolve(__dirname, './src'),
		},
	},
	plugins: [react(), tailwindcss()],
});
