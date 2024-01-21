import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
	base: "/",
	build: {
		emptyOutDir: true,
		outDir: "../dist/static",
	},
	plugins: [react()],
	server: {
		port: 4201,
		proxy: {
			"/api": "http://localhost:4202",
			"/docs": "http://localhost:4202",
			"/health": "http://localhost:4202",
		},
	},
	test: {
		coverage: {
			provider: "istanbul",
			reporter: [["json", { file: "client.json" }], ["text"]],
			reportsDirectory: "../.nyc_output/",
		},
		environment: "jsdom",
		globals: true,
		root: "client",
		setupFiles: ["setupTests.mjs"],
	},
});
