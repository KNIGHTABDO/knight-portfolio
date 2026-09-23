import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Cut = 'wide' | 'square'

const SRC: Record<Cut, { mp4: string; webm: string; poster: string }> = {
    wide: { mp4: '/film/knights-move-wide.mp4', webm: '/film/knights-move-wide.webm', poster: '/film/knights-move-wide-poster.jpg' },
    square: { mp4: '/film/knights-move-square.mp4', webm: '/film/knights-move-square.webm', poster: '/film/knights-move-square-poster.jpg' }
}

interface HeroFilmProps {
    className?: string
}

/**
 * "The Knight's Move": an 8 s pencil loop drawn on white. The page
 * multiplies it onto its own paper (screen + invert at night), so the film
 * has no edges. Phones get the square cut; reduced motion keeps the poster.
 */
const HeroFilm = ({ className }: HeroFilmProps) => {
    const [cut, setCut] = useState<Cut | null>(null)
    const [playing, setPlaying] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const narrow = window.matchMedia('(max-width: 640px)')
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
        const pick = () => setCut(reduced.matches ? null : narrow.matches ? 'square' : 'wide')
        pick()
        narrow.addEventListener('change', pick)
        reduced.addEventListener('change', pick)
        return () => {
            narrow.removeEventListener('change', pick)
            reduced.removeEventListener('change', pick)
        }
    }, [])

    useEffect(() => {
        const v = videoRef.current
        if (!v) return
        setPlaying(false)
        v.play().catch(() => setPlaying(false))
        // pause when off screen: the page should not spend battery on a hidden loop
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) v.play().catch(() => {})
            else v.pause()
        })
        io.observe(v)
        return () => io.disconnect()
    }, [cut])

    return (
        <div aria-hidden='true' className={cn('pointer-events-none relative mx-auto w-full max-w-[1920px] select-none', className)}>
            <picture>
                <source media='(max-width: 640px)' srcSet={SRC.square.poster} />
                <img
                    src={SRC.wide.poster}
                    alt=''
                    width={1920}
                    height={1080}
                    fetchPriority='high'
                    className={cn('film aspect-square w-full transition-opacity duration-300 sm:aspect-video', playing && 'opacity-0')}
                />
            </picture>
            {cut && (
                <video
                    key={cut}
                    ref={videoRef}
                    className={cn('film absolute inset-0 h-full w-full transition-opacity duration-300', playing ? 'opacity-100' : 'opacity-0')}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload='auto'
                    disablePictureInPicture
                    onPlaying={() => setPlaying(true)}
                >
                    {/* H.264 first (Safari, Chrome, Edge); VP9 for browsers built without it */}
                    <source src={SRC[cut].mp4} type='video/mp4; codecs="avc1.640028"' />
                    <source src={SRC[cut].webm} type='video/webm; codecs="vp9"' />
                </video>
            )}
        </div>
    )
}

export default HeroFilm
