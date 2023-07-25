import "dotenv-expand/config";

const missing = [
	"DATABASE_URL",
	"OAUTH_CLIENT_ID",
	"OAUTH_CLIENT_SECRET",
	"SESSION_SECRET",
	"SUDO_TOKEN",
].filter((envVar) => !process.env[envVar]);
if (missing.length > 0) {
	throw new Error(`Missing required env vars: ${missing.join(", ")}`);
}

export default {
	dbUrl: process.env.DATABASE_URL,
	logLevel: process.env.LOG_LEVEL?.toLowerCase() ?? "info",
	oauth: {
		authorizationURL:
			process.env.OAUTH_BASE_URL && `${process.env.OAUTH_BASE_URL}/authorize`,
		clientID: process.env.OAUTH_CLIENT_ID,
		clientSecret: process.env.OAUTH_CLIENT_SECRET,
		callbackUrl: process.env.OAUTH_CALLBACK_URL,
		tokenURL:
			process.env.OAUTH_BASE_URL &&
			`${process.env.OAUTH_BASE_URL}/access_token`,
		userEmailURL:
			process.env.GITHUB_API_URL && `${process.env.GITHUB_API_URL}/user/emails`,
		userProfileURL:
			process.env.GITHUB_API_URL && `${process.env.GITHUB_API_URL}/user`,
	},
	port: parseInt(process.env.PORT ?? "4201", 10),
	production: process.env.NODE_ENV?.toLowerCase() === "production",
	sessionSecret: process.env.SESSION_SECRET.split(","),
	sessionStore: process.env.SESSION_STORE ?? "postgres",
	sudoToken: process.env.SUDO_TOKEN,
};
