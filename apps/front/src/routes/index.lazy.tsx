import { createLazyFileRoute } from '@tanstack/react-router';

import { useAuthActions } from '~/stores/auth_store.ts';

export const Route = createLazyFileRoute('/')({
	component: Home,
});

function Home() {
	const { getUser } = useAuthActions();
	const user = getUser();

	if (!user) {
		return <strong>Tu n&#39;es pas connecté enfoiré</strong>;
	}

	return (
		<ul>
			<li>Bienvenue {user.username}</li>
			<li>Ton UID est {user.uid}</li>
			<li>Tes rôles sont {user.roles.join(', ')}</li>
		</ul>
	);
}
