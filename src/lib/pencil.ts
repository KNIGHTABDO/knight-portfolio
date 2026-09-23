import type { Pt } from '@/lib/sketch'

import {
    TAU,
    clamp,
    hash,
    lerp,
    noise1,
    rng,
    wobble
} from '@/lib/sketch'

/** Colours read from the live CSS tokens, so doodles follow the lamp. */
export interface Ink {
    graphite: string
    soft: string
    faint: string
    pink: string
    blue: string
    yellow: string
    green: string
    orange: string
    paper: string
    card: string
    night: boolean
    hand: string
    arabic: string
    mono: string
}

export const readInk = (el: Element): Ink => {
    const s = getComputedStyle(el)
    const v = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback
    return {
        graphite: v('--graphite', '#2a2622'),
        soft: v('--graphite-soft', '#5a534b'),
        faint: v('--graphite-faint', '#8b8377'),
        pink: v('--pink', '#ff48b0'),
        blue: v('--blue', '#0078bf'),
        yellow: v('--yellow', '#ffe800'),
        green: v('--green', '#00a95c'),
        orange: v('--orange', '#ff6c2f'),
        paper: v('--paper', '#f4efe4'),
        card: v('--paper-card', '#faf6ee'),
        night: document.documentElement.dataset.theme === 'night',
        hand: v('--font-caveat', 'cursive'),
        arabic: v('--font-ruqaa', 'serif'),
        mono: v('--font-jetbrains', 'monospace')
    }
}

interface PencilOptions {
    seed: number
    color: string
    width?: number
    alpha?: number
    closed?: boolean
    amp?: number
    /** second, lighter pass that does not quite agree with the first */
    passes?: 1 | 2
    taper?: boolean
}

/** A graphite gesture: tapered main pass plus a quieter search line. */
export const pencil = (c: CanvasRenderingContext2D, pts: Array<Pt>, o: PencilOptions): void => {
    const { seed, color, width = 2, alpha = 1, closed = false, amp = 1.1, passes = 2, taper = true } = o
    if (pts.length < 2) return
    const q = wobble(pts, { seed, amp, closed, step: 4 })
    const n = q.length
    c.save()
    c.strokeStyle = color
    c.lineCap = 'round'
    c.lineJoin = 'round'
    for (let i = 1; i < n + (closed ? 1 : 0); i++) {
        const a = q[i - 1]
        const b = q[i % n]
        const u = i / n
        const press = taper && !closed ? 0.35 + 0.65 * Math.sin(Math.PI * clamp(u, 0, 1)) : 1
        const tooth = hash(i, seed)
        if (tooth < 0.05) continue
        c.globalAlpha = alpha * (0.72 + tooth * 0.28)
        c.lineWidth = width * press
        c.beginPath()
        c.moveTo(a[0], a[1])
        c.lineTo(b[0], b[1])
        c.stroke()
    }
    if (passes === 2) {
        const r = wobble(pts, { seed: seed + 17, amp: amp * 1.3, closed, step: 5 })
        c.globalAlpha = alpha * 0.32
        c.lineWidth = Math.max(0.6, width * 0.45)
        c.beginPath()
        r.forEach((p, i) => (i ? c.lineTo(p[0] + 0.8, p[1] - 0.6) : c.moveTo(p[0] + 0.8, p[1] - 0.6)))
        if (closed) c.closePath()
        c.stroke()
    }
    c.restore()
}

export const ellipsePts = (cx: number, cy: number, rx: number, ry: number, from = 0, to = TAU, n = 40): Array<Pt> => {
    const out: Array<Pt> = []
    for (let i = 0; i <= n; i++) {
        const a = lerp(from, to, i / n)
        out.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry])
    }
    return out
}

export const polyPath = (pts: Array<Pt>, close = true): Path2D => {
    const p = new Path2D()
    pts.forEach((q, i) => (i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1])))
    if (close) p.closePath()
    return p
}

interface HatchOptions {
    seed: number
    color: string
    angle?: number
    gap?: number
    len?: number
    alpha?: number
    width?: number
    /** 0..1 at a point: whether a stroke exists there (tone) */
    tone?: (x: number, y: number) => number
}

/** Short strokes clipped to a shape; one path, stable per seed. */
export const hatch = (c: CanvasRenderingContext2D, clip: Path2D, box: [number, number, number, number], o: HatchOptions): void => {
    const { seed, color, angle = -0.95, gap = 5, len = 11, alpha = 0.5, width = 1, tone } = o
    const r = rng(seed)
    const [bx, by, bw, bh] = box
    const cx = bx + bw / 2
    const cy = by + bh / 2
    const R = Math.hypot(bw, bh) / 2
    const ca = Math.cos(angle)
    const sa = Math.sin(angle)
    c.save()
    c.clip(clip)
    c.strokeStyle = color
    c.globalAlpha = alpha
    c.lineWidth = width
    c.lineCap = 'round'
    c.beginPath()
    for (let v = -R; v <= R; v += gap) {
        for (let u = -R; u <= R; u += len * 1.6) {
            const uu = u + (r() - 0.5) * len * 0.8
            const x0 = cx + ca * uu - sa * v + (r() - 0.5) * 2
            const y0 = cy + sa * uu + ca * v + (r() - 0.5) * 2
            const L = len * (0.55 + r() * 0.7)
            if (tone && r() > tone(x0, y0)) continue
            c.moveTo(x0, y0)
            c.lineTo(x0 + ca * L, y0 + sa * L)
        }
    }
    c.stroke()
    c.restore()
}

interface DotOptions {
    seed: number
    color: string
    cell?: number
    density?: number | ((x: number, y: number) => number)
    angle?: number
    alpha?: number
}

/** A riso halftone clipped to a shape. */
export const dots = (c: CanvasRenderingContext2D, clip: Path2D, box: [number, number, number, number], o: DotOptions): void => {
    const { seed, color, cell = 5, density = 0.5, angle = 0.26, alpha = 1 } = o
    const r = rng(seed)
    const dens = typeof density === 'function' ? density : () => density
    const [bx, by, bw, bh] = box
    const cx = bx + bw / 2
    const cy = by + bh / 2
    const R = Math.hypot(bw, bh) / 2
    const ca = Math.cos(angle)
    const sa = Math.sin(angle)
    c.save()
    c.clip(clip)
    c.fillStyle = color
    c.globalAlpha = alpha
    c.beginPath()
    for (let v = -R; v <= R; v += cell) {
        for (let u = -R; u <= R; u += cell) {
            const x = cx + ca * u - sa * v + (r() - 0.5) * cell * 0.15
            const y = cy + sa * u + ca * v + (r() - 0.5) * cell * 0.15
            const d = clamp(dens(x, y), 0, 1)
            if (d <= 0.02) continue
            const rad = cell * 0.6 * Math.sqrt(d)
            c.moveTo(x + rad, y)
            c.arc(x, y, rad, 0, TAU)
        }
    }
    c.fill()
    c.restore()
}

/** Handwritten lettering in the page's hand font. */
export const letter = (
    c: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    { size = 20, color, family, align = 'left', alpha = 1, rotate = 0 }: { size?: number; color: string; family: string; align?: CanvasTextAlign; alpha?: number; rotate?: number }
): void => {
    c.save()
    c.translate(x, y)
    c.rotate(rotate)
    c.font = `${size}px ${family}`
    c.textAlign = align
    c.textBaseline = 'middle'
    c.fillStyle = color
    c.globalAlpha = alpha
    c.fillText(text, 0, 0)
    c.restore()
}

/** Held drawings: which of `n` redraws is on screen, changing every `hold` frames. */
export const variant = (frame: number, n = 3, hold = 2): number => Math.floor(frame / hold) % n

export const ease = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export const noise = noise1
