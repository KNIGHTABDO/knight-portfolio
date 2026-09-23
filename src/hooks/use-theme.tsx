import type { FC, ReactNode } from 'react'

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react'

export type Theme = 'paper' | 'night'

interface ThemeContextValue {
    theme: Theme
    mounted: boolean
    setTheme: (theme: Theme) => void
    toggle: () => void
}

export const THEME_STORAGE_KEY = 'knight-theme'

const ThemeContext = createContext<ThemeContextValue | null>(null)

const apply = (theme: Theme): void => {
    const root = document.documentElement
    if (theme === 'night') root.setAttribute('data-theme', 'night')
    else root.removeAttribute('data-theme')
    window.dispatchEvent(new CustomEvent('knight-theme', { detail: theme }))
}

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>('paper')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // _document's boot script already chose; read it back
        setThemeState(document.documentElement.dataset.theme === 'night' ? 'night' : 'paper')
        setMounted(true)
    }, [])

    const setTheme = useCallback((next: Theme) => {
        setThemeState(next)
        apply(next)
        try {
            localStorage.setItem(THEME_STORAGE_KEY, next)
        } catch {
            /* private mode: the lamp still works for this visit */
        }
    }, [])

    const toggle = useCallback(() => setTheme(theme === 'night' ? 'paper' : 'night'), [theme, setTheme])

    const value = useMemo(() => ({ theme, mounted, setTheme, toggle }), [theme, mounted, setTheme, toggle])

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextValue => {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
    return ctx
}
