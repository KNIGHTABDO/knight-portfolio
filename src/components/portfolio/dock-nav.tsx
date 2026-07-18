import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Github, Menu, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { NAV_ITEMS, NAV_IDS } from '@/constants/nav'
import { GITHUB } from '@/constants/github'
import { useScrollSpy } from '@/hooks/use-interactions'
import { sound } from '@/lib/sound'

export const DockNav = () => {
    const active = useScrollSpy(NAV_IDS)
    const [open, setOpen] = useState(false)
    const toggleRef = useRef<HTMLButtonElement | null>(null)
    
    const [isMuted, setIsMuted] = useState(false)
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    const [currentPath, setCurrentPath] = useState<'all' | 'clinic' | 'workshop'>('all')
    const [crestClicks, setCrestClicks] = useState(0)

    // Read initial path and sound state
    useEffect(() => {
        if (sound) {
            setIsMuted(sound.getMuteStatus())
        }
        const savedPath = localStorage.getItem('knight-path') as 'all' | 'clinic' | 'workshop' | null
        if (savedPath) {
            setCurrentPath(savedPath)
            document.documentElement.setAttribute('data-path', savedPath)
        }
    }, [])

    const handleSoundToggle = () => {
        if (sound) {
            const nextMutedStatus = sound.toggleMute()
            setIsMuted(nextMutedStatus)
            if (!nextMutedStatus) {
                sound.playDulcimer()
            }
        }
    }

    const handlePathToggle = (path: 'all' | 'clinic' | 'workshop') => {
        setCurrentPath(path)
        localStorage.setItem('knight-path', path)
        document.documentElement.setAttribute('data-path', path)
        
        // Play path-specific feedback
        if (sound) {
            if (path === 'clinic') {
                sound.playHeartbeat()
            } else if (path === 'workshop') {
                sound.playRelayClick()
            } else {
                sound.playTick()
            }
        }

        // Trigger custom event for other components to re-render
        window.dispatchEvent(new CustomEvent('knight-path-change', { detail: path }))
    }

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
        if (sound) sound.playPageOpen()

        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = ''
        }
    }, [open])

    const playNavTick = () => {
        if (sound) sound.playTick()
    }

    const handleCrestClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (sound) sound.playTick()
        const nextClicks = crestClicks + 1
        setCrestClicks(nextClicks)
        if (nextClicks >= 3) {
            setCrestClicks(0)
            window.dispatchEvent(new CustomEvent('knight-open-console'))
        }
    }

    return (
        <div className='pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4'>
            {/* Desktop Chapter Ribbon */}
            <nav
                aria-label='Primary'
                className='pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-4 py-2.5 pl-5 pr-3 bg-bg-raised/85 backdrop-blur-md border border-border/40 rounded-[var(--radius-glass-md)] shadow-md transition-all duration-300'
                style={{
                    boxShadow: 'inset 0 1px 0 rgba(246, 198, 78, 0.05), var(--shadow-md)'
                }}
            >
                {/* Crest */}
                <a
                    href='#hero'
                    onClick={handleCrestClick}
                    className='group flex items-center gap-3 rounded-full'
                    aria-label='Back to top'
                >
                    <span className='grid size-8 place-items-center rounded-[var(--radius-glass-sm)] bg-accent-soft font-pixel text-xs font-bold text-accent border border-accent/20 group-hover:scale-105 transition-transform duration-300'>
                        K
                    </span>
                    <span className='hidden font-display text-sm font-bold tracking-[0.25em] text-ink group-hover:text-accent transition-colors duration-300 sm:block'>
                        KNIGHT
                    </span>
                </a>

                {/* Chapter List */}
                <ul className='hidden items-center gap-2 md:flex'>
                    {NAV_ITEMS.map((item) => {
                        const isActive = active === item.id
                        const isHovered = hoveredItem === item.id

                        return (
                            <li key={item.id} className='relative'>
                                <a
                                    href={`#${item.id}`}
                                    aria-current={isActive ? 'true' : undefined}
                                    onClick={playNavTick}
                                    onMouseEnter={() => {
                                        setHoveredItem(item.id)
                                        if (sound) sound.playTick()
                                    }}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    className={cn(
                                        'flex h-9 items-center rounded-md px-3 font-display text-xs tracking-wider transition-all duration-150 relative z-10 uppercase',
                                        isActive
                                            ? 'text-accent font-semibold'
                                            : 'text-ink-secondary hover:text-ink'
                                    )}
                                >
                                    <span>{item.plain}</span>
                                </a>

                                {/* Chapter Gold Underline */}
                                {isActive && (
                                    <div 
                                        className='absolute bottom-0 inset-x-3 h-[2px] bg-accent' 
                                        style={{
                                            filter: 'drop-shadow(0 0 2px #F6C64E)'
                                        }}
                                    />
                                )}
                            </li>
                        )
                    })}
                </ul>

                {/* Right controls */}
                <div className='flex items-center gap-2.5'>

                    <a
                        href={GITHUB.profileUrl}
                        target='_blank'
                        rel='noreferrer'
                        onClick={playNavTick}
                        className='gx-btn gx-btn-primary gx-btn-sm h-9 border border-tarnished/40 bg-gradient-to-b from-accent to-accent-hover text-accent-ink hidden md:inline-flex'
                    >
                        <Github className='size-4' />
                        GitHub
                    </a>
                    
                    {/* Clasp button for mobile codex */}
                    <button
                        ref={toggleRef}
                        type='button'
                        onClick={() => setOpen((v) => !v)}
                        aria-expanded={open}
                        aria-controls='mobile-menu'
                        aria-label={open ? 'Close Codex' : 'Open Codex'}
                        className='gx-btn gx-btn-secondary gx-btn-icon size-9 border-border/40 md:hidden'
                    >
                        {open ? <X className='size-4' /> : <Menu className='size-4' />}
                    </button>
                </div>
            </nav>

            {/* Mobile Pocket Codex Drawer */}
            {open && (
                <>
                    <button
                        type='button'
                        aria-label='Close Codex'
                        onClick={() => setOpen(false)}
                        className='pointer-events-auto fixed inset-0 z-40 md:hidden bg-bg/80 backdrop-blur-sm'
                    />
                    <div
                        id='mobile-menu'
                        className='pointer-events-auto fixed inset-x-4 top-20 z-50 flex flex-col gap-2 rounded-[var(--radius-glass-xl)] p-5 border border-accent/25 bg-bg-raised max-h-[80vh] overflow-y-auto'
                        style={{
                            animation: 'fade-up var(--dur-base) var(--ease-out) both',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(246, 198, 78, 0.08)'
                        }}
                    >
                        {/* Title page */}
                        <div className='border-b border-border/40 pb-3 mb-2'>
                            <span className='font-pixel text-[9px] text-accent tracking-widest block'>THE NIGHT CODEX</span>
                            <span className='font-display text-lg font-bold text-ink'>Chapters</span>
                        </div>

                        {NAV_ITEMS.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={() => {
                                    setOpen(false)
                                    playNavTick()
                                }}
                                aria-current={active === item.id ? 'true' : undefined}
                                className={cn(
                                    'flex items-center justify-between h-12 rounded-[var(--radius-glass-md)] px-4 transition-colors',
                                    active === item.id
                                        ? 'bg-accent-soft border border-accent/20 text-accent font-semibold'
                                        : 'text-ink-secondary hover:bg-bg-hover hover:text-ink'
                                )}
                            >
                                <span className='font-display text-xs tracking-wider uppercase'>{item.plain}</span>
                            </a>
                        ))}
                        <div className='mt-2 flex flex-col gap-2 border-t border-border/40 pt-4'>
                            <a
                                href={GITHUB.profileUrl}
                                target='_blank'
                                rel='noreferrer'
                                onClick={() => {
                                    setOpen(false)
                                    playNavTick()
                                }}
                                className='gx-btn gx-btn-primary w-full'
                            >
                                <Github className='size-4' />
                                GitHub Profile
                            </a>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
