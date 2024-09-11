import * as React from "react";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function SelectCategoria() {
	return (
		<Select>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Categoría" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Categoría</SelectLabel>
					<SelectItem value="varonil">Varonil</SelectItem>
					<SelectItem value="femenil">Femenil</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
