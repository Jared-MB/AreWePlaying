import { Share2 } from "lucide-preact";
import { toast } from "sonner";

export default function ShareButton({
	title,
	text,
}: {
	title: string;
	text: string;
}) {
	const share = async () => {
		const url = window.location.href;

		// La Web Share API sólo existe en algunos navegadores (sobre todo móviles);
		// en el resto se copia el enlace al portapapeles.
		if (navigator.share) {
			try {
				await navigator.share({ title, text, url });
			} catch (error) {
				// AbortError significa que el usuario cerró el diálogo: no es un error.
				if (error instanceof DOMException && error.name === "AbortError")
					return;
				toast.error("No se pudo compartir");
			}
			return;
		}

		try {
			await navigator.clipboard.writeText(url);
			toast.success("Enlace copiado al portapapeles");
		} catch {
			toast.error("No se pudo copiar el enlace");
		}
	};

	return (
		<button
			onClick={share}
			type="button"
			title="Compartir"
			className="touch-hitbox cursor-pointer flex justify-center gap-2 bg-surface hover:bg-surface-hover rounded-md p-2 duration-180 text-sm tracking-wider shadow-xs transition-transform focus:scale-95"
		>
			<Share2 className="size-5" aria-hidden="true" />
			<span className="hidden lg:inline-flex">Compartir</span>
		</button>
	);
}
