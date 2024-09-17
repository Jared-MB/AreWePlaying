import { quicksand } from "@/core/config";
import { cn } from "@/core/utils";

import "./globals.css";
import Header from "@/app/components/header";
import { ThemeProvider } from "@/components/providers/theming.provider";

export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					quicksand.variable,
				)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Header />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
