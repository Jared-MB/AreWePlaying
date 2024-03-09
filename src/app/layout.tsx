import Header from "@/components/header";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Separator } from "@/components/ui/separator";

export const fontSans = Quicksand({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "AreWePlaying?",
	description: "Calendario de partidos deportivos de la BUAP.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(
					"min-h-screen bg-background font-sans relative antialiased flex flex-col gap-6  ",
					fontSans.variable,
				)}
			>
				<Header />
				<div className="px-8 fixed top-[5.5rem] w-full z-50">
					<Separator />
				</div>
				{children}
			</body>
		</html>
	);
}
