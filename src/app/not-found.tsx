import Link from "next/link";

export default function NotFound() {
	return (
		<main className="container mx-auto h-[calc(100dvh-5rem)] grid place-content-center gap-8">
			<h2 className="text-center text-6xl font-mono font-medium">
				404 - NOT FOUND
			</h2>
			<div className="flex items-center flex-col gap-2">
				<p className="text-center">No encontramos lo que estabas buscando</p>
				<Link
					href="/weeks"
					className="text-center text-primary hover:underline"
				>
					Regresa al inicio
				</Link>
			</div>
		</main>
	);
}
