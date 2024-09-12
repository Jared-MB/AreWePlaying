import Link from "next/link";
import { PickerFecha } from "../functional/pickerFecha";
import { SelectCategoria } from "../functional/selectCategoria";
import SearchBar from "../sports-filter";

export default function Header() {
	return (
		<header className="bg-gray-800 ">
			<nav className="container flex items-center justify-between p-4">
				<Link href="/" className="text-white text-2xl font-bold">
					Are We Playing?
				</Link>
				<ul className="flex grow space-x-4 justify-center">
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
			</nav>
		</header>
	);
}
