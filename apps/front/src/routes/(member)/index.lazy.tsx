import { createLazyFileRoute } from '@tanstack/react-router';

import { useAuthState } from '~/stores/auth_store';

export const Route = createLazyFileRoute('/_member_layout/')({
	component: Home,
});

function Home() {
	const user = useAuthState();

	if (!user) {
		return <strong>Tu n'es pas connecté enfoiré</strong>;
	}

	return (
		<ul>
			<li>Bienvenue {user.username}</li>
			<li>Ton UID est {user.uid}</li>
			<li>Tes rôles sont {user.roles.join(', ')}</li>
		</ul>
	);
}
