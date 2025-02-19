import { defineConfig } from 'tsup';
import { readdirSync } from 'node:fs';
import * as path from 'node:path';

const getEntries = (dir: string): string[] => {
	const entries: string[] = [];

	const files = readdirSync(dir, { withFileTypes: true });
	for (const file of files) {
		const fullPath = path.join(dir, file.name);
		if (file.isDirectory()) {
			entries.push(...getEntries(fullPath));
		} else if (
			(fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) &&
			!fullPath.includes('.stories.tsx') &&
			!fullPath.endsWith('vite_env.d.ts')
		) {
			entries.push(fullPath);
		}
	}

	return entries;
};

export default defineConfig({
	entry: getEntries('src'),
	format: 'esm',
	target: 'es2022',
	dts: true,
	minify: false,
	clean: true,
	outDir: 'lib',
	bundle: false,
	platform: 'browser',
});
