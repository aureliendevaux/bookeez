import { routeTree } from '~/route_tree.gen';
import { createRouter } from '@tanstack/react-router';

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
