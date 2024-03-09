import * as React from "react";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<div
				className={cn(
					"border border-input rounded-md flex flex-row gap-x-2 items-center focus-within:ring-[2px] focus-within:ring-purple-500 focus-within:ring-offset-2",
					className,
				)}
			>
				{type === "search" && (
					<Search className="pl-3 w-7 h-7 text-muted-foreground" />
				)}
				<input
					type={type}
					className="flex h-10 w-full rounded-md bg-background px-3 py-2 text-sm ring-offset-1 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					ref={ref}
					{...props}
				/>
			</div>
		);
	},
);
Input.displayName = "Input";

export { Input };
