import { Button, Link, ToggleButton } from '@bookeez/ui';
import {
	createFileRoute,
	type MakeRouteMatchUnion,
	Outlet,
	redirect,
	useNavigate,
	useRouterState,
} from '@tanstack/react-router';
import { tsr } from '~/lib/query';
import { isAuthenticated, useAuthActions } from '~/stores/auth_store';
import { useSidebarState } from '~/stores/user_preferences_store';
import { cw } from '~/utils/style';

export const Route = createFileRoute('/_admin_layout')({
	beforeLoad: () => {
		if (!isAuthenticated()) {
			// eslint-disable-next-line @typescript-eslint/only-throw-error
			throw redirect({ to: '/auth/login' });
		}
	},
	component: AdminLayout,
});

function isActiveDomain(matches: Array<MakeRouteMatchUnion>, expected: string) {
	for (const match of matches) {
		if (match.fullPath.includes(expected)) {
			return true;
		}
	}

	return false;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function AdminLayout() {
	const [sidebarOpen, toggleSidebar] = useSidebarState();
	const { logout } = useAuthActions();
	const navigate = useNavigate();
	const matches = useRouterState({ select: (s) => s.matches });
	const lastMatch = matches.slice(-1);
	let title = lastMatch.shift()?.context.admin.title;
	let resourceId: string | undefined;

	if (title?.includes('#')) {
		const hashPosition = title.indexOf('#');
		resourceId = title.slice(hashPosition).trim();
		title = title.slice(0, hashPosition - 1).trim();
	}

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
		<div className="grid h-full grid-cols-[auto_1fr] grid-rows-[auto_1fr] bg-neutral-50">
			<header
				className={cw(
					'row-span-1 row-start-1 flex w-full items-center justify-between gap-2 border-b border-b-neutral-200 bg-white p-3',
					{
						'col-span-1 col-start-2': sidebarOpen,
						'col-span-2 col-start-1': !sidebarOpen,
					},
				)}
			>
				<div className={cw('flex items-center gap-2')}>
					<ToggleButton
						isSelected={sidebarOpen}
						onChange={() => {
							toggleSidebar();
						}}
						intent="neutral"
						variant="ghost"
						icon={sidebarOpen ? 'sidebar-collapse' : 'sidebar-expand'}
						tooltip={sidebarOpen ? 'Fermer la sidebar' : 'Ouvrir la sidebar'}
					/>
					{title && (
						<h1 className={cw('font-serif text-xl text-neutral-700')}>
							<span>{title}</span>
							{resourceId && (
								<span className={cw('ml-2 text-sm font-light text-neutral-400')}>{resourceId}</span>
							)}
						</h1>
					)}
				</div>

				<nav className={cw('flex items-center justify-end gap-1')}>
					<Button label="Profil" icon="circle-user" variant="ghost" intent="brand" />
					<Button
						onPress={handleLogout}
						tooltip="Déconnexion"
						icon="logout"
						intent="danger"
						variant="ghost"
					/>
				</nav>
			</header>
			{sidebarOpen ? (
				<aside
					className={cw(
						'col-span-1 col-start-1 row-span-2 row-start-1 border-r border-r-neutral-200 bg-white',
					)}
				>
					<p
						className={cw(
							'text-brand-500 bg-brand-50 px-2 py-4 text-center font-serif text-2xl font-bold uppercase',
						)}
					>
						bookeez
					</p>
					<nav className={cw('grid min-w-3xs gap-1 p-2')}>
						<Link
							to="/admin/books"
							intent={isActiveDomain(matches, '/admin/books') ? 'brand' : 'neutral'}
							label="Livres"
							variant="ghost"
							icon="book-open-text"
							align="start"
						/>
						<Link
							to="/admin/libraries"
							intent={isActiveDomain(matches, '/admin/libraries') ? 'brand' : 'neutral'}
							label="Bibliothèques"
							variant="ghost"
							icon="library"
							align="start"
						/>
						<Link
							to="/admin/authors"
							intent={isActiveDomain(matches, '/admin/authors') ? 'brand' : 'neutral'}
							label="Auteurs"
							variant="ghost"
							icon="pen-tool"
							align="start"
						/>
						<Link
							to="/admin/publishers"
							intent={isActiveDomain(matches, '/admin/publishers') ? 'brand' : 'neutral'}
							label="Maisons d'édition"
							variant="ghost"
							icon="building"
							align="start"
						/>
						<Link
							to="/admin/kinds"
							intent={isActiveDomain(matches, '/admin/kinds') ? 'brand' : 'neutral'}
							label="Genres"
							variant="ghost"
							icon="bookmark"
							align="start"
						/>
						<Link
							to="/admin/types"
							intent={isActiveDomain(matches, '/admin/types') ? 'brand' : 'neutral'}
							label="Types"
							variant="ghost"
							icon="layout-list"
							align="start"
						/>
						<Link
							to="/admin/users"
							intent={isActiveDomain(matches, '/admin/users') ? 'brand' : 'neutral'}
							label="Utilisateurs"
							variant="ghost"
							icon="users"
							align="start"
						/>
					</nav>
				</aside>
			) : null}
			<main
				className={cw('row-span-1 row-start-2 overflow-y-auto', {
					'col-span-1 col-start-2': sidebarOpen,
					'col-span-2 col-start-1': !sidebarOpen,
				})}
			>
				<Outlet />
			</main>
		</div>
	);
}
