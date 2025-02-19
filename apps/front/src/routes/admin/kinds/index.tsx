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
					<li key={kind.uid}>{kind.name}</li>
				))}
			</ul>
		</>
	);
}
