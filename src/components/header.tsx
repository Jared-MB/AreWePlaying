import {
	type IconSelector,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "./ui/input";
import { DatePickerWithRange } from "./ui/date-range-picker";

import { FaBasketballBall } from "react-icons/fa";

const Icons: IconSelector[] = [
	{
		key: "basketball",
		value: <FaBasketballBall />,
	},
];

export default function Header() {
	return (
		<header className="flex items-center gap-x-8 mt-6 px-16 fixed h-10 w-full">
			<h1 className="text-purple-500 font-medium text-2xl">AreWePlaying?</h1>
			<nav>
				<ToggleGroup type="single" className="gap-x-2">
					<ToggleGroupItem value="day">DIA</ToggleGroupItem>
					<ToggleGroupItem value="week">SEMANA</ToggleGroupItem>
					<ToggleGroupItem value="month">MES</ToggleGroupItem>
				</ToggleGroup>
			</nav>
			<Select>
				<SelectTrigger className="w-[220px]">
					<SelectValue placeholder="Selecciona un deporte" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Sports</SelectLabel>
						<SelectItem value="basketball">Basketball</SelectItem>
						<SelectItem value="football">Football</SelectItem>
						<SelectItem value="soccer">Soccer</SelectItem>
						<SelectItem value="volleyball">Volleyball</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
			<Select>
				<SelectTrigger className="w-[220px]">
					<SelectValue placeholder="Select una categoría" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Categoría</SelectLabel>
						<SelectItem value="all">Todos</SelectItem>
						<SelectItem value="femenil">Femenil</SelectItem>
						<SelectItem value="varonil">Varonil</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
			<DatePickerWithRange />
		</header>
	);
}
