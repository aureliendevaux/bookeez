import { layout, physical, rootRoute } from '@tanstack/virtual-file-routes';

export const routes = rootRoute('__root.tsx', [
	layout('(layouts)/member_layout.tsx', [physical('/m', '(member)')]),
	physical('/auth', 'auth'),
]);
