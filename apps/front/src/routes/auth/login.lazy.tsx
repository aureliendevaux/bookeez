import { useForm } from '@tanstack/react-form';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

import { tsr } from '~/lib/query.ts';
import { useAuthActions } from '~/stores/auth_store';

export const Route = createLazyFileRoute('/auth/login')({
	component: RouteComponent,
});

const schema = z.object({
	email: z.string().email(),
	password: z.string(),
});

type Schema = z.infer<typeof schema>;

function RouteComponent() {
	const { login } = useAuthActions();
	const navigate = useNavigate({ from: '/auth/login' });
	const { mutate } = tsr.auth.login.useMutation();

	const form = useForm<Schema>({
		defaultValues: {
			email: '',
			password: '',
		},
		onSubmit: ({ value }) => {
			mutate(
				{ body: value },
				{
					onSuccess: (result) => {
						login(result.body);
						void navigate({ to: '/m' });
					},
				},
			);
		},
	});

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				event.stopPropagation();
				void form.handleSubmit();
			}}
		>
			<div>
				<form.Field
					name="email"
					validators={{
						onChange: schema.shape.email,
					}}
				>
					{(field) => (
						<>
							<label htmlFor="email">Email</label>
							<input
								type="email"
								id="email"
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
							/>
							{field.state.meta.errors.map((error, index) => (
								<em key={index}>{error}</em>
							))}
						</>
					)}
				</form.Field>
			</div>
			<div>
				<form.Field
					name="password"
					validators={{
						onChange: schema.shape.password,
					}}
				>
					{(field) => (
						<>
							<label htmlFor="password">Mot de passe</label>
							<input
								type="password"
								id="password"
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
							/>
							{field.state.meta.errors.map((error, index) => (
								<em key={index}>{error}</em>
							))}
						</>
					)}
				</form.Field>
			</div>
			<form.Subscribe selector={(state) => [state.canSubmit]}>
				{([canSubmit]) => (
					<button type="submit" disabled={!canSubmit}>
						Se connecter
					</button>
				)}
			</form.Subscribe>
		</form>
	);
}
