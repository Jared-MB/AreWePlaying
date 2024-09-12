import Link from "next/link";
import { PickerFecha } from "../functional/pickerFecha";
import { SelectCategoria } from "../functional/selectCategoria";
import SearchBar from "../sports-filter";

export default function Header() {
	return (
		<header className="flex items-center justify-between gap-x-8 py-6 px-16 fixed h-[5.5rem] w-full z-50 bg-white">
			<h1>
				<Link href="/" className="text-primary font-medium text-3xl ">
					AreWePlaying?
				</Link>
			</h1>
			<ul className="flex gap-x-4">
				<li>
					<SelectCategoria />
				</li>
				<li>
					<SearchBar />
				</li>
				<li>
					<PickerFecha />
				</li>
			</ul>
			<span>Menu</span>
		</header>
	);
}
