import type { CSSProperties } from 'react'
import {
    ArrowUpRight,
    Code2,
    ExternalLink,
    GitFork,
    Star
} from 'lucide-react'

import type { GithubRepo } from '@/types/github'
import { languageColor, relativeTime } from '@/lib/format'
import { THEME_META } from '@/lib/repo-utils'
import { sound } from '@/lib/sound'
import { CornerBrackets } from '@/components/generals/corner-brackets'

const LangDot = ({ language }: { language: string | null }) =>
    language ? (
        <span className='inline-flex items-center gap-1.5 text-[11px] font-pixel text-ink-secondary'>
            <span className='gx-langdot' style={{ '--lang': languageColor(language) } as CSSProperties} />
            {language}
        </span>
    ) : (
        <span className='text-[11px] font-pixel text-ink-tertiary'>—</span>
    )

const StarPill = ({ repo }: { repo: GithubRepo }) => (
    <span className='flex items-center gap-2 font-mono text-[11px] text-ink-tertiary'>
        <span className='flex items-center gap-0.5'>
            <Star className='size-3 text-accent' /> {repo.stars}
        </span>
        {repo.forks > 0 && (
            <span className='flex items-center gap-0.5'>
                <GitFork className='size-3 text-ink-tertiary' /> {repo.forks}
            </span>
        )}
    </span>
)

/** Relic-style card for search lists. Dark navy, tarnished border, gold text. */
export const FeaturedCard = ({ repo }: { repo: GithubRepo }) => {
    const meta = THEME_META[repo.theme]

    const handleHover = () => {
        if (sound) sound.playTick()
    }

    return (
        <div 
            onMouseEnter={handleHover}
            className='flex flex-col gap-3.5 p-5 bg-bg-raised/35 hover:bg-bg-raised/70 rounded-[var(--radius-glass-md)] transition-all duration-300 relative shadow-sm group border border-transparent'
        >
            <CornerBrackets />
            <div className='flex items-start justify-between gap-3 relative z-10'>
                <span className='font-pixel text-[8px] text-accent tracking-widest uppercase bg-accent-soft border border-accent/20 px-2 py-0.5 rounded'>
                    {meta.label}
                </span>
                <StarPill repo={repo} />
            </div>

            <div className='flex flex-col gap-1.5 relative z-10'>
                <h3 className='font-display text-lg font-bold text-ink group-hover:text-accent transition-colors leading-tight'>
                    {repo.name}
                </h3>
                <p className='text-xs leading-relaxed text-ink-secondary line-clamp-3 font-sans'>
                    {repo.description ?? 'An experiment forged within the KNIGHT workshop.'}
                </p>
            </div>

            {repo.topics.length > 0 && (
                <div className='flex flex-wrap gap-1 relative z-10'>
                    {repo.topics.slice(0, 3).map((topic) => (
                        <span key={topic} className='font-pixel text-[8px] border border-border/50 text-ink-tertiary px-1.5 py-0.5 rounded bg-bg-sunken'>
                            #{topic}
                        </span>
                    ))}
                </div>
            )}

            <div className='mt-auto flex items-center justify-between gap-3 pt-2.5 border-t border-border/20 relative z-10'>
                <LangDot language={repo.language} />
                
                <div className='flex items-center gap-1.5'>
                    {repo.homepage && (
                        <a
                            href={repo.homepage}
                            target='_blank'
                            rel='noreferrer'
                            onClick={() => sound?.playDulcimer()}
                            className='font-pixel text-[9px] text-accent hover:text-accent-hover flex items-center gap-0.5 px-2 py-1 bg-accent-soft border border-accent/25 rounded transition-colors'
                        >
                            <ExternalLink className='size-2.5' />
                            Demo
                        </a>
                    )}
                    <a
                        href={repo.htmlUrl}
                        target='_blank'
                        rel='noreferrer'
                        onClick={() => sound?.playTick()}
                        className='font-pixel text-[9px] text-ink-secondary hover:text-ink flex items-center gap-0.5 px-2 py-1 bg-bg-sunken border border-border/60 rounded transition-colors'
                    >
                        <Code2 className='size-2.5' />
                        Code
                    </a>
                </div>
            </div>
        </div>
    )
}

/** Compact repo card in the list view. */
export const CompactRepoCard = ({ repo }: { repo: GithubRepo }) => {
    const meta = THEME_META[repo.theme]
    const href = repo.homepage ?? repo.htmlUrl

    const handleHover = () => {
        if (sound) sound.playTick()
    }

    return (
        <a
            href={href}
            target='_blank'
            rel='noreferrer'
            onMouseEnter={handleHover}
            onClick={() => sound?.playDulcimer()}
            className='flex flex-col gap-2.5 p-4.5 bg-bg-raised/30 hover:bg-bg-raised/70 rounded-[var(--radius-glass-md)] transition-all duration-300 group shadow-sm relative border border-transparent'
        >
            <CornerBrackets />
            <div className='flex items-start justify-between gap-2 relative z-10'>
                <div className='flex items-center gap-1.5 min-w-0'>
                    <h4 className='font-display text-sm font-bold text-ink truncate group-hover:text-accent transition-colors'>{repo.name}</h4>
                    <ArrowUpRight className='size-3 text-ink-tertiary transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent shrink-0' />
                </div>
                <StarPill repo={repo} />
            </div>

            <p className='flex-1 text-xs leading-relaxed text-ink-secondary line-clamp-2 font-sans relative z-10'>
                {repo.description ?? 'An experiment from the KNIGHT workshop.'}
            </p>

            <div className='flex items-center justify-between gap-2 pt-2 border-t border-border/20 relative z-10'>
                <LangDot language={repo.language} />
                <span className='font-mono text-[9px] text-ink-tertiary'>{relativeTime(repo.pushedAt)}</span>
            </div>
            <span className='sr-only'>{meta.label} project</span>
        </a>
    )
}
