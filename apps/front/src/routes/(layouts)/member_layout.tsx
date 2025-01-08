import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router';

import { tsr } from '~/lib/query';
import { isAuthenticated, useAuthActions } from '~/stores/auth_store';

export const Route = createFileRoute('/_member_layout')({
	beforeLoad: () => {
		if (!isAuthenticated()) {
			// eslint-disable-next-line @typescript-eslint/only-throw-error
			throw redirect({ to: '/auth/login' });
		}
	},
	component: MemberLayout,
});

function MemberLayout() {
	const { logout } = useAuthActions();
	const navigate = useNavigate();

	const mutation = tsr.auth.logout.useMutation({
		onSuccess() {
			logout();
			void navigate({ to: '/auth/login' });
		},
	});

	function handleLogout() {
		mutation.mutate({});
	}

	return (
		<>
			<header>
				<button type="button" onClick={handleLogout}>
					Déconnexion
				</button>
			</header>
			<Outlet />
		</>
	);
}
