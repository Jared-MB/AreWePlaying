"use client";

import useSearchParams, { type KeySearchParams } from "@/hooks/useSearchParams";
import { BadgeButton } from "../ui/badge";

export default function Tag({
	children,
	title,
	value,
	query,
}: {
	children: React.ReactNode;
	value: string;
	query: KeySearchParams;
	title?: string;
}) {
	const { setSearchParams } = useSearchParams();

	const handleClick = () => {
		setSearchParams(value, query);
	};

	return (
		<BadgeButton title={title} onClick={handleClick}>
			#{children}
		</BadgeButton>
	);
}
