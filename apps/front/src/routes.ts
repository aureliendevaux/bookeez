import { layout, physical, rootRoute } from '@tanstack/virtual-file-routes';

export const routes = rootRoute('__root.tsx', [
	layout('(layouts)/member_layout.tsx', [physical('', '(member)')]),
	layout('(layouts)/auth_layout.tsx', [physical('/auth', 'auth')]),
]);
