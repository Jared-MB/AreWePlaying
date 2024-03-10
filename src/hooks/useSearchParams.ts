import { useMatchStore } from "@/store/matches.store";
import { useSearchParams as useSearchParamsNext } from "next/navigation"
import type { DateRange } from "react-day-picker";
import useMatch from "./useMatch";
import { useEffect } from "react";

export type KeySearchParams = 'sport' | 'category' | 'dateRange';

export default function useSearchParams() {

    const { changeMatches } = useMatch();

    const searchParams = useSearchParamsNext()

    const setSearchParams = (
        value: React.Key | DateRange | undefined,
        key: KeySearchParams,
    ) => {
        const params = new URLSearchParams(searchParams.toString());
        value && params.set(key, value.toString());
        value === undefined && params.delete(key);
        window.history.pushState({}, "", `?${params.toString()}`);
    };

    const clearSearchParams = () => window.history.pushState({}, "", "/");

    useEffect(() => {
        changeMatches();
    }, [searchParams])

    return {
        searchParams,
        setSearchParams,
        clearSearchParams
    }
}