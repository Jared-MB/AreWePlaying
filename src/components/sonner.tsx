import type { CSSProperties } from "preact";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ toastOptions, ...props }: ToasterProps) => {
	return (
		<Sonner
			theme="system"
			className="toaster group"
			toastOptions={{
				style: {
					borderRadius: "var(--radius)",
					backgroundColor: "var(--muted)",
					fontFamily: "var(--font-mono)",
				},
			}}
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
				} as CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
