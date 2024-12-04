import { AvatarProfile } from "@/components/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { getUsername } from "@/core/modules/user/adapters/user.adapter";
import { User } from "lucide-react";
import Link from "next/link";
import Filters from "./filters/filters";
import Logout from "./logout";

export default async function MobileHeader() {
	const username = await getUsername();

	return (
		<Sheet>
			<SheetTrigger className="flex xl:hidden">
				<AvatarProfile />
			</SheetTrigger>
			<SheetContent className="w-[400px] sm:w-[540px] bg-zinc-50 dark:bg-background">
				<SheetHeader>
					<SheetTitle className="text-2xl text-purple-500 text-left">
						Filtrar resultados
					</SheetTitle>
				</SheetHeader>
				<section className="py-6">
					<Filters />
				</section>
				<Separator />
				<SheetFooter className="py-6">
					{!username ? (
						<Logout username={username} className={buttonVariants()} />
					) : (
						<div className="flex flex-col gap-y-8">
							<Link href="/profile" className={buttonVariants()}>
								<User className="mr-2 h-5 w-5" />
								<span>{username}</span>
							</Link>
							<Logout
								username={username}
								className={buttonVariants({
									variant: "outline",
								})}
							/>
							{/* <Link
								href="/login"
								className={buttonVariants({
									variant: "outline",
								})}
							>
								Cerrar sesión
							</Link> */}
						</div>
					)}
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
