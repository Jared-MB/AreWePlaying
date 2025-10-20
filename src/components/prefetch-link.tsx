"use client";

import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";

export function PrefetchLink({
	href,
	children,
	className,
}: {
	href: Route;
	children: React.ReactNode;
	className?: string;
}) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Link
			className={className}
			href={href}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			prefetch={isHovered}
		>
			{children}
		</Link>
	);
}
