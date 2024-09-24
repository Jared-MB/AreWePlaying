import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AvatarEquipo({ src }: { src: string }) {
	return (
		<Avatar className="h-20 w-20 mx-4">
			<AvatarImage src={src} alt="Avatar" />
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>
	);
}
