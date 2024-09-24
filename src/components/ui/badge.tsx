import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/core/utils";
import { useRouter } from "next/navigation";

const badgeVariants = cva(
	"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
				secondary:
					"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
				destructive:
					"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
				outline: "text-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {
	value: string;
}

function Badge({ className, value, ...props }: BadgeProps) {
	const router = useRouter();
	// const selectCategory = searchParams.get("categoria") || "";

	const handleCategoryChange = (value: string) => {
		const params = new URLSearchParams(window.location.search); // Obtiene los parámetros de la URL
		if (value) {
			params.set("categoria", value); // Agrega el parámetro a la URL pero no actualiza la página
		} else {
			params.delete("categoria");
		}
		router.push(`?${params.toString()}`); // Actualiza la página con el nuevo parámetro
	};

	return (
		<div
			className={cn(badgeVariants({}), className)}
			{...props}
			onClick={() => handleCategoryChange(value)} // Añade el evento onClick aquí
		/>
	);
}

export { Badge, badgeVariants };
