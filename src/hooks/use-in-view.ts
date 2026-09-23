import type { RefObject } from 'react'

import { useEffect, useState } from 'react'

interface InViewOptions {
    once?: boolean
    rootMargin?: string
    threshold?: number
}

/** True while (or once) the element is on screen. SSR and no-IO browsers get true. */
export const useInView = <T extends Element>(ref: RefObject<T | null>, { once = true, rootMargin = '0px 0px -12% 0px', threshold = 0 }: InViewOptions = {}): boolean => {
    const [inView, setInView] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        if (typeof IntersectionObserver === 'undefined') {
            setInView(true)
            return
        }
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true)
                    if (once) io.disconnect()
                } else if (!once) {
                    setInView(false)
                }
            },
            { rootMargin, threshold }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [ref, once, rootMargin, threshold])

    return inView
}

export const useReducedMotion = (): boolean => {
    const [reduced, setReduced] = useState(false)

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)')
        const update = () => setReduced(media.matches)
        update()
        media.addEventListener('change', update)
        return () => media.removeEventListener('change', update)
    }, [])

    return reduced
}
