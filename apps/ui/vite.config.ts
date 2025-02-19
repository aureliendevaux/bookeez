import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	server: {
		host: true,
		allowedHosts: ['ui.bookeez.aaa'],
	},
	plugins: [react(), tailwindcss()],
});
