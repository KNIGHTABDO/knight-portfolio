import {
    useEffect,
    useRef,
    useState
} from 'react'

const prefersReducedMotion = (): boolean =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Reveal-on-scroll. Adds `is-visible` once the element enters the viewport,
 * then unobserves. Falls back to visible immediately when IO is unavailable.
 */
export const useReveal = <T extends HTMLElement = HTMLDivElement>(
    options: { threshold?: number; rootMargin?: string } = {}
) => {
    const ref = useRef<T | null>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const node = ref.current
        if (!node) return

        if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
            setVisible(true)
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true)
                        observer.unobserve(entry.target)
                    }
                })
            },
            {
                threshold: options.threshold ?? 0.14,
                rootMargin: options.rootMargin ?? '0px 0px -8% 0px'
            }
        )

        observer.observe(node)
        return () => observer.disconnect()
    }, [options.threshold, options.rootMargin])

    return { ref, visible }
}

/** Count from 0 to `end` once the element scrolls into view. */
export const useCountUp = (end: number, duration = 1400) => {
    const ref = useRef<HTMLSpanElement | null>(null)
    const [value, setValue] = useState(0)
    const started = useRef(false)

    useEffect(() => {
        const node = ref.current
        if (!node) return

        const run = () => {
            if (started.current) return
            started.current = true

            if (prefersReducedMotion() || typeof requestAnimationFrame === 'undefined') {
                setValue(end)
                return
            }

            const start = performance.now()
            const tick = (now: number) => {
                const t = Math.min(1, (now - start) / duration)
                const eased = 1 - Math.pow(1 - t, 3)
                setValue(Math.round(end * eased))
                if (t < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
        }

        if (typeof IntersectionObserver === 'undefined') {
            run()
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        run()
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.4 }
        )

        observer.observe(node)
        return () => observer.disconnect()
    }, [end, duration])

    return { ref, value }
}

/** Track which section id is currently active for the dock nav. */
export const useScrollSpy = (ids: Array<string>, offset = 120) => {
    const [active, setActive] = useState<string>(ids[0] ?? '')

    useEffect(() => {
        if (ids.length === 0) return

        const onScroll = () => {
            const scrollY = window.scrollY + offset
            let current = ids[0]

            for (const id of ids) {
                const el = document.getElementById(id)
                if (el && el.offsetTop <= scrollY) current = id
            }

            setActive(current)
        }

        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [ids, offset])

    return active
}

/** Page scroll progress 0..1 for the top progress bar. */
export const useScrollProgress = () => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        let frame = 0
        const onScroll = () => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(() => {
                const scrollable = document.documentElement.scrollHeight - window.innerHeight
                setProgress(scrollable > 0 ? window.scrollY / scrollable : 0)
            })
        }

        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', onScroll)
            cancelAnimationFrame(frame)
        }
    }, [])

    return progress
}

/** Pointer tilt for the hero card. No-op on touch / reduced-motion. */
export const useTilt = <T extends HTMLElement = HTMLDivElement>(max = 8) => {
    const ref = useRef<T | null>(null)

    useEffect(() => {
        const node = ref.current
        if (!node) return

        const fine = window.matchMedia('(pointer: fine)').matches
        if (!fine || prefersReducedMotion()) return

        let frame = 0

        const onMove = (e: PointerEvent) => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(() => {
                const rect = node.getBoundingClientRect()
                const px = (e.clientX - rect.left) / rect.width - 0.5
                const py = (e.clientY - rect.top) / rect.height - 0.5
                node.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`
            })
        }

        const reset = () => {
            cancelAnimationFrame(frame)
            node.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)'
        }

        node.addEventListener('pointermove', onMove)
        node.addEventListener('pointerleave', reset)
        return () => {
            node.removeEventListener('pointermove', onMove)
            node.removeEventListener('pointerleave', reset)
            cancelAnimationFrame(frame)
        }
    }, [max])

    return ref
}

/** SSR-safe media query. */
export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const media = window.matchMedia(query)
        const onChange = () => setMatches(media.matches)
        onChange()
        media.addEventListener('change', onChange)
        return () => media.removeEventListener('change', onChange)
    }, [query])

    return matches
}
