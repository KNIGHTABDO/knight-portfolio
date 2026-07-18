import type { FC, ReactNode } from 'react'

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react'

type ThemeMode = 'system' | 'light' | 'dark'
type Resolved = 'light' | 'dark'

interface ThemeContextValue {
    mode: ThemeMode
    resolved: Resolved
    mounted: boolean
    setMode: (mode: ThemeMode) => void
    toggle: () => void
}

const STORAGE_KEY = 'knight-theme'

const ThemeContext = createContext<ThemeContextValue | null>(null)

const systemPrefersDark = (): boolean =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches

const applyMode = (mode: ThemeMode): void => {
    const root = document.documentElement

    if (mode === 'system') {
        root.removeAttribute('data-theme')
        return
    }

    root.setAttribute('data-theme', mode)
}

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [mode, setModeState] = useState<ThemeMode>('system')
    const [resolved, setResolved] = useState<Resolved>('dark')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const stored = (typeof localStorage !== 'undefined'
            ? localStorage.getItem(STORAGE_KEY)
            : null) as ThemeMode | null

        const initial: ThemeMode =
            stored === 'light' || stored === 'dark' || stored === 'system'
                ? stored
                : 'system'

        setModeState(initial)
        setResolved(initial === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : initial)
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        applyMode(mode)
        setResolved(mode === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : mode)

        const media = window.matchMedia('(prefers-color-scheme: dark)')
        const onChange = () => {
            if (mode === 'system') setResolved(media.matches ? 'dark' : 'light')
        }

        media.addEventListener('change', onChange)
        return () => media.removeEventListener('change', onChange)
    }, [mode, mounted])

    const setMode = useCallback((next: ThemeMode) => {
        setModeState(next)
        try {
            localStorage.setItem(STORAGE_KEY, next)
        } catch {
            /* ignore private-mode storage errors */
        }
    }, [])

    const toggle = useCallback(() => {
        setMode(resolved === 'dark' ? 'light' : 'dark')
    }, [resolved, setMode])

    const value = useMemo(
        () => ({ mode, resolved, mounted, setMode, toggle }),
        [mode, resolved, mounted, setMode, toggle]
    )

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextValue => {
    const ctx = useContext(ThemeContext)

    if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')

    return ctx
}
