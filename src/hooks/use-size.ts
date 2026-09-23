import type { RefObject } from 'react'

import { useEffect, useState } from 'react'

/** Border-box size of an element, kept current with ResizeObserver. */
export const useSize = <T extends Element>(ref: RefObject<T | null>): { width: number; height: number } => {
    const [size, setSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const measure = () => {
            const r = el.getBoundingClientRect()
            setSize((s) => (Math.abs(s.width - r.width) < 0.5 && Math.abs(s.height - r.height) < 0.5 ? s : { width: r.width, height: r.height }))
        }
        measure()
        if (typeof ResizeObserver === 'undefined') return
        const ro = new ResizeObserver(measure)
        ro.observe(el)
        return () => ro.disconnect()
    }, [ref])

    return size
}
