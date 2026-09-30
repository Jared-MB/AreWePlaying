import { Share2 } from "lucide-preact";
import { toast } from "sonner";

// "banner" es el botón de contorno sobre el encabezado de color del equipo.
const VARIANTS = {
	surface:
		"bg-surface hover:bg-surface-hover rounded-md p-2 shadow-xs text-sm tracking-wider",
	banner:
		"items-center rounded-full border-2 border-current px-4 py-2 font-mono text-sm font-bold uppercase tracking-wider hover:bg-primary-foreground hover:text-banner",
};

export default function ShareButton({
	title,
	text,
	variant = "surface",
}: {
	title: string;
	text: string;
	variant?: keyof typeof VARIANTS;
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
			className={`touch-hitbox cursor-pointer flex justify-center gap-2 duration-180 transition-[transform,background-color,color] focus:scale-95 ${VARIANTS[variant]}`}
		>
			<Share2 className="size-5" aria-hidden="true" />
			<span className="sr-only lg:not-sr-only">Compartir</span>
		</button>
	);
}
