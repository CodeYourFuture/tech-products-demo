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
		specPattern: "integration/**/*.test.js",
		supportFile: "support/index.js",
	},
	fixturesFolder: "fixtures",
	screenshotsFolder: "screenshots",
	video: false,
	videosFolder: "videos",
});
