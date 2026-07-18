import type { CSSProperties } from 'react'

import { useScrollProgress } from '@/hooks/use-interactions'

export const ScrollProgress = () => {
    const progress = useScrollProgress()

    return (
        <div className='fixed inset-x-0 top-0 z-[60] h-[3px]' aria-hidden='true'>
            <div
                className='h-full origin-left bg-accent transition-transform duration-150 ease-out'
                style={{ transform: `scaleX(${progress})` } as CSSProperties}
            />
        </div>
    )
}
