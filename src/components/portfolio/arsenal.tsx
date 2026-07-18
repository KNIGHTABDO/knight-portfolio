import { useMemo, useState, useEffect } from 'react'
import { GitFork, Search, SlidersHorizontal, Eye, EyeOff, Star, ExternalLink, Code2 } from 'lucide-react'

import type { GithubRepo, ThemeKey } from '@/types/github'
import { THEME_META, THEME_ORDER, countByTheme } from '@/lib/repo-utils'
import { cn } from '@/lib/utils'
import { Section, SectionHeading } from '@/components/generals/section'
import { Reveal } from '@/components/generals/reveal'
import { CompactRepoCard } from '@/components/portfolio/repo-card'
import { sound } from '@/lib/sound'

type ThemeFilter = 'all' | ThemeKey
type SortKey = 'recent' | 'stars' | 'name'

const PAGE = 12

const SORTS: Array<{ key: SortKey; label: string }> = [
    { key: 'recent', label: 'Recent' },
    { key: 'stars', label: 'Stars' },
    { key: 'name', label: 'A–Z' }
]

// Simple organic branch positioning helper
const getLeafPosition = (theme: ThemeKey, index: number, total: number) => {
    const startX = 200
    const startY = 320
    
    let endX = 200
    let endY = 50
    
    if (theme === 'ai') {
        endX = 40; endY = 120;
    } else if (theme === 'medical') {
        endX = 110; endY = 70;
    } else if (theme === 'arabic') {
        endX = 200; endY = 60;
    } else if (theme === 'media') {
        endX = 290; endY = 70;
    } else if (theme === 'tools') {
        endX = 360; endY = 120;
    }
    
    const t = total > 1 ? index / (total - 1) * 0.85 + 0.1 : 0.5
    const wobble = Math.sin(index * 4) * 14
    
    const x = startX + (endX - startX) * t + wobble
    const y = startY + (endY - startY) * t - Math.sin(t * Math.PI) * 20
    
    return { x, y }
}

interface ArsenalProps {
    repos: Array<GithubRepo>
    refreshing: boolean
}

export const Arsenal = ({ repos, refreshing }: ArsenalProps) => {
    const [viewMode, setViewMode] = useState<'canopy' | 'list'>('canopy')
    const [query, setQuery] = useState('')
    const [theme, setTheme] = useState<ThemeFilter>('all')
    const [sort, setSort] = useState<SortKey>('recent')
    const [hideForks, setHideForks] = useState(false)
    const [visible, setVisible] = useState(PAGE)
    const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null)
    const [discoveredRelics, setDiscoveredRelics] = useState<Set<string>>(new Set())

    // Load initial relic state
    useEffect(() => {
        const saved = localStorage.getItem('knight-discovered-relics')
        if (saved) {
            try {
                setDiscoveredRelics(new Set(JSON.parse(saved)))
            } catch {}
        }
    }, [])

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

    const handleSelectRepo = (repo: GithubRepo) => {
        setSelectedRepo(repo)
        if (sound) sound.playDulcimer()

        // If it's a featured repo, discover it!
        const featuredSlugs = ['claudio', 'zeroqcm', 'forge', 'serve', 'huroof-abdo', 'relearn']
        if (featuredSlugs.includes(repo.name.toLowerCase())) {
            const nextDiscovered = new Set(discoveredRelics)
            nextDiscovered.add(repo.name.toLowerCase())
            setDiscoveredRelics(nextDiscovered)
            localStorage.setItem('knight-discovered-relics', JSON.stringify(Array.from(nextDiscovered)))
        }
    }

    // Group repos for spatial tree layout
    const treeLeaves = useMemo(() => {
        const grouped: Record<ThemeKey, Array<{ repo: GithubRepo; x: number; y: number }>> = {
            ai: [], medical: [], arabic: [], media: [], tools: []
        }
        
        // Split repos by theme
        THEME_ORDER.forEach((tKey) => {
            const themeRepos = repos.filter((r) => r.theme === tKey)
            themeRepos.forEach((repo, idx) => {
                const pos = getLeafPosition(tKey, idx, themeRepos.length)
                grouped[tKey].push({ repo, ...pos })
            })
        })

        return grouped
    }, [repos])

    return (
        <Section id='arsenal' size='wide'>
            <div className='flex flex-wrap items-end justify-between gap-4'>
                <SectionHeading
                    title='The Repository Observatory'
                    description='Search the spells, filter by realms, or navigate the spatial tree canopy of 89 public builds.'
                />

                {/* View toggles */}
                <div className='flex items-center gap-2 bg-bg-sunken border border-border/50 p-1 rounded-full relative z-10'>
                    <button
                        onClick={() => {
                            setViewMode('canopy')
                            if (sound) sound.playTick()
                        }}
                        className={cn(
                            'px-4 py-1 text-xs font-pixel rounded-full transition-all',
                            viewMode === 'canopy' ? 'bg-accent text-accent-ink' : 'text-ink-tertiary hover:text-ink-secondary'
                        )}
                    >
                        Canopy Tree
                    </button>
                    <button
                        onClick={() => {
                            setViewMode('list')
                            if (sound) sound.playTick()
                        }}
                        className={cn(
                            'px-4 py-1 text-xs font-pixel rounded-full transition-all',
                            viewMode === 'list' ? 'bg-accent text-accent-ink' : 'text-ink-tertiary hover:text-ink-secondary'
                        )}
                    >
                        Scroll List
                    </button>
                </div>
            </div>

            {/* Quest Relic Log in Toolbar */}
            {discoveredRelics.size > 0 && (
                <div className='mt-3 flex items-center gap-2.5 px-4 py-2 bg-bg-sunken/40 border border-border/40 rounded-lg w-fit'>
                    <span className='font-pixel text-[8px] text-accent tracking-widest uppercase'>QUEST RELICS FOUND:</span>
                    <div className='flex items-center gap-1.5'>
                        {['zeroqcm', 'claudio', 'forge', 'huroof-abdo', 'serve', 'relearn'].map((slug) => {
                            const found = discoveredRelics.has(slug)
                            return (
                                <span 
                                    key={slug} 
                                    className={cn(
                                        'size-4.5 rounded border grid place-items-center font-pixel text-[9px] font-bold transition-all',
                                        found 
                                            ? 'bg-accent border-accent text-accent-ink shadow-[0_0_6px_#F6C64E]' 
                                            : 'bg-bg-sunken border-border/50 text-ink-tertiary opacity-30'
                                    )}
                                    title={found ? `Sigil of ${slug} discovered!` : `Discover ${slug} relic`}
                                >
                                    {slug[0].toUpperCase()}
                                </span>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Toolbar filter/search panel */}
            <Reveal className='mt-6'>
                <div className='border border-border/50 bg-bg-raised/40 p-4 sm:p-5 rounded-[var(--radius-glass-lg)] flex flex-col gap-4 relative z-20 shadow-sm'>
                    <div className='flex flex-col gap-3 lg:flex-row lg:items-center'>
                        <div className='relative flex-1'>
                            <Search className='pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-tertiary' />
                            <input
                                type='search'
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value)
                                    resetPage()
                                    if (sound && e.target.value) sound.playSpell()
                                }}
                                placeholder='Cast a search query — try "agent", "medical", "zero"…'
                                className='gx-input pl-11 bg-bg-sunken border-border/70 font-sans text-sm focus:border-accent text-ink placeholder:text-ink-tertiary'
                                aria-label='Search repositories'
                            />
                        </div>

                        <div className='flex items-center gap-2'>
                            <div className='gx-seg border border-border/60 bg-bg-sunken'>
                                {SORTS.map((s) => (
                                    <button
                                        key={s.key}
                                        type='button'
                                        onClick={() => {
                                            setSort(s.key)
                                            if (sound) sound.playTick()
                                        }}
                                        data-active={sort === s.key}
                                        className='gx-seg-item font-pixel text-[10px]'
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
                                    if (sound) sound.playTick()
                                }}
                                data-active={hideForks}
                                className={cn(
                                    'gx-seg-item h-[42px] gap-1.5 px-3.5 border border-border/60 bg-bg-sunken rounded-full text-xs font-pixel transition-colors',
                                    hideForks ? 'text-accent border-accent/40 bg-accent-soft' : 'text-ink-tertiary'
                                )}
                                aria-pressed={hideForks}
                            >
                                <GitFork className='size-3.5' />
                                <span>No forks</span>
                            </button>
                        </div>
                    </div>

                    {/* Theme Filters */}
                    <div className='no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1'>
                        <SlidersHorizontal className='size-3.5 shrink-0 text-ink-tertiary' />
                        <FilterChip
                            active={theme === 'all'}
                            label='All Realms'
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

            {/* VIEW MODE CONTAINER */}
            <div className='mt-6 relative z-10'>
                {viewMode === 'canopy' ? (
                    /* SPATIAL TREE VIEW */
                    <div className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr] min-h-[500px] border border-border/40 bg-bg-raised/20 rounded-[var(--radius-glass-xl)] p-5 relative overflow-hidden shadow-inner'>
                        {/* Spatial Tree SVG Map */}
                        <div className='flex flex-col items-center justify-center bg-bg-sunken/40 border border-border/30 rounded-xl p-4 min-h-[400px] relative'>
                            <span className='absolute left-4 top-4 font-display text-xs italic text-ink-tertiary'>Almanac Canopy</span>
                            
                            <svg className='w-full max-w-[450px] h-[400px]' viewBox='0 0 400 350' fill='none'>
                                {/* Tree Trunk */}
                                <path d='M 200 350 C 200 310, 190 290, 200 270' stroke='#8D6C2E' strokeWidth='8' strokeLinecap='round' opacity='0.7' />
                                
                                {/* Branch 1: AI (Left Up) */}
                                <path d='M 200 270 C 170 230, 90 190, 40 120' stroke='#8D6C2E' strokeWidth='3' strokeLinecap='round' opacity={theme === 'all' || theme === 'ai' ? '0.6' : '0.15'} />
                                {/* Branch 2: Med-Tech (Left Center) */}
                                <path d='M 200 270 C 180 220, 140 150, 110 70' stroke='#8D6C2E' strokeWidth='3.5' strokeLinecap='round' opacity={theme === 'all' || theme === 'medical' ? '0.6' : '0.15'} />
                                {/* Branch 3: Arabic (Center Up) */}
                                <path d='M 200 270 C 200 210, 200 130, 200 60' stroke='#8D6C2E' strokeWidth='3' strokeLinecap='round' opacity={theme === 'all' || theme === 'arabic' ? '0.6' : '0.15'} />
                                {/* Branch 4: Media (Right Center) */}
                                <path d='M 200 270 C 220 220, 260 150, 290 70' stroke='#8D6C2E' strokeWidth='3.5' strokeLinecap='round' opacity={theme === 'all' || theme === 'media' ? '0.6' : '0.15'} />
                                {/* Branch 5: Tools (Right Up) */}
                                <path d='M 200 270 C 230 230, 310 190, 360 120' stroke='#8D6C2E' strokeWidth='3' strokeLinecap='round' opacity={theme === 'all' || theme === 'tools' ? '0.6' : '0.15'} />

                                {/* Branch Area Text Labels */}
                                <g className='font-pixel text-[6px] tracking-wide fill-ink-tertiary select-none' opacity='0.4'>
                                    <text x='15' y='145'>THE FORGE</text>
                                    <text x='70' y='60'>THE CLINIC</text>
                                    <text x='185' y='45'>THE GROVE</text>
                                    <text x='305' y='60'>BROADCAST</text>
                                    <text x='345' y='145'>WORKSHOP</text>
                                </g>

                                {/* Render Leaf Nodes */}
                                {THEME_ORDER.map((tKey) => {
                                    const leaves = treeLeaves[tKey]
                                    const activeTheme = theme === 'all' || theme === tKey
                                    
                                    return leaves.map(({ repo, x, y }) => {
                                        // Check if matches search query
                                        const matchesSearch = query === '' || 
                                            repo.name.toLowerCase().includes(query.toLowerCase()) ||
                                            (repo.description ?? '').toLowerCase().includes(query.toLowerCase())
                                            
                                        const isSelected = selectedRepo?.id === repo.id
                                        const finalOpacity = activeTheme && matchesSearch ? (isSelected ? '1.0' : '0.85') : '0.12'
                                        
                                        return (
                                            <g 
                                                key={repo.id}
                                                className='cursor-pointer'
                                                onClick={() => handleSelectRepo(repo)}
                                                onMouseEnter={() => {
                                                    if (sound && activeTheme && matchesSearch) sound.playTick()
                                                }}
                                            >
                                                {/* Outer selection glow */}
                                                {isSelected && (
                                                    <circle 
                                                        cx={x} 
                                                        cy={y} 
                                                        r='9' 
                                                        fill='none' 
                                                        stroke='#F6C64E' 
                                                        strokeWidth='1.5' 
                                                        className='animate-ping'
                                                    />
                                                )}
                                                {/* Leaf Body */}
                                                <circle 
                                                    cx={x} 
                                                    cy={y} 
                                                    r={isSelected ? '6' : repo.stars > 2 ? '4.5' : '3'} 
                                                    fill={isSelected ? '#FFF1A6' : repo.isFork ? '#5A7BA8' : '#F6C64E'} 
                                                    stroke={isSelected ? '#F6C64E' : 'none'}
                                                    opacity={finalOpacity}
                                                    className={cn(
                                                        'transition-all duration-300',
                                                        matchesSearch && query !== '' && 'animate-pulse'
                                                    )}
                                                />
                                            </g>
                                        )
                                    })
                                })}
                            </svg>

                            {/* Brief Map legend */}
                            <div className='flex gap-4 font-pixel text-[8px] text-ink-tertiary border-t border-border/20 pt-2 w-full justify-center'>
                                <span className='flex items-center gap-1'><span className='size-1.5 rounded-full bg-accent' /> Original Repo</span>
                                <span className='flex items-center gap-1'><span className='size-1.5 rounded-full bg-ink-tertiary' /> Forked</span>
                                <span className='flex items-center gap-1'><span className='size-1.5 rounded-full bg-accent border border-accent animate-pulse' /> Matches Search</span>
                            </div>
                        </div>

                        {/* Side Codex Drawer */}
                        <div className='flex flex-col border border-border/40 bg-bg-raised/30 rounded-xl p-5 min-h-[300px]'>
                            {selectedRepo ? (
                                <div className='flex flex-col h-full animate-fade-in'>
                                    {/* Codex header */}
                                    <div className='border-b border-border/30 pb-3 mb-4'>
                                        <span className='font-pixel text-[8px] text-accent tracking-widest block uppercase'>
                                            {selectedRepo.theme} RELIC CODEX
                                        </span>
                                        <h3 className='font-display text-xl font-bold text-ink leading-tight mt-1'>
                                            {selectedRepo.name}
                                        </h3>
                                        <span className='font-mono text-[9px] text-ink-tertiary block mt-1'>
                                            Updated {new Date(selectedRepo.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className='text-xs leading-relaxed text-ink-secondary mb-4 flex-1'>
                                        {selectedRepo.description ?? 'An experiment cataloged within the KNIGHT observer.'}
                                    </p>

                                    {/* Language and Stats */}
                                    <div className='grid grid-cols-2 gap-3 p-3 bg-bg-sunken/50 border border-border/30 rounded-lg text-xs font-mono text-ink-secondary mb-4'>
                                        <div>
                                            <span className='text-[10px] text-ink-tertiary block font-pixel'>RUNE LANGUAGE</span>
                                            <span className='font-semibold text-ink'>{selectedRepo.language ?? '—'}</span>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <div>
                                                <span className='text-[10px] text-ink-tertiary block font-pixel'>STARS</span>
                                                <span className='font-semibold text-ink'>★ {selectedRepo.stars}</span>
                                            </div>
                                            <div>
                                                <span className='text-[10px] text-ink-tertiary block font-pixel'>FORKS</span>
                                                <span className='font-semibold text-ink'>⑂ {selectedRepo.forks}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Topics */}
                                    {selectedRepo.topics.length > 0 && (
                                        <div className='mb-6'>
                                            <span className='font-pixel text-[8px] text-ink-tertiary block mb-1.5 uppercase'>SIGILS & TAGS</span>
                                            <div className='flex flex-wrap gap-1'>
                                                {selectedRepo.topics.map((t) => (
                                                    <span key={t} className='font-pixel text-[8px] border border-border/50 text-ink-tertiary px-1.5 py-0.5 rounded'>
                                                        #{t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Launch buttons */}
                                    <div className='flex items-center gap-2 mt-auto pt-3 border-t border-border/30'>
                                        {selectedRepo.homepage && (
                                            <a
                                                href={selectedRepo.homepage}
                                                target='_blank'
                                                rel='noreferrer'
                                                onClick={() => sound?.playDulcimer()}
                                                className='flex-1 justify-center gx-btn gx-btn-primary h-9 font-pixel text-[9px] bg-gradient-to-b from-accent to-accent-hover text-accent-ink border border-tarnished/30'
                                            >
                                                <ExternalLink className='size-3.5' /> LAUNCH DEMO
                                            </a>
                                        )}
                                        <a
                                            href={selectedRepo.htmlUrl}
                                            target='_blank'
                                            rel='noreferrer'
                                            onClick={() => sound?.playTick()}
                                            className='flex-1 justify-center gx-btn gx-btn-secondary h-9 border border-border/60 text-ink bg-bg-raised/40 hover:border-accent font-pixel text-[9px]'
                                        >
                                            <Code2 className='size-3.5' /> VIEW SOURCE
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className='flex flex-col items-center justify-center text-center py-16 flex-1 opacity-70'>
                                    <EyeOff className='size-8 text-ink-tertiary mb-3' />
                                    <p className='font-display text-sm font-bold text-ink'>Codex Locked</p>
                                    <p className='text-xs text-ink-secondary max-w-[200px] mt-1'>Select an interactive leaf from the spatial tree canopy to decrypt its records.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* SCROLL LIST VIEW */
                    <div className='animate-fade-in'>
                        <div className='flex items-center justify-between text-xs text-ink-secondary mb-4 font-mono'>
                            <span>
                                Showing <span className='font-semibold text-accent'>{shown.length}</span> of{' '}
                                <span className='font-semibold text-ink'>{filtered.length}</span> spells
                            </span>
                            {refreshing && <span className='font-mono text-xs text-ink-tertiary animate-pulse'>syncing…</span>}
                        </div>

                        {shown.length > 0 ? (
                            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                                {shown.map((repo) => (
                                    <CompactRepoCard key={repo.id} repo={repo} />
                                ))}
                            </div>
                        ) : (
                            <div className='border border-border/40 bg-bg-raised/30 rounded-xl flex flex-col items-center gap-2 p-12 text-center'>
                                <p className='font-display text-base font-bold text-ink'>No repositories match your incantation.</p>
                                <p className='text-xs text-ink-secondary'>Modify the filters or cast another spell.</p>
                            </div>
                        )}

                        {visible < filtered.length && (
                            <div className='mt-8 flex justify-center'>
                                <button
                                    type='button'
                                    onClick={() => {
                                        setVisible((v) => v + PAGE)
                                        if (sound) sound.playTick()
                                    }}
                                    className='gx-btn gx-btn-secondary border border-border/60 text-ink bg-bg-raised/40 hover:border-accent font-pixel text-[9px]'
                                >
                                    Load more ({filtered.length - visible} remaining)
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
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
}) => {
    const handleClick = () => {
        onClick()
        if (sound) sound.playTick()
    }
    return (
        <button
            type='button'
            onClick={handleClick}
            data-active={active}
            className={cn(
                'gx-seg-item h-9 shrink-0 gap-1.5 border border-border/50 rounded-full px-4 text-[10px] font-pixel transition-colors',
                active ? 'text-accent border-accent/40 bg-accent-soft' : 'text-ink-tertiary bg-bg-raised/40'
            )}
        >
            {label}
            <span className={cn('font-mono text-[9px]', active ? 'text-accent' : 'text-ink-tertiary')}>
                {count}
            </span>
        </button>
    )
}
