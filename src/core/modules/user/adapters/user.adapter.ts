import { getUsernameService } from "../services/user.service";

export async function getUsername() {
	const username = await getUsernameService();
	return username.username;
}
