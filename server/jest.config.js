/**
 * @type {import("jest").Config}
 */
module.exports = {
	coverageDirectory: "<rootDir>/.nyc_output/",
	coverageReporters: [["json", { file: "server.json" }], "text"],
	rootDir: "..",
	setupFilesAfterEnv: ["<rootDir>/server/setupTests.js"],
	testEnvironment: "node",
	testMatch: ["<rootDir>/server/**/*.test.js"],
	verbose: true,
};
