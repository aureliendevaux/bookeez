import { cx, CxOptions } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

export function cw(...classes: CxOptions) {
	return twMerge(cx(classes));
}
