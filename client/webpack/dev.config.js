const { merge } = require("webpack-merge");

const common = require("./common.config");

module.exports = merge(common, {
	devtool: "inline-source-map",
	devServer: {
		historyApiFallback: {
			disableDotRule: true,
		},
		port: 4201,
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
