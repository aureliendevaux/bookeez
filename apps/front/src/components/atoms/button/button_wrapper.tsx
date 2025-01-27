import type { ReactElement, ReactNode } from "react";

import { Tooltip, TooltipTrigger } from "react-aria-components";

interface ButtonWrapperProps {
	children?: ReactElement;
	tooltip?: ReactNode;
}

export function ButtonWrapper(props: Readonly<ButtonWrapperProps>) {
	const { children, tooltip } = props;

	if (!tooltip && !children) return null;
	if (!tooltip && children) return children;

	return (
		<TooltipTrigger>
			{children}
			<Tooltip offset={2} className="rounded-md bg-neutral-800 px-2 py-1 text-sm text-white">
				{tooltip}
			</Tooltip>
		</TooltipTrigger>
	);
}
