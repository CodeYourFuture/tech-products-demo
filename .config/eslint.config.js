const cyf = require("@codeyourfuture/eslint-config-standard");
const vitest = require("@vitest/eslint-plugin");
const cypress = require("eslint-plugin-cypress/flat");
const importPlugin = require("eslint-plugin-import");
const jest = require("eslint-plugin-jest");
const jsxA11y = require("eslint-plugin-jsx-a11y");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const testingLibrary = require("eslint-plugin-testing-library");
const globals = require("globals");

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
	cyf,
	{
		languageOptions: {
			ecmaVersion: 2022,
			globals: globals.node,
		},
		linterOptions: {
			reportUnusedDisableDirectives: "error",
		},
		plugins: {
			import: importPlugin,
		},
		rules: {
			"import/order": [
				"error",
				{
					alphabetize: { caseInsensitive: true, order: "asc" },
					"newlines-between": "always",
				},
			],
			"comma-dangle": "off",
			"no-console": "error",
			"no-warning-comments": "warn",
			"object-shorthand": "error",
			"operator-linebreak": "off",
		},
	},
	mergeConfigs("Express server tests", jest.configs["flat/recommended"], {
		files: ["server/setupTests.js", "server/**/*.test.js"],
		rules: {
			"jest/expect-expect": [
				"error",
				{
					assertFunctionNames: [
						"expect",
						"agent.**.expect",
						"request.**.expect",
						"screen.findBy*",
					],
				},
			],
			"jest/no-commented-out-tests": "error",
			"jest/no-disabled-tests": "error",
		},
	}),
	mergeConfigs(
		"React client",
		jsxA11y.flatConfigs.strict,
		react.configs.flat.recommended,
		react.configs.flat["jsx-runtime"],
		{
			files: ["client/**/*.js?(x)"],
			languageOptions: {
				globals: globals.browser,
			},
			plugins: {
				"react-hooks": reactHooks,
			},
			rules: {
				"react/jsx-tag-spacing": "error",
				"react/no-unused-prop-types": "error",
				"react/prop-types": "error",
				"react-hooks/rules-of-hooks": "error",
				"react-hooks/exhaustive-deps": "error",
			},
			settings: {
				react: {
					version: "detect",
				},
			},
		}
	),
	mergeConfigs(
		"React client tests",
		testingLibrary.configs["flat/react"],
		vitest.configs.recommended,
		{
			files: ["client/setupTests.mjs", "client/**/*.test.js?(x)"],
			languageOptions: {
				globals: vitest.environments.env.globals,
			},
		}
	),
	mergeConfigs(
		"Cypress tests",
		cypress.configs.recommended,
		testingLibrary.configs["flat/dom"],
		{
			files: ["e2e/**/*.js"],
			rules: {
				"testing-library/await-async-queries": "off",
				"testing-library/await-async-utils": "off",
				"testing-library/prefer-screen-queries": "off",
			},
		}
	),
	{
		files: ["migrations/*.js"],
		linterOptions: {
			reportUnusedDisableDirectives: "off",
		},
	},
	{
		files: [".devcontainer/**/*.?(c|m)js", "bin/*.js", "cypress.config.js"],
		rules: {
			"no-console": "off",
		},
	},
	{
		ignores: [".nyc_output/", "dist/", "reports/", "*.d.ts"],
	},
];

/**
 * @param {string} name
 * @param {import("eslint").Linter.FlatConfig} configs
 * @returns {import("eslint").Linter.FlatConfig}
 */
function mergeConfigs(name, ...configs) {
	return {
		...configs.at(-1),
		languageOptions: {
			globals: objectProp(arrayProp(configs, "languageOptions"), "globals"),
			parserOptions: objectProp(
				arrayProp(configs, "languageOptions"),
				"parserOptions"
			),
		},
		name,
		plugins: objectProp(configs, "plugins"),
		rules: objectProp(configs, "rules"),
	};
}

function arrayProp(arrays, prop) {
	return arrays.flatMap((arr) => arr[prop] ?? []);
}

function objectProp(arrays, prop) {
	return Object.fromEntries(
		arrays.flatMap((arr) => Object.entries(arr[prop] ?? {}))
	);
}
