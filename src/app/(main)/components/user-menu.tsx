import { LogOut, User } from "lucide-react";

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
	dropdownMenuItemClass,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function UserMenu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="xl:flex hidden">
				<AvatarProfile />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>¿Quién eres?</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
						{/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
					</DropdownMenuItem>
					<DropdownThemeSwitch />
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link className={dropdownMenuItemClass} href="/login">
						<LogOut className="mr-2 h-4 w-4" />
						<span>Inicia sesión</span>
						{/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
