import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AvatarProfile({ username }: { username?: string }) {
	return (
		<Avatar>
			<AvatarImage src="" alt="Avatar" />
			<AvatarFallback>{username ? username.at(0) : "?"}</AvatarFallback>
		</Avatar>
	);
}
