import { Button, Link } from '@bookeez/ui';
import { createFileRoute } from '@tanstack/react-router';
import { queryClient, tsr } from '~/lib/query';

export const Route = createFileRoute('/_admin_layout/admin/kinds/')({
	component: AdminKindsList,
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
		<>
			<h1>Genres</h1>

			<ul className="space-y-2">
				{query.data.body.map((kind) => (
					<ListItem key={kind.uid} kind={kind} />
				))}
			</ul>
		</>
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
		<li className="flex items-center gap-1">
			<span>{kind.name}</span>
			<Link
				to="/admin/kinds/$uid"
				params={{ uid: kind.uid }}
				tooltip="Modifier"
				icon="pencil"
				variant="ghost"
				intent="neutral"
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
