import { type ReactNode, type RefAttributes } from 'react';
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';

import { buttonVariants, type ButtonVariants } from '~/components/atoms/button/button_variants';
import { ButtonWrapper } from '~/components/atoms/button/button_wrapper';
import { InnerButton } from '~/components/atoms/button/inner_button';
import { cw } from '~/utils/style';

interface ButtonProps
	extends ButtonVariants,
		Omit<AriaButtonProps, 'children' | 'className'>,
		RefAttributes<HTMLButtonElement> {
	className?: string;
	icon?: string;
	iconSize?: 'sm' | 'md' | 'lg';
	label?: ReactNode;
	tooltip?: ReactNode;
}

export function Button(props: Readonly<ButtonProps>) {
	const {
		align = 'center',
		className,
		fullWidth,
		icon,
		iconSize,
		intent,
		label,
		size = 'md',
		tooltip,
		variant,
		...rest
	} = props;

	return (
		<ButtonWrapper tooltip={tooltip}>
			<AriaButton
				{...rest}
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
			</AriaButton>
		</ButtonWrapper>
	);
}
