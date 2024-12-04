import { getUsernameService } from "../services/user.service";

export async function getUsername() {
	const user = await getUsernameService();
	if (!user || user.statusCode >= 400) {
		return null;
	}
	return user.username;
}

export const getUser = async () => {
	const user = await getUsernameService();
	if (!user || user.statusCode >= 400) {
		return null;
	}
	return user;
};
