import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'virtual:uno.css';
import './index.css';

import { routeTree } from './route_tree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';

const router = createRouter({ routeTree });
const root = document.querySelector('#root');

if (root) {
	createRoot(root).render(
		<StrictMode>
			<RouterProvider router={router} />
		</StrictMode>,
	);
}

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
