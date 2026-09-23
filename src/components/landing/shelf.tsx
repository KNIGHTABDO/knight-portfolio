import type { GithubOverview, GithubRepo, ThemeKey } from '@/types/github'

import { useDeferredValue, useMemo, useState } from 'react'
import { ArrowUpRight, GitFork, RefreshCw, Search, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { relativeTime } from '@/lib/format'
import { INK_BG, languageInk } from '@/lib/ink'
import { THEME_META, THEME_ORDER, countByTheme } from '@/lib/repo-utils'

import Mark from '@/components/sketch/mark'
import Reveal from '@/components/sketch/reveal'
import SketchBox from '@/components/sketch/sketch-box'
import SectionHead from '@/components/landing/section-head'

type Sort = 'recent' | 'stars' | 'name'

const SORTS: Array<[Sort, string]> = [
    ['recent', 'recently touched'],
    ['stars', 'most starred'],
    ['name', 'a → z']
]

const PAGE = 12

interface ShelfProps {
    overview: GithubOverview
    refreshing: boolean
    onRefresh: () => void
}

const Row = ({ repo, n }: { repo: GithubRepo; n: number }) => (
    <li className='border-b border-dashed border-rule'>
        <a href={repo.homepage || repo.htmlUrl} target='_blank' rel='noreferrer' className='group grid grid-cols-[2.2rem_1fr] gap-x-3 py-4 sm:grid-cols-[3rem_1fr_auto] sm:gap-x-5'>
            <span className='pt-1.5 font-mono text-xs text-graphite-faint'>{String(n).padStart(3, '0')}</span>
            <span className='min-w-0'>
                <span className='flex items-baseline gap-2'>
                    <span className='marker-hover truncate font-display text-[1.65rem] leading-tight text-graphite'>{repo.name}</span>
                    {repo.isFork && <span className='shrink-0 font-hand text-lg text-graphite-faint'>(fork)</span>}
                    <ArrowUpRight className='size-4 shrink-0 translate-y-0.5 text-graphite-faint opacity-0 transition-opacity group-hover:opacity-100' />
                </span>
                <span className='mt-0.5 block text-[0.98rem] leading-6 text-graphite-soft'>{repo.description || <span className='font-hand text-lg text-graphite-faint'>no description, just vibes</span>}</span>
                <span className='mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.7rem] text-graphite-faint sm:hidden'>
                    <Meta repo={repo} />
                </span>
            </span>
            <span className='hidden items-center gap-5 pt-2 font-mono text-[0.72rem] text-graphite-faint sm:flex'>
                <Meta repo={repo} />
            </span>
        </a>
    </li>
)

const Meta = ({ repo }: { repo: GithubRepo }) => (
    <>
        {repo.language && (
            <span className='flex items-center gap-1.5'>
                <span className={cn('size-2.5 rounded-full', INK_BG[languageInk(repo.language)])} />
                {repo.language}
            </span>
        )}
        <span className='flex items-center gap-1' title='stars'>
            <Star className='size-3.5' />
            {repo.stars}
        </span>
        {repo.forks > 0 && (
            <span className='flex items-center gap-1' title='forks'>
                <GitFork className='size-3.5' />
                {repo.forks}
            </span>
        )}
        <span className='w-24 text-right'>{relativeTime(repo.pushedAt)}</span>
    </>
)

const Shelf = ({ overview, refreshing, onRefresh }: ShelfProps) => {
    const [family, setFamily] = useState<ThemeKey | 'all'>('all')
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState<Sort>('recent')
    const [forks, setForks] = useState(true)
    const [shown, setShown] = useState(PAGE)
    const q = useDeferredValue(query.trim().toLowerCase())

    const counts = useMemo(() => countByTheme(overview.repos), [overview.repos])

    const list = useMemo(() => {
        const rows = overview.repos.filter((r) => {
            if (!forks && r.isFork) return false
            if (family !== 'all' && r.theme !== family) return false
            if (!q) return true
            return [r.name, r.description ?? '', r.language ?? '', ...r.topics].join(' ').toLowerCase().includes(q)
        })
        return rows.sort((a, b) => {
            if (sort === 'stars') return b.stars - a.stars || (b.pushedAt ?? '').localeCompare(a.pushedAt ?? '')
            if (sort === 'name') return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
            return (b.pushedAt ?? '').localeCompare(a.pushedAt ?? '')
        })
    }, [overview.repos, family, q, sort, forks])

    const sourceNote = overview.source === 'live' ? 'live from github' : overview.source === 'cache' ? 'from github, cached' : 'from the last snapshot'

    return (
        <section id='shelf' aria-labelledby='shelf-title' className='relative mx-auto max-w-6xl px-5 pt-28 sm:px-8 sm:pt-40'>
            <SectionHead
                id='shelf-title'
                index='03'
                kicker='the whole shelf'
                title={<>Every repo, <em className='italic'>one shelf.</em></>}
                aside={
                    <span className='inline-flex items-center gap-2'>
                        {overview.repos.length} on the shelf, {sourceNote}
                        <button type='button' onClick={onRefresh} className='inline-flex items-center text-graphite-faint hover:text-graphite' aria-label='Refresh from GitHub'>
                            <RefreshCw className={cn('size-4', refreshing && 'animate-spin')} />
                        </button>
                    </span>
                }
            />

            <Reveal className='mt-12'>
                <div role='tablist' aria-label='Families' className='flex flex-wrap gap-x-2 gap-y-3'>
                    {(['all', ...THEME_ORDER] as Array<ThemeKey | 'all'>).map((key) => {
                        const on = family === key
                        const label = key === 'all' ? 'everything' : THEME_META[key].label.toLowerCase()
                        const n = key === 'all' ? overview.repos.length : counts[key]
                        return (
                            <button
                                key={key}
                                role='tab'
                                aria-selected={on}
                                type='button'
                                onClick={() => {
                                    setFamily(key)
                                    setShown(PAGE)
                                }}
                                className={cn('px-3 py-1 font-hand text-[1.45rem] leading-none transition-colors', on ? 'text-graphite' : 'text-graphite-faint hover:text-graphite-soft')}
                            >
                                {on ? (
                                    <Mark kind='circle' ink='text-pink' seed={key.length * 7} width={2.2} delay={0}>
                                        {label}
                                    </Mark>
                                ) : (
                                    label
                                )}
                                <sup className='ml-1 font-mono text-[0.62rem] text-graphite-faint'>{n}</sup>
                            </button>
                        )
                    })}
                </div>
                {family !== 'all' && <p className='mt-4 max-w-2xl text-graphite-soft'><span className='font-hand text-xl text-blue'>{THEME_META[family].tagline} — </span>{THEME_META[family].description}</p>}

                <div className='mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
                    <label className='flex w-full max-w-sm items-center gap-2'>
                        <Search className='size-5 shrink-0 text-graphite-faint' />
                        <span className='sr-only'>Search repositories</span>
                        <input
                            type='search'
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value)
                                setShown(PAGE)
                            }}
                            placeholder='search a name, a topic, a language…'
                            className='pencil-input w-full py-1.5 text-lg text-graphite'
                        />
                    </label>
                    <div className='flex flex-wrap items-center gap-x-5 gap-y-2 font-hand text-xl'>
                        {SORTS.map(([key, label]) => (
                            <button key={key} type='button' onClick={() => setSort(key)} aria-pressed={sort === key} className={cn('leading-none', sort === key ? 'text-graphite' : 'text-graphite-faint hover:text-graphite-soft')}>
                                <span className={cn('marker-hover', sort === key && 'is-on')}>{label}</span>
                            </button>
                        ))}
                        <label className='flex cursor-pointer items-center gap-2 text-graphite-soft'>
                            <input type='checkbox' checked={forks} onChange={(e) => setForks(e.target.checked)} className='size-4 accent-[var(--blue)]' />
                            forks
                        </label>
                    </div>
                </div>
            </Reveal>

            <ul className='mt-6 border-t border-rule-strong'>
                {list.slice(0, shown).map((r, i) => (
                    <Row key={r.id} repo={r} n={i + 1} />
                ))}
            </ul>
            {list.length === 0 && <p className='py-10 text-center font-hand text-2xl text-graphite-faint'>nothing on this shelf matches “{query}”.</p>}

            <div className='mt-8 flex items-center justify-between gap-4'>
                <p className='font-mono text-xs text-graphite-faint'>
                    showing {Math.min(shown, list.length)} of {list.length}
                </p>
                {shown < list.length && (
                    <button type='button' onClick={() => setShown((s) => s + PAGE * 2)} className='boil-hover relative px-5 py-2 font-hand text-2xl leading-none text-graphite'>
                        pull out more
                        <SketchBox seed={61} width={1.8} />
                    </button>
                )}
            </div>
        </section>
    )
}

export default Shelf
