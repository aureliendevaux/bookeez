import type { ValidationError } from '@tanstack/react-form';

import { Icon } from '~/components/atoms/icon';
import { cw } from '~/utils/style';
import { FieldError } from 'react-aria-components';

export interface ErrorsProps {
	errors?: Array<ValidationError>;
	as?: keyof HTMLElementTagNameMap;
}

export function Errors(props: Readonly<ErrorsProps>) {
	const { as, errors } = props;

	if (errors === undefined) return null;

	const Parent = as ?? FieldError;

	return (
		<Parent className={cw('text-danger-500 mt-1 grid text-sm')}>
			{errors.map((error, index) => (
				<em key={index} className={cw('inline-flex items-center gap-1 not-italic')}>
					<Icon name="circle-x" size="sm" />
					<span>{error}</span>
				</em>
			))}
		</Parent>
	);
}
