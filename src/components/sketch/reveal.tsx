import type { CSSProperties, ElementType, ReactNode } from 'react'

import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/use-in-view'

interface RevealProps {
    children: ReactNode
    as?: ElementType
    className?: string
    delay?: number
    tilt?: number
    id?: string
}

/** Puts its children down on twos when they scroll into view. */
const Reveal = ({ children, as: Tag = 'div', className, delay = 0, tilt = 0, id }: RevealProps) => {
    const ref = useRef<HTMLElement>(null)
    const inView = useInView(ref)

    return (
        <Tag
            ref={ref}
            id={id}
            data-inview={inView}
            className={cn('reveal', className)}
            style={{ '--reveal-delay': `${delay}ms`, '--tilt': `${tilt}deg` } as CSSProperties}
        >
            {children}
        </Tag>
    )
}

export default Reveal
