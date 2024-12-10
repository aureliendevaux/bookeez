import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { useAuthStore } from '~/stores/auth_store';
import { tsr } from '~/lib/query.ts';

export const Route = createLazyFileRoute('/auth/login')({
	component: RouteComponent,
});

function RouteComponent() {
	const { login } = useAuthStore();
	const navigate = useNavigate({ from: '/auth/login' });
	const { mutate } = tsr.auth.login.useMutation();

	const form = useForm({
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
						void navigate({ to: '/' });
					},
				},
			);
		},
		validatorAdapter: zodValidator(),
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
						onChange: z.string().email(),
					}}
				>
					{(field) => (
						<>
							<input
								type="email"
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
						onChange: z.string(),
					}}
				>
					{(field) => (
						<>
							<input
								type="password"
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
			<button type="submit">Se connecter</button>
		</form>
	);
}
