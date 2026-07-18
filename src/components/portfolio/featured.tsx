import type { GithubRepo } from '@/types/github'
import { 
    Radio, 
    BookOpen, 
    Hammer, 
    MessageSquare, 
    Languages, 
    Sparkles,
    ArrowUpRight,
    Code2,
    Lock
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { FEATURED_SLUGS } from '@/constants/github'
import { Section, SectionHeading } from '@/components/generals/section'
import { Reveal } from '@/components/generals/reveal'
import { sound } from '@/lib/sound'
import { CornerBrackets } from '@/components/generals/corner-brackets'

const pickFeatured = (repos: Array<GithubRepo>): Array<GithubRepo> => {
    const byName = new Map(repos.map((r) => [r.name.toLowerCase(), r]))
    const picked: Array<GithubRepo> = []
    const used = new Set<string>()

    for (const slug of FEATURED_SLUGS) {
        const repo = byName.get(slug.toLowerCase())
        if (repo) {
            picked.push(repo)
            used.add(repo.name.toLowerCase())
        }
    }

    if (picked.length < 6) {
        const rest = [...repos]
            .filter((r) => !used.has(r.name.toLowerCase()) && !r.isFork)
            .sort((a, b) => b.stars - a.stars || (b.pushedAt ?? '').localeCompare(a.pushedAt ?? ''))

        for (const repo of rest) {
            if (picked.length >= 6) break
            picked.push(repo)
        }
    }

    return picked.slice(0, 6)
}

// Maps slugs to specific custom relics
const RELIC_META: Record<string, { label: string; icon: any; relicName: string; description?: string }> = {
    'claudio': { 
        label: 'Personal AI DJ Radio', 
        icon: Radio, 
        relicName: 'The Broadcaster’s Dial',
        description: 'A personal radio station hosted by Claudio, an AI DJ who keeps the broadcast moving between tracks.'
    },
    'zeroqcm': { label: 'Medical Revision Engine', icon: BookOpen, relicName: 'The Healing Codex' },
    'forge': { label: 'App Generator', icon: Hammer, relicName: 'The Creator Hammer' },
    'serve': { label: 'AI Conversation Space', icon: MessageSquare, relicName: 'The Memory Vessel' },
    'huroof-abdo': { label: 'Real-time Arabic Game', icon: Languages, relicName: 'The Glyph Tiles' },
    'relearn': { label: 'Interactive Lesson Maker', icon: Sparkles, relicName: 'The Lesson Lantern' }
}

interface FeaturedProps {
    repos: Array<GithubRepo>
}

export const Featured = ({ repos }: FeaturedProps) => {
    const featured = pickFeatured(repos)

    const onRelicHover = () => {
        if (sound) sound.playTick()
    }

    const onRelicClick = () => {
        if (sound) sound.playDulcimer()
    }

    return (
        <Section id='work' size='wide'>
            <SectionHeading
                title='Flagships of the Forge'
                description='Six distinct instruments built under midnight watch, resting on illuminated pedestals.'
            />

            <div className='mt-10 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {featured.map((repo, i) => {
                    const meta = RELIC_META[repo.name.toLowerCase()]
                    const Icon = meta?.icon ?? Sparkles

                    return (
                        <Reveal key={repo.id} delay={(i % 3) * 90} className='h-full'>
                            <article 
                                onMouseEnter={onRelicHover}
                                onClick={onRelicClick}
                                className='group flex h-full min-h-[26rem] flex-col rounded-[var(--radius-glass-md)] bg-bg-raised/35 p-6 relative border border-transparent shadow-md transition-colors hover:bg-bg-raised/65'
                            >
                                <CornerBrackets />

                                <span className='text-xs italic tracking-wide text-accent font-display select-none'>
                                    {meta?.relicName ?? 'A work from the collection'}
                                </span>

                                <div className='my-6 grid size-16 place-items-center self-center rounded-xl border border-border/70 bg-bg-sunken text-accent group-hover:text-accent-hover group-hover:border-accent transition-all'>
                                    <Icon className='size-6' aria-hidden='true' />
                                </div>

                                <h3 className='min-h-7 font-display text-xl font-semibold text-ink group-hover:text-accent transition-colors leading-tight mb-2'>
                                    {repo.name}
                                </h3>

                                <p className='mt-2 line-clamp-3 text-sm leading-relaxed text-ink-secondary mb-6 font-sans'>
                                    {meta?.description ?? repo.description ?? 'An independent project from the collection.'}
                                </p>

                                <footer className='mt-auto border-t border-border/20 pt-4 relative z-10'>
                                    <div className='mb-3 flex items-center justify-between text-xs text-ink-tertiary select-none font-mono'>
                                        <span>{repo.language ?? 'Language unlisted'}</span>
                                        <span aria-label={`${repo.stars} stars`}>★ {repo.stars}</span>
                                    </div>

                                    <div className='grid min-h-9 grid-cols-2 gap-2 font-pixel text-[10px]'>
                                        {repo.homepage ? (
                                            <>
                                                <a 
                                                    className='gx-btn gx-btn-primary py-2 px-3 text-center border border-accent/25 hover:border-accent' 
                                                    href={repo.homepage}
                                                    target='_blank'
                                                    rel='noreferrer'
                                                >
                                                    Live demo
                                                </a>
                                                <a 
                                                    className='gx-btn gx-btn-secondary py-2 px-3 text-center border border-border/60 hover:border-accent' 
                                                    href={repo.htmlUrl}
                                                    target='_blank'
                                                    rel='noreferrer'
                                                >
                                                    Source
                                                </a>
                                            </>
                                        ) : (
                                            <a 
                                                className='gx-btn gx-btn-secondary col-span-2 py-2 px-3 text-center border border-border/60 hover:border-accent' 
                                                href={repo.htmlUrl}
                                                target='_blank'
                                                rel='noreferrer'
                                            >
                                                Source
                                            </a>
                                        )}
                                    </div>
                                </footer>
                            </article>
                        </Reveal>
                    )
                })}
            </div>
        </Section>
    )
}
export default Featured
