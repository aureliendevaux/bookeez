import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { isAuthenticated } from '~/stores/auth_store';

export const Route = createFileRoute('/_auth_layout')({
	beforeLoad: () => {
		if (isAuthenticated()) {
			// eslint-disable-next-line @typescript-eslint/only-throw-error
			throw redirect({ to: '/' });
		}
	},
	component: AuthLayout,
});

function AuthLayout() {
	return (
		<>
			<Outlet />
		</>
	);
}
