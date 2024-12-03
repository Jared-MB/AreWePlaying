import { User } from "lucide-react";

import { AvatarProfile } from "@/components/avatar";
import { DropdownThemeSwitch } from "@/components/toggle-theme";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUsername } from "@/core/modules/user/adapters/user.adapter";
import Link from "next/link";
import Logout from "./logout";

export async function UserMenu() {
	const username = await getUsername();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="xl:flex hidden">
				<AvatarProfile username={username} />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>{username ?? "¿Quién eres?"}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{username && (
						<DropdownMenuItem asChild>
							<Link href="/profile" className="cursor-pointer">
								<User className="mr-2 h-5 w-5" />
								<span>Perfil</span>
							</Link>
							{/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
						</DropdownMenuItem>
					)}
					<DropdownThemeSwitch />
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Logout username={username} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
