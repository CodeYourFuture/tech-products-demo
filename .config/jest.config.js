/**
 * @type {import("jest").Config}
 */
module.exports = {
	coverageDirectory: "../reports/coverage",
	globals: {
		fetch,
		Request,
		Response,
		Headers,
		FormData,
		ReadableStream,
	},
	projects: [
		{
			displayName: "client",
			moduleNameMapper: {
				"\\.(png|svg|jpe?g|gif|s?css|sass)$":
					"<rootDir>/client/__mocks__/fileMock.js",
			},
			rootDir: ".",
			setupFilesAfterEnv: ["<rootDir>/client/setupTests.js"],
			testEnvironment: "jsdom",
			testMatch: ["<rootDir>/client/**/*.test.js"],
		},
		{
			displayName: "server",
			rootDir: ".",
			setupFilesAfterEnv: ["<rootDir>/server/setupTests.js"],
			testEnvironment: "node",
			testMatch: ["<rootDir>/server/**/*.test.js"],
		},
	],
	verbose: true,
};
