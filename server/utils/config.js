import "dotenv-expand/config";

checkRequired([
	"DATABASE_URL",
	"OAUTH_CLIENT_ID",
	"OAUTH_CLIENT_SECRET",
	"SESSION_SECRET",
	"SUDO_TOKEN",
]);

export default {
	dbUrl: process.env.DATABASE_URL,
	logLevel: process.env.LOG_LEVEL?.toLowerCase() ?? "info",
	oauth: {
		authorizationURL: oauthUrl("OAUTH_AUTHORIZE_ENDPOINT", "/authorize"),
		clientID: process.env.OAUTH_CLIENT_ID,
		clientSecret: process.env.OAUTH_CLIENT_SECRET,
		callbackURL: process.env.OAUTH_CALLBACK_URL,
		tokenURL: oauthUrl("OAUTH_ACCESS_TOKEN_ENDPOINT", "/access_token"),
		userAgent: "CodeYourFuture/tech-products-demo",
		userEmailURL: apiUrl("GH_API_BASE_URL", "/user/emails"),
		userProfileURL: apiUrl("GH_API_BASE_URL", "/user"),
	},
	port: parseInt(process.env.PORT ?? "4201", 10),
	production: process.env.NODE_ENV?.toLowerCase() === "production",
	sessionSecret: process.env.SESSION_SECRET.split(","),
	sessionStore: process.env.SESSION_STORE ?? "postgres",
	sudoToken: process.env.SUDO_TOKEN,
};

/**
 * Determine URLs for API endpoints
 * @param {string} envVar - environment variable to use if available
 * @param {string} endpoint - endpoint to add
 * @returns {string}
 */
function apiUrl(envVar, endpoint) {
	return process.env[envVar] && `${process.env[envVar]}${endpoint}`;
}

/**
 * Throws an error if any required env vars are missing
 * @param {string[]} required - names of required env vars
 */
function checkRequired(required) {
	const missing = required.filter((envVar) => !process.env[envVar]);
	if (missing.length > 0) {
		const message = `Missing required env var${
			missing.length > 1 ? "s" : ""
		}: ${missing.join(", ")}`;
		throw new Error(message);
	}
}

/**
 * Determine URLs for OAuth connections
 * @param {string} envVar - environment variable to use if available
 * @param {string} endpoint - endpoint on OAUTH_BASE_URL otherwise
 * @returns {string}
 */
function oauthUrl(envVar, endpoint) {
	if (process.env[envVar]) {
		return process.env[envVar];
	}
	return (
		process.env.OAUTH_BASE_URL && `${process.env.OAUTH_BASE_URL}${endpoint}`
	);
}
