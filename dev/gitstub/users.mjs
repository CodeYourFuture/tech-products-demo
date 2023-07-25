import { createHash } from "node:crypto";

export default JSON.parse(process.env.USERS).map(createSpec);

function createSpec({
	gitHubId,
	gitHubLogin,
	name,
	privateEmails = [],
	publicEmails = [],
	token,
}) {
	let login = gitHubLogin;
	if (login === undefined) {
		if (name === undefined) {
			throw new Error("A user must have a name or gitHubLogin");
		}
		login = name.toLowerCase().split(" ").join("-");
	}

	const emails = [
		...publicEmails.map((email) => createEmail(email, "public")),
		...privateEmails.map((email) => createEmail(email, "private")),
	];
	if (emails.length === 0) {
		throw new Error("A user must have some emails");
	}
	const [primaryEmail] = emails;
	primaryEmail.primary = true;

	const gravatarId = createGravatarId(primaryEmail.email);

	return {
		_id: emails[0].email,
		emails,
		token,
		user: createUser({
			email: publicEmails.length === 0 ? null : publicEmails[0],
			gravatarId,
			id: gitHubId,
			login,
			name: name ?? null,
		}),
	};
}

function createEmail(email, visibility) {
	return {
		email,
		primary: false,
		verified: true,
		visibility,
	};
}

function createGravatarId(email) {
	return createHash("md5").update(email.trim().toLowerCase()).digest("hex");
}

function createUser({ email, gravatarId, id, login, name }) {
	return {
		avatar_url: `https://www.gravatar.com/avatar/${gravatarId}?default=identicon`,
		email,
		gravatar_id: gravatarId,
		html_url: `https://github.com/${login}`,
		id,
		login,
		name,
		type: "User",
		url: `https://api.github.com/users/${login}`,
	};
}
