import { createRouter } from '@tanstack/react-router';
import { routeTree } from '~/route_tree.gen';

export const router = createRouter({
	routeTree,
	context: {
		admin: {
			title: '',
		},
	},
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
