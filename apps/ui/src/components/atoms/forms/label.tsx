import type { ReactNode } from 'react';
import type { LabelProps as AriaLabelProps } from 'react-aria-components';

import { cw } from '~/utils/style';
import { Label as AriaLabel } from 'react-aria-components';

export interface LabelProps extends Omit<AriaLabelProps, 'content'> {
	content: ReactNode;
	isRequired?: boolean;
}

export function Label(props: Readonly<LabelProps>) {
	const { content, className, hidden, isRequired, ...rest } = props;

	return (
		<AriaLabel
			{...rest}
			className={cw(
				{
					'mb-1 block leading-none font-medium text-neutral-700': !hidden,
					'sr-only': hidden,
				},
				className,
			)}
		>
			{content}
			{isRequired && <span className={cw('text-danger-500')}>&nbsp;*</span>}
		</AriaLabel>
	);
}
