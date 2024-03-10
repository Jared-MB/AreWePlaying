import Header from "@/components/header";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

import QueryProvider from "./provider";

import { Github } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

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
						"bg-background font-sans relative antialiased flex flex-col ",
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
					<footer className="relative top-[5.5rem] h-10 mt-6">
						<Separator />
						<div className="flex justify-end items-center w-full p-4">
							<Link
								href="https://github.com/Jared-MB/AreWePlaying"
								target="_blank"
								rel="noopener noreferrer"
								className={cn(
									buttonVariants({
										size: "icon",
										variant: "ghost",
									}),
									"hover:scale-110 transition",
								)}
							>
								<Github className="w-6 h-6" />
							</Link>
						</div>
					</footer>
				</body>
			</QueryProvider>
		</html>
	);
}
