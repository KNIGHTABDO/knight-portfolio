import type { ReactNode } from 'react'

import { useMemo, useRef } from 'react'
import { roughEllipse, roughUnderline } from '@/lib/sketch'
import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/use-in-view'
import { useSize } from '@/hooks/use-size'

import Strokes from '@/components/sketch/strokes'

type MarkKind = 'circle' | 'underline' | 'double' | 'zigzag'

interface MarkProps {
    children: ReactNode
    kind?: MarkKind
    seed?: number
    className?: string
    /** text colour class for the mark, e.g. 'text-pink' */
    ink?: string
    width?: number
    delay?: number
}

/** Circles or underlines a word by hand, drawn on when it scrolls into view. */
const Mark = ({ children, kind = 'underline', seed = 3, className, ink = 'text-pink', width = 2.6, delay = 0.2 }: MarkProps) => {
    const ref = useRef<HTMLSpanElement>(null)
    const { width: w, height: h } = useSize(ref)
    const inView = useInView(ref)

    const box = useMemo(() => {
        if (!w || !h) return null
        if (kind === 'circle') {
            const W = w + 26
            const H = h + 14
            return { W, H, x: -13, y: -7, variants: [roughEllipse(W, H, seed, { pad: 3 }), roughEllipse(W, H, seed + 50, { pad: 3 }), roughEllipse(W, H, seed + 90, { pad: 3 })] }
        }
        const H = Math.max(10, h * 0.32)
        const W = w + 6
        const k = kind === 'underline' ? 'single' : kind
        return { W, H, x: -3, y: h - H * (kind === 'zigzag' ? 0.05 : 0.2), variants: [roughUnderline(W, H, seed, k), roughUnderline(W, H, seed + 40, k), roughUnderline(W, H, seed + 80, k)] }
    }, [w, h, kind, seed])

    return (
        <span ref={ref} data-inview={inView} className={cn('boil-hover relative inline-block whitespace-nowrap', className)}>
            <span className='relative z-10'>{children}</span>
            {box && (
                <svg
                    aria-hidden='true'
                    className={cn('pointer-events-none absolute z-0 overflow-visible', ink)}
                    style={{ left: box.x, top: box.y }}
                    width={box.W}
                    height={box.H}
                >
                    <Strokes variants={box.variants} width={width} drawOn delay={delay} duration={kind === 'circle' ? 0.9 : 0.55} />
                </svg>
            )}
        </span>
    )
}

export default Mark
