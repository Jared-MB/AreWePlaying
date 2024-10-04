import Link from "next/link";
import Fans from "./components/fans";

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
			<section className="h-screen hidden lg:basis-1/2 lg:flex justify-center items-center bg-purple-500/70 rounded-r-xl">
				<Fans className="w-[500px] h-[350px]" />
			</section>
			{children}
		</div>
	);
}
