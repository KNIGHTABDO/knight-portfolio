import type { CSSProperties, ElementType, ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { useReveal } from '@/hooks/use-interactions'

interface RevealProps {
    children: ReactNode
    className?: string
    delay?: number
    scale?: boolean
    as?: ElementType
    style?: CSSProperties
}

export const Reveal = ({
    children,
    className,
    delay = 0,
    scale = false,
    as,
    style
}: RevealProps) => {
    const Tag = (as ?? 'div') as ElementType
    const { ref, visible } = useReveal<HTMLDivElement>()

    return (
        <Tag
            ref={ref}
            className={cn('reveal', scale && 'reveal-scale', visible && 'is-visible', className)}
            style={{ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties}
        >
            {children}
        </Tag>
    )
}
