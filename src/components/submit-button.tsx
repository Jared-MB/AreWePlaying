import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

import loader from "@/core/styles/loader.module.css";
import { Loader2 } from "lucide-react";

export default function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button
			disabled={pending}
			className="flex flex-row items-center gap-x-2"
			type="submit"
		>
			{pending && <Loader2 className={loader.loader} />}
			{pending ? "Subiendo..." : "Subir imagen"}
		</Button>
	);
}
