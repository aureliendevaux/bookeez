import { Button, TextInput } from '@bookeez/ui';
import { useForm } from '@tanstack/react-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { queryClient, tsr } from '~/lib/query';
import { z } from 'zod';

export const Route = createFileRoute('/_admin_layout/admin/kinds/$uid')({
	component: AdminKindsEdit,
	loader: ({ params }) => {
		return queryClient.ensureQueryData({
			queryKey: [{ domain: 'admin', resource: 'kinds', action: 'show', id: params.uid }],
			queryFn: () => tsr.admin.kinds.show.query({ params: { uid: params.uid } }),
		});
	},
});

const editSchema = z.object({
	name: z.string(),
});

type Schema = z.infer<typeof editSchema>;

function AdminKindsEdit() {
	const parameters = Route.useParams();
	const navigate = useNavigate();
	const query = tsr.admin.kinds.show.useSuspenseQuery({
		queryKey: [{ domain: 'admin', resource: 'kinds', action: 'show', id: parameters.uid }],
	});
	const updateMutation = tsr.admin.kinds.update.useMutation({
		onSuccess() {
			void queryClient.invalidateQueries({
				queryKey: [{ resource: 'kinds' }],
				exact: false,
			});
		},
	});

	const form = useForm<Schema>({
		defaultValues: { name: query.data.body.name },
		onSubmit: async (values) => {
			updateMutation.mutate({ params: { uid: parameters.uid }, body: values.value });
			await navigate({ to: '/admin/kinds' });
		},
	});

	return (
		<>
			<h1>Modifier un genre</h1>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					void form.handleSubmit();
				}}
			>
				<form.Field name="name" validators={{ onChange: editSchema.shape.name }}>
					{(field) => (
						<TextInput
							label="Nom du genre"
							value={field.state.value}
							name={field.name}
							onChange={(value) => field.handleChange(value)}
							errors={field.state.meta.errors}
							isRequired
						/>
					)}
				</form.Field>

				<form.Subscribe selector={(state) => [state.canSubmit]}>
					{([canSubmit]) => (
						<Button
							type="submit"
							label="Sauvegarder"
							intent="success"
							variant="solid"
							isDisabled={!canSubmit}
						/>
					)}
				</form.Subscribe>
			</form>
		</>
	);
}
