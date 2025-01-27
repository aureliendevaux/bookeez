import type { ClassValue } from 'class-variance-authority/types';

import { cva, type VariantProps } from 'class-variance-authority';

type Variants = {
	align: {
		center: ClassValue;
		end: ClassValue;
		start: ClassValue;
	};
	disabled: {
		false: ClassValue;
		true: ClassValue;
	};
	fullWidth: {
		true: ClassValue;
	};
	iconOnly: {
		false: ClassValue;
		true: ClassValue;
	};
	intent: {
		brand: ClassValue;
		danger: ClassValue;
		light: ClassValue;
		neutral: ClassValue;
		success: ClassValue;
		warning: ClassValue;
	};
	size: {
		lg: ClassValue;
		md: ClassValue;
		sm: ClassValue;
	};
	variant: {
		ghost: ClassValue;
		outline: ClassValue;
		solid: ClassValue;
		underline: ClassValue;
	};
};

export const buttonVariants = cva<Variants>(
	'inline-flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 border-none rounded-md font-medium transition-colors',
	{
		compoundVariants: [
			// Classic button
			{
				className: 'px-2.5 py-1.5',
				iconOnly: false,
				size: 'sm',
				variant: ['solid', 'outline', 'ghost'],
			},
			{
				className: 'px-3 py-2',
				iconOnly: false,
				size: 'md',
				variant: ['solid', 'outline', 'ghost'],
			},
			{
				className: 'px-5 py-3',
				iconOnly: false,
				size: 'lg',
				variant: ['solid', 'outline', 'ghost'],
			},
			{
				className: 'underline underline-offset-3 underline-2 decoration-skip-ink',
				iconOnly: false,
				variant: 'underline',
			},
			// Icon button
			{
				className: 'h-8 w-8',
				iconOnly: true,
				size: 'sm',
				variant: ['solid', 'outline', 'ghost'],
			},
			{
				className: 'h-10 w-10',
				iconOnly: true,
				size: 'md',
				variant: ['solid', 'outline', 'ghost'],
			},
			{
				className: 'h-12 w-12',
				iconOnly: true,
				size: 'lg',
				variant: ['solid', 'outline', 'ghost'],
			},
			{
				className: 'rounded-sm',
				iconOnly: true,
				variant: 'underline',
			},
			// Accessibility outline color
			{
				className: 'outline-brand-4',
				intent: 'brand',
			},
			{
				className: 'outline-neutral-4',
				intent: 'neutral',
			},
			{
				className: 'outline-success-4',
				intent: 'success',
			},
			{
				className: 'outline-danger-4',
				intent: 'danger',
			},
			{
				className: 'outline-neutral-4',
				intent: 'light',
			},
			{
				className: 'outline-warning-4',
				intent: 'warning',
			},
			// Solid colors
			{
				className: 'bg-brand-6 hover:bg-brand-7',
				disabled: false,
				intent: 'brand',
				variant: 'solid',
			},
			{
				className: 'bg-neutral-6 hover:bg-neutral-7',
				disabled: false,
				intent: 'neutral',
				variant: 'solid',
			},
			{
				className: 'bg-success-6 hover:bg-success-7',
				disabled: false,
				intent: 'success',
				variant: 'solid',
			},
			{
				className: 'bg-danger-6 hover:bg-danger-7',
				disabled: false,
				intent: 'danger',
				variant: 'solid',
			},
			{
				className: 'text-neutral-6 bg-neutral-1 hover:bg-neutral-2',
				disabled: false,
				intent: 'light',
				variant: 'solid',
			},
			{
				className: 'bg-warning-6 hover:bg-warning-7',
				disabled: false,
				intent: 'warning',
				variant: 'solid',
			},
			// Outline colors
			{
				className: 'text-brand-6 hover:(text-brand-7 bg-brand-50)',
				disabled: false,
				intent: 'brand',
				variant: 'outline',
			},
			{
				className: 'text-neutral-6 hover:(text-neutral-7 bg-neutral-50)',
				disabled: false,
				intent: 'neutral',
				variant: 'outline',
			},
			{
				className: 'text-success-6 hover:(text-success-7 bg-success-50)',
				disabled: false,
				intent: 'success',
				variant: 'outline',
			},
			{
				className: 'text-danger-6 hover:(text-danger-7 bg-danger-50)',
				disabled: false,
				intent: 'danger',
				variant: 'outline',
			},
			{
				className: 'text-neutral-5 hover:(text-neutral-6 bg-neutral-50)',
				disabled: false,
				intent: 'light',
				variant: 'outline',
			},
			{
				className: 'text-warning-6 hover:(text-warning-7 bg-warning-50)',
				disabled: false,
				intent: 'warning',
				variant: 'outline',
			},
			// Underline colors
			{
				className: 'text-brand-6 hover:text-brand-7',
				disabled: false,
				intent: 'brand',
				variant: 'underline',
			},
			{
				className: 'text-neutral-6 hover:text-neutral-7',
				disabled: false,
				intent: 'neutral',
				variant: 'underline',
			},
			{
				className: 'text-success-6 hover:text-success-7',
				disabled: false,
				intent: 'success',
				variant: 'underline',
			},
			{
				className: 'text-danger-6 hover:text-danger-7',
				disabled: false,
				intent: 'danger',
				variant: 'underline',
			},
			{
				className: 'text-neutral-5 hover:text-neutral-6',
				disabled: false,
				intent: 'light',
				variant: 'underline',
			},
			{
				className: 'text-warning-6 hover:text-warning-7',
				disabled: false,
				intent: 'warning',
				variant: 'underline',
			},
			// Ghost colors
			{
				className: 'text-brand-7 hover:(bg-brand-50)',
				disabled: false,
				intent: 'brand',
				variant: 'ghost',
			},
			{
				className: 'text-neutral-7 hover:(bg-neutral-50)',
				disabled: false,
				intent: 'neutral',
				variant: 'ghost',
			},
			{
				className: 'text-success-7 hover:(bg-success-50)',
				disabled: false,
				intent: 'success',
				variant: 'ghost',
			},
			{
				className: 'text-danger-7 hover:(bg-danger-50)',
				disabled: false,
				intent: 'danger',
				variant: 'ghost',
			},
			{
				className: 'text-neutral-5 hover:(bg-neutral-50)',
				disabled: false,
				intent: 'light',
				variant: 'ghost',
			},
			{
				className: 'text-warning-7 hover:(bg-warning-50)',
				disabled: false,
				intent: 'warning',
				variant: 'ghost',
			},
			// Disabled state
			{
				className: 'text-neutral-3 bg-neutral-1',
				disabled: true,
				variant: 'solid',
			},
			{
				className: 'text-neutral-3',
				disabled: true,
				variant: 'outline',
			},
			{
				className: 'text-neutral-3',
				disabled: true,
				variant: 'underline',
			},
			{
				className: 'text-neutral-3',
				disabled: true,
				variant: 'ghost',
			},
			{
				className: 'border-b-neutral-3',
				disabled: true,
				iconOnly: true,
				variant: 'underline',
			},
		],
		variants: {
			align: {
				center: 'justify-center text-center',
				end: 'justify-end',
				start: 'justify-start',
			},
			disabled: {
				false: 'cursor-pointer',
				true: 'cursor-not-allowed',
			},
			fullWidth: {
				true: 'w-full',
			},
			iconOnly: {
				false: undefined,
				true: undefined,
			},
			intent: {
				brand: undefined,
				danger: undefined,
				light: undefined,
				neutral: undefined,
				success: undefined,
				warning: undefined,
			},
			size: {
				lg: undefined,
				md: undefined,
				sm: undefined,
			},
			variant: {
				ghost: 'no-underline bg-transparent',
				outline: 'no-underline bg-transparent ring-current ring-1.5 ring-inset',
				solid: 'no-underline text-white',
				underline: 'p-0 bg-transparent',
			},
		},
	},
);

export type $ButtonVariants = VariantProps<typeof buttonVariants>;
export type ButtonVariants = Omit<$ButtonVariants, 'disabled' | 'iconOnly'>;
