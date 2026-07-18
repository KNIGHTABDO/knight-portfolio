import { Moon, Sun } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'

interface ThemeToggleProps {
    className?: string
}

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
    const { resolved, toggle, mounted } = useTheme()
    const isDark = resolved === 'dark'

    return (
        <button
            type='button'
            onClick={toggle}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className={cn('gx-btn gx-btn-secondary gx-btn-icon', className)}
        >
            <span className='relative flex size-5 items-center justify-center'>
                <Sun
                    className={cn(
                        'absolute size-5 transition-all duration-300',
                        mounted && !isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-90 opacity-0'
                    )}
                />
                <Moon
                    className={cn(
                        'absolute size-5 transition-all duration-300',
                        mounted && isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-90 opacity-0'
                    )}
                />
            </span>
        </button>
    )
}
