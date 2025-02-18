import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const sourceFile = path.resolve(import.meta.dirname, '../public/sprite.svg');
const typesFile = path.resolve(import.meta.dirname, '../src/types/icon.ts');
const declarationFile = path.resolve(import.meta.dirname, '../src/components/atoms/icon/names.ts');

const file = await readFile(sourceFile, { encoding: 'utf8', flag: 'r' });

const iconIds: Array<string> = [];
const symbols = file.match(/<symbol id="([^"]+)"/g);

if (!symbols) {
	throw new Error('Aucune icône trouvée.');
}

for (const symbol of symbols) {
	const extractedId = /<symbol id="([^"]+)"/.exec(symbol);

	if (extractedId?.[1] === undefined) {
		continue;
	}

	iconIds.push(extractedId[1]);
}

iconIds.sort((a, b) => {
	if (!a || !b) {
		return 0;
	}

	return a.localeCompare(b);
});

await generateTypes(iconIds);
await generateDeclaration(iconIds);

async function generateDeclaration(ids: Array<string>) {
	let content = 'export default [';

	for (const icon of ids) {
		content += `'${icon}',`;
	}

	content = content.slice(0, -1) + '];';

	await writeFile(declarationFile, content, { encoding: 'utf8', flag: 'w' });
}

async function generateTypes(ids: Array<string>) {
	let content = 'export type IconName =';

	for (const icon of ids) {
		content += ` '${icon}' |`;
	}

	content = content.slice(0, -1) + ';';

	await writeFile(typesFile, content, { encoding: 'utf8', flag: 'w' });
}

console.log('Icônes générées avec succès !');
