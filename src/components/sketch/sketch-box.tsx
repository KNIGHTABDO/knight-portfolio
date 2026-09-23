import { useMemo, useRef } from 'react'
import { roughRect } from '@/lib/sketch'
import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/use-in-view'
import { useSize } from '@/hooks/use-size'

import Strokes from '@/components/sketch/strokes'

interface SketchBoxProps {
    seed: number
    className?: string
    width?: number
    boil?: boolean
    drawOn?: boolean
    delay?: number
    /** how far the frame sits outside its parent, px */
    bleed?: number
}

/**
 * A hand-ruled frame that fills its (relative) parent. Three redraws boil
 * when an ancestor with `boil-hover` is hovered.
 */
const SketchBox = ({ seed, className, width = 1.8, boil = true, drawOn = false, delay = 0, bleed = 4 }: SketchBoxProps) => {
    const ref = useRef<SVGSVGElement>(null)
    const { width: w, height: h } = useSize(ref)
    const inView = useInView(ref)
    const variants = useMemo(() => {
        if (!w || !h) return []
        const n = boil ? 3 : 1
        return Array.from({ length: n }, (_, k) => roughRect(w, h, seed * 7 + k * 101, { inset: bleed / 2 + 2, amp: 1.1 + k * 0.1 }))
    }, [w, h, seed, boil, bleed])

    return (
        <svg
            ref={ref}
            data-inview={inView}
            aria-hidden='true'
            className={cn('pointer-events-none absolute overflow-visible', className)}
            style={{ left: -bleed, top: -bleed, width: `calc(100% + ${bleed * 2}px)`, height: `calc(100% + ${bleed * 2}px)` }}
        >
            {variants.length > 0 && <Strokes variants={variants} width={width} drawOn={drawOn} delay={delay} />}
        </svg>
    )
}

export default SketchBox
