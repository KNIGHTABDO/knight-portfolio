import type { CSSProperties } from 'react'
import { BookMarked, GitFork, RefreshCw, Trophy, Users, Zap } from 'lucide-react'

import type { ContribData, GithubOverview } from '@/types/github'
import { ACHIEVEMENTS } from '@/constants/github'
import { compactNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Section, SectionHeading } from '@/components/generals/section'
import { Reveal } from '@/components/generals/reveal'
import { CountUp } from '@/components/generals/count-up'
import { ContributionHeatmap } from '@/components/portfolio/contribution-heatmap'
import { sound } from '@/lib/sound'
import { CornerBrackets } from '@/components/generals/corner-brackets'

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
        { label: 'Spells in Almanac', value: profile.publicRepos, compact: false },
        { label: 'Star Sigils', value: stats.totalStars, compact: true },
        { label: 'Watchers', value: profile.followers, compact: false },
        { label: 'Original Manuscripts', value: stats.originalRepos, compact: false }
    ]

    const shown = stats.languages.slice(0, 8)
    const shownPercent = shown.reduce((sum, l) => sum + l.percent, 0)
    const otherPercent = Math.max(0, 100 - shownPercent)

    const handleRefresh = () => {
        onRefresh()
        if (sound) sound.playSpell()
    }

    const handleCardHover = () => {
        if (sound) sound.playTick()
    }

    return (
        <Section id='stats' size='wide'>
            <div className='flex flex-wrap items-end justify-between gap-4'>
                <SectionHeading
                    title='A Live Read on the Forge'
                    description='Real-time records synchronized from the GitHub API.'
                />
                
                <div className='flex items-center gap-3 relative z-10'>
                    <span className='font-display text-xs italic text-accent bg-bg-sunken/65 px-3 py-1.5 border border-border/30 select-none'>
                        {source === 'seed' ? 'Archived Records' : 'Synchronized'}
                    </span>
                    <button
                        type='button'
                        onClick={handleRefresh}
                        className='gx-btn gx-btn-secondary size-9 border-border/40 bg-bg-raised hover:border-accent transition-colors'
                        aria-label='Sync GitHub metrics'
                    >
                        <RefreshCw className={cn('size-4 text-accent', refreshing && 'anim-spin-slow')} />
                    </button>
                </div>
            </div>

            {/* Counters */}
            <div className='mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 relative z-10'>
                {cards.map((card, i) => (
                    <Reveal key={card.label} delay={i * 70}>
                        <div 
                            onMouseEnter={handleCardHover}
                            className='bg-bg-raised/35 p-5 rounded-[var(--radius-glass-sm)] flex flex-col gap-3.5 transition-colors hover:bg-bg-raised/65 relative group shadow-sm'
                        >
                            <CornerBrackets />
                            <div className='flex items-center justify-between text-ink-tertiary font-mono text-[9px] select-none'>
                                <span>Entry 0{i+1}</span>
                            </div>
                            <CountUp
                                value={card.value}
                                compact={card.compact}
                                className='font-mono text-3xl font-bold text-accent tracking-tight'
                            />
                            <span className='font-pixel text-[8px] text-ink-tertiary tracking-widest uppercase'>{card.label}</span>
                        </div>
                    </Reveal>
                ))}
            </div>

            <div className='mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] relative z-10'>
                {/* Heraldic Achievement Badges */}
                <Reveal>
                    <div className='bg-bg-raised/35 p-5 sm:p-6 rounded-[var(--radius-glass-md)] flex flex-col gap-4 relative group shadow-sm'>
                        <CornerBrackets />
                        <h3 className='font-display text-base font-bold text-ink'>Heraldic Achievements</h3>
                        <div className='flex flex-col gap-3'>
                            {ACHIEVEMENTS.map((ach, i) => {
                                return (
                                    <div
                                        key={ach.name}
                                        className='flex items-center gap-3.5 rounded-sm bg-bg-sunken/35 border-0 px-4 py-3 relative group/item transition-all hover:bg-bg-raised/50'
                                    >
                                        <CornerBrackets className="border-tarnished/35 group-hover/item:border-accent" />
                                        <span className='font-mono text-xs font-bold text-accent select-none w-6 shrink-0'>
                                            [H.{i+1}]
                                        </span>
                                        <div className='min-w-0 flex-1'>
                                            <p className='font-display text-sm font-bold text-ink flex items-center gap-1.5'>
                                                {ach.name}
                                                {ach.tier && <span className='font-pixel text-[8px] text-accent-hover tracking-wider uppercase'>{ach.tier}</span>}
                                            </p>
                                            <p className='truncate font-sans text-xs text-ink-tertiary mt-0.5'>{ach.blurb}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </Reveal>

                {/* Language Spectrum Bar (Restyled as gold stacked pixel blocks) */}
                <Reveal delay={80}>
                    <div className='bg-bg-raised/35 p-5 sm:p-6 rounded-[var(--radius-glass-md)] flex flex-col gap-5 relative group shadow-sm'>
                        <CornerBrackets />
                        <div className='flex items-center justify-between'>
                            <h3 className='font-display text-base font-bold text-ink'>Language Runes</h3>
                            <span className='font-pixel text-[9px] text-accent'>
                                {stats.languages.length} RUNE SPECIES
                            </span>
                        </div>

                        {/* Pixel stack spectrum */}
                        <div className='flex h-3 w-full overflow-hidden border border-border bg-bg-sunken rounded'>
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

                        <div className='grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3 font-mono text-xs text-ink-secondary'>
                            {shown.map((lang) => (
                                <div key={lang.name} className='flex items-center gap-2'>
                                    <span className='size-2 shrink-0 rounded' style={{ background: lang.color } as CSSProperties} />
                                    <span className='truncate font-sans'>{lang.name}</span>
                                    <span className='ml-auto text-ink-tertiary text-[10px]'>{lang.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Heatmap Section */}
            <Reveal className='mt-6 relative z-10'>
                <ContributionHeatmap data={contributions} loading={contributionsLoading} />
            </Reveal>
        </Section>
    )
}
export default Stats
