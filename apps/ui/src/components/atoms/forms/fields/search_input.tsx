import type { ValidationError } from '@tanstack/react-form';
import type { ReactNode } from 'react';

import { Input, SearchField, type SearchFieldProps } from 'react-aria-components';

import { cw } from '../../../../utils/style.js';
import { Button } from '../../button/button.js';
import { Icon } from '../../icon/icon.js';
import { Description } from '../description.js';
import { Errors } from '../errors.js';
import { Label } from '../label.js';

export interface SearchInputProps extends SearchFieldProps {
	label: ReactNode;
	placeholder?: string;
	hiddenLabel?: boolean;
	errors?: Array<ValidationError>;
	description?: ReactNode;
}

export function SearchInput(props: Readonly<SearchInputProps>) {
	const { description, errors, hiddenLabel = false, label, placeholder, ...rest } = props;
	const isInvalid = errors && errors.length > 0;

	return (
		<SearchField {...rest} isInvalid={isInvalid} validationBehavior="aria">
			{({ isEmpty }) => (
				<>
					<Label content={label} hidden={hiddenLabel} isRequired={props.isRequired} />
					<div
						className={cw(
							'group group-focus:ring-brand-500 relative flex items-center rounded-md pr-1 pl-3 ring-1 shadow-xs ring-neutral-400 ring-inset group-focus:ring-2',
							{
								'ring-danger-500 focus:ring-danger-500 px-3': isInvalid,
							},
						)}
					>
						<Icon name="search" className={cw('mr-2 text-neutral-400')} />
						<Input
							className={cw(
								'block w-full rounded-md border-0 py-2 text-neutral-700 placeholder:text-neutral-400',
							)}
							placeholder={placeholder}
						/>
						{!isEmpty && (
							<Button
								icon="circle-x"
								intent="light"
								size="sm"
								tooltip="Effacer"
								variant="ghost"
								className="shrink-0"
							/>
						)}
						{isInvalid && (
							<Icon name="triangle-alert" size="md" className={cw('text-danger-500 ml-2')} />
						)}
					</div>
					<Errors errors={errors} />
					{description && <Description>{description}</Description>}
				</>
			)}
		</SearchField>
	);
}
