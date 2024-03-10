import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"capitalize inline-flex items-center rounded-xl border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
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

export interface BadgeProps<T = HTMLSpanElement>
	extends React.HTMLAttributes<T>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<span className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge, badgeVariants };

export function BadgeButton({ className, variant, ...props }: BadgeProps) {
	return (
		<button
			type="button"
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		>
			{props.children}
		</button>
	);
}

// export function BadgeLink({
// 	className,
// 	variant,
// 	href,
// 	target = "_self",
// 	children,
// 	...props
// }: BadgeProps & {
// 	href: LinkProps["href"];
// 	target?: HTMLAnchorElement["target"];
// }) {
// 	return (
// 		<Link
// 			href={href}
// 			target={target}
// 			className={cn(badgeVariants({ variant }), className)}
// 			{...props}
// 		>
// 			{children}
// 		</Link>
// 	);
// }
