import type { CSSProperties } from 'react'

import {
    BookMarked,
    GitFork,
    RefreshCw,
    Star,
    Trophy,
    Users,
    Zap
} from 'lucide-react'

import type { ContribData, GithubOverview } from '@/types/github'

import { ACHIEVEMENTS } from '@/constants/github'
import { compactNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Section, SectionHeading } from '@/components/generals/section'
import { Reveal } from '@/components/generals/reveal'
import { CountUp } from '@/components/generals/count-up'
import { ContributionHeatmap } from '@/components/portfolio/contribution-heatmap'

interface StatsProps {
    overview: GithubOverview
    contributions: ContribData | null
    contributionsLoading: boolean
    refreshing: boolean
    onRefresh: () => void
}

const ACH_ICONS = [Zap, Users, Trophy]

export const Stats = ({
    overview,
    contributions,
    contributionsLoading,
    refreshing,
    onRefresh
}: StatsProps) => {
    const { profile, stats, source } = overview

    const cards = [
        { icon: BookMarked, label: 'Public repos', value: profile.publicRepos, compact: false },
        { icon: Star, label: 'Total stars', value: stats.totalStars, compact: true },
        { icon: Users, label: 'Followers', value: profile.followers, compact: false },
        { icon: GitFork, label: 'Original builds', value: stats.originalRepos, compact: false }
    ]

    const shown = stats.languages.slice(0, 8)
    const shownPercent = shown.reduce((sum, l) => sum + l.percent, 0)
    const otherPercent = Math.max(0, 100 - shownPercent)

    return (
        <Section id='stats' size='wide'>
            <div className='flex flex-wrap items-end justify-between gap-4'>
                <SectionHeading
                    eyebrow='By the numbers'
                    title='A live read on the build'
                    description='Everything here is pulled straight from the GitHub API and refreshed in your browser.'
                />
                <div className='flex items-center gap-3'>
                    <span className='gx-chip'>
                        <span className={cn('gx-live-dot', source === 'seed' && 'opacity-40')} />
                        <span className='font-mono text-[11px]'>
                            {source === 'seed' ? 'snapshot' : 'live from GitHub'}
                        </span>
                    </span>
                    <button
                        type='button'
                        onClick={onRefresh}
                        className='gx-btn gx-btn-secondary gx-btn-icon'
                        aria-label='Refresh GitHub data'
                    >
                        <RefreshCw className={cn('size-4', refreshing && 'anim-spin-slow')} />
                    </button>
                </div>
            </div>

            {/* Big counters */}
            <div className='mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4'>
                {cards.map((card, i) => (
                    <Reveal key={card.label} delay={i * 70}>
                        <div className='gx-card gx-card-hover flex h-full flex-col gap-3 p-5'>
                            <span className='grid size-10 place-items-center rounded-[var(--radius-glass-sm)] bg-accent-soft text-accent'>
                                <card.icon className='size-5' />
                            </span>
                            <CountUp
                                value={card.value}
                                compact={card.compact}
                                className='font-display text-3xl font-extrabold text-ink sm:text-4xl'
                            />
                            <span className='text-sm font-medium text-ink-secondary'>{card.label}</span>
                        </div>
                    </Reveal>
                ))}
            </div>

            <div className='mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]'>
                {/* Achievements */}
                <Reveal>
                    <div className='gx-card flex h-full flex-col gap-4 p-5 sm:p-6'>
                        <h3 className='font-display text-lg font-bold text-ink'>GitHub achievements</h3>
                        <div className='flex flex-col gap-3'>
                            {ACHIEVEMENTS.map((ach, i) => {
                                const Icon = ACH_ICONS[i % ACH_ICONS.length]
                                return (
                                    <div
                                        key={ach.name}
                                        className='flex items-center gap-3 rounded-[var(--radius-glass-md)] bg-[var(--bg-hover)] px-4 py-3'
                                    >
                                        <span className='grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent'>
                                            <Icon className='size-4' />
                                        </span>
                                        <div className='min-w-0 flex-1'>
                                            <p className='font-semibold text-ink'>
                                                {ach.name}
                                                {ach.tier && <span className='ml-1.5 text-accent'>{ach.tier}</span>}
                                            </p>
                                            <p className='truncate text-xs text-ink-tertiary'>{ach.blurb}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </Reveal>

                {/* Language spectrum */}
                <Reveal delay={80}>
                    <div className='gx-card flex h-full flex-col gap-5 p-5 sm:p-6'>
                        <div className='flex items-center justify-between'>
                            <h3 className='font-display text-lg font-bold text-ink'>Language spectrum</h3>
                            <span className='font-mono text-xs text-ink-tertiary'>
                                {stats.languages.length} languages
                            </span>
                        </div>

                        <div className='flex h-4 w-full overflow-hidden rounded-full ring-1 ring-[var(--glass-border)]'>
                            {shown.map((lang) => (
                                <div
                                    key={lang.name}
                                    style={{ width: `${lang.percent}%`, background: lang.color } as CSSProperties}
                                    title={`${lang.name} · ${lang.percent}%`}
                                />
                            ))}
                            {otherPercent > 0 && (
                                <div style={{ width: `${otherPercent}%`, background: 'var(--ink-tertiary)' } as CSSProperties} />
                            )}
                        </div>

                        <div className='grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3'>
                            {shown.map((lang) => (
                                <div key={lang.name} className='flex items-center gap-2'>
                                    <span className='size-2.5 shrink-0 rounded-full' style={{ background: lang.color } as CSSProperties} />
                                    <span className='truncate text-sm text-ink-secondary'>{lang.name}</span>
                                    <span className='ml-auto font-mono text-xs text-ink-tertiary'>{lang.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </div>

            <Reveal className='mt-6'>
                <ContributionHeatmap data={contributions} loading={contributionsLoading} />
            </Reveal>
        </Section>
    )
}
