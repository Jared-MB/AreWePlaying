import { FORMAT_DATE, LOCALE } from "@/constants/date";
import type { Match } from "@/types";
import { format, parse } from "@formkit/tempo";

export const MATCHES: Match[] = [
    {
        id: '1',
        date: parse('01:00 PM - Marzo 19, 2024', FORMAT_DATE, LOCALE),
        gender: 'femenil',
        location: {
            id: '1',
            name: 'Arena BUAP',
            url: 'https://maps.app.goo.gl/LrnLgSkbW4jKdSd39'
        },
        isLocal: true,
        sport: {
            id: '1',
            name: 'Basketball'
        },
        university: {
            id: '1',
            image: {
                id: '1',
                url: '/next.svg'
            },
            name: 'UDLAP'
        }
    }, {
        id: '2',
        date: parse('01:00 PM - Marzo 19, 2024', FORMAT_DATE, LOCALE),
        gender: 'varonil',
        location: {
            id: '1',
            name: 'Arena BUAP',
            url: 'https://maps.app.goo.gl/LrnLgSkbW4jKdSd39'
        },
        isLocal: true,
        sport: {
            id: '1',
            name: 'Basketball'
        },
        university: {
            id: '1',
            image: {
                id: '2',
                url: '/next.svg'
            },
            name: 'Tec de Monterrey'
        }
    }, {
        id: '3',
        date: parse('01:00 PM - Marzo 19, 2024', FORMAT_DATE, LOCALE),
        gender: 'femenil',
        location: {
            id: '2',
            name: 'UVM Centro',
            url: 'https://maps.app.goo.gl/LrnLgSkbW4jKdSd39'
        },
        isLocal: false,
        sport: {
            id: '1',
            name: 'Basketball'
        },
        university: {
            id: '1',
            image: {
                id: '3',
                url: '/next.svg'
            },
            name: 'UVM Centro'
        },
    }, {
        id: '4',
        date: parse('01:00 PM - Marzo 19, 2024', FORMAT_DATE, LOCALE),
        gender: 'varonil',
        location: {
            id: '2',
            name: 'UVM Centro',
            url: 'https://maps.app.goo.gl/LrnLgSkbW4jKdSd39'
        },
        isLocal: false,
        sport: {
            id: '1',
            name: 'Basketball'
        },
        university: {
            id: '1',
            image: {
                id: '4',
                url: '/next.svg'
            },
            name: 'UVM Centro'
        }
    }, {
        id: '5',
        date: parse('01:00 PM - Marzo 19, 2024', FORMAT_DATE, LOCALE),
        isLocal: true,
        location: {
            id: '1',
            name: 'Arena BUAP',
            url: 'https://maps.app.goo.gl/LrnLgSkbW4jKdSd39'
        },
        sport: {
            id: '1',
            name: 'Basketball'
        },
        university: {
            id: '4',
            image: {
                id: '5',
                url: '/next.svg'
            },
            name: 'UNAM'
        },
        gender: 'femenil'
    }
]