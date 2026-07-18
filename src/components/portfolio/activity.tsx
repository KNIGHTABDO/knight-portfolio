import {
    Activity as ActivityIcon,
    CircleDot,
    GitBranch,
    GitCommitHorizontal,
    GitFork,
    GitPullRequest,
    Globe,
    Package,
    Star
} from 'lucide-react'

import type { ActivityEvent } from '@/types/github'

import { GITHUB } from '@/constants/github'
import { relativeTime } from '@/lib/format'
import { Section, SectionHeading } from '@/components/generals/section'
import { Reveal } from '@/components/generals/reveal'
import { useActivity } from '@/hooks/use-live-github'

const ICONS: Record<string, typeof ActivityIcon> = {
    'git-commit': GitCommitHorizontal,
    'git-branch': GitBranch,
    star: Star,
    'git-fork': GitFork,
    'git-pull-request': GitPullRequest,
    'circle-dot': CircleDot,
    package: Package,
    globe: Globe
}

const shortRepo = (full: string) => full.split('/').slice(-1)[0] || full

const Row = ({ event }: { event: ActivityEvent }) => {
    const Icon = ICONS[event.icon] ?? ActivityIcon

    return (
        <li className='flex items-center gap-4 rounded-[var(--radius-glass-md)] px-4 py-3 transition-colors hover:bg-[var(--bg-hover)]'>
            <span className='grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent'>
                <Icon className='size-4' />
            </span>
            <p className='min-w-0 flex-1 text-sm text-ink-secondary'>
                {event.action}{' '}
                <a
                    href={event.repoUrl}
                    target='_blank'
                    rel='noreferrer'
                    className='font-semibold text-ink underline-offset-2 hover:text-accent hover:underline'
                >
                    {shortRepo(event.repo)}
                </a>
            </p>
            <span className='shrink-0 font-mono text-xs text-ink-tertiary'>{relativeTime(event.createdAt)}</span>
        </li>
    )
}

export const Activity = () => {
    const { events, loading } = useActivity()

    return (
        <Section id='activity'>
            <SectionHeading
                eyebrow='Live activity'
                title='Straight from the commit log'
                description="The last things KNIGHT pushed, starred and shipped — fetched live when you loaded this page."
            />

            <Reveal className='mt-8'>
                <div className='gx-card p-3 sm:p-4'>
                    <div className='mb-1 flex items-center justify-between px-3 py-2'>
                        <span className='gx-chip font-mono text-[11px]'>
                            <span className='gx-live-dot' /> streaming from GitHub
                        </span>
                        <a
                            href={GITHUB.profileUrl}
                            target='_blank'
                            rel='noreferrer'
                            className='text-xs font-semibold text-accent hover:underline'
                        >
                            View all
                        </a>
                    </div>

                    {loading ? (
                        <ul className='flex flex-col gap-2 p-1'>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <li key={i} className='gx-skeleton h-14 w-full' />
                            ))}
                        </ul>
                    ) : events.length > 0 ? (
                        <ul className='flex flex-col'>
                            {events.map((event) => (
                                <Row key={event.id} event={event} />
                            ))}
                        </ul>
                    ) : (
                        <p className='px-4 py-10 text-center text-sm text-ink-tertiary'>
                            No recent public activity to show right now — the full history lives on GitHub.
                        </p>
                    )}
                </div>
            </Reveal>
        </Section>
    )
}
