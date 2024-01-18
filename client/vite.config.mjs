import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

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
});
