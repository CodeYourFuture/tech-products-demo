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
		authorizationURL:
			process.env.OAUTH_BASE_URL && `${process.env.OAUTH_BASE_URL}/authorize`,
		clientID: process.env.OAUTH_CLIENT_ID,
		clientSecret: process.env.OAUTH_CLIENT_SECRET,
		callbackURL: process.env.OAUTH_CALLBACK_URL,
		tokenURL:
			process.env.OAUTH_BASE_URL &&
			`${process.env.OAUTH_BASE_URL}/access_token`,
		userAgent: "CodeYourFuture/tech-products-demo",
		userEmailURL:
			process.env.GH_API_BASE_URL &&
			`${process.env.GH_API_BASE_URL}/user/emails`,
		userProfileURL:
			process.env.GH_API_BASE_URL && `${process.env.GH_API_BASE_URL}/user`,
	},
	port: parseInt(process.env.PORT ?? "4201", 10),
	production: process.env.NODE_ENV?.toLowerCase() === "production",
	sessionSecret: process.env.SESSION_SECRET.split(","),
	sessionStore: process.env.SESSION_STORE ?? "postgres",
	sudoToken: process.env.SUDO_TOKEN,
};

function checkRequired(required) {
	const missing = required.filter((envVar) => !process.env[envVar]);
	if (missing.length > 0) {
		const message = `Missing required env var${
			missing.length > 1 ? "s" : ""
		}: ${missing.join(", ")}`;
		throw new Error(message);
	}
}
