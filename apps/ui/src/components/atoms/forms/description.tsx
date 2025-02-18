import { cw } from '~/utils/style';
import { Text, type TextProps } from 'react-aria-components';

export type DescriptionProps = TextProps;

export function Description(props: Readonly<DescriptionProps>) {
	const { children, className, ...rest } = props;

	if (!children) return null;

	return (
		<Text
			{...rest}
			slot="description"
			className={cw('mt-1 block text-sm text-neutral-500', className)}
		>
			{children}
		</Text>
	);
}
