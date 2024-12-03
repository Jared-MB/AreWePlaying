"use client";

import { dropdownMenuItemClass } from "@/components/ui/dropdown-menu";
import { logout } from "@/core/modules/auth/adapters/auth.adapter";
import { cn } from "@/core/utils";
import { LogOut } from "lucide-react";
import Link from "next/link";

export default function Logout({ username }: { username?: string }) {
	return (
		<Link
			className={cn(dropdownMenuItemClass, "cursor-pointer hover:bg-accent")}
			href="/login"
			onClick={() => logout()}
		>
			<LogOut className="mr-2 h-5 w-5" />
			<span>{username ? "Cerrar sesión" : "Inicia sesión"}</span>
			{/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
		</Link>
	);
}
