import { useMatchStore } from "@/store/matches.store";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function useMatch() {

    const initialMatches = useMatchStore((state) => state.initialMatches);
    const setMatches = useMatchStore((state) => state.setMatches);

    const searchParams = useSearchParams()

    const changeMatches = useCallback(() => {

        const params = new URLSearchParams(searchParams.toString());

        let matches = initialMatches;
        params.forEach((value, key) => {
            if (key === 'sport') {
                matches = matches.filter(match => match.sport.name.toLowerCase() === value.toLowerCase() || value === 'all')
            }
            if (key === 'category') {
                matches = matches.filter(match => match.gender.toLowerCase() === value.toLowerCase() || value === 'all')
            }
        })

        setMatches(matches);
    }, [searchParams, initialMatches])

    return {
        changeMatches
    }
}