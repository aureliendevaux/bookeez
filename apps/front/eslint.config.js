import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import eslintJs from '@eslint/js';
import eslintImportX from 'eslint-plugin-import-x';
import tsParser from '@typescript-eslint/parser';
import eslintNoUseExtendNative from 'eslint-plugin-no-use-extend-native';
import n from 'eslint-plugin-n';
import eslintPrettier from 'eslint-config-prettier';
import eslintPromise from 'eslint-plugin-promise';
import sonarjs from 'eslint-plugin-sonarjs';
import typescriptESLint from 'typescript-eslint';
import eslintUnicorn from 'eslint-plugin-unicorn';
import eslintReact from 'eslint-plugin-react';
import eslintReactRefresh from 'eslint-plugin-react-refresh';
import unocss from '@unocss/eslint-config/flat';
import eslintQuery from '@tanstack/eslint-plugin-query';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

/** @see https://github.com/jsx-eslint/eslint-plugin-react */
const react = [
	eslintReact.configs.flat.recommended,
	eslintReact.configs.flat['jsx-runtime'],
	eslintReactRefresh.configs.recommended,
	...eslintQuery.configs['flat/recommended'],
];

/** @see https://unocss.dev/integrations/eslint */
const unoCSS = [unocss];

/** @see https://github.com/eslint-community/eslint-plugin-eslint-comments */
const comments = [eslintComments.recommended];

/** @see https://eslint.org/docs/latest/use/getting-started */
const native = [
	eslintJs.configs.recommended,
	{
		rules: {
			'quotes': 'off',
			'space-before-function-paren': 'off',
			'no-irregular-whitespace': ['error'],
			'indent': 'off',
			'no-multiple-empty-lines': ['error', { max: 1 }],
			'one-var': ['error', 'never'],
			'no-cond-assign': ['error', 'except-parens'],
			'comma-dangle': ['error', 'always-multiline'],
			'eqeqeq': ['error', 'always'],
			'eol-last': ['error', 'always'],
			'new-parens': ['error', 'always'],
			'no-caller': ['error'],
			'no-constant-condition': ['error'],
			'no-control-regex': ['error'],
			'no-debugger': ['error'],
			'no-duplicate-case': ['error'],
			'no-eval': ['error'],
			'no-ex-assign': ['error'],
			'no-extra-boolean-cast': ['error'],
			'no-fallthrough': ['error'],
			'no-inner-declarations': ['error'],
			'no-invalid-regexp': ['error', { allowConstructorFlags: ['u', 'y'] }],
			'no-proto': ['error'],
			'no-shadow': ['off'],
			'@typescript-eslint/no-shadow': 'error',
			'no-regex-spaces': ['error'],
			'no-self-compare': ['error'],
			'no-sparse-arrays': ['error'],
			'no-mixed-spaces-and-tabs': ['error'],
			'no-unsafe-negation': ['error'],
			'no-new-wrappers': ['error'],
			'no-self-assign': ['error'],
			'no-this-before-super': ['error'],
			'no-with': ['error'],
			'rest-spread-spacing': ['error', 'never'],
			'no-trailing-spaces': ['error', { ignoreComments: true }],
			'no-undef-init': ['error'],
			'no-unsafe-finally': ['error'],
			'padded-blocks': ['error', 'never'],
			'space-in-parens': ['error', 'never'],
			'use-isnan': ['error'],
			'valid-typeof': ['error', { requireStringLiterals: true }],
			'brace-style': ['error', '1tbs'],
			'curly': ['error', 'all'],
			'handle-callback-err': ['error', '^(err|error)$'],
			'max-len': [
				'error',
				{
					code: 100,
					comments: 120,
					ignoreUrls: true,
					ignoreTemplateLiterals: true,
				},
			],
			'no-array-constructor': ['error'],
			'no-unreachable': ['error'],
			'no-multi-spaces': ['error'],
		},
	},
];

/** @see https://github.com/un-ts/eslint-plugin-import-x */
const importX = [
	eslintImportX.flatConfigs.recommended,
	eslintImportX.flatConfigs.typescript,
	{
		files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
		ignores: ['eslint.config.js'],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
		rules: {
			'import-x/no-unresolved': 'off',
			'import-x/namespace': 'off',
			'import-x/default': 'off',
			'import-x/no-named-as-default': 'off',
			'import-x/no-named-as-default-member': 'off',
			'import-x/order': [
				'error',
				{
					'groups': [
						'type',
						'builtin',
						'external',
						'internal',
						'index',
						'parent',
						'sibling',
						'object',
					],
					'pathGroups': [
						{
							pattern: '#*/**',
							group: 'internal',
						},
					],
					'distinctGroup': true,
					'newlines-between': 'always',
					'alphabetize': {
						order: 'asc',
						orderImportKind: 'asc',
						caseInsensitive: true,
					},
				},
			],
		},
	},
];

/** @see https://github.com/dustinspecker/eslint-plugin-no-use-extend-native */
const noUseExtendNative = [
	{
		plugins: {
			'no-use-extend-native': eslintNoUseExtendNative,
		},
	},
];

/** @see https://github.com/eslint-community/eslint-plugin-n */
const node = [
	n.configs['flat/recommended-module'],
	{
		rules: {
			'n/no-missing-import': 'off',
			'n/no-unpublished-import': 'off',
			'n/no-unsupported-features/node-builtins': 'off',
			'n/no-unsupported-features/es-syntax': 'off',
		},
	},
];

/** @see https://github.com/prettier/eslint-config-prettier */
const prettier = [eslintPrettier];

/** @see https://github.com/eslint-community/eslint-plugin-promise */
const promise = [
	eslintPromise.configs['flat/recommended'],
	{
		rules: {
			'promise/always-return': 'off',
		},
	},
];

/** @see https://github.com/SonarSource/eslint-plugin-sonarjs */
const sonar = [
	sonarjs.configs.recommended,
	{
		plugins: sonarjs,
		rules: {
			'sonarjs/no-duplicate-string': 'off',
			'sonarjs/no-accessor-field-mismatch': 'off',
		},
	},
];

/** @see https://typescript-eslint.io/getting-started/ */
const typescript = [
	...typescriptESLint.configs.recommendedTypeChecked,
	...typescriptESLint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
				sourceType: 'module',
				ecmaVersion: 'latest',
			},
		},
		rules: {
			'@typescript-eslint/semi': [2, 'never'],
			'@typescript-eslint/quotes': ['error', 'single'],
			'@typescript-eslint/indent': [
				'error',
				2,
				{
					SwitchCase: 1,
					flatTernaryExpressions: false,
					ignoredNodes: ['TSTypeParameterInstantiation'],
				},
			],
			'@typescript-eslint/space-before-function-paren': ['error', 'always'],
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'variable',
					format: ['camelCase', 'snake_case', 'PascalCase'],
				},
				{
					selector: 'typeLike',
					format: ['PascalCase'],
				},
				{
					selector: 'class',
					format: ['PascalCase'],
				},
				{
					selector: 'interface',
					format: ['PascalCase'],
					custom: {
						regex: '^I[A-Z]',
						match: false,
					},
				},
			],
			'@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
			'@typescript-eslint/consistent-type-definitions': 'off',
			'@typescript-eslint/array-type': ['error', { default: 'generic' }],
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
			'@typescript-eslint/unbound-method': 'off',
		},
	},
];

/** @see https://github.com/sindresorhus/eslint-plugin-unicorn */
const unicorn = [
	eslintUnicorn.configs['flat/recommended'],
	{
		rules: {
			'unicorn/filename-case': ['error', { case: 'snakeCase' }],
			'unicorn/prevent-abbreviations': [
				'error',
				{
					checkFilenames: false,
					checkDefaultAndNamespaceImports: false,
					checkShorthandImports: false,
					extendDefaultReplacements: false,
					replacements: {
						whitelist: { include: true },
						blacklist: { exclude: true },
						master: { main: true },
						slave: { secondary: true },
						application: { app: true },
						applications: { apps: true },
						arr: { array: true },
						e: { error: true, event: true },
						el: { element: true },
						elem: { element: true },
						len: { length: true },
						msg: { message: true },
						num: { number: true },
						obj: { object: true },
						opts: { options: true },
						param: { parameter: true },
						params: { parameters: true },
						prev: { previous: true },
						req: { request: true },
						res: { response: true, result: true },
						ret: { returnValue: true },
						str: { string: true },
						temp: { temporary: true },
						tmp: { temporary: true },
						val: { value: true },
						err: { error: true },
					},
				},
			],
			'unicorn/numeric-separators-style': 'off',
			'unicorn/no-null': 'off',
			'unicorn/prefer-module': 'error',
			'unicorn/prefer-node-protocol': 'error',
			'unicorn/no-await-expression-member': 'error',
			'unicorn/no-for-loop': 'error',
			'unicorn/no-instanceof-array': 'error',
			'unicorn/prefer-number-properties': 'error',
		},
	},
];

/** @type {import('eslint').Linter.Config[]} */
export default [
	/* Ignores files globally. */
	{
		ignores: [
			'dist',
			'src/route_tree.gen.ts',
			'eslint.config.js',
			'vite.config.ts',
			'uno.config.ts',
			'prettier.config.js',
			'tailwind.config.js',
		],
	},
	/* Global options. */
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	...compat.config({
		plugins: ['react-hooks'],
		extends: ['plugin:react-hooks/recommended'],
	}),
	/* Custom configuration. */
	...native,
	...typescript,
	...unicorn,
	...sonar,
	...comments,
	...noUseExtendNative,
	...node,
	...importX,
	...promise,
	...prettier,
	...react,
	...unoCSS,
	/* Specific for ESLint itself. */
	{
		files: ['eslint.config.js'],
		languageOptions: {
			sourceType: 'script',
			globals: {
				...globals.node,
			},
		},
	},
];
