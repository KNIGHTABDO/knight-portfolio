import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

interface StrokesProps {
    /** one path string per redraw variant (1 = held, 3 = can boil) */
    variants: Array<string>
    width?: number
    className?: string
    drawOn?: boolean
    duration?: number
    delay?: number
    stagger?: number
    linecap?: 'round' | 'butt'
}

/**
 * The shared renderer for every SVG mark: each variant is a group of
 * subpaths; with drawOn each subpath gets pathLength=1 and is drawn in turn.
 */
const Strokes = ({ variants, width = 2, className, drawOn = false, duration = 0.8, delay = 0, stagger = 0.14, linecap = 'round' }: StrokesProps) => (
    <g className={cn(variants.length > 1 && 'boil', drawOn && 'draw-on', className)} fill='none' stroke='currentColor' strokeWidth={width} strokeLinecap={linecap} strokeLinejoin='round'>
        {variants.map((d, v) => (
            <g key={v} className={`v${v + 1}`}>
                {d.split(/(?=M)/).map((sub, i) => (
                    <path
                        key={i}
                        d={sub}
                        pathLength={drawOn ? 1 : undefined}
                        style={drawOn ? ({ '--draw-dur': `${duration}s`, '--draw-delay': `${delay + i * stagger}s` } as CSSProperties) : undefined}
                    />
                ))}
            </g>
        ))}
    </g>
)

export default Strokes
