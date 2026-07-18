import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { Reveal } from '@/components/generals/reveal'

interface ContainerProps {
    children: ReactNode
    className?: string
    size?: 'default' | 'wide' | 'narrow'
}

export const Container = ({ children, className, size = 'default' }: ContainerProps) => (
    <div
        className={cn(
            'mx-auto w-full px-5 sm:px-8',
            size === 'default' && 'max-w-6xl',
            size === 'wide' && 'max-w-7xl',
            size === 'narrow' && 'max-w-3xl',
            className
        )}
    >
        {children}
    </div>
)

interface SectionProps {
    children: ReactNode
    id?: string
    className?: string
    size?: 'default' | 'wide' | 'narrow'
}

export const Section = ({ children, id, className, size = 'default' }: SectionProps) => (
    <section id={id} className={cn('scroll-mt-24 py-16 sm:py-24', className)}>
        <Container size={size}>{children}</Container>
    </section>
)

interface SectionHeadingProps {
    eyebrow?: string
    title: ReactNode
    description?: ReactNode
    align?: 'left' | 'center'
    className?: string
}

export const SectionHeading = ({
    eyebrow,
    title,
    description,
    align = 'left',
    className
}: SectionHeadingProps) => (
    <Reveal
        className={cn(
            'flex flex-col gap-3',
            align === 'center' && 'items-center text-center',
            className
        )}
    >
        {eyebrow && (
            <span className='gx-chip gx-chip-accent w-fit font-mono uppercase tracking-[0.18em]'>
                {eyebrow}
            </span>
        )}
        <h2 className='font-display text-3xl font-bold leading-[1.05] tracking-tight text-ink sm:text-[2.75rem]'>
            {title}
        </h2>
        {description && (
            <p
                className={cn(
                    'max-w-2xl text-base leading-relaxed text-ink-secondary sm:text-lg',
                    align === 'center' && 'mx-auto'
                )}
            >
                {description}
            </p>
        )}
    </Reveal>
)
