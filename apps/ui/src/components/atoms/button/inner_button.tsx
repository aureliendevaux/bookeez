import { ReactNode } from 'react';

import type { IconName } from '../../../types/icon.js';

import { cw } from '../../../utils/style.js';
import { Icon } from '../icon/icon.js';

interface InnerButtonProps {
	icon?: IconName;
	iconSize?: 'lg' | 'md' | 'sm';
	label?: ReactNode;
	size?: 'lg' | 'md' | 'sm';
}

export function InnerButton(props: Readonly<InnerButtonProps>) {
	const { icon, iconSize, label, size = 'md' } = props;

	return (
		<>
			{icon !== undefined && <Icon name={icon} size={iconSize ?? size} />}
			{label !== undefined && (
				<span className={cw('text-center', { 'text-sm': size === 'sm' })}>{label}</span>
			)}
		</>
	);
}
