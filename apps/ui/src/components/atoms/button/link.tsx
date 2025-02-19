import type { ReactNode } from 'react';

import {
	Link as TanStackLink,
	type LinkProps as TanStackLinkProps,
	useLocation,
} from '@tanstack/react-router';

import type { IconName } from '../../../types/icon.js';

import { cw } from '../../../utils/style.js';
import { buttonVariants, type ButtonVariants } from './button_variants.js';
import { ButtonWrapper } from './button_wrapper.js';
import { InnerButton } from './inner_button.js';

export interface LinkProps
	extends ButtonVariants,
		Omit<TanStackLinkProps, 'children' | 'label' | 'size'> {
	icon?: IconName;
	iconSize?: 'sm' | 'md' | 'lg';
	label?: ReactNode;
	tooltip?: ReactNode;
	className?: string;
}

export function Link(props: Readonly<LinkProps>) {
	const {
		align = 'center',
		className,
		fullWidth,
		href,
		icon,
		iconSize,
		intent,
		label,
		size = 'md',
		tooltip,
		variant,
		...rest
	} = props;
	const location = useLocation();
	const isActiveRoute = props.href === location.href;

	return (
		<ButtonWrapper tooltip={tooltip}>
			<TanStackLink
				{...rest}
				href={href}
				className={cw(
					buttonVariants({
						align,
						disabled: !!props.disabled,
						fullWidth,
						iconOnly: !!icon && !label,
						intent: isActiveRoute ? 'brand' : intent,
						size,
						variant: isActiveRoute ? 'solid' : variant,
					}),
					className,
				)}
			>
				<InnerButton icon={icon} iconSize={iconSize} label={label} size={size ?? undefined} />
			</TanStackLink>
		</ButtonWrapper>
	);
}
