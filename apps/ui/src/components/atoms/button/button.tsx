import { type ReactNode, type RefAttributes } from 'react';
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';

import type { IconName } from '../../../types/icon.js';

import { cw } from '../../../utils/style.js';
import { buttonVariants, type ButtonVariants } from './button_variants.js';
import { ButtonWrapper } from './button_wrapper.js';
import { InnerButton } from './inner_button.js';

export interface ButtonProps
	extends ButtonVariants,
		Omit<AriaButtonProps, 'children' | 'className'>,
		RefAttributes<HTMLButtonElement> {
	className?: string;
	icon?: IconName;
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
