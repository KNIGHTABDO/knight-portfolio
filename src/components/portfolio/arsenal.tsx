import { useMemo, useState } from 'react'
import { GitFork, Search, SlidersHorizontal } from 'lucide-react'

import type { GithubRepo, ThemeKey } from '@/types/github'

import { THEME_META, THEME_ORDER, countByTheme } from '@/lib/repo-utils'
import { cn } from '@/lib/utils'
import { Section, SectionHeading } from '@/components/generals/section'
import { Reveal } from '@/components/generals/reveal'
import { CompactRepoCard } from '@/components/portfolio/repo-card'

type ThemeFilter = 'all' | ThemeKey
type SortKey = 'recent' | 'stars' | 'name'

const PAGE = 12

const SORTS: Array<{ key: SortKey; label: string }> = [
    { key: 'recent', label: 'Recent' },
    { key: 'stars', label: 'Stars' },
    { key: 'name', label: 'A–Z' }
]

interface ArsenalProps {
    repos: Array<GithubRepo>
    refreshing: boolean
}

export const Arsenal = ({ repos, refreshing }: ArsenalProps) => {
    const [query, setQuery] = useState('')
    const [theme, setTheme] = useState<ThemeFilter>('all')
    const [sort, setSort] = useState<SortKey>('recent')
    const [hideForks, setHideForks] = useState(false)
    const [visible, setVisible] = useState(PAGE)

    const counts = useMemo(() => countByTheme(repos), [repos])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()

        const list = repos.filter((repo) => {
            if (hideForks && repo.isFork) return false
            if (theme !== 'all' && repo.theme !== theme) return false
            if (!q) return true
            return (
                repo.name.toLowerCase().includes(q) ||
                (repo.description ?? '').toLowerCase().includes(q) ||
                repo.topics.some((t) => t.toLowerCase().includes(q)) ||
                (repo.language ?? '').toLowerCase().includes(q)
            )
        })

        const sorted = [...list].sort((a, b) => {
            if (sort === 'stars') return b.stars - a.stars || (b.pushedAt ?? '').localeCompare(a.pushedAt ?? '')
            if (sort === 'name') return a.name.localeCompare(b.name)
            return (b.pushedAt ?? '').localeCompare(a.pushedAt ?? '')
        })

        return sorted
    }, [repos, query, theme, sort, hideForks])

    const shown = filtered.slice(0, visible)

    const resetPage = () => setVisible(PAGE)

    return (
        <Section id='arsenal' size='wide'>
            <SectionHeading
                eyebrow='The arsenal'
                title='Every repo, searchable & live'
                description='The full public catalogue, pulled from the GitHub API. Search it, filter by world, or sort by what shines.'
            />

            {/* Toolbar */}
            <Reveal className='mt-8'>
                <div className='gx-card flex flex-col gap-4 p-4 sm:p-5'>
                    <div className='flex flex-col gap-3 lg:flex-row lg:items-center'>
                        <div className='relative flex-1'>
                            <Search className='pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-tertiary' />
                            <input
                                type='search'
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value)
                                    resetPage()
                                }}
                                placeholder='Search 89 repos — try "agent", "medical", "radio"…'
                                className='gx-input pl-11'
                                aria-label='Search repositories'
                            />
                        </div>

                        <div className='flex items-center gap-2'>
                            <div className='gx-seg glass-tint'>
                                {SORTS.map((s) => (
                                    <button
                                        key={s.key}
                                        type='button'
                                        onClick={() => setSort(s.key)}
                                        data-active={sort === s.key}
                                        className='gx-seg-item'
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                            <button
                                type='button'
                                onClick={() => {
                                    setHideForks((v) => !v)
                                    resetPage()
                                }}
                                data-active={hideForks}
                                className={cn(
                                    'gx-seg-item glass-tint h-[42px] gap-1.5 px-3.5',
                                    hideForks && 'text-accent'
                                )}
                                aria-pressed={hideForks}
                            >
                                <GitFork className='size-3.5' />
                                <span className='hidden sm:inline'>No forks</span>
                            </button>
                        </div>
                    </div>

                    {/* Theme filter */}
                    <div className='no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1'>
                        <SlidersHorizontal className='size-4 shrink-0 text-ink-tertiary' />
                        <FilterChip
                            active={theme === 'all'}
                            label='All'
                            count={repos.length}
                            onClick={() => {
                                setTheme('all')
                                resetPage()
                            }}
                        />
                        {THEME_ORDER.map((key) => (
                            <FilterChip
                                key={key}
                                active={theme === key}
                                label={THEME_META[key].label}
                                count={counts[key]}
                                onClick={() => {
                                    setTheme(key)
                                    resetPage()
                                }}
                            />
                        ))}
                    </div>
                </div>
            </Reveal>

            {/* Result count */}
            <div className='mt-6 flex items-center justify-between text-sm text-ink-secondary'>
                <span>
                    Showing <span className='font-semibold text-ink'>{shown.length}</span> of{' '}
                    <span className='font-semibold text-ink'>{filtered.length}</span>
                </span>
                {refreshing && <span className='font-mono text-xs text-ink-tertiary'>syncing…</span>}
            </div>

            {/* Grid */}
            {shown.length > 0 ? (
                <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                    {shown.map((repo) => (
                        <CompactRepoCard key={repo.id} repo={repo} />
                    ))}
                </div>
            ) : (
                <div className='gx-card mt-4 flex flex-col items-center gap-2 p-12 text-center'>
                    <p className='font-display text-lg font-bold text-ink'>No repos match that.</p>
                    <p className='text-sm text-ink-secondary'>Try a different keyword or clear the filters.</p>
                </div>
            )}

            {visible < filtered.length && (
                <div className='mt-8 flex justify-center'>
                    <button
                        type='button'
                        onClick={() => setVisible((v) => v + PAGE)}
                        className='gx-btn gx-btn-secondary'
                    >
                        Load more ({filtered.length - visible} left)
                    </button>
                </div>
            )}
        </Section>
    )
}

const FilterChip = ({
    active,
    label,
    count,
    onClick
}: {
    active: boolean
    label: string
    count: number
    onClick: () => void
}) => (
    <button
        type='button'
        onClick={onClick}
        data-active={active}
        className='gx-seg-item glass-tint h-9 shrink-0 gap-1.5'
    >
        {label}
        <span className={cn('font-mono text-[10px]', active ? 'text-accent' : 'text-ink-tertiary')}>
            {count}
        </span>
    </button>
)
