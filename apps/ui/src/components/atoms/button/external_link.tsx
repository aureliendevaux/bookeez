import type { ReactNode } from 'react';
import type { LinkProps as AriaLinkProps } from 'react-aria-components';

import { buttonVariants, type ButtonVariants } from '~/components/atoms/button/button_variants';
import { ButtonWrapper } from '~/components/atoms/button/button_wrapper';
import { InnerButton } from '~/components/atoms/button/inner_button';
import { cw } from '~/utils/style';

export interface ExternalLinkProps
	extends ButtonVariants,
		Omit<AriaLinkProps, 'children' | 'href' | 'slot' | 'style'> {
	href: string;
	icon?: string;
	iconSize?: 'sm' | 'md' | 'lg';
	label?: ReactNode;
	tooltip?: ReactNode;
}

export function ExternalLink(props: Readonly<ExternalLinkProps>) {
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
		target = '_blank',
		...rest
	} = props;

	return (
		<ButtonWrapper tooltip={tooltip}>
			<a
				{...rest}
				target={target}
				href={href}
				className={cw(
					buttonVariants({
						align,
						disabled: !!props.isDisabled,
						fullWidth,
						iconOnly: !!icon && !label,
						intent,
						size,
						variant,
					}),
					className,
				)}
			>
				<InnerButton icon={icon} iconSize={iconSize} label={label} size={size ?? undefined} />
			</a>
		</ButtonWrapper>
	);
}
