import { SelectCategoria } from "./selectCategoria";
import { SelectDeporte } from "./selectDeporte";
import { PickerFecha } from "./pickerFecha";

export default function Header() {
    return (
        <header className="bg-gray-800 ">
            <nav className="container flex items-center justify-between p-4">
                <a href="/" className="text-white text-2xl font-bold">
                    Are We Playing?
                </a>
                <ul className="flex grow space-x-4 justify-center">
                    <li>
                        <SelectCategoria />
                    </li>
                    <li>
                        <SelectDeporte />
                    </li>
                    <li>
                        <PickerFecha />
                    </li>
                </ul>
            </nav>
        </header>
    );
}
