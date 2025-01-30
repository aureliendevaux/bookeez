import type { ValueOf } from '~/types/utils';
import type { HTMLAttributes } from 'react';

import { cw } from '~/utils/style';

export const IconNames = {
	ArrowDown: 'icon-arrow-down',
	ArrowLeft: 'icon-arrow-left',
	ArrowRight: 'icon-arrow-right',
	ArrowUp: 'icon-arrow-up',
	Close: 'icon-close',
	Menu: 'icon-menu',
} as const;

export type IconNames = typeof IconNames;
export type IconName = ValueOf<IconNames>;

export interface IconProps extends HTMLAttributes<SVGElement> {
	name: keyof IconNames;
	size?: 'sm' | 'md' | 'lg';
}

export function Icon(props: Readonly<IconProps>) {
	const { className, name, size, ...rest } = props;
	const iconUri = `/sprite.svg#${IconNames[name]}`;

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
