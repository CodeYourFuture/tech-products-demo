const { merge } = require("webpack-merge");

const common = require("./common.config");

const codespace = process.env.CODESPACE_NAME;
const port = 4201;

module.exports = merge(common, {
	devtool: "inline-source-map",
	devServer: {
		allowedHosts: codespace && [`${codespace}-${port}.preview.app.github.dev`],
		client: {
			webSocketURL: {
				port: codespace && 443,
			},
		},
		historyApiFallback: {
			disableDotRule: true,
		},
		port,
		proxy: [
			{
				context: ["/api", "/docs", "/health"],
				logLevel: "debug",
				logProvider: () => console,
				target: "http://localhost:4202",
			},
		],
		static: false,
	},
	mode: "development",
});
