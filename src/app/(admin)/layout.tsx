import {} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex relative h-dvh flex-col">
			<header className="flex p-4 w-dvw justify-between h-16">
				<Link href="/" className="text-4xl font-medium text-purple-500">
					AreWePlaying?
				</Link>
			</header>
			<div className="grid grid-cols-[20dvw_auto]">
				<aside className="p-8">
					<nav className="flex flex-col gap-y-4">
						<Link href="/admin/university">Universidades</Link>
						<Link href="/admin/team">Equipos</Link>
						<Link href="/admin/match">Partidos</Link>
					</nav>
				</aside>
				{children}
			</div>
		</div>
	);
}
