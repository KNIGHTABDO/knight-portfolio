import type { Pt } from '@/lib/sketch'
import type { Ink } from '@/lib/pencil'
import type { DoodleDraw } from '@/components/sketch/doodle'

import { TAU, clamp, hash, lerp } from '@/lib/sketch'

import {
    dots,
    ease,
    ellipsePts,
    hatch,
    letter,
    pencil,
    polyPath,
    variant
} from '@/lib/pencil'

/*
 * Every doodle is a pure function of (frame, active): the drawings are
 * authored once, poses come from time snapped to the doodle's 12 fps, and
 * while hovered the marks boil between three held redraws.
 */

type C = CanvasRenderingContext2D

const rectPts = (x: number, y: number, w: number, h: number): Array<Pt> => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]

const box = (c: C, x: number, y: number, w: number, h: number, seed: number, color: string, width = 2) => {
    pencil(c, [[x - 3, y], [x + w + 4, y + 0.5]], { seed, color, width })
    pencil(c, [[x + w, y - 3], [x + w + 0.5, y + h + 3]], { seed: seed + 1, color, width })
    pencil(c, [[x + w + 3, y + h], [x - 4, y + h - 0.5]], { seed: seed + 2, color, width })
    pencil(c, [[x, y + h + 3], [x - 0.5, y - 4]], { seed: seed + 3, color, width })
}

/** Illegible handwriting: rows of little arches. */
const squiggle = (c: C, x: number, y: number, w: number, rows: number, seed: number, color: string, gap = 12, width = 1.2) => {
    for (let r = 0; r < rows; r++) {
        const pts: Array<Pt> = []
        const end = x + w * (r === rows - 1 ? 0.55 : 0.92 + hash(r, seed) * 0.08)
        let px = x
        let k = 0
        while (px < end) {
            pts.push([px, y + r * gap - (k % 2 ? 3.5 + hash(k, seed + r) * 2 : 0)])
            px += 4 + hash(k + 50, seed) * 3
            k++
        }
        if (pts.length > 1) pencil(c, pts, { seed: seed + r * 13, color, width, passes: 1, amp: 0.4 })
    }
}

const shade = (c: C, pts: Array<Pt>, seed: number, ink: Ink, alpha = 0.45, angle = -0.95, gap = 5) => {
    const xs = pts.map((p) => p[0])
    const ys = pts.map((p) => p[1])
    const bx: [number, number, number, number] = [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)]
    hatch(c, polyPath(pts), bx, { seed, color: ink.graphite, alpha, angle, gap, len: 10, width: 1 })
}

const screen = (c: C, pts: Array<Pt>, seed: number, color: string, density = 0.5, cell = 5, dx = 4, dy = -3) => {
    const shifted = pts.map(([x, y]) => [x + dx, y + dy] as Pt)
    const xs = shifted.map((p) => p[0])
    const ys = shifted.map((p) => p[1])
    dots(c, polyPath(shifted), [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)], { seed, color, density, cell })
}

const boilSeed = (base: number, frame: number, active: boolean) => base + (active ? variant(frame) * 1000 : 0)

/* ---------------- ZeroQCM: a QCM sheet being answered ---------------- */
export const qcmDoodle: DoodleDraw = (c, { t, frame, active, ink }) => {
    const s = boilSeed(10, frame, active)
    const g = ink.graphite
    // a stack of sheets
    c.save()
    c.translate(200, 152)
    c.rotate(-0.05)
    for (let k = 2; k >= 1; k--) {
        c.fillStyle = ink.card
        c.fillRect(-130 + k * 9, -118 + k * 7, 250, 236)
        box(c, -130 + k * 9, -118 + k * 7, 250, 236, s + k * 40, ink.faint, 1.3)
    }
    c.fillStyle = ink.card
    c.fillRect(-130, -118, 250, 236)
    box(c, -130, -118, 250, 236, s, g, 2)
    letter(c, 'QCM · cardiologie', -112, -92, { size: 21, color: g, family: ink.hand })
    squiggle(c, -112, -66, 150, 1, s + 3, ink.faint, 12, 1)
    const answers = [1, 3, 0, 2]
    const cycle = 4.8
    const progress = active ? (t % cycle) / 1.05 : 2.4
    for (let r = 0; r < 4; r++) {
        const y = -36 + r * 42
        letter(c, `${r + 1}.`, -112, y, { size: 19, color: ink.soft, family: ink.hand })
        for (let k = 0; k < 4; k++) {
            const x = -64 + k * 46
            pencil(c, ellipsePts(x, y, 13, 12, -1.9, -1.9 + TAU * 1.04, 22), { seed: s + r * 10 + k, color: g, width: 1.4, passes: 1, amp: 0.5 })
            letter(c, 'ABCD'[k], x, y + 1, { size: 15, color: ink.faint, family: ink.hand, align: 'center' })
            if (k !== answers[r]) continue
            const done = clamp(progress - r, 0, 1)
            if (done <= 0) continue
            if (done > 0.25) dots(c, polyPath(ellipsePts(x + 2, y - 2, 12, 11, 0, TAU, 20)), [x - 12, y - 14, 26, 24], { seed: 70 + r, color: ink.yellow, cell: 4, density: 0.75 })
            const tick: Array<Pt> = [[x - 9, y - 1], [x - 2, y + 8], [x + 16, y - 16]]
            const u = clamp(done / 0.8, 0, 1)
            const partial = u < 0.45 ? [tick[0], [lerp(tick[0][0], tick[1][0], u / 0.45), lerp(tick[0][1], tick[1][1], u / 0.45)] as Pt] : [tick[0], tick[1], [lerp(tick[1][0], tick[2][0], (u - 0.45) / 0.55), lerp(tick[1][1], tick[2][1], (u - 0.45) / 0.55)] as Pt]
            pencil(c, partial, { seed: s + 200 + r, color: ink.pink, width: 3, amp: 0.6 })
        }
    }
    c.restore()
    letter(c, '215k+ questions', 300, 272, { size: 22, color: ink.blue, family: ink.hand, align: 'center', rotate: -0.06 })
}

/* ---------------- FORGE: describe it, strike, an app appears ---------------- */
export const anvilDoodle: DoodleDraw = (c, { t, frame, active, ink }) => {
    const s = boilSeed(20, frame, active)
    const g = ink.graphite
    const cycle = 1.5
    const u = active ? (t % cycle) / cycle : 0.05
    const anvil: Array<Pt> = [[92, 172], [300, 172], [322, 160], [340, 162], [318, 186], [262, 196], [250, 218], [276, 236], [276, 250], [134, 250], [134, 236], [160, 218], [150, 196], [104, 190], [70, 176]]
    screen(c, anvil, 21, ink.blue, 0.42, 5.5)
    pencil(c, anvil, { seed: s, color: g, width: 2.6, closed: true, amp: 0.7 })
    shade(c, [[134, 236], [276, 236], [276, 250], [134, 250]], s + 3, ink, 0.6)
    shade(c, [[150, 196], [262, 196], [250, 218], [160, 218]], s + 4, ink, 0.4)
    pencil(c, [[98, 181], [300, 181]], { seed: s + 5, color: g, width: 1, alpha: 0.5 })
    // the app it forges
    const born = active ? clamp((u - 0.42) / 0.2, 0, 1) : 1
    if (born > 0) {
        const k = ease(born)
        const w = 70 * k
        const h = 46 * k
        const x = 205 - w / 2
        const y = 168 - h
        c.fillStyle = ink.card
        c.fillRect(x, y, w, h)
        box(c, x, y, w, h, s + 9, g, 1.6)
        if (k > 0.6) {
            pencil(c, [[x, y + 11], [x + w, y + 11]], { seed: s + 10, color: g, width: 1.2, passes: 1 })
            for (let i = 0; i < 3; i++) {
                c.fillStyle = [ink.pink, ink.yellow, ink.green][i]
                c.beginPath()
                c.arc(x + 8 + i * 8, y + 5.5, 2.4, 0, TAU)
                c.fill()
            }
            squiggle(c, x + 8, y + 22, w - 18, 2, s + 11, ink.faint, 10, 1)
        }
    }
    // hammer about its grip
    const lift = u < 0.3 ? ease(u / 0.3) : u < 0.4 ? 1 - ease((u - 0.3) / 0.1) : u < 0.5 ? 0.12 * Math.sin(((u - 0.4) / 0.1) * Math.PI) : 0
    const ang = -0.15 - lift * 1.15
    c.save()
    c.translate(345, 118)
    c.rotate(ang)
    const handle: Array<Pt> = [[0, -5], [-96, -7], [-96, 5], [0, 6]]
    pencil(c, handle, { seed: s + 12, color: g, width: 2, closed: true, amp: 0.5 })
    shade(c, handle, s + 13, ink, 0.3, 0, 4)
    const head: Array<Pt> = [[-118, -30], [-86, -30], [-86, 32], [-118, 32]]
    screen(c, head, 22, ink.orange, 0.5, 5, 3, -2)
    pencil(c, head, { seed: s + 14, color: g, width: 2.4, closed: true, amp: 0.5 })
    shade(c, [[-118, 10], [-86, 10], [-86, 32], [-118, 32]], s + 15, ink, 0.55)
    c.restore()
    // sparks on the strike
    if (active && u > 0.38 && u < 0.62) {
        const k = (u - 0.38) / 0.24
        for (let i = 0; i < 9; i++) {
            const a = -Math.PI * (0.1 + (i / 8) * 0.8) + (hash(i, 7) - 0.5) * 0.2
            const r0 = 16 + k * 30
            const r1 = r0 + 14 + hash(i, 8) * 12
            pencil(c, [[222 + Math.cos(a) * r0, 170 + Math.sin(a) * r0], [222 + Math.cos(a) * r1, 170 + Math.sin(a) * r1]], { seed: s + 30 + i, color: i % 2 ? ink.orange : ink.pink, width: 2.2, passes: 1 })
        }
    }
    letter(c, '"a timer for my ward rounds"', 36, 38, { size: 21, color: ink.soft, family: ink.hand, rotate: -0.03 })
    pencil(c, [[150, 52], [178, 88], [196, 112]], { seed: s + 40, color: ink.faint, width: 1.3, passes: 1 })
    pencil(c, [[188, 104], [196, 113], [199, 101]], { seed: s + 41, color: ink.faint, width: 1.3, passes: 1 })
}

/* ---------------- Claudio / fm-radio: a radio that talks back ---------------- */
export const radioDoodle: DoodleDraw = (c, { t, frame, active, ink }) => {
    const s = boilSeed(30, frame, active)
    const g = ink.graphite
    const body = rectPts(70, 110, 230, 140)
    screen(c, body, 31, ink.pink, 0.28, 6)
    pencil(c, body, { seed: s, color: g, width: 2.6, closed: true, amp: 0.8 })
    // antenna
    const sway = Math.sin(t * 2.2) * (active ? 0.08 : 0.02)
    pencil(c, [[250, 110], [250 + Math.sin(sway - 0.5) * 120, 110 - Math.cos(sway - 0.5) * 120]], { seed: s + 1, color: g, width: 2 })
    c.fillStyle = g
    c.beginPath()
    c.arc(250 + Math.sin(sway - 0.5) * 122, 110 - Math.cos(sway - 0.5) * 122, 3.2, 0, TAU)
    c.fill()
    // speaker grille
    const grille = ellipsePts(130, 180, 42, 42, 0, TAU, 36)
    c.fillStyle = ink.card
    c.fill(polyPath(grille))
    dots(c, polyPath(grille), [88, 138, 84, 84], { seed: 33, color: g, cell: 7, density: 0.35, angle: 0 })
    pencil(c, grille, { seed: s + 2, color: g, width: 2, closed: true })
    // dial window
    const dial = rectPts(196, 140, 84, 36)
    c.fillStyle = ink.card
    c.fill(polyPath(dial))
    pencil(c, dial, { seed: s + 3, color: g, width: 1.6, closed: true })
    for (let i = 0; i <= 8; i++) pencil(c, [[202 + i * 9.5, 148], [202 + i * 9.5, i % 2 ? 153 : 157]], { seed: s + 10 + i, color: ink.soft, width: 1, passes: 1, taper: false })
    const needle = 214 + (active ? ((Math.sin(t * 0.9) + 1) / 2) * 50 : 36)
    pencil(c, [[needle, 143], [needle, 173]], { seed: s + 4, color: ink.pink, width: 2.2, passes: 1 })
    letter(c, 'FM 88.4', 238, 196, { size: 18, color: ink.soft, family: ink.hand, align: 'center' })
    for (let k = 0; k < 2; k++) {
        pencil(c, ellipsePts(218 + k * 40, 226, 10, 10, 0, TAU, 20), { seed: s + 20 + k, color: g, width: 1.6, closed: true, passes: 1 })
    }
    // feet
    pencil(c, [[92, 250], [88, 262]], { seed: s + 5, color: g, width: 2.2 })
    pencil(c, [[278, 250], [282, 262]], { seed: s + 6, color: g, width: 2.2 })
    // the DJ talks: arcs leave the grille in turn
    const beat = active ? (t * 1.6) % 1 : 0.62
    for (let k = 0; k < 3; k++) {
        const r = 58 + k * 18 + beat * 18
        const a = 1 - clamp(((r - 58) / 72), 0, 1)
        if (a <= 0.05) continue
        pencil(c, ellipsePts(130, 180, r, r, Math.PI * 1.05, Math.PI * 1.42, 14), { seed: s + 40 + k, color: ink.blue, width: 2.4, alpha: a, passes: 1 })
    }
    // notes drift up on twos
    for (let k = 0; k < 2; k++) {
        const p = active ? (t * 0.5 + k * 0.5) % 1 : 0.3 + k * 0.35
        const x = 44 + k * 26 + Math.sin(p * 6 + k) * 8
        const y = 120 - p * 80
        c.save()
        c.globalAlpha = 1 - p
        c.fillStyle = g
        c.beginPath()
        c.ellipse(x, y, 5.5, 4.2, -0.4, 0, TAU)
        c.fill()
        c.restore()
        pencil(c, [[x + 5, y - 1], [x + 5, y - 24], [x + 13, y - 18]], { seed: s + 60 + k, color: g, width: 1.6, alpha: 1 - p, passes: 1 })
    }
    letter(c, '"good evening, this is Claudio"', 150, 36, { size: 20, color: ink.soft, family: ink.hand, align: 'center', rotate: -0.02 })
}

/* ---------------- Huroof: the hex board fills with two teams ---------------- */
const LETTERS = 'ح ر و ف ع ب د ك ن ق ص م ل ج ط س ي ه ش ت'.split(' ')

export const hexDoodle: DoodleDraw = (c, { t, frame, active, ink }) => {
    const s = boilSeed(40, frame, active)
    const R = 29
    const w = Math.sqrt(3) * R
    const claimed = active ? Math.floor(t * 2.4) % 22 : 7
    const order = [6, 11, 2, 14, 8, 17, 0, 12, 5, 19, 9, 3, 15, 1, 18, 7, 13, 4, 16, 10, 20, 21]
    let n = 0
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 5; col++) {
            const id = row * 5 + col
            const cx = 70 + col * w + (row % 2 ? w / 2 : 0)
            const cy = 62 + row * R * 1.5
            const hexPts: Array<Pt> = Array.from({ length: 6 }, (_, i) => {
                const a = (Math.PI / 3) * i + Math.PI / 6
                return [cx + Math.cos(a) * (R - 2), cy + Math.sin(a) * (R - 2)] as Pt
            })
            const rank = order.indexOf(id)
            if (rank >= 0 && rank < claimed) {
                const team = hash(id, 3) > 0.5
                dots(c, polyPath(hexPts), [cx - R, cy - R, R * 2, R * 2], { seed: 44 + id, color: team ? ink.pink : ink.blue, cell: 4.6, density: 0.62 })
            }
            pencil(c, hexPts, { seed: s + id, color: ink.graphite, width: 1.7, closed: true, amp: 0.5, passes: 1 })
            letter(c, LETTERS[n % LETTERS.length], cx, cy + 2, { size: 25, color: ink.graphite, family: ink.arabic, align: 'center' })
            n++
        }
    }
    letter(c, 'حروف مع عبدو', 330, 268, { size: 30, color: ink.pink, family: ink.arabic, align: 'center', rotate: -0.05 })
    letter(c, 'team pink vs team blue', 96, 272, { size: 19, color: ink.soft, family: ink.hand, align: 'center', rotate: 0.02 })
}

/* ---------------- ReLearn: notes lift off the page as lessons ---------------- */
export const bookDoodle: DoodleDraw = (c, { t, frame, active, ink }) => {
    const s = boilSeed(50, frame, active)
    const g = ink.graphite
    const left: Array<Pt> = [[200, 214], [150, 202], [88, 206], [60, 216], [60, 272], [96, 262], [150, 262], [200, 276]]
    const right: Array<Pt> = [[200, 214], [250, 202], [312, 206], [340, 216], [340, 272], [304, 262], [250, 262], [200, 276]]
    for (const [pts, k] of [[left, 0], [right, 1]] as Array<[Array<Pt>, number]>) {
        c.fillStyle = ink.card
        c.fill(polyPath(pts))
        pencil(c, pts, { seed: s + k, color: g, width: 2.2, closed: true, amp: 0.6 })
    }
    squiggle(c, 80, 226, 104, 3, s + 5, ink.faint, 11, 1)
    squiggle(c, 218, 226, 104, 3, s + 6, ink.faint, 11, 1)
    pencil(c, [[200, 214], [200, 276]], { seed: s + 7, color: g, width: 1.4 })
    // three cards rise, turning into questions
    for (let k = 0; k < 3; k++) {
        const p = active ? ((t * 0.42 + k / 3) % 1) : [0.25, 0.55, 0.85][k]
        const x = lerp(140 + k * 60, 90 + k * 110, p)
        const y = lerp(206, 40, ease(p))
        const rot = (k - 1) * 0.25 * p + Math.sin(p * 5 + k) * 0.08
        const alpha = p > 0.85 ? (1 - p) / 0.15 : 1
        c.save()
        c.globalAlpha = alpha
        c.translate(x, y)
        c.rotate(rot)
        const card = rectPts(-30, -20, 60, 40)
        c.fillStyle = ink.card
        c.fill(polyPath(card))
        screen(c, card, 52 + k, [ink.yellow, ink.pink, ink.blue][k], 0.35, 4.5, 2, -2)
        pencil(c, card, { seed: s + 20 + k, color: g, width: 1.7, closed: true, amp: 0.4 })
        letter(c, ['?', '✓', 'Q'][k], 0, 1, { size: 24, color: g, family: ink.hand, align: 'center' })
        c.restore()
    }
    letter(c, 'PDF → lesson', 330, 150, { size: 21, color: ink.blue, family: ink.hand, align: 'center', rotate: 0.05 })
}

/* ---------------- Serve: a quiet conversation, typing ---------------- */
export const chatDoodle: DoodleDraw = (c, { t, frame, active, ink }) => {
    const s = boilSeed(60, frame, active)
    const g = ink.graphite
    // moon and a few stars: it is late
    pencil(c, ellipsePts(330, 52, 22, 22, Math.PI * 0.42, Math.PI * 1.58, 20), { seed: s + 90, color: g, width: 1.8, passes: 1 })
    pencil(c, ellipsePts(339, 52, 17, 18, Math.PI * 0.5, Math.PI * 1.5, 18), { seed: s + 89, color: g, width: 1.4, passes: 1 })
    for (let k = 0; k < 4; k++) {
        const x = 250 + hash(k, 5) * 130
        const y = 20 + hash(k, 6) * 60
        pencil(c, [[x - 5, y], [x + 5, y]], { seed: s + 91 + k, color: ink.soft, width: 1.2, passes: 1, taper: false })
        pencil(c, [[x, y - 5], [x, y + 5]], { seed: s + 95 + k, color: ink.soft, width: 1.2, passes: 1, taper: false })
    }
    const a: Array<Pt> = [[40, 92], [210, 88], [214, 144], [96, 148], [70, 170], [74, 146], [42, 144]]
    c.fillStyle = ink.card
    c.fill(polyPath(a))
    pencil(c, a, { seed: s, color: g, width: 2.2, closed: true, amp: 0.7 })
    squiggle(c, 58, 110, 136, 2, s + 3, ink.soft, 16, 1.3)
    const b: Array<Pt> = [[166, 180], [350, 176], [354, 236], [330, 238], [340, 262], [306, 238], [168, 240]]
    screen(c, b, 61, ink.blue, 0.36, 5, 4, -3)
    pencil(c, b, { seed: s + 1, color: g, width: 2.2, closed: true, amp: 0.7 })
    const cycle = 3.2
    const u = active ? (t % cycle) / cycle : 0.8
    if (u < 0.55) {
        for (let k = 0; k < 3; k++) {
            const bob = active ? Math.max(0, Math.sin((t * 6 - k * 0.9) % TAU)) * 6 : 0
            c.fillStyle = g
            c.beginPath()
            c.arc(236 + k * 20, 208 - bob, 4.2, 0, TAU)
            c.fill()
        }
    } else {
        squiggle(c, 184, 198, 150, 3, s + 4, g, 13, 1.3)
    }
    letter(c, 'no feeds. just talk.', 110, 262, { size: 20, color: ink.soft, family: ink.hand, align: 'center', rotate: -0.03 })
}

/* ---------------- The clinic: a heart that keeps time ---------------- */
export const heartDoodle: DoodleDraw = (c, { t, frame, ink }) => {
    const s = 70 + variant(frame, 3, 4) * 100
    const g = ink.graphite
    const beat = t % 1.1
    const k = beat < 0.1 ? 1 - 0.08 * Math.sin((beat / 0.1) * Math.PI) : beat < 0.28 ? 1 - 0.05 * Math.sin(((beat - 0.1) / 0.18) * Math.PI) : 1
    c.save()
    c.translate(150, 150)
    c.scale(k, k)
    c.translate(-150, -150)
    const heart: Array<Pt> = [[120, 92], [92, 96], [70, 124], [72, 168], [100, 214], [150, 262], [186, 232], [214, 190], [228, 148], [216, 110], [190, 90], [160, 96], [146, 112]]
    screen(c, heart, 71, ink.pink, 0.55, 5.5, 5, -4)
    pencil(c, heart, { seed: s, color: g, width: 2.6, closed: true, amp: 1 })
    // aorta and pulmonary trunk
    pencil(c, [[150, 108], [148, 70], [160, 44], [196, 40], [214, 60], [212, 92]], { seed: s + 1, color: g, width: 2.4 })
    pencil(c, [[166, 104], [166, 72], [178, 58], [196, 60], [200, 78], [198, 96]], { seed: s + 2, color: g, width: 1.8 })
    for (let i = 0; i < 3; i++) pencil(c, [[166 + i * 16, 46 - i * 2], [164 + i * 18, 22 - i * 3]], { seed: s + 3 + i, color: g, width: 1.8 })
    pencil(c, [[128, 100], [112, 64], [86, 52]], { seed: s + 7, color: g, width: 2 })
    // interventricular groove and a little shadow
    pencil(c, [[176, 116], [160, 166], [150, 220], [152, 252]], { seed: s + 8, color: g, width: 1.4, alpha: 0.7 })
    shade(c, [[72, 150], [110, 150], [132, 210], [150, 258], [100, 214], [72, 168]], s + 9, ink, 0.5)
    c.restore()
    // ECG under it
    const pts: Array<Pt> = []
    for (let x = 20; x <= 280; x += 2) {
        const u = ((x - 20 - (t % 1.1) * 0) % 130) - 65
        const y = 282 - 26 * Math.exp(-(u * u) / 8) + 7 * Math.exp(-((u - 4) ** 2) / 6) - 5 * Math.exp(-((u - 28) ** 2) / 60)
        pts.push([x, y])
    }
    pencil(c, pts, { seed: 77, color: ink.pink, width: 2, passes: 1, amp: 0.3 })
}

/* ---------------- The workshop: a laptop, code typing itself ---------------- */
export const laptopDoodle: DoodleDraw = (c, { t, frame, ink }) => {
    const s = 80 + variant(frame, 3, 4) * 100
    const g = ink.graphite
    const lid: Array<Pt> = [[60, 40], [240, 40], [240, 170], [60, 170]]
    c.fillStyle = ink.night ? ink.paper : '#2a2622'
    c.fill(polyPath(lid))
    pencil(c, lid, { seed: s, color: g, width: 2.4, closed: true, amp: 0.6 })
    const base: Array<Pt> = [[40, 176], [260, 176], [284, 200], [16, 200]]
    c.fillStyle = ink.card
    c.fill(polyPath(base))
    pencil(c, base, { seed: s + 1, color: g, width: 2.4, closed: true, amp: 0.6 })
    shade(c, base, s + 2, ink, 0.35, -0.2, 4)
    // code lines appear on twos, then the screen clears
    const lines = [[0, 60, ink.pink], [1, 90, ink.card], [1, 40, ink.yellow], [2, 70, ink.card], [1, 54, ink.blue], [0, 30, ink.card], [0, 80, ink.pink]] as Array<[number, number, string]>
    const shown = Math.floor(t * 3) % (lines.length + 4)
    lines.forEach(([indent, w, col], i) => {
        if (i >= shown) return
        const y = 58 + i * 15
        pencil(c, [[76 + indent * 14, y], [76 + indent * 14 + w, y]], { seed: s + 10 + i, color: col, width: 3, passes: 1, amp: 0.3, taper: false })
    })
    const cy = 58 + Math.min(shown, lines.length - 1) * 15
    if (Math.floor(t * 2) % 2 === 0) {
        c.fillStyle = ink.card
        c.fillRect(78 + (shown < lines.length ? 0 : 60), cy - 6, 8, 12)
    }
    letter(c, '02:14', 262, 30, { size: 22, color: ink.blue, family: ink.hand, align: 'center', rotate: 0.08 })
}

/* ---------------- Contact: a paper plane on a loop ---------------- */
export const planeDoodle: DoodleDraw = (c, { t, frame, ink }) => {
    const s = 90 + variant(frame, 3, 3) * 100
    const path = (u: number): Pt => [200 + Math.sin(u * TAU) * 150, 100 + Math.sin(u * TAU * 2) * 44]
    const u = (t * 0.16) % 1
    // dotted trail
    c.fillStyle = ink.blue
    for (let k = 1; k < 26; k++) {
        const p = path(u - k * 0.012)
        c.globalAlpha = 1 - k / 26
        c.beginPath()
        c.arc(p[0], p[1], 2, 0, TAU)
        c.fill()
    }
    c.globalAlpha = 1
    const p = path(u)
    const q = path(u + 0.004)
    const a = Math.atan2(q[1] - p[1], q[0] - p[0])
    c.save()
    c.translate(p[0], p[1])
    c.rotate(a)
    const wing: Array<Pt> = [[26, 0], [-22, -16], [-12, 0]]
    const fold: Array<Pt> = [[26, 0], [-12, 0], [-20, 12]]
    c.fillStyle = ink.card
    c.fill(polyPath(wing))
    c.fill(polyPath(fold))
    screen(c, fold, 91, ink.yellow, 0.6, 3.6, 1, -1)
    pencil(c, wing, { seed: s, color: ink.graphite, width: 1.8, closed: true, amp: 0.3, passes: 1 })
    pencil(c, fold, { seed: s + 1, color: ink.graphite, width: 1.8, closed: true, amp: 0.3, passes: 1 })
    c.restore()
}
