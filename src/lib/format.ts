/** Language → brand color (GitHub linguist palette, trimmed to what KNIGHT ships). */
export const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Rust: '#dea584',
    Go: '#00ADD8',
    HTML: '#e34c26',
    CSS: '#563d7c',
    'Jupyter Notebook': '#DA5B0B',
    MDX: '#fcb32c',
    Java: '#b07219',
    Shell: '#89e051',
    C: '#555555',
    'C++': '#f34b7d',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    Vue: '#41b883',
    Svelte: '#ff3e00',
    Ruby: '#701516',
    PHP: '#4F5D95'
}

export const languageColor = (language: string | null | undefined): string =>
    (language && LANGUAGE_COLORS[language]) || '#8a8f98'

/** 1234 -> "1.2k". */
export const compactNumber = (value: number): string => {
    if (value < 1000) return String(value)
    if (value < 1_000_000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`
    return `${(value / 1_000_000).toFixed(1)}M`
}

export const formatDate = (iso: string | null | undefined): string => {
    if (!iso) return ''
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export const formatMonthYear = (iso: string | null | undefined): string => {
    if (!iso) return ''
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

/** "3 days ago", "5 months ago". */
export const relativeTime = (iso: string | null | undefined): string => {
    if (!iso) return ''
    const then = new Date(iso).getTime()
    if (Number.isNaN(then)) return ''

    const seconds = Math.round((Date.now() - then) / 1000)
    const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
        ['year', 31536000],
        ['month', 2592000],
        ['week', 604800],
        ['day', 86400],
        ['hour', 3600],
        ['minute', 60]
    ]

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

    for (const [unit, secondsInUnit] of units) {
        if (Math.abs(seconds) >= secondsInUnit) {
            return rtf.format(-Math.round(seconds / secondsInUnit), unit)
        }
    }

    return 'just now'
}

export const pluralize = (count: number, singular: string, plural?: string): string =>
    `${count} ${count === 1 ? singular : plural ?? `${singular}s`}`
