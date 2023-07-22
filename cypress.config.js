const { defineConfig } = require("cypress");

module.exports = defineConfig({
	e2e: {
		baseUrl: "http://localhost:4201",
		async setupNodeEvents(on, config) {
			await import("dotenv-expand/config");
			Object.entries(process.env).forEach(([key, value]) => {
				if (key.startsWith("CYPRESS_")) {
					config.env[key.slice(8)] = value;
				}
			});
			return config;
		},
		specPattern: "e2e/integration/**/*.test.js",
		supportFile: "e2e/support/index.js",
	},
	fixturesFolder: "e2e/fixtures",
	screenshotsFolder: "e2e/screenshots",
	video: false,
	videosFolder: "e2e/videos",
});
