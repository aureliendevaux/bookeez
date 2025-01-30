import type { ArgTypes, Meta, StoryObj } from '@storybook/react';
import type { ValueOf } from '~/types/utils';

import { IconNames } from '~/components/atoms/icon';

import { ExternalLink, type ExternalLinkProps } from './external_link';

const Categories = {
	Content: 'Content',
	Events: 'Events',
	Style: 'Style',
} as const;

const Controls: Record<
	ValueOf<typeof Categories>,
	Partial<ArgTypes<Readonly<ExternalLinkProps>>>
> = {
	Style: {
		intent: {
			options: ['brand', 'success', 'warning', 'danger', 'light', 'neutral'] satisfies Array<
				ExternalLinkProps['intent']
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
			options: ['solid', 'outline', 'ghost', 'underline'] satisfies Array<
				ExternalLinkProps['variant']
			>,
			control: {
				type: 'select',
			},
			table: {
				category: Categories.Style,
				type: { summary: "ButtonVariants['variant']" },
			},
		},
		align: {
			options: ['start', 'center', 'end'] satisfies Array<ExternalLinkProps['align']>,
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
			options: ['sm', 'md', 'lg'] satisfies Array<ExternalLinkProps['size']>,
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
			options: ['sm', 'md', 'lg'] satisfies Array<ExternalLinkProps['iconSize']>,
			control: {
				type: 'select',
			},
			table: {
				category: Categories.Content,
				type: { summary: 'sm | md | lg' },
			},
		},
		icon: {
			options: Object.keys(IconNames),
			control: {
				type: 'select',
			},
			table: {
				category: Categories.Content,
				type: { summary: 'IconName' },
			},
		},
	},
	Events: {},
} as const;

const meta = {
	title: 'Atoms/Link',
	component: ExternalLink,
	args: {
		intent: 'success',
		variant: 'solid',
		label: 'Button',
		align: 'center',
		isDisabled: false,
		fullWidth: false,
		size: 'md',
		href: '/',
	},
	argTypes: {
		...Controls.Content,
		...Controls.Events,
		...Controls.Style,
	},
} satisfies Meta<typeof ExternalLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
