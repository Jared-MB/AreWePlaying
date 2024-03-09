import { cn } from "@/lib/utils";

interface ChildrenProps {
	children?: React.ReactNode;
}

export function InputLabel({
	children,
	className,
}: ChildrenProps & { className?: string }) {
	return (
		<label
			className={cn("text-sm md:text-xs text-primary font-medium", className)}
		>
			{children}
		</label>
	);
}

export function InputContainer({ children }: ChildrenProps) {
	return (
		<div className="relative w-full md:w-fit flex flex-col gap-y-1 justify-end">
			{children}
		</div>
	);
}
