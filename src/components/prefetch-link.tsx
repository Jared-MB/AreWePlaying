"use client";

import Link from "next/link";
import { type ComponentProps, useState } from "react";

export function PrefetchLink({
	href,
	children,
	className,
	...props
}: ComponentProps<typeof Link>) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Link
			className={className}
			href={href}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			prefetch={isHovered}
			{...props}
		>
			{children}
		</Link>
	);
}
