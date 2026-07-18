import type { ActivityEvent } from '@/types/github'
import { GITHUB } from '@/constants/github'
import { relativeTime } from '@/lib/format'
import { Section, SectionHeading } from '@/components/generals/section'
import { Reveal } from '@/components/generals/reveal'
import { useActivity } from '@/hooks/use-live-github'
import { sound } from '@/lib/sound'
import { CornerBrackets } from '@/components/generals/corner-brackets'

const shortRepo = (full: string) => full.split('/').slice(-1)[0] || full

const Row = ({ event }: { event: ActivityEvent }) => {
    const handleHover = () => {
        if (sound) sound.playTick()
    }

    return (
        <li 
            onMouseEnter={handleHover}
            className='flex items-center gap-4 rounded-md px-3.5 py-3 transition-colors hover:bg-bg-hover relative z-10 border-b border-border/20 last:border-0'
        >
            <span className='font-mono text-[11px] font-bold text-accent select-none w-4 shrink-0 text-center'>
                »
            </span>
            <p className='min-w-0 flex-1 text-xs text-ink-secondary'>
                {event.action}{' '}
                <a
                    href={event.repoUrl}
                    target='_blank'
                    rel='noreferrer'
                    className='font-semibold text-ink hover:text-accent transition-colors'
                >
                    {shortRepo(event.repo)}
                </a>
            </p>
            <span className='shrink-0 font-mono text-[10px] text-ink-tertiary'>{relativeTime(event.createdAt)}</span>
        </li>
    )
}

export const Activity = () => {
    const { events, loading } = useActivity()

    return (
        <Section id='activity'>
            <SectionHeading
                title='Chronicle of the Midnight Watch'
                description="Recent push events and manuscripts recorded in real-time."
            />

            <Reveal className='mt-8 relative z-10'>
                <div className='bg-bg-raised/35 p-4 rounded-[var(--radius-glass-md)] relative overflow-hidden group shadow-sm'>
                    <CornerBrackets />
                    {/* Grid watermark background */}
                    <div className='absolute inset-0 bg-[linear-gradient(rgba(141,108,46,0.02)_1px,transparent_1px)] bg-[size:100%_8px] pointer-events-none' />

                    <div className='mb-2.5 flex items-center justify-between px-3 py-1.5 border-b border-border/30'>
                        <span className='font-display text-xs italic text-accent select-none'>
                            Active Transmission
                        </span>
                        <a
                            href={GITHUB.profileUrl}
                            target='_blank'
                            rel='noreferrer'
                            onClick={() => sound?.playTick()}
                            className='font-pixel text-[8px] text-ink-tertiary hover:text-accent tracking-wider uppercase'
                        >
                            View Almanac
                        </a>
                    </div>

                    {loading ? (
                        <ul className='flex flex-col gap-2 p-1'>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <li key={i} className='gx-skeleton h-12 w-full rounded' />
                            ))}
                        </ul>
                    ) : events.length > 0 ? (
                        <ul className='flex flex-col'>
                            {events.map((event) => (
                                <Row key={event.id} event={event} />
                            ))}
                        </ul>
                    ) : (
                        <p className='px-4 py-10 text-center font-display text-xs text-ink-tertiary'>
                            Almanac is currently blank — check the records directly on GitHub.
                        </p>
                    )}
                </div>
            </Reveal>
        </Section>
    )
}
export default Activity
