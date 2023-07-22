module.exports = {
	moduleNameMapper: {
		"\\.(png|svg|jpe?g|gif|s?css|sass)$": "<rootDir>/__mocks__/fileMock.js",
	},
	setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
	testEnvironment: "jsdom",
	testMatch: ["<rootDir>/**/*.test.js"],
};
