import { type ReactNode, type RefAttributes } from 'react';
import {
	ToggleButton as AriaToggleButton,
	type ToggleButtonProps as AriaToggleButtonProps,
} from 'react-aria-components';

import type { IconName } from '../../../types/icon.js';

import { cw } from '../../../utils/style.js';
import { buttonVariants, type ButtonVariants } from './button_variants.js';
import { ButtonWrapper } from './button_wrapper.js';
import { InnerButton } from './inner_button.js';

export interface ToggleButtonProps
	extends ButtonVariants,
		Omit<AriaToggleButtonProps, 'children'>,
		RefAttributes<HTMLButtonElement> {
	icon?: IconName;
	iconSize?: 'sm' | 'md' | 'lg';
	label?: ReactNode;
	tooltip?: ReactNode;
}

export function ToggleButton(props: Readonly<ToggleButtonProps>) {
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
			<AriaToggleButton
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
			</AriaToggleButton>
		</ButtonWrapper>
	);
}
