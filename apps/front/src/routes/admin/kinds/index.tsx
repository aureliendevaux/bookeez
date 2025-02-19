import { Button, Link } from '@bookeez/ui';
import { createFileRoute } from '@tanstack/react-router';
import { queryClient, tsr } from '~/lib/query';
import { cw } from '~/utils/style';

export const Route = createFileRoute('/_admin_layout/admin/kinds/')({
	component: AdminKindsList,
	beforeLoad: () => {
		return {
			admin: {
				title: 'Genres',
			},
		};
	},
	loader: () => {
		return queryClient.ensureQueryData({
			queryKey: [{ domain: 'admin', resource: 'kinds', action: 'index' }],
			queryFn: () => tsr.admin.kinds.index.query(),
		});
	},
});

function AdminKindsList() {
	const query = tsr.admin.kinds.index.useSuspenseQuery({
		queryKey: [{ domain: 'admin', resource: 'kinds', action: 'index' }],
	});

	if (query.isError) {
		return null;
	}

	return (
		<div className={cw('grid gap-4 p-6')}>
			<Link
				to="/admin/kinds/new"
				intent="brand"
				variant="solid"
				label="Ajouter"
				className={cw('justify-self-end')}
			/>

			<ul className="divide-y-1 divide-neutral-300 rounded-md bg-white shadow-sm">
				{query.data.body.map((kind) => (
					<ListItem key={kind.uid} kind={kind} />
				))}
			</ul>
		</div>
	);
}

interface ListItemProps {
	kind: { uid: string; name: string };
}

function ListItem({ kind }: Readonly<ListItemProps>) {
	const deleteMutation = tsr.admin.kinds.destroy.useMutation({
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: [{ resource: 'kinds' }],
				exact: false,
			});
		},
	});

	return (
		<li className="flex items-center gap-1 px-3 py-2">
			<span>{kind.name}</span>
			<Link
				to="/admin/kinds/$uid"
				params={{ uid: kind.uid }}
				tooltip="Modifier"
				icon="pencil"
				variant="ghost"
				intent="neutral"
				className="ml-auto"
			/>
			<Button
				onPress={() => {
					deleteMutation.mutate({ params: { uid: kind.uid } });
				}}
				tooltip="Supprimer"
				intent="danger"
				variant="ghost"
				icon="trash"
			/>
		</li>
	);
}
