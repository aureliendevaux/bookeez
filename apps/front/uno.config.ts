import {
	defineConfig,
	presetUno,
	presetWebFonts,
	presetIcons,
	transformerVariantGroup,
} from 'unocss';

export default defineConfig({
	content: {
		filesystem: ['src/**/*.{ts,tsx}', 'index.html'],
	},
	presets: [
		presetUno(),
		presetWebFonts({
			fonts: {
				sans: {
					provider: 'bunny',
					name: 'Inter',
					weights: [400, 500, 700],
				},
			},
		}),
		presetIcons({
			extraProperties: {
				'display': 'inline-block',
				'vertical-align': 'middle',
			},
		}),
	],
	transformers: [transformerVariantGroup()],
});
