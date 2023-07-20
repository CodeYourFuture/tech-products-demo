module.exports = {
	projects: [
		{
			displayName: "client",
			moduleNameMapper: {
				"\\.(png|svg|jpe?g|gif|css)$": "<rootDir>/__mocks__/fileMock.js",
			},
			setupFilesAfterEnv: ["<rootDir>/client/setupTests.js"],
			testEnvironment: "jsdom",
			testMatch: ["<rootDir>/client/**/*.test.js"],
		},
		{
			displayName: "server",
			setupFilesAfterEnv: ["<rootDir>/server/setupTests.js"],
			testEnvironment: "node",
			testMatch: ["<rootDir>/server/**/*.test.js"],
		},
	],
	testRunner: "jest-circus/runner",
};
