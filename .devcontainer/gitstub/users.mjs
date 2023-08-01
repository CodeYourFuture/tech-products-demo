import { createHash, randomUUID } from "node:crypto";

const gitHubIds = new Set();

export default JSON.parse(process.env.USERS).map(createSpec);

function createSpec({
	gitHubId,
	gitHubLogin,
	name,
	email,
	publicEmail = false,
	token = randomUUID(),
}) {
	if (gitHubIds.has(gitHubId)) {
		throw new Error("Every user must have a unique gitHubId");
	}
	gitHubIds.add(gitHubId);

	let login = gitHubLogin;
	if (login === undefined) {
		if (name === undefined) {
			throw new Error("A user must have a name or gitHubLogin");
		}
		login = name.toLowerCase().split(" ").join("-");
	}

	if (!email) {
		throw new Error("A user must have an email");
	}

	const gravatarId = createGravatarId(email);

	return {
		_id: email,
		token,
		user: createUser({
			email: publicEmail ? email : null,
			gravatarId,
			id: gitHubId,
			login,
			name: name ?? null,
		}),
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
