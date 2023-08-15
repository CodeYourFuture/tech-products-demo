require("dotenv-expand/config");

const { defineConfig } = require("cypress");

const { clearDb, closeConnection, seed } = require("./e2e/db");

module.exports = defineConfig({
	downloadsFolder: "e2e/downloads",
	e2e: {
		baseUrl: "http://localhost:4201",
		async setupNodeEvents(on, config) {
			loadEnvVars(config.env);
			on("after:run", () => closeConnection());
			on("task", { clearDb, seed, table });
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

function loadEnvVars(env, prefix = "CYPRESS_") {
	const updates = Object.fromEntries(
		Object.entries(process.env)
			.filter(([key]) => key.startsWith(prefix))
			.map(([key, value]) => [key.slice(prefix.length), value])
	);
	console.table(updates);
	Object.assign(env, updates);
}

function table(data) {
	console.table(data);
	return null;
}
