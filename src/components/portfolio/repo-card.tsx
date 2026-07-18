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
import { cn } from '@/lib/utils'

const LangDot = ({ language }: { language: string | null }) =>
    language ? (
        <span className='inline-flex items-center gap-1.5 text-xs font-medium text-ink-secondary'>
            <span className='gx-langdot' style={{ '--lang': languageColor(language) } as CSSProperties} />
            {language}
        </span>
    ) : (
        <span className='text-xs font-medium text-ink-tertiary'>—</span>
    )

const StarPill = ({ repo }: { repo: GithubRepo }) => (
    <span className='flex items-center gap-2 font-mono text-xs text-ink-tertiary'>
        <span className='flex items-center gap-1'>
            <Star className='size-3.5' /> {repo.stars}
        </span>
        {repo.forks > 0 && (
            <span className='flex items-center gap-1'>
                <GitFork className='size-3.5' /> {repo.forks}
            </span>
        )}
    </span>
)

/** Large featured card — bounded, real glass, two explicit action links. */
export const FeaturedCard = ({ repo }: { repo: GithubRepo }) => {
    const meta = THEME_META[repo.theme]

    return (
        <div className='gx-card gx-card-hover group flex h-full flex-col gap-4 p-6'>
            <div className='flex items-start justify-between gap-3'>
                <span className='gx-chip gx-chip-accent'>{meta.label}</span>
                <StarPill repo={repo} />
            </div>

            <div className='flex flex-col gap-2'>
                <h3 className='font-display text-xl font-bold tracking-tight text-ink sm:text-2xl'>
                    {repo.name}
                </h3>
                <p className='text-sm leading-relaxed text-ink-secondary line-clamp-3'>
                    {repo.description ?? 'An experiment from the KNIGHT workshop.'}
                </p>
            </div>

            {repo.topics.length > 0 && (
                <div className='flex flex-wrap gap-1.5'>
                    {repo.topics.slice(0, 4).map((topic) => (
                        <span key={topic} className='gx-chip text-[11px]'>#{topic}</span>
                    ))}
                </div>
            )}

            <div className='mt-auto flex items-center justify-between gap-3 pt-2'>
                <LangDot language={repo.language} />
                <div className='flex items-center gap-2'>
                    {repo.homepage && (
                        <a
                            href={repo.homepage}
                            target='_blank'
                            rel='noreferrer'
                            className='gx-btn gx-btn-primary gx-btn-sm'
                        >
                            <ExternalLink className='size-3.5' />
                            Live
                        </a>
                    )}
                    <a
                        href={repo.htmlUrl}
                        target='_blank'
                        rel='noreferrer'
                        className='gx-btn gx-btn-secondary gx-btn-sm'
                    >
                        <Code2 className='size-3.5' />
                        Code
                    </a>
                </div>
            </div>
        </div>
    )
}

/** Compact grid item — unbounded, tint tier, single link to keep it valid. */
export const CompactRepoCard = ({ repo }: { repo: GithubRepo }) => {
    const meta = THEME_META[repo.theme]
    const href = repo.homepage ?? repo.htmlUrl

    return (
        <a
            href={href}
            target='_blank'
            rel='noreferrer'
            className={cn('gx-card-tint gx-card-hover group flex h-full flex-col gap-3 p-5')}
        >
            <div className='flex items-start justify-between gap-2'>
                <div className='flex items-center gap-2'>
                    <h4 className='font-display text-base font-bold text-ink'>{repo.name}</h4>
                    <ArrowUpRight className='size-4 text-ink-tertiary transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent' />
                </div>
                <StarPill repo={repo} />
            </div>

            <p className='flex-1 text-sm leading-relaxed text-ink-secondary line-clamp-2'>
                {repo.description ?? 'An experiment from the KNIGHT workshop.'}
            </p>

            <div className='flex items-center justify-between gap-2 pt-1'>
                <LangDot language={repo.language} />
                <span className='flex items-center gap-2'>
                    {repo.homepage && (
                        <span className='gx-chip gx-chip-accent text-[10px]'>demo</span>
                    )}
                    <span className='font-mono text-[11px] text-ink-tertiary'>{relativeTime(repo.pushedAt)}</span>
                </span>
            </div>
            <span className='sr-only'>{meta.label} project</span>
        </a>
    )
}
