import Header from "@/components/header";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

import QueryProvider from "./provider";

export const fontSans = Quicksand({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const viewport: Viewport = {
	width: "device-width",
};

export const metadata: Metadata = {
	title: "AreWePlaying?",
	description: "Calendario de partidos y eventos deportivos de la BUAP.",
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
		},
	},
	keywords: "BUAP, partidos, deportes, calendario",
	category: "Sports",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<QueryProvider>
				<body
					className={cn(
						"min-h-screen bg-background font-sans relative antialiased flex flex-col gap-6  ",
						fontSans.variable,
					)}
				>
					<Suspense>
						<Header />
					</Suspense>
					<div className="px-8 fixed top-[5.5rem] w-full z-50">
						<Separator />
					</div>
					{children}
				</body>
			</QueryProvider>
		</html>
	);
}
