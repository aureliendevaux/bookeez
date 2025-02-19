import type { Preview, ReactRenderer } from '@storybook/react';
import '@fontsource-variable/lexend';
import '@fontsource/atkinson-hyperlegible';
import '../src/index.css';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
			expanded: true,
			sort: 'alpha',
			disableSaveFromUI: true,
		},
		viewport: {
			viewports: INITIAL_VIEWPORTS,
			defaultViewport: 'desktop',
		},
	},
	decorators: [
		withThemeByDataAttribute<ReactRenderer>({
			themes: {
				light: 'light',
				dark: 'dark',
			},
			defaultTheme: 'light',
			attributeName: 'data-theme',
		}),
	],
	tags: ['autodocs'],
};

export default preview;
