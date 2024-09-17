import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AvatarProfile() {
	return (
		<Avatar>
			<AvatarImage src="" alt="Avatar" />
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>
	);
}
