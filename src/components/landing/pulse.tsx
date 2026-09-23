import type { ActivityEvent, ContribData, GithubOverview } from '@/types/github'
import type { DoodleDraw } from '@/components/sketch/doodle'

import { useEffect, useMemo, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate, relativeTime } from '@/lib/format'
import { INK_VAR, languageInk } from '@/lib/ink'
import { dots, letter, pencil, polyPath } from '@/lib/pencil'
import { hash } from '@/lib/sketch'

import Doodle from '@/components/sketch/doodle'
import Reveal from '@/components/sketch/reveal'
import SectionHead from '@/components/landing/section-head'

interface PulseProps {
    overview: GithubOverview
    contributions: ContribData | null
    contributionsLoading: boolean
    events: Array<ActivityEvent>
    eventsLoading: boolean
}

const PITCH = 16
const CELL = 12
const TOP = 30
const LEFT = 30

/** Contribution levels as pencil marks: nothing, a stroke, two, cross-hatch, printed. */
const calendar = (data: ContribData): DoodleDraw => (c, { ink }) => {
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    let lastMonth = -1
    let lastLabel = -9
    ;['mon', 'wed', 'fri'].forEach((d, k) => letter(c, d, 0, TOP + (1 + k * 2) * PITCH + CELL / 2, { size: 14, color: ink.faint, family: ink.hand }))
    data.weeks.forEach((week, w) => {
        const x = LEFT + w * PITCH
        const first = week[0]
        if (first) {
            const m = Number(first.date.slice(5, 7)) - 1
            if (m !== lastMonth) {
                if (w - lastLabel >= 3 && w < data.weeks.length - 2) {
                    letter(c, months[m], x, 12, { size: 16, color: ink.soft, family: ink.hand })
                    lastLabel = w
                }
                lastMonth = m
            }
        }
        week.forEach((day, d) => {
            const y = TOP + d * PITCH
            const id = w * 7 + d
            const seed = 500 + id
            const x0 = x + (hash(id, 1) - 0.5) * 1.2
            const y0 = y + (hash(id, 2) - 0.5) * 1.2
            if (day.level === 0) {
                c.fillStyle = ink.faint
                c.globalAlpha = 0.5
                c.beginPath()
                c.arc(x0 + CELL / 2, y0 + CELL / 2, 1.1, 0, Math.PI * 2)
                c.fill()
                c.globalAlpha = 1
                return
            }
            if (day.level >= 4) {
                dots(c, polyPath([[x0, y0], [x0 + CELL, y0], [x0 + CELL, y0 + CELL], [x0, y0 + CELL]]), [x0, y0, CELL, CELL], { seed, color: ink.blue, cell: 3, density: 0.85 })
            }
            const strokes = Math.min(3, day.level)
            for (let k = 0; k < strokes; k++) {
                const off = (k - (strokes - 1) / 2) * 4
                if (k < 2) pencil(c, [[x0 + 1 + off, y0 + CELL - 1], [x0 + CELL - 1 + off * 0.2, y0 + 1 + off * 0.2]], { seed: seed + k, color: ink.graphite, width: 1.3, passes: 1, amp: 0.3 })
                else pencil(c, [[x0 + 1, y0 + 1], [x0 + CELL - 1, y0 + CELL - 1]], { seed: seed + k, color: ink.graphite, width: 1.3, passes: 1, amp: 0.3 })
            }
        })
    })
}

const Stat = ({ value, label, note }: { value: number | string; label: string; note?: string }) => (
    <div className='relative min-w-0 border-l border-rule-strong pl-5 first:border-l-0 first:pl-0 [&:nth-child(3)]:border-l-0 [&:nth-child(3)]:pl-0 sm:[&:nth-child(3)]:border-l sm:[&:nth-child(3)]:pl-5'>
        <p className={cn('truncate font-display leading-none text-graphite', typeof value === 'number' ? 'text-[clamp(3rem,6vw,4.6rem)]' : 'pt-2 text-[clamp(2rem,3.6vw,3.1rem)] italic')}>{value}</p>
        <p className='mt-2 font-hand text-2xl leading-tight text-graphite-soft'>{label}</p>
        {note && <p className='mt-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-graphite-faint'>{note}</p>}
    </div>
)

const Pulse = ({ overview, contributions, contributionsLoading, events, eventsLoading }: PulseProps) => {
    const { profile, stats } = overview
    const draw = useMemo(() => (contributions ? calendar(contributions) : null), [contributions])
    const scroller = useRef<HTMLDivElement>(null)
    const langs = stats.languages.slice(0, 6)

    // on narrow screens the calendar scrolls; start at the most recent weeks
    useEffect(() => {
        const el = scroller.current
        if (el) el.scrollLeft = el.scrollWidth
    }, [contributions])
    const other = Math.max(0, 100 - langs.reduce((a, l) => a + l.percent, 0))

    return (
        <section id='pulse' aria-labelledby='pulse-title' className='relative mx-auto max-w-6xl px-5 pt-28 sm:px-8 sm:pt-40'>
            <SectionHead
                id='pulse-title'
                index='04'
                kicker='vital signs'
                title={<>Pulse, <em className='italic'>taken from GitHub.</em></>}
                aside={<span className='inline-block rotate-[-1deg]'>resting rate: a lot of late commits.</span>}
            />

            <Reveal className='mt-14 grid grid-cols-2 gap-y-10 sm:grid-cols-4'>
                <Stat value={profile.publicRepos} label='public repos' note={`${stats.originalRepos} original · ${stats.forkedRepos} forks`} />
                <Stat value={stats.totalStars} label='stars collected' />
                <Stat value={profile.followers} label='followers' note={`following ${profile.following}`} />
                <Stat value={stats.topLanguage ?? '—'} label='mother tongue' note='most used language' />
            </Reveal>

            <Reveal className='paper-card relative mt-16 px-5 py-7 sm:px-8'>
                <div className='flex flex-wrap items-baseline justify-between gap-3'>
                    <h3 className='font-hand text-3xl text-graphite'>
                        {contributions ? `${contributions.total.toLocaleString('en-US')} contributions in the last year` : 'the contribution calendar'}
                    </h3>
                    <p className='font-mono text-[0.68rem] uppercase tracking-[0.16em] text-graphite-faint'>one stroke per level · printed = busiest days</p>
                </div>
                <div ref={scroller} className='mt-5 overflow-x-auto pb-2'>
                    {draw && contributions ? (
                        <div className='min-w-[720px]'>
                            <Doodle
                                draw={draw}
                                width={LEFT + contributions.weeks.length * PITCH}
                                height={TOP + 7 * PITCH}
                                redrawKey={contributions.updatedAt}
                                label={`${contributions.total} GitHub contributions in the last year, drawn as pencil marks`}
                            />
                        </div>
                    ) : (
                        <p className='squared flex h-36 items-center justify-center font-hand text-2xl text-graphite-faint'>
                            {contributionsLoading ? 'sharpening the pencil…' : 'github’s calendar is not answering right now. the pencil waits.'}
                        </p>
                    )}
                </div>
            </Reveal>

            <div className='mt-16 grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20'>
                <Reveal>
                    <h3 className='font-hand text-3xl text-graphite'>languages, as printed</h3>
                    <div className='mt-5 flex h-12 w-full overflow-hidden' role='img' aria-label={langs.map((l) => `${l.name} ${l.percent}%`).join(', ')}>
                        {langs.map((l, i) => (
                            <span
                                key={l.name}
                                className='h-full'
                                style={{
                                    width: `${l.percent}%`,
                                    backgroundColor: INK_VAR[languageInk(l.name)],
                                    backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,.28) 0 1.1px, transparent 1.4px)',
                                    backgroundSize: '5px 5px',
                                    transform: `translateY(${[0, 2, -1, 1, -2, 0][i]}px)`,
                                    mixBlendMode: 'multiply'
                                }}
                            />
                        ))}
                        {other > 0.5 && <span className='h-full bg-graphite-faint/40' style={{ width: `${other}%` }} />}
                    </div>
                    <ul className='mt-5 grid grid-cols-2 gap-x-6 gap-y-2'>
                        {langs.map((l) => (
                            <li key={l.name} className='flex items-baseline gap-2'>
                                <span className='size-3 shrink-0 rounded-full' style={{ backgroundColor: INK_VAR[languageInk(l.name)] }} />
                                <span className='text-graphite'>{l.name}</span>
                                <span aria-hidden='true' className='leader' />
                                <span className='font-mono text-xs text-graphite-faint'>{l.percent}%</span>
                            </li>
                        ))}
                    </ul>
                </Reveal>

                <Reveal delay={120}>
                    <h3 className='font-hand text-3xl text-graphite'>lab notebook, latest entries</h3>
                    <ol className='mt-4 border-t border-rule-strong font-mono text-[0.8rem]'>
                        {events.slice(0, 7).map((e, i) => (
                            <li key={e.id} className='grid grid-cols-[5.5rem_1fr] gap-3 border-b border-dashed border-rule py-3'>
                                <time dateTime={e.createdAt} className='text-graphite-faint' title={formatDate(e.createdAt)}>
                                    {relativeTime(e.createdAt).replace(' ago', '')}
                                </time>
                                <span className='text-graphite-soft'>
                                    {e.action}{' '}
                                    <a href={e.repoUrl} target='_blank' rel='noreferrer' className={cn('group inline-flex items-center gap-0.5 text-graphite', i === 0 && 'caret')}>
                                        <span className='marker-hover'>{e.repo.replace(/^knightabdo\//i, '')}</span>
                                        <ArrowUpRight className='size-3 opacity-50 group-hover:opacity-100' />
                                    </a>
                                </span>
                            </li>
                        ))}
                    </ol>
                    {events.length === 0 && (
                        <p className='py-8 font-hand text-2xl text-graphite-faint'>{eventsLoading ? 'reading the log…' : 'the public log is quiet right now.'}</p>
                    )}
                </Reveal>
            </div>
        </section>
    )
}

export default Pulse
