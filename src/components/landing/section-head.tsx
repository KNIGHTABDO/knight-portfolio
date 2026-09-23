import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import Reveal from '@/components/sketch/reveal'

interface SectionHeadProps {
    index: string
    kicker: string
    title: ReactNode
    aside?: ReactNode
    className?: string
    id?: string
}

/** "§ 02 — kicker", a big display title, and a pencilled aside. */
const SectionHead = ({ index, kicker, title, aside, className, id }: SectionHeadProps) => (
    <Reveal className={cn('max-w-4xl', className)}>
        <p className='font-mono text-[0.7rem] uppercase tracking-[0.22em] text-graphite-faint'>
            § {index} — {kicker}
        </p>
        <h2 id={id} className='mt-4 font-display text-[clamp(2.5rem,5.4vw,4.9rem)] leading-[0.96] tracking-[-0.01em] text-graphite'>
            {title}
        </h2>
        {aside && <div className='mt-3 font-hand text-2xl text-blue sm:text-[1.7rem]'>{aside}</div>}
    </Reveal>
)

export default SectionHead
