/** Languages printed in the riso inks the page already uses. */
const LANGUAGE_INK: Record<string, string> = {
    TypeScript: 'blue',
    JavaScript: 'yellow',
    Python: 'green',
    Rust: 'orange',
    Go: 'navy',
    HTML: 'pink',
    CSS: 'pink',
    'Jupyter Notebook': 'orange',
    Shell: 'green'
}

export const languageInk = (language: string | null | undefined): string => (language && LANGUAGE_INK[language]) || 'graphite-faint'

export const INK_BG: Record<string, string> = {
    blue: 'bg-blue',
    yellow: 'bg-yellow',
    green: 'bg-green',
    orange: 'bg-orange',
    navy: 'bg-navy',
    pink: 'bg-pink',
    'graphite-faint': 'bg-graphite-faint'
}

export const INK_VAR: Record<string, string> = {
    blue: 'var(--blue)',
    yellow: 'var(--yellow)',
    green: 'var(--green)',
    orange: 'var(--orange)',
    navy: 'var(--navy)',
    pink: 'var(--pink)',
    'graphite-faint': 'var(--graphite-faint)'
}
