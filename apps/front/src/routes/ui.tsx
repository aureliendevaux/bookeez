import { createFileRoute } from '@tanstack/react-router';

import { Button } from '~/components/atoms/button/button';

export const Route = createFileRoute('/ui')({
	component: Ui,
});

function Ui() {
	return (
		<div className="flex items-center gap-2">
			<Button label="Salutttt" variant="solid" intent="brand" />
			<Button label="Salutttt" variant="ghost" intent="brand" />
			<Button label="Salutttt" variant="outline" intent="brand" />
			<Button label="Salutttt" variant="underline" intent="brand" />
		</div>
	);
}
