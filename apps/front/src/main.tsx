import { AppProviders } from '~/providers';
import { hydrateAuthState } from '~/stores/auth_store';
// @ts-expect-error font files
import '@fontsource-variable/lexend';
// @ts-expect-error font files
import '@fontsource/atkinson-hyperlegible';

import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

await hydrateAuthState();

const root = document.querySelector('#root');

if (root) {
	createRoot(root).render(
		<StrictMode>
			<AppProviders />
		</StrictMode>,
	);
}
