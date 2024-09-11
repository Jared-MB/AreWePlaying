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

export function SelectDeporte() {
    return (
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Deporte" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Deporte</SelectLabel>
                    <SelectItem value="futbol">Futbol</SelectItem>
                    <SelectItem value="basquetbol">Basquetbol</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
