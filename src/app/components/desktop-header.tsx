import Filters from "./filters/filters";
import { UserMenu } from "./user-menu";

export default function DesktopHeader() {
	return (
		<>
			<div className="md:flex hidden">
				<Filters />
			</div>
			<UserMenu />
		</>
	);
}
