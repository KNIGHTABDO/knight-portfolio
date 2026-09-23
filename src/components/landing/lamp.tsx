import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'

interface LampProps {
    className?: string
}

/** A hanging bulb with a pull cord. Pulling it is the night-mode switch. */
const Lamp = ({ className }: LampProps) => {
    const { theme, toggle, mounted } = useTheme()
    const [pulling, setPulling] = useState(false)
    const night = mounted && theme === 'night'

    const pull = () => {
        setPulling(true)
        window.setTimeout(() => {
            toggle()
            setPulling(false)
        }, 170)
    }

    return (
        <button
            type='button'
            onClick={pull}
            aria-pressed={night}
            aria-label={night ? 'Turn the lamp on (paper mode)' : 'Turn the lamp off (night mode)'}
            title={night ? 'lights on' : 'night shift'}
            className={cn('boil-hover group relative -mt-4 flex h-16 w-10 items-start justify-center text-graphite', className)}
        >
            <svg viewBox='0 0 40 64' className='h-16 w-10 overflow-visible' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M20 0 L20.4 12' strokeWidth='1.6' />
                <g className={cn('transition-transform duration-150 ease-out', pulling && 'translate-y-[5px]')}>
                    {/* bulb */}
                    <path
                        d='M13.2 22.5c-.4-4.4 3-7.6 6.9-7.5 4.1.1 7.1 3.3 6.7 7.7-.3 3.1-2.6 4.6-3.3 7.2l-7.3.2c-.6-2.9-2.8-4.4-3-7.6Z'
                        strokeWidth='1.7'
                        className={cn('transition-colors duration-300', night ? 'fill-transparent' : 'fill-yellow/80')}
                    />
                    <path d='M16.7 31.9l6.6-.2M17 34.4l6.1-.1M18.2 36.8l3.8-.1' strokeWidth='1.4' />
                    <path d='M18.5 29.6c-.2-2.6.6-4.3 1.6-5.3M21.7 29.5c.1-2.2-.3-3.8-1.1-5' strokeWidth='1' className='opacity-60' />
                    {!night && <path d='M9 18.5l-3.6-1.6M8.6 24.2l-4 .4M31 18l3.5-1.7M31.6 23.7l3.9.5M20.4 11.6l.1-3.4' strokeWidth='1.3' className='text-orange' stroke='currentColor' />}
                    {/* cord and bead */}
                    <path d='M24 37 C24.6 43 23.3 49 24.2 56' strokeWidth='1.1' className='transition-transform duration-150 group-hover:translate-y-[2px]' />
                    <circle cx='24.2' cy='58.4' r='2.3' className='fill-current' />
                </g>
            </svg>
        </button>
    )
}

export default Lamp
