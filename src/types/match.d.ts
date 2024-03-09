import type { Location } from "./location"
import type { Sport } from "./sport"
import type { University } from "./university"

export interface Match {
    id: string
    university: University
    location: Location
    isLocal: boolean
    date: Date
    sport: Sport
    gender: 'varonil' | 'femenil'
}