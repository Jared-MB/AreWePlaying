import Link from "next/link";
import DesktopHeader from "./desktop-header";
import MobileHeader from "./mobile-header";

export default function Header() {
	return (
		<header className="flex items-center justify-between gap-x-8 py-6 px-16 fixed h-[5.5rem] w-full z-50 bg-white">
			<h1>
				<Link href="/" className="text-primary font-medium text-3xl ">
					AreWePlaying?
				</Link>
			</h1>
			<DesktopHeader />
			<MobileHeader />
		</header>
	);
}
