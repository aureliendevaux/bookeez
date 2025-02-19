import type { ValidationError } from '@tanstack/react-form';

import { ToggleButton } from '~/components/atoms/button';
import { Description } from '~/components/atoms/forms/description';
import { Errors } from '~/components/atoms/forms/errors';
import { Label } from '~/components/atoms/forms/label';
import { Icon } from '~/components/atoms/icon';
import { cw } from '~/utils/style';
import { type ReactNode, useState } from 'react';
import { Input, TextField, type TextFieldProps } from 'react-aria-components';

export interface PasswordInputProps extends Omit<TextFieldProps, 'type'> {
	label: ReactNode;
	placeholder?: string;
	hiddenLabel?: boolean;
	errors?: Array<ValidationError>;
	description?: ReactNode;
}

export function PasswordInput(props: Readonly<PasswordInputProps>) {
	const { description, errors, hiddenLabel = false, label, placeholder, ...rest } = props;
	const isInvalid = errors && errors.length > 0;
	const [showPassword, togglePassword] = useState<boolean>(false);

	return (
		<TextField
			{...rest}
			type={showPassword ? 'text' : 'password'}
			isInvalid={isInvalid}
			validationBehavior="aria"
		>
			<Label content={label} hidden={hiddenLabel} isRequired={props.isRequired} />
			<div
				className={cw(
					'group group-focus:ring-brand-500 relative flex items-center rounded-md pr-1 pl-3 ring-1 shadow-xs ring-neutral-400 ring-inset group-focus:ring-2',
					{
						'ring-danger-500 focus:ring-danger-500 px-3': isInvalid,
					},
				)}
			>
				<Input
					className={cw(
						'block w-full rounded-md border-0 py-2 text-neutral-700 placeholder:text-neutral-400',
						{
							'font-mono': !showPassword,
						},
					)}
					placeholder={placeholder}
				/>
				<ToggleButton
					icon={showPassword ? 'eye-closed' : 'eye'}
					intent="neutral"
					isSelected={showPassword}
					onChange={() => {
						togglePassword((v) => !v);
					}}
					size="sm"
					tooltip={showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
					variant="ghost"
				/>
				{isInvalid && <Icon name="triangle-alert" className={cw('text-danger-500 ml-2')} />}
			</div>
			<Errors errors={errors} />
			{description && <Description>{description}</Description>}
		</TextField>
	);
}
