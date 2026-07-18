import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Sparkles, ArrowRight, Github, BookOpen, PenTool } from 'lucide-react'

import type { GithubOverview } from '@/types/github'
import { GITHUB } from '@/constants/github'
import { compactNumber } from '@/lib/format'
import { Container } from '@/components/generals/section'
import { sound } from '@/lib/sound'
import { cn } from '@/lib/utils'

const useTypewriter = (words: Array<string>) => {
    const [text, setText] = useState(words[0] ?? '')
    const [index, setIndex] = useState(0)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setText(words[index % words.length])
            return
        }

        const current = words[index % words.length]
        const done = !deleting && text === current
        const cleared = deleting && text === ''

        const delay = done ? 2000 : cleared ? 300 : deleting ? 50 : 100

        const timer = setTimeout(() => {
            if (done) {
                setDeleting(true)
                return
            }
            if (cleared) {
                setDeleting(false)
                setIndex((i) => (i + 1) % words.length)
                return
            }
            setText(current.slice(0, deleting ? text.length - 1 : text.length + 1))
        }, delay)

        return () => clearTimeout(timer)
    }, [text, deleting, index, words])

    return text
}

interface HeroProps {
    overview: GithubOverview
}

export const Hero = ({ overview }: HeroProps) => {
    const { profile, stats } = overview
    const typed = useTypewriter(['scholar', 'artificer', 'night builder', 'system thinker'])
    const [activePath, setActivePath] = useState<'all' | 'clinic' | 'workshop'>('all')

    useEffect(() => {
        const updatePath = () => {
            const savedPath = localStorage.getItem('knight-path') as 'all' | 'clinic' | 'workshop' | null
            if (savedPath) setActivePath(savedPath)
        }
        updatePath()
        window.addEventListener('knight-path-change', updatePath as any)
        return () => window.removeEventListener('knight-path-change', updatePath as any)
    }, [])

    const handleSelectPath = (path: 'clinic' | 'workshop') => {
        localStorage.setItem('knight-path', path)
        document.documentElement.setAttribute('data-path', path)
        setActivePath(path)
        
        if (sound) {
            if (path === 'clinic') sound.playHeartbeat()
            else sound.playRelayClick()
        }

        window.dispatchEvent(new CustomEvent('knight-path-change', { detail: path }))
        
        // Scroll to about section
        const aboutEl = document.getElementById('about')
        if (aboutEl) {
            aboutEl.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <header id='hero' className='relative min-h-screen flex items-center overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 bg-bg'>
            
            {/* The Pixel Art Golden Tree Background */}
            <div className='absolute right-0 top-0 bottom-0 w-full md:w-[60%] lg:w-[50%] z-0 pointer-events-none opacity-45 md:opacity-90 overflow-hidden'>
                <div className='relative w-full h-full scale-[1.06] translate-y-[-2%]'>
                    <Image
                        src='/bg-tree.gif'
                        alt='Golden Tree at Night'
                        fill
                        priority
                        unoptimized
                        className='object-cover object-center select-none'
                        style={{
                            imageRendering: 'pixelated'
                        }}
                    />
                </div>
                {/* Scrim gradients to ease the image into the abyss background */}
                <div className='absolute inset-0 bg-gradient-to-r from-bg via-bg/40 to-transparent' />
                <div className='absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/50' />
            </div>

            <Container className='relative z-10 w-full'>
                <div className='grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]'>
                    <div className='flex flex-col items-start gap-6 max-w-2xl'>
                        {/* Header Location Tag */}
                        <div className='flex items-center gap-2 font-pixel text-[10px] text-accent tracking-[0.25em] fade-up'>
                            <span>MOROCCO</span>
                            <span className='text-tarnished'>//</span>
                            <span>FMPC</span>
                            <span className='text-tarnished'>//</span>
                            <span className='text-ink-secondary'>NIGHT WATCH</span>
                        </div>

                        {/* Title Wordmark with letter gathering delay */}
                        <div className='fade-up' style={{ animationDelay: '100ms' }}>
                            <h1 className='font-display text-5xl font-light tracking-[0.25em] text-ink sm:text-7xl lg:text-8xl select-none'>
                                KNIGHT
                            </h1>
                        </div>

                        {/* Rethemed Typewriter */}
                        <p className='fade-up flex min-h-[1.75rem] items-center font-mono text-base text-ink-secondary sm:text-lg'
                           style={{ animationDelay: '200ms' }}>
                            <span className='text-accent mr-1.5'>~/</span>
                            <span>the observer is a</span>
                            <span className='text-accent font-semibold ml-1.5'>{typed}</span>
                            <span className='gx-caret' />
                        </p>

                        {/* Narrative duality statement */}
                        <p className='fade-up text-lg leading-relaxed text-ink-secondary sm:text-xl font-display'
                           style={{ animationDelay: '300ms' }}>
                            I study the <span className='text-ink border-b border-lake-blue/45 font-medium'>body by day</span>.<br />
                            At night, I forge <span className='text-accent border-b border-accent/45 font-semibold'>autonomous code</span> that learns, remembers, and speaks.
                        </p>

                        <p className='fade-up max-w-lg text-sm leading-relaxed text-ink-tertiary font-sans'
                           style={{ animationDelay: '400ms' }}>
                            Second-year medical student in Casablanca, Morocco. Vibe coding clinical toolkits for peers and stress-testing LLMs. {profile.publicRepos} public experiments streaming live.
                        </p>

                        {/* Sigils: Choice of two paths */}
                        <div className='fade-up flex flex-wrap gap-4 w-full pt-2'
                             style={{ animationDelay: '500ms' }}>
                            
                            <button
                                onClick={() => handleSelectPath('clinic')}
                                className={cn(
                                    'flex-1 min-w-[170px] flex items-center justify-between p-4 border rounded-[var(--radius-glass-md)] transition-all text-left bg-bg-raised/40 hover:bg-bg-raised/75 group',
                                    activePath === 'clinic' ? 'border-accent shadow-[0_0_12px_rgba(246,198,78,0.2)]' : 'border-border'
                                )}
                            >
                                <div>
                                    <span className='font-pixel text-[8px] tracking-widest text-ink-tertiary block mb-1'>PATHWAY I</span>
                                    <span className='font-display text-sm font-bold text-ink group-hover:text-accent transition-colors'>Enter the Clinic</span>
                                    <span className='text-[10px] text-ink-secondary block mt-0.5'>Med-tech & Education</span>
                                </div>
                                <BookOpen className='size-5 text-accent opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all' />
                            </button>

                            <button
                                onClick={() => handleSelectPath('workshop')}
                                className={cn(
                                    'flex-1 min-w-[170px] flex items-center justify-between p-4 border rounded-[var(--radius-glass-md)] transition-all text-left bg-bg-raised/40 hover:bg-bg-raised/75 group',
                                    activePath === 'workshop' ? 'border-accent shadow-[0_0_12px_rgba(246,198,78,0.2)]' : 'border-border'
                                )}
                            >
                                <div>
                                    <span className='font-pixel text-[8px] tracking-widest text-ink-tertiary block mb-1'>PATHWAY II</span>
                                    <span className='font-display text-sm font-bold text-ink group-hover:text-accent transition-colors'>Enter the Workshop</span>
                                    <span className='text-[10px] text-ink-secondary block mt-0.5'>AI Agents & Forge Tools</span>
                                </div>
                                <PenTool className='size-5 text-accent opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all' />
                            </button>
                        </div>

                        {/* Primary Buttons */}
                        <div className='fade-up flex flex-wrap items-center gap-3 pt-2'
                             style={{ animationDelay: '600ms' }}>
                            <a href='#about' onClick={() => sound?.playTick()} className='gx-btn gx-btn-primary bg-gradient-to-b from-accent to-accent-hover text-accent-ink border border-tarnished/30'>
                                Open the Codex
                                <ArrowRight className='size-4 group-hover:translate-x-1 transition-transform' />
                            </a>
                            <a href={GITHUB.profileUrl} target='_blank' rel='noreferrer' onClick={() => sound?.playTick()} className='gx-btn gx-btn-secondary border-border/60 text-ink bg-bg-raised/45 hover:border-accent'>
                                <Github className='size-4' />
                                @{GITHUB.username}
                            </a>
                        </div>
                    </div>

                    <div className='fade-up flex flex-col justify-end lg:items-end gap-3 font-mono text-[11px] text-ink-tertiary pointer-events-none'
                         style={{ animationDelay: '700ms' }}>
                        <div className='bg-bg-raised/60 backdrop-blur-sm border border-border/40 p-4 rounded-[var(--radius-glass-md)] max-w-[280px] w-full self-center lg:self-end'>
                            <span className='font-display text-[10px] italic font-semibold text-accent block mb-2.5'>Almanac Ledger</span>
                            
                            <div className='space-y-1.5'>
                                <div className='flex justify-between'>
                                    <span>Repositories:</span>
                                    <span className='font-bold text-ink'>{profile.publicRepos}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Stars Received:</span>
                                    <span className='font-bold text-ink'>{compactNumber(stats.totalStars)}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Followers:</span>
                                    <span className='font-bold text-ink'>{profile.followers}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Location:</span>
                                    <span className='font-bold text-ink'>{profile.location || 'Casablanca'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </header>
    )
}
export default Hero
