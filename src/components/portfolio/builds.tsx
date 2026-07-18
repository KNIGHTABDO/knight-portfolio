import type { CSSProperties } from 'react'

import { Bot, Clapperboard, Moon, Stethoscope, Wrench } from 'lucide-react'

import type { GithubRepo, ThemeKey } from '@/types/github'

import { THEME_META, THEME_ORDER, countByTheme } from '@/lib/repo-utils'
import { languageColor } from '@/lib/format'
import { Section, SectionHeading } from '@/components/generals/section'
import { Reveal } from '@/components/generals/reveal'

const THEME_ICON: Record<ThemeKey, typeof Bot> = {
    ai: Bot,
    medical: Stethoscope,
    arabic: Moon,
    media: Clapperboard,
    tools: Wrench
}

interface BuildsProps {
    repos: Array<GithubRepo>
}

export const Builds = ({ repos }: BuildsProps) => {
    const counts = countByTheme(repos)

    const examplesFor = (theme: ThemeKey) =>
        repos
            .filter((r) => r.theme === theme)
            .sort((a, b) => b.stars - a.stars || (b.pushedAt ?? '').localeCompare(a.pushedAt ?? ''))
            .slice(0, 4)

    const marquee = repos.length > 0 ? repos : []

    return (
        <Section id='builds' size='wide'>
            <SectionHeading
                eyebrow='What I build'
                title='Five obsessions, one workshop'
                description='Every repo falls into one of these worlds. The counts update live as new projects ship.'
            />

            <div className='mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
                {THEME_ORDER.map((key, i) => {
                    const meta = THEME_META[key]
                    const Icon = THEME_ICON[key]
                    const examples = examplesFor(key)

                    return (
                        <Reveal key={key} delay={(i % 3) * 90}>
                            <div className='gx-card gx-card-hover flex h-full flex-col gap-4 p-6'>
                                <div className='flex items-center justify-between'>
                                    <span className='grid size-11 place-items-center rounded-[var(--radius-glass-md)] bg-accent-soft text-accent'>
                                        <Icon className='size-5' />
                                    </span>
                                    <span className='font-display text-3xl font-extrabold text-ink/15'>
                                        {String(counts[key]).padStart(2, '0')}
                                    </span>
                                </div>

                                <div>
                                    <p className='font-mono text-xs uppercase tracking-wider text-accent'>{meta.tagline}</p>
                                    <h3 className='font-display text-xl font-bold text-ink'>{meta.label}</h3>
                                </div>

                                <p className='flex-1 text-sm leading-relaxed text-ink-secondary'>{meta.description}</p>

                                <div className='flex flex-wrap gap-1.5 border-t border-[var(--border)] pt-4'>
                                    {examples.map((repo) => (
                                        <span key={repo.id} className='gx-chip text-[11px]'>
                                            <span
                                                className='size-2 rounded-full'
                                                style={{ background: languageColor(repo.language) } as CSSProperties}
                                            />
                                            {repo.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    )
                })}
            </div>

            {/* Signature marquee of every repo */}
            {marquee.length > 0 && (
                <div className='gx-marquee-track no-scrollbar relative mt-10 overflow-hidden py-2' aria-hidden='true'>
                    <div
                        className='pointer-events-none absolute inset-y-0 left-0 z-10 w-16'
                        style={{ background: 'linear-gradient(90deg, var(--bg), transparent)' } as CSSProperties}
                    />
                    <div
                        className='pointer-events-none absolute inset-y-0 right-0 z-10 w-16'
                        style={{ background: 'linear-gradient(270deg, var(--bg), transparent)' } as CSSProperties}
                    />
                    <div className='gx-marquee gap-3'>
                        {[...marquee, ...marquee].map((repo, i) => (
                            <span key={`${repo.id}-${i}`} className='gx-chip whitespace-nowrap font-mono text-xs'>
                                <span
                                    className='size-2 rounded-full'
                                    style={{ background: languageColor(repo.language) } as CSSProperties}
                                />
                                {repo.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </Section>
    )
}
