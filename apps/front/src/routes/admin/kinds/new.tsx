import { Button, TextInput } from '@bookeez/ui';
import { useForm } from '@tanstack/react-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { queryClient, tsr } from '~/lib/query';
import { z } from 'zod';

export const Route = createFileRoute('/_admin_layout/admin/kinds/new')({
	component: AdminKindsNew,
});

const schema = z.object({
	name: z.string(),
});

type Schema = z.infer<typeof schema>;

function AdminKindsNew() {
	const navigate = useNavigate();
	const mutation = tsr.admin.kinds.store.useMutation({
		onSuccess: (response) => {
			console.log(response.body.name);
		},
	});

	const form = useForm<Schema>({
		defaultValues: {
			name: '',
		},
		onSubmit: (values) => {
			mutation.mutate({ body: values.value });
			form.reset();
			void queryClient.invalidateQueries({
				queryKey: [{ resource: 'kinds' }],
			});
			void navigate({ to: '/admin/kinds' });
		},
	});

	return (
		<>
			<h1>Créer un genre</h1>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					void form.handleSubmit();
				}}
			>
				<form.Field name="name" validators={{ onChange: schema.shape.name }}>
					{(fieldApi) => (
						<TextInput
							name={fieldApi.name}
							value={fieldApi.state.value}
							label="Nom du genre"
							onChange={(value) => fieldApi.handleChange(value)}
							isRequired
							errors={fieldApi.state.meta.errors}
						/>
					)}
				</form.Field>

				<form.Subscribe selector={(state) => [state.canSubmit]}>
					{([canSubmit]) => (
						<Button
							label="Ajouter"
							type="submit"
							intent={'success'}
							variant={'solid'}
							isDisabled={!canSubmit}
						/>
					)}
				</form.Subscribe>
			</form>
		</>
	);
}
