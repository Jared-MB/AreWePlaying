import Link from "next/link";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex relative h-dvh">
			<Link href="/" className="absolute text-4xl font-medium top-4 left-4">
				AreWePlaying?
			</Link>
			{children}
		</div>
	);
}
