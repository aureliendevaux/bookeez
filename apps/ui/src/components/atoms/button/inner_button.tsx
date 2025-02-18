import type { IconName } from '~/types/icon';

import { Icon } from '~/components/atoms/icon';
import { cw } from '~/utils/style';
import { ReactNode } from 'react';

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
