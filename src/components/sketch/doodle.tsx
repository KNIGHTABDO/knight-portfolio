import type { Ink } from '@/lib/pencil'

import { useEffect, useRef } from 'react'
import { readInk } from '@/lib/pencil'
import { cn } from '@/lib/utils'

export interface DoodleFrame {
    /** seconds since the doodle started acting */
    t: number
    /** drawn-frame index at the doodle's fps */
    frame: number
    active: boolean
    ink: Ink
    w: number
    h: number
}

export type DoodleDraw = (c: CanvasRenderingContext2D, f: DoodleFrame) => void

interface DoodleProps {
    draw: DoodleDraw
    /** logical drawing size; the canvas keeps this aspect */
    width: number
    height: number
    /** acting (hovered / focused / centred on touch) */
    active?: boolean
    /** keep a slow idle loop even when not active */
    idle?: boolean
    fps?: number
    className?: string
    label?: string
    /** change to force a fresh drawing (new data) */
    redrawKey?: string | number
}

/**
 * A live pencil drawing on a canvas. Draws on twos (12 fps by default), only
 * while on screen, and holds a single still drawing for reduced motion.
 */
const Doodle = ({ draw, width, height, active = false, idle = false, fps = 12, className, label, redrawKey }: DoodleProps) => {
    const ref = useRef<HTMLCanvasElement>(null)
    const drawRef = useRef(draw)
    const activeRef = useRef(active)
    const kickRef = useRef<() => void>(() => {})
    drawRef.current = draw
    activeRef.current = active

    useEffect(() => {
        kickRef.current()
    }, [active])

    useEffect(() => {
        const cv = ref.current
        if (!cv) return
        const ctx = cv.getContext('2d')
        if (!ctx) return

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        let ink = readInk(cv)
        let visible = false
        let raf = 0
        let last = -1
        let t0 = performance.now()
        let wasActive = activeRef.current

        const size = () => {
            const dpr = Math.min(2, window.devicePixelRatio || 1)
            const r = cv.getBoundingClientRect()
            cv.width = Math.max(1, Math.round(r.width * dpr))
            cv.height = Math.max(1, Math.round(r.height * dpr))
            last = -1
        }

        const render = (t: number, frame: number) => {
            const sx = cv.width / width
            ctx.setTransform(sx, 0, 0, sx, 0, 0)
            ctx.clearRect(0, 0, width, height)
            drawRef.current(ctx, { t, frame, active: activeRef.current && !reduced, ink, w: width, h: height })
        }

        const tick = (now: number) => {
            raf = 0
            if (!visible) return
            const act = activeRef.current
            if (act !== wasActive) {
                wasActive = act
                t0 = now
                last = -1
            }
            const t = (now - t0) / 1000
            const frame = Math.floor(t * fps)
            if (frame !== last) {
                last = frame
                render(frame / fps, frame)
            }
            if (!reduced && (act || idle)) raf = requestAnimationFrame(tick)
        }

        const kick = () => {
            if (!raf) raf = requestAnimationFrame(tick)
        }

        size()
        render(0, 0)

        const ro = new ResizeObserver(() => {
            size()
            render(0, 0)
            kick()
        })
        ro.observe(cv)

        const io = new IntersectionObserver(([e]) => {
            visible = e.isIntersecting
            if (visible) kick()
        }, { rootMargin: '80px' })
        io.observe(cv)

        const onTheme = () => {
            ink = readInk(cv)
            last = -1
            render(0, 0)
            kick()
        }
        window.addEventListener('knight-theme', onTheme)
        document.fonts?.ready.then(onTheme).catch(() => {})

        kickRef.current = kick

        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            io.disconnect()
            kickRef.current = () => {}
            window.removeEventListener('knight-theme', onTheme)
        }
    }, [width, height, fps, idle, redrawKey])

    return (
        <canvas
            ref={ref}
            role={label ? 'img' : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : true}
            className={cn('block w-full', className)}
            style={{ aspectRatio: `${width} / ${height}` }}
        />
    )
}

export default Doodle
