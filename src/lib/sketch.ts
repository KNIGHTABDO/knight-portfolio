/**
 * Hand-drawn marks for the page. A small TypeScript port of the seeded
 * primitives in the hand-drawn-canvas-animation skill (MIT, see film/):
 * everything is a pure function of its seed, so a mark never swims between
 * renders. "Boil" is made from a few fixed redraws, never from time.
 */

export type Pt = [number, number]

export const TAU = Math.PI * 2

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

export const clamp = (x: number, a: number, b: number): number => Math.max(a, Math.min(b, x))

/** One integer to a 0..1 float, no state. */
export const hash = (k: number, seed = 0): number => {
    let a = (Math.imul(k | 0, 0x9e3779b1) + Math.imul((seed * 4096) | 0, 0x85ebca77)) | 0
    a ^= a >>> 15
    a = Math.imul(a, 0x2c1b3c6d)
    a ^= a >>> 12
    a = Math.imul(a, 0x297a2d39)
    a ^= a >>> 15
    return (a >>> 0) / 4294967296
}

/** Seeded generator (mulberry-style). */
export const rng = (seed: number): (() => number) => {
    let a = (seed * 1000003) >>> 0
    return () => {
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

/** Smooth 1D value noise in -1..1. */
export const noise1 = (x: number, seed = 1): number => {
    const i = Math.floor(x)
    const f = x - i
    const u = f * f * (3 - 2 * f)
    return lerp(hash(i, seed) * 2 - 1, hash(i + 1, seed) * 2 - 1, u)
}

/** Stable seed from a string id. */
export const seedOf = (id: string): number => {
    let n = 2166136261
    for (let i = 0; i < id.length; i++) n = Math.imul(n ^ id.charCodeAt(i), 16777619)
    return (n >>> 0) % 100000
}

/** Subdivide a polyline so a wobble has somewhere to live. */
export const resample = (pts: Array<Pt>, step = 6, closed = false): Array<Pt> => {
    const out: Array<Pt> = []
    const n = pts.length
    const segs = closed ? n : n - 1
    for (let i = 0; i < segs; i++) {
        const a = pts[i]
        const b = pts[(i + 1) % n]
        const m = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
        for (let k = 0; k < m; k++) out.push([lerp(a[0], b[0], k / m), lerp(a[1], b[1], k / m)])
    }
    if (!closed) out.push([...pts[n - 1]] as Pt)
    return out
}

interface WobbleOptions {
    seed: number
    amp?: number
    freq?: number
    step?: number
    closed?: boolean
    /** keep the endpoints on their authored positions */
    pin?: boolean
}

/** A hand wanders along the stroke: a slow coherent offset along the normal. */
export const wobble = (pts: Array<Pt>, { seed, amp = 1.4, freq = 1, step = 6, closed = false, pin = false }: WobbleOptions): Array<Pt> => {
    const q = resample(pts, step, closed)
    const n = q.length
    const s = [0]
    for (let i = 1; i < n; i++) s.push(s[i - 1] + Math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1]))
    const L = s[n - 1] || 1
    const sc = freq / 70
    return q.map((p, i) => {
        const a = q[i > 0 ? i - 1 : closed ? n - 1 : 0]
        const b = q[i < n - 1 ? i + 1 : closed ? 0 : n - 1]
        let nx = a[1] - b[1]
        let ny = b[0] - a[0]
        const l = Math.hypot(nx, ny) || 1
        nx /= l
        ny /= l
        const env = pin ? Math.sin((s[i] / L) * Math.PI) : 1
        const d = amp * env * (0.65 * noise1(s[i] * sc + seed * 0.37, seed) + 0.35 * noise1(s[i] * sc * 2.7 + 11, seed + 7))
        return [p[0] + nx * d, p[1] + ny * d] as Pt
    })
}

const fmt = (v: number) => (Math.round(v * 10) / 10).toString()

/** Catmull-Rom through the points as SVG cubic segments. */
export const curve = (pts: Array<Pt>, closed = false): string => {
    const n = pts.length
    if (n < 2) return ''
    const P = (i: number): Pt => (closed ? pts[((i % n) + n) % n] : pts[clamp(i, 0, n - 1)])
    let d = `M${fmt(pts[0][0])} ${fmt(pts[0][1])}`
    const segs = closed ? n : n - 1
    for (let i = 0; i < segs; i++) {
        const p0 = P(i - 1)
        const p1 = P(i)
        const p2 = P(i + 1)
        const p3 = P(i + 2)
        const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
        const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
        d += `C${fmt(c1[0])} ${fmt(c1[1])} ${fmt(c2[0])} ${fmt(c2[1])} ${fmt(p2[0])} ${fmt(p2[1])}`
    }
    return closed ? `${d}Z` : d
}

/** A pencil line between two points that overshoots a little at both ends. */
export const roughLine = (a: Pt, b: Pt, seed: number, amp = 1.2, overshoot = 4): string => {
    const r = rng(seed)
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    const ux = (b[0] - a[0]) / len
    const uy = (b[1] - a[1]) / len
    const o1 = overshoot * (0.3 + r())
    const o2 = overshoot * (0.3 + r())
    const start: Pt = [a[0] - ux * o1 + (r() - 0.5) * 2, a[1] - uy * o1 + (r() - 0.5) * 2]
    const end: Pt = [b[0] + ux * o2 + (r() - 0.5) * 2, b[1] + uy * o2 + (r() - 0.5) * 2]
    return curve(wobble([start, end], { seed, amp, step: 10, pin: true }))
}

/** A box drawn as four separate strokes that cross at the corners. */
export const roughRect = (w: number, h: number, seed: number, { inset = 3, amp = 1.3, overshoot = 7 } = {}): string => {
    const x0 = inset
    const y0 = inset
    const x1 = w - inset
    const y1 = h - inset
    const r = rng(seed)
    const j = () => (r() - 0.5) * 2.4
    return [
        roughLine([x0 + j(), y0 + j()], [x1 + j(), y0 + j()], seed + 1, amp, overshoot),
        roughLine([x1 + j(), y0 + j()], [x1 + j(), y1 + j()], seed + 2, amp, overshoot * 0.6),
        roughLine([x1 + j(), y1 + j()], [x0 + j(), y1 + j()], seed + 3, amp, overshoot),
        roughLine([x0 + j(), y1 + j()], [x0 + j(), y0 + j()], seed + 4, amp, overshoot * 0.6)
    ].join(' ')
}

/** The loop you draw around a word: a bit more than one turn, never closed. */
export const roughEllipse = (w: number, h: number, seed: number, { turns = 1.12, amp = 2.2, pad = 4 } = {}): string => {
    const r = rng(seed)
    const cx = w / 2
    const cy = h / 2
    const rx = w / 2 - pad
    const ry = h / 2 - pad
    const start = -Math.PI * (0.62 + r() * 0.2)
    const n = 64
    const pts: Array<Pt> = []
    for (let i = 0; i <= n * turns; i++) {
        const a = start + (i / n) * TAU
        const grow = 1 + (i / (n * turns)) * 0.06 * (r() > 0.5 ? 1 : -1)
        pts.push([cx + Math.cos(a) * rx * grow, cy + Math.sin(a) * ry * grow])
    }
    return curve(wobble(pts, { seed, amp, step: 8, freq: 1.3 }))
}

/** Underline: a single confident swipe, a double, or a scribbled zig-zag. */
export const roughUnderline = (w: number, h: number, seed: number, kind: 'single' | 'double' | 'zigzag' = 'single'): string => {
    const r = rng(seed)
    const y = h * 0.55
    if (kind === 'zigzag') {
        const pts: Array<Pt> = []
        const steps = Math.max(4, Math.round(w / 16))
        for (let i = 0; i <= steps; i++) pts.push([(i / steps) * w, y + (i % 2 ? -h * 0.3 : h * 0.3) + (r() - 0.5) * 2])
        return curve(wobble(pts, { seed, amp: 0.8, step: 5 }))
    }
    const lift = (r() - 0.5) * h * 0.5
    const one = curve(wobble([[2, y + lift], [w * 0.5, y - h * 0.12], [w - 2, y - lift * 0.4]], { seed, amp: 1.2, step: 8 }))
    if (kind === 'single') return one
    const two = curve(wobble([[w * 0.08, y + h * 0.32], [w * 0.55, y + h * 0.2], [w * 0.94, y + h * 0.28]], { seed: seed + 9, amp: 1, step: 8 }))
    return `${one} ${two}`
}

/** A hand-drawn arrow: bent shaft plus two short head strokes. */
export const roughArrow = (from: Pt, to: Pt, seed: number, bend = 0.25): { shaft: string; head: string } => {
    const r = rng(seed)
    const mx = (from[0] + to[0]) / 2
    const my = (from[1] + to[1]) / 2
    const dx = to[0] - from[0]
    const dy = to[1] - from[1]
    const mid: Pt = [mx - dy * bend, my + dx * bend]
    const shaftPts = wobble([from, mid, to], { seed, amp: 1.3, step: 8, pin: true })
    const end = shaftPts[shaftPts.length - 1]
    const prev = shaftPts[Math.max(0, shaftPts.length - 5)]
    const ang = Math.atan2(end[1] - prev[1], end[0] - prev[0])
    const hl = 13 + r() * 4
    const h1: Pt = [end[0] - Math.cos(ang - 0.5) * hl, end[1] - Math.sin(ang - 0.5) * hl]
    const h2: Pt = [end[0] - Math.cos(ang + 0.45) * hl * 0.9, end[1] - Math.sin(ang + 0.45) * hl * 0.9]
    return {
        shaft: curve(shaftPts),
        head: `${curve(wobble([h1, end], { seed: seed + 3, amp: 0.5, step: 5 }))} ${curve(wobble([end, h2], { seed: seed + 4, amp: 0.5, step: 5 }))}`
    }
}

/** Short parallel hatch strokes filling a rectangle (for SVG tone). */
export const hatchRect = (w: number, h: number, seed: number, { gap = 6, angle = -0.9, len = 14 } = {}): string => {
    const r = rng(seed)
    const ca = Math.cos(angle)
    const sa = Math.sin(angle)
    const R = Math.hypot(w, h) / 2
    const cx = w / 2
    const cy = h / 2
    let d = ''
    for (let v = -R; v <= R; v += gap) {
        for (let u = -R; u <= R; u += len * 1.5) {
            const uu = u + (r() - 0.5) * len * 0.6
            const x0 = cx + ca * uu - sa * v
            const y0 = cy + sa * uu + ca * v
            const L = len * (0.6 + r() * 0.6)
            const x1 = x0 + ca * L
            const y1 = y0 + sa * L
            if (x0 < 0 || x0 > w || y0 < 0 || y0 > h || x1 < 0 || x1 > w || y1 < 0 || y1 > h) continue
            d += `M${fmt(x0)} ${fmt(y0)}L${fmt(x1)} ${fmt(y1)}`
        }
    }
    return d
}
