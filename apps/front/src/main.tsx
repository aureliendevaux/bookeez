import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import 'virtual:uno.css';
import './index.css';
import { AppProviders } from '~/providers';
import { hydrateAuthState } from '~/stores/auth_store';

await hydrateAuthState();

const root = document.querySelector('#root');

if (root) {
	createRoot(root).render(
		<StrictMode>
			<AppProviders />
		</StrictMode>,
	);
}
