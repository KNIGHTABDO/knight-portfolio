import type { CSSProperties } from 'react'

import { useEffect, useRef, useState } from 'react'
import { Github, Menu, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { NAV_ITEMS, NAV_IDS } from '@/constants/nav'
import { GITHUB } from '@/constants/github'
import { useScrollSpy } from '@/hooks/use-interactions'
import { ThemeToggle } from '@/components/generals/theme-toggle'

export const DockNav = () => {
    const active = useScrollSpy(NAV_IDS)
    const [open, setOpen] = useState(false)
    const toggleRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        if (!open) return

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false)
                toggleRef.current?.focus()
            }
        }

        document.addEventListener('keydown', onKey)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = ''
        }
    }, [open])

    return (
        <div className='pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4'>
            <nav
                aria-label='Primary'
                className='glass pointer-events-auto flex w-full max-w-4xl items-center justify-between gap-2 rounded-full py-2 pl-3 pr-2'
            >
                <a
                    href='#hero'
                    className='group flex items-center gap-2.5 rounded-full px-1.5 py-1'
                    aria-label='Back to top'
                >
                    <span className='grid size-8 place-items-center rounded-[var(--radius-glass-sm)] bg-accent-soft font-display text-base font-extrabold text-accent'>
                        K
                    </span>
                    <span className='hidden font-display text-sm font-bold tracking-[0.22em] text-ink sm:block'>
                        KNIGHT
                    </span>
                </a>

                <ul className='hidden items-center gap-1 md:flex'>
                    {NAV_ITEMS.map((item) => {
                        const isActive = active === item.id
                        return (
                            <li key={item.id}>
                                <a
                                    href={`#${item.id}`}
                                    aria-current={isActive ? 'true' : undefined}
                                    className={cn(
                                        'flex h-9 items-center rounded-full px-3.5 text-sm font-medium transition-colors duration-150',
                                        isActive
                                            ? 'bg-accent-soft text-accent'
                                            : 'text-ink-secondary hover:bg-[var(--bg-hover)] hover:text-ink'
                                    )}
                                >
                                    {item.label}
                                </a>
                            </li>
                        )
                    })}
                </ul>

                <div className='flex items-center gap-2'>
                    <ThemeToggle className='hidden sm:inline-flex' />
                    <a
                        href={GITHUB.profileUrl}
                        target='_blank'
                        rel='noreferrer'
                        className='gx-btn gx-btn-primary gx-btn-sm hidden md:inline-flex'
                    >
                        <Github className='size-4' />
                        GitHub
                    </a>
                    <button
                        ref={toggleRef}
                        type='button'
                        onClick={() => setOpen((v) => !v)}
                        aria-expanded={open}
                        aria-controls='mobile-menu'
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        className='gx-btn gx-btn-secondary gx-btn-icon md:hidden'
                    >
                        {open ? <X className='size-5' /> : <Menu className='size-5' />}
                    </button>
                </div>
            </nav>

            {/* Mobile drawer */}
            {open && (
                <>
                    <button
                        type='button'
                        aria-label='Close menu'
                        onClick={() => setOpen(false)}
                        className='pointer-events-auto fixed inset-0 z-40 md:hidden'
                        style={{ background: 'var(--scrim)' } as CSSProperties}
                    />
                    <div
                        id='mobile-menu'
                        className='glass-strong pointer-events-auto fixed inset-x-4 top-20 z-50 flex flex-col gap-1 rounded-[var(--radius-glass-xl)] p-4 md:hidden'
                        style={{ animation: 'fade-up var(--dur-base) var(--ease-out) both' } as CSSProperties}
                    >
                        {NAV_ITEMS.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={() => setOpen(false)}
                                aria-current={active === item.id ? 'true' : undefined}
                                className={cn(
                                    'flex h-12 items-center rounded-[var(--radius-glass-md)] px-4 text-base font-medium transition-colors',
                                    active === item.id
                                        ? 'bg-accent-soft text-accent'
                                        : 'text-ink-secondary hover:bg-[var(--bg-hover)] hover:text-ink'
                                )}
                            >
                                {item.label}
                            </a>
                        ))}
                        <div className='mt-2 flex items-center gap-2 border-t border-[var(--border)] pt-3'>
                            <ThemeToggle />
                            <a
                                href={GITHUB.profileUrl}
                                target='_blank'
                                rel='noreferrer'
                                onClick={() => setOpen(false)}
                                className='gx-btn gx-btn-primary flex-1'
                            >
                                <Github className='size-4' />
                                GitHub
                            </a>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
