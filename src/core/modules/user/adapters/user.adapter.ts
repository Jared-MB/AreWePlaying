import { getUsernameService } from "../services/user.service";

export async function getUsername() {
	const username = await getUsernameService();
	if (!username) {
		return null;
	}
	return username.username;
}
