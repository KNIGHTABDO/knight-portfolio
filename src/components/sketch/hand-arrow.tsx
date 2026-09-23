import type { Pt } from '@/lib/sketch'

import { useMemo, useRef } from 'react'
import { roughArrow } from '@/lib/sketch'
import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/use-in-view'

import Strokes from '@/components/sketch/strokes'

interface HandArrowProps {
    width: number
    height: number
    from: Pt
    to: Pt
    seed?: number
    bend?: number
    className?: string
    strokeWidth?: number
    delay?: number
}

/** A pencil arrow inside its own little box. */
const HandArrow = ({ width, height, from, to, seed = 5, bend = 0.25, className, strokeWidth = 2, delay = 0.3 }: HandArrowProps) => {
    const ref = useRef<SVGSVGElement>(null)
    const inView = useInView(ref)
    const variants = useMemo(() => [0, 1, 2].map((k) => {
        const a = roughArrow(from, to, seed + k * 31, bend)
        return `${a.shaft} ${a.head}`
    }), [from, to, seed, bend])

    return (
        <svg ref={ref} data-inview={inView} aria-hidden='true' viewBox={`0 0 ${width} ${height}`} width={width} height={height} className={cn('pointer-events-none overflow-visible', className)}>
            <Strokes variants={variants} width={strokeWidth} drawOn delay={delay} stagger={0.5} duration={0.6} />
        </svg>
    )
}

export default HandArrow
