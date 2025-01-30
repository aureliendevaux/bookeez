import { ReactNode } from 'react';

import { Icon } from '~/components/atoms/icon';
import { cw } from '~/utils/style';

interface InnerButtonProps {
	icon?: string;
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
