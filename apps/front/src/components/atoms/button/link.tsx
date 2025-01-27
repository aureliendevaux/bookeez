import type { ReactNode } from 'react';

import {
	Link as TanStackLink,
	type LinkProps as TanStackLinkProps,
	useLocation,
} from '@tanstack/react-router';

import { buttonVariants, type ButtonVariants } from '~/components/atoms/button/button_variants';
import { ButtonWrapper } from '~/components/atoms/button/button_wrapper';
import { InnerButton } from '~/components/atoms/button/inner_button';
import { cw } from '~/utils/style';

interface LinkProps extends ButtonVariants, Omit<TanStackLinkProps, 'children' | 'label' | 'size'> {
	href: string;
	icon?: string;
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
				<InnerButton icon={icon} label={label} size={size ?? undefined} />
			</TanStackLink>
		</ButtonWrapper>
	);
}
