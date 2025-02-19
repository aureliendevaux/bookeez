import type { HTMLAttributes } from 'react';

import type { IconName } from '../../../types/icon.js';

import { cw } from '../../../utils/style.js';

export interface IconProps extends HTMLAttributes<SVGElement> {
	name: IconName;
	size?: 'sm' | 'md' | 'lg';
}

export function Icon(props: Readonly<IconProps>) {
	const { className, name, size = 'md', ...rest } = props;
	const iconUri = `/sprite.svg#${name}`;

	return (
		<svg
			{...rest}
			aria-hidden="true"
			className={cw(
				'pointer-events-none inline-block shrink-0 align-middle text-current',
				{
					'size-4': size === 'sm',
					'size-5': size === 'md',
					'size-6': size === 'lg',
				},
				className,
			)}
		>
			<use href={iconUri} />
		</svg>
	);
}
