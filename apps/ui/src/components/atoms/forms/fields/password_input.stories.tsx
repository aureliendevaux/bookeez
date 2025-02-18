import type { ArgTypes, Meta, StoryObj } from '@storybook/react';
import type { ValueOf } from '~/types/utils';

import { fn } from '@storybook/test';

import { PasswordInput, type PasswordInputProps } from './password_input';

const Categories = {
	Content: 'Content',
	Events: 'Events',
	Style: 'Style',
} as const;

const Controls: Record<
	ValueOf<typeof Categories>,
	Partial<ArgTypes<Readonly<PasswordInputProps>>>
> = {
	Style: {
		hiddenLabel: {
			control: {
				type: 'boolean',
			},
			table: {
				category: Categories.Style,
				defaultValue: { summary: 'false' },
			},
		},
		isRequired: {
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
		description: {
			control: {
				type: 'text',
			},
			table: {
				category: Categories.Content,
				type: { summary: 'string' },
			},
		},
		placeholder: {
			control: {
				type: 'text',
			},
			table: {
				category: Categories.Content,
				type: { summary: 'string' },
			},
		},
		errors: {
			table: {
				category: Categories.Content,
				type: { summary: 'Array<ValidationError> | undefined' },
			},
		},
	},
	Events: {
		onChange: {
			table: {
				category: Categories.Events,
				type: { summary: '(value: string) => void' },
			},
		},
	},
} as const;

const meta = {
	title: 'Atoms/Forms/PasswordInput',
	component: PasswordInput,
	args: {
		label: 'Mon magnifique label',
		onChange: fn(),
	},
	argTypes: {
		...Controls.Content,
		...Controls.Events,
		...Controls.Style,
	},
} satisfies Meta<typeof PasswordInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithErrors: Story = {
	args: {
		errors: [
			'Email invalide',
			'Nombre de caractères insuffisant',
			'Identifiants invalides',
			'Un problème inconnu est survenu, merci de bien vouloir réessayer ultérieurement.',
		],
	},
};
