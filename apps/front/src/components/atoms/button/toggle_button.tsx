import { type ReactNode, type RefAttributes } from 'react';
import {
	ToggleButton as AriaToggleButton,
	type ToggleButtonProps as AriaToggleButtonProps,
} from 'react-aria-components';

import { buttonVariants, type ButtonVariants } from '~/components/atoms/button/button_variants';
import { ButtonWrapper } from '~/components/atoms/button/button_wrapper';
import { InnerButton } from '~/components/atoms/button/inner_button';
import { cw } from '~/utils/style';

interface ToggleButtonProps
	extends ButtonVariants,
		Omit<AriaToggleButtonProps, 'children'>,
		RefAttributes<HTMLButtonElement> {
	icon?: string;
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
