import type { Metadata } from "next";

import { Space_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { GithubIcon } from "lucide-react";
import { ScheduleHeader } from "@/components/schedule-header";
import { DevDropdown } from "suspense-fallback-debugger";
import { Providers } from "./providers";

const spaceMono = Space_Mono({
	weight: ["400", "700"],
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "Are We Playing?",
	description: "Horario de partidos de la liga ABE",
	keywords: [
		"basketball",
		"Mexico",
		"ABE",
		"Liga ABE",
		"Horario",
		"Partidos",
		"Horario de partidos",
		"Horario de partidos basketball",
		"Horario de partidos ABE",
		"Horario de partidos basketball ABE",
		"Horario de partidos ABE basketball",
		"Partidos basketball",
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es">
			<head>
				<meta
					name="google-site-verification"
					content="vhnEvLSZ4cAdbDdRlkwQdS8jq2PFCV1C3j1HWywmR6o"
				/>
			</head>
			<Providers>
				<body className={`${spaceMono.variable} font-sans antialiased`}>
					<DevDropdown />
					<main className="min-h-screen bg-background">
						<ScheduleHeader />
						{children}
					</main>
					<footer className="border-t-2 border-foreground bg-background py-4 px-6 flex w-full items-center justify-between">
						<span className="text-muted-foreground text-xs text-pretty max-w-[75dvw]">
							Los datos pueden estar desactualizados o incompletos. Para obtener
							información más precisa, visite el sitio oficial de la{" "}
							<Link
								className="text-primary hover:underline"
								href="https://www.abemexico.org/"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Ver sitio oficial de la Liga ABE"
							>
								Liga ABE
							</Link>
							.
						</span>
						<Link
							href="https://github.com/Jared-MB/AreWePlaying"
							target="_blank"
							rel="noopener noreferrer"
						>
							<GithubIcon />
						</Link>
					</footer>
				</body>
			</Providers>
		</html>
	);
}
