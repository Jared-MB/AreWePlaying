// app/layout.tsx
import { quicksand } from "@/core/config";
import { cn } from "@/core/utils";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theming.provider";
import { Toaster } from "@/components/ui/sonner";

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
					{children}
				</ThemeProvider>
				<Toaster />
			</body>
		</html>
	);
}
