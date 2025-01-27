import type { HTMLAttributes } from 'react';

import { cw } from '~/utils/style';

interface IconProps extends HTMLAttributes<HTMLElement> {
	name: string;
	size?: 'sm' | 'md' | 'lg';
}

export function Icon(props: Readonly<IconProps>) {
	const { className, name, size, ...rest } = props;

	return (
		<i
			{...rest}
			aria-hidden="true"
			className={cw(
				'inline-block shrink-0 align-middle',
				{
					'size-4': size === 'sm',
					'size-5': size === 'md',
					'size-6': size === 'lg',
				},
				className,
				name,
			)}
		/>
	);
}
