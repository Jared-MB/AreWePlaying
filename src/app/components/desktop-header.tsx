import Filters from "./filters/filters";
import { UserMenu } from "./user-menu";

export default function DesktopHeader() {
	return (
		<>
			<div className="xl:flex hidden">
				<Filters />
			</div>
			<UserMenu />
		</>
	);
}
