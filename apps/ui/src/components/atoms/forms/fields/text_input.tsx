import type { ValidationError } from '@tanstack/react-form';
import type { ReactNode } from 'react';

import { Description } from '~/components/atoms/forms/description';
import { Errors } from '~/components/atoms/forms/errors';
import { Label } from '~/components/atoms/forms/label';
import { Icon } from '~/components/atoms/icon';
import { cw } from '~/utils/style';
import { Input, TextField, type TextFieldProps } from 'react-aria-components';

export interface TextInputProps extends TextFieldProps {
	label: ReactNode;
	placeholder?: string;
	hiddenLabel?: boolean;
	errors?: Array<ValidationError>;
	description?: ReactNode;
}

export function TextInput(props: Readonly<TextInputProps>) {
	const { description, errors, hiddenLabel = false, label, placeholder, ...rest } = props;
	const isInvalid = errors && errors.length > 0;

	return (
		<TextField {...rest} isInvalid={isInvalid} validationBehavior="aria">
			<Label content={label} hidden={hiddenLabel} isRequired={props.isRequired} />
			<div className={cw('relative rounded-md shadow-xs')}>
				<Input
					className={cw(
						'focus:ring-brand-500 block w-full rounded-md border-0 py-2 pr-10 pl-3 text-neutral-700 ring-1 ring-neutral-400 ring-inset placeholder:text-neutral-400 focus:ring-2',
						{
							'ring-danger-500 focus:ring-danger-500': isInvalid,
						},
					)}
					placeholder={placeholder}
				/>
				{isInvalid && (
					<div
						className={cw('pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3')}
					>
						<Icon name="triangle-alert" className={cw('text-danger-500')} />
					</div>
				)}
			</div>
			<Errors errors={errors} />
			{description && <Description>{description}</Description>}
		</TextField>
	);
}
