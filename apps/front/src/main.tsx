import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'virtual:uno.css';
import './index.css';
import { AppProviders } from '~/providers';

const root = document.querySelector('#root');

if (root) {
	createRoot(root).render(
		<StrictMode>
			<AppProviders />
		</StrictMode>,
	);
}
