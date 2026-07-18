import type { CSSProperties } from 'react'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
    ArrowDown,
    ArrowUpRight,
    Github,
    Sparkles,
    Star
} from 'lucide-react'

import type { GithubOverview } from '@/types/github'

import { GITHUB, IDENTITIES } from '@/constants/github'
import { compactNumber } from '@/lib/format'
import { Container } from '@/components/generals/section'

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

        const delay = done ? 1600 : cleared ? 260 : deleting ? 45 : 75

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

const StatTile = ({ label, value }: { label: string; value: string }) => (
    <div className='gx-card-tint flex flex-col gap-0.5 rounded-[var(--radius-glass-md)] px-4 py-3'>
        <span className='font-display text-xl font-bold text-ink sm:text-2xl'>{value}</span>
        <span className='text-xs font-medium uppercase tracking-wider text-ink-tertiary'>{label}</span>
    </div>
)

interface HeroProps {
    overview: GithubOverview
}

export const Hero = ({ overview }: HeroProps) => {
    const typed = useTypewriter(IDENTITIES)
    const { profile, stats } = overview

    return (
        <header id='hero' className='relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24'>
            {/* animated glow field */}
            <div aria-hidden='true' className='absolute inset-0 -z-10'>
                <div
                    className='gx-blob anim-drift-a left-[6%] top-[12%] size-64 sm:size-80'
                    style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 55%, transparent), transparent 70%)' } as CSSProperties}
                />
                <div
                    className='gx-blob anim-drift-b right-[8%] top-[30%] size-72 sm:size-96'
                    style={{ background: 'radial-gradient(circle, rgba(96,160,220,0.4), transparent 70%)' } as CSSProperties}
                />
            </div>

            <Container>
                <div className='grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]'>
                    <div className='flex flex-col items-start gap-6'>
                        <span className='gx-chip gx-chip-accent fade-up'>
                            <span className='gx-live-dot' />
                            <span className='font-mono text-[11px]'>Open source · {profile.publicRepos} repos</span>
                        </span>

                        <div className='fade-up' style={{ animationDelay: '60ms' } as CSSProperties}>
                            <p className='mb-2 font-mono text-sm text-ink-secondary'>
                                {'>'} whoami
                            </p>
                            <h1 className='gx-gradient-text font-display text-[19vw] font-extrabold leading-[0.86] tracking-tight sm:text-[8rem] lg:text-[9.5rem]'>
                                KNIGHT
                            </h1>
                        </div>

                        <p
                            className='fade-up flex min-h-[1.75rem] items-center font-mono text-lg text-ink sm:text-xl'
                            style={{ animationDelay: '120ms' } as CSSProperties}
                        >
                            <span className='text-accent'>~/</span>
                            <span className='ml-1'>{typed}</span>
                            <span className='gx-caret' />
                        </p>

                        <p
                            className='fade-up max-w-xl text-base leading-relaxed text-ink-secondary sm:text-lg'
                            style={{ animationDelay: '160ms' } as CSSProperties}
                        >
                            A 2nd-year medical student in Morocco who vibe-codes between lectures —
                            shipping AI agents, med-tech for fellow students, and Arabic-first apps,
                            while stress-testing every LLM I can get my hands on.
                        </p>

                        <div
                            className='fade-up flex flex-wrap items-center gap-3'
                            style={{ animationDelay: '220ms' } as CSSProperties}
                        >
                            <a href='#arsenal' className='gx-btn gx-btn-primary'>
                                <Sparkles className='size-4' />
                                Explore the arsenal
                            </a>
                            <a href={GITHUB.profileUrl} target='_blank' rel='noreferrer' className='gx-btn gx-btn-secondary'>
                                <Github className='size-4' />
                                @{GITHUB.username}
                            </a>
                        </div>

                        <div
                            className='fade-up grid w-full grid-cols-2 gap-3 pt-2 sm:max-w-lg sm:grid-cols-4'
                            style={{ animationDelay: '280ms' } as CSSProperties}
                        >
                            <StatTile label='Repos' value={String(profile.publicRepos)} />
                            <StatTile label='Stars' value={compactNumber(stats.totalStars)} />
                            <StatTile label='Followers' value={String(profile.followers)} />
                            <StatTile label='Top lang' value={stats.topLanguage ?? '—'} />
                        </div>
                    </div>

                    {/* Avatar card */}
                    <div className='fade-up flex justify-center lg:justify-end' style={{ animationDelay: '160ms' } as CSSProperties}>
                        <AvatarCard overview={overview} />
                    </div>
                </div>

                <a
                    href='#about'
                    className='mt-16 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-ink-tertiary transition-colors hover:text-accent'
                >
                    <ArrowDown className='size-4 animate-bounce' />
                    Scroll to explore
                </a>
            </Container>
        </header>
    )
}

const AvatarCard = ({ overview }: { overview: GithubOverview }) => {
    const { profile, stats } = overview
    const langs = stats.languages.slice(0, 4)

    return (
        <div className='relative w-full max-w-sm'>
            <div
                aria-hidden='true'
                className='anim-spin-slow absolute -inset-4 -z-10 rounded-[var(--radius-glass-xl)] opacity-40'
                style={{ background: 'conic-gradient(from 0deg, transparent, var(--accent), transparent 60%)', filter: 'blur(26px)' } as CSSProperties}
            />
            <div className='gx-card anim-float overflow-hidden p-5'>
                <div className='flex items-center gap-4'>
                    <div className='relative shrink-0'>
                        <div className='overflow-hidden rounded-[var(--radius-glass-lg)] ring-1 ring-[var(--glass-border)]'>
                            <Image
                                src={profile.avatarUrl}
                                alt={`${profile.name}'s GitHub avatar`}
                                width={88}
                                height={88}
                                priority
                                className='size-[88px] object-cover'
                            />
                        </div>
                        <span className='absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full border border-[var(--glass-border)] bg-accent text-accent-ink shadow'>
                            <Star className='size-3.5' fill='currentColor' />
                        </span>
                    </div>
                    <div className='min-w-0'>
                        <p className='font-display text-lg font-bold text-ink'>{profile.name}</p>
                        <p className='truncate font-mono text-sm text-ink-secondary'>@{profile.login}</p>
                        <p className='mt-1 text-sm text-ink-tertiary'>{profile.bio}</p>
                    </div>
                </div>

                <div className='mt-5 space-y-2'>
                    {langs.map((lang) => (
                        <div key={lang.name} className='flex items-center gap-3'>
                            <span className='w-24 shrink-0 truncate text-xs font-medium text-ink-secondary'>{lang.name}</span>
                            <div className='h-2 flex-1 overflow-hidden rounded-full bg-[var(--bg-hover)]'>
                                <div
                                    className='h-full rounded-full'
                                    style={{ width: `${Math.max(8, lang.percent)}%`, background: lang.color } as CSSProperties}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className='mt-5 flex items-center justify-between rounded-[var(--radius-glass-md)] bg-[var(--bg-hover)] px-4 py-2.5'>
                    <span className='font-mono text-xs text-ink-tertiary'>{profile.location ?? 'Morocco'} 🇲🇦</span>
                    <a
                        href={GITHUB.profileUrl}
                        target='_blank'
                        rel='noreferrer'
                        className='flex items-center gap-1 text-xs font-semibold text-accent hover:underline'
                    >
                        Profile <ArrowUpRight className='size-3.5' />
                    </a>
                </div>
            </div>
        </div>
    )
}
