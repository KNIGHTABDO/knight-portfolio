import { Github, Heart } from 'lucide-react'

import { GITHUB } from '@/constants/github'
import { NAV_ITEMS } from '@/constants/nav'
import { Container } from '@/components/generals/section'
import { ThemeToggle } from '@/components/generals/theme-toggle'

export const SiteFooter = () => {
    const year = new Date().getFullYear()

    return (
        <footer className='mt-8 border-t border-[var(--border)] py-12'>
            <Container>
                <div className='flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between'>
                    <div className='max-w-sm'>
                        <a href='#hero' className='flex items-center gap-2.5'>
                            <span className='grid size-8 place-items-center rounded-[var(--radius-glass-sm)] bg-accent-soft font-display text-base font-extrabold text-accent'>
                                K
                            </span>
                            <span className='font-display text-sm font-bold tracking-[0.22em] text-ink'>KNIGHT</span>
                        </a>
                        <p className='mt-4 text-sm leading-relaxed text-ink-secondary'>
                            A living portfolio, assembled from live GitHub data. Built with Next.js and a
                            liquid-glass design system, from a med-school desk in Morocco.
                        </p>
                    </div>

                    <nav aria-label='Footer' className='grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-1'>
                        <span className='mb-1 text-xs font-semibold uppercase tracking-wider text-ink-tertiary'>
                            Sections
                        </span>
                        {NAV_ITEMS.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className='text-sm text-ink-secondary transition-colors hover:text-accent'
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className='flex flex-col items-start gap-4'>
                        <span className='text-xs font-semibold uppercase tracking-wider text-ink-tertiary'>
                            Elsewhere
                        </span>
                        <a
                            href={GITHUB.profileUrl}
                            target='_blank'
                            rel='noreferrer'
                            className='gx-btn gx-btn-secondary gx-btn-sm'
                        >
                            <Github className='size-4' />
                            @{GITHUB.username}
                        </a>
                        <ThemeToggle />
                    </div>
                </div>

                <div className='mt-10 flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] pt-6 text-xs text-ink-tertiary sm:flex-row'>
                    <p>© {year} KNIGHT. Data fetched live from the GitHub public API.</p>
                    <p className='flex items-center gap-1.5'>
                        Made with <Heart className='size-3.5 text-accent' fill='currentColor' /> and too many LLMs
                    </p>
                </div>
            </Container>
        </footer>
    )
}
