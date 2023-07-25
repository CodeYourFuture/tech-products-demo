import { usersService } from "../users";

export async function deserialize(id) {
	return usersService.findById(id);
}

export async function logIn(profile) {
	const existing = await usersService.findByGitHubId(profile.id);
	if (existing) {
		return existing;
	}
	return usersService.create({
		email: profile.emails?.[0]?.value,
		gitHubId: profile.id,
		name: profile.displayName ?? profile.username,
	});
}
