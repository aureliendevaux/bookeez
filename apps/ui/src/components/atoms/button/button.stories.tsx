import type { ArgTypes, Meta, StoryObj } from '@storybook/react';

import { fn } from '@storybook/test';

import type { ValueOf } from '../../../types/utils.js';

import icons from '../icon/names.js';
import { Button, type ButtonProps } from './button.js';

const Categories = {
	Content: 'Content',
	Events: 'Events',
	Style: 'Style',
} as const;

const Controls: Record<ValueOf<typeof Categories>, Partial<ArgTypes<Readonly<ButtonProps>>>> = {
	Style: {
		intent: {
			options: ['brand', 'success', 'warning', 'danger', 'light', 'neutral'] satisfies Array<
				ButtonProps['intent']
			>,
			control: {
				type: 'select',
			},
			table: {
				category: Categories.Style,
				type: { summary: "ButtonVariants['intent']" },
			},
		},
		variant: {
			options: ['solid', 'outline', 'ghost', 'underline'] satisfies Array<ButtonProps['variant']>,
			control: {
				type: 'select',
			},
			table: {
				category: Categories.Style,
				type: { summary: "ButtonVariants['variant']" },
			},
		},
		align: {
			options: ['start', 'center', 'end'] satisfies Array<ButtonProps['align']>,
			control: {
				type: 'select',
			},
			table: {
				category: Categories.Style,
				type: { summary: "ButtonVariants['align']" },
				defaultValue: { summary: 'center' },
			},
		},
		size: {
			options: ['sm', 'md', 'lg'] satisfies Array<ButtonProps['size']>,
			control: {
				type: 'select',
			},
			table: {
				category: Categories.Style,
				type: { summary: "ButtonVariants['size']" },
				defaultValue: { summary: 'md' },
			},
		},
		fullWidth: {
			control: {
				type: 'boolean',
			},
			table: {
				category: Categories.Style,
				defaultValue: { summary: 'false' },
			},
		},
		isDisabled: {
			control: {
				type: 'boolean',
			},
			table: {
				category: Categories.Style,
				defaultValue: { summary: 'false' },
			},
		},
	},
	Content: {
		label: {
			control: {
				type: 'text',
			},
			table: {
				category: Categories.Content,
				type: { summary: 'string' },
			},
		},
		iconSize: {
			options: ['sm', 'md', 'lg'] satisfies Array<ButtonProps['iconSize']>,
			control: {
				type: 'select',
			},
			table: {
				category: Categories.Content,
				type: { summary: 'sm | md | lg' },
			},
		},
		icon: {
			options: icons,
			control: {
				type: 'select',
			},
			table: {
				category: Categories.Content,
				type: { summary: 'IconName' },
			},
		},
	},
	Events: {
		onPress: {
			table: {
				category: Categories.Events,
				type: { summary: '() => void' },
			},
		},
	},
} as const;

const meta = {
	title: 'Atoms/Button',
	component: Button,
	args: {
		intent: 'success',
		variant: 'solid',
		label: 'Button',
		align: 'center',
		isDisabled: false,
		fullWidth: false,
		size: 'md',
		onPress: fn(),
	},
	argTypes: {
		...Controls.Content,
		...Controls.Events,
		...Controls.Style,
	},
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
