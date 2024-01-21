/**
 * @type {import("jest").Config}
 */
module.exports = {
	coverageDirectory: "<rootDir>/reports/server-coverage/",
	rootDir: "..",
	setupFilesAfterEnv: ["<rootDir>/server/setupTests.js"],
	testEnvironment: "node",
	testMatch: ["<rootDir>/server/**/*.test.js"],
	verbose: true,
};
