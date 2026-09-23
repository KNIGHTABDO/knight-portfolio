import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

import { NAV } from '@/constants/content'

import Lamp from '@/components/landing/lamp'

/** A sticky strip of index tabs, ruled in pencil once the page moves. */
const TopBar = () => {
    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState(false)
    const [current, setCurrent] = useState<string | null>(null)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        const sections = ['top', ...NAV.map((n) => n.id)].map((id) => document.getElementById(id)).filter(Boolean) as Array<HTMLElement>
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id === 'top' ? null : e.target.id)
            },
            { rootMargin: '-45% 0px -50% 0px' }
        )
        sections.forEach((s) => io.observe(s))
        return () => io.disconnect()
    }, [])

    return (
        <header className={cn('fixed inset-x-0 top-0 z-50 transition-colors duration-300', scrolled ? 'bg-paper/88 backdrop-blur-[2px]' : 'bg-transparent')}>
            <div className='mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:h-18 sm:px-8'>
                <a href='#top' className='group flex items-end gap-2' aria-label='KNIGHT — back to the top'>
                    <img src='/knight/rest.webp' alt='' width={30} height={44} className='h-11 w-auto transition-transform duration-200 group-hover:-translate-y-1 group-hover:rotate-[-6deg]' />
                    <span className='pb-0.5 font-display text-[1.7rem] leading-none tracking-tight'>knight</span>
                    <span className='hidden pb-1 font-hand text-lg leading-none text-graphite-faint sm:inline'>/ abdo</span>
                </a>

                <nav aria-label='Sections' className='hidden items-center gap-1 md:flex'>
                    {NAV.map((n) => (
                        <a
                            key={n.id}
                            href={`#${n.id}`}
                            aria-current={current === n.id ? 'true' : undefined}
                            className={cn('group rounded-sm px-3 py-1 font-hand text-[1.45rem] leading-none transition-colors', current === n.id ? 'text-graphite' : 'text-graphite-soft hover:text-graphite')}
                        >
                            <span className={cn('marker-hover', current === n.id && 'is-on')}>{n.label}</span>
                        </a>
                    ))}
                </nav>

                <div className='flex items-center gap-2'>
                    <Lamp />
                    <button
                        type='button'
                        className='flex size-10 items-center justify-center md:hidden'
                        aria-expanded={open}
                        aria-controls='mobile-nav'
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        onClick={() => setOpen((o) => !o)}
                    >
                        {open ? <X className='size-6' /> : <Menu className='size-6' />}
                    </button>
                </div>
            </div>
            <div className={cn('mx-auto h-px max-w-6xl bg-rule-strong transition-opacity duration-300', scrolled ? 'opacity-100' : 'opacity-0')} />

            {open && (
                <nav id='mobile-nav' aria-label='Sections' className='paper-card mx-4 mt-2 rotate-[-0.6deg] px-6 py-4 md:hidden'>
                    <ul className='flex flex-col'>
                        {NAV.map((n, i) => (
                            <li key={n.id} className='border-b border-dashed border-rule last:border-0'>
                                <a href={`#${n.id}`} onClick={() => setOpen(false)} className='flex items-baseline gap-3 py-2.5 font-hand text-3xl'>
                                    <span className='font-mono text-xs text-graphite-faint'>0{i + 1}</span>
                                    {n.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </header>
    )
}

export default TopBar
