import { useSearchParams as useSearchParamsNext } from "next/navigation"
import type { DateRange } from "react-day-picker";

export default function useSearchParams() {
    const searchParams = useSearchParamsNext()

    const setSearchParams = (
        value: React.Key | DateRange | undefined,
        key: string,
    ) => {
        const params = new URLSearchParams(searchParams.toString());
        value && params.set(key, value.toString());
        window.history.pushState({}, "", `?${params.toString()}`);
    };

    const clearSearchParams = () => window.history.pushState({}, "", "/");

    return {
        searchParams,
        setSearchParams,
        clearSearchParams
    }
}