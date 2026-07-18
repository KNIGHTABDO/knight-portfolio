import type { CSSProperties } from 'react'
import Image from 'next/image'

import type { GithubRepo, ThemeKey } from '@/types/github'
import { THEME_META, THEME_ORDER, countByTheme } from '@/lib/repo-utils'
import { languageColor } from '@/lib/format'
import { Section, SectionHeading } from '@/components/generals/section'
import { Reveal } from '@/components/generals/reveal'
import { sound } from '@/lib/sound'
import { CornerBrackets } from '@/components/generals/corner-brackets'
import { cn } from '@/lib/utils'

const REALM_MAP_NAMES: Record<ThemeKey, string> = {
    ai: 'The Forge',
    medical: 'The Clinic',
    arabic: 'The Grove',
    media: 'The Broadcast Tower',
    tools: 'The Workshop'
}

const REALM_COORDINATES: Record<ThemeKey, string> = {
    ai: 'LAT 45°N // INTELLIGENCE',
    medical: 'LAT 12°S // LIFE SYSTEMS',
    arabic: 'LAT 88°E // ARABIC HERITAGE',
    media: 'LAT 30°W // AUDIO-VISUAL',
    tools: 'LAT 00°X // CODER WORKBENCH'
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

    const onZoneHover = () => {
        if (sound) sound.playTick()
    }

    return (
        <Section id='builds' size='wide' className='relative overflow-hidden'>
            {/* The Pixel Art Landscape Background (Right side of sequence) */}
            <div className='absolute right-0 top-0 bottom-0 w-full md:w-[60%] lg:w-[50%] z-0 pointer-events-none opacity-45 md:opacity-90 overflow-hidden'>
                <div className='relative w-full h-full scale-[1.06] translate-y-[-2%]'>
                    <Image
                        src='/bg-landscape.gif'
                        alt='Nocturne Landscape'
                        fill
                        unoptimized
                        className='object-cover object-center select-none'
                        style={{
                            imageRendering: 'pixelated'
                        }}
                    />
                </div>
                {/* Scrim gradients to ease the image into the background */}
                <div className='absolute inset-0 bg-gradient-to-r from-bg via-bg/40 to-transparent' />
                <div className='absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/50' />
            </div>

            <div className='relative z-10'>
                <SectionHeading
                    title='Five Realms, One Cartography'
                    description='Every public coordinate corresponds to one of five domains on the nocturne map.'
                />

                {/* Realms Map Grid */}
                <div className='mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
                    {THEME_ORDER.map((key, i) => {
                        const meta = THEME_META[key]
                        const examples = examplesFor(key)
                        const realmName = REALM_MAP_NAMES[key]
                        const coordinates = REALM_COORDINATES[key]

                        return (
                            <Reveal key={key} delay={(i % 3) * 90} className='h-full'>
                                <div 
                                    onMouseEnter={onZoneHover}
                                    className='group flex flex-col p-6 bg-bg-raised/35 hover:bg-bg-raised/70 rounded-[var(--radius-glass-md)] transition-all duration-300 relative overflow-hidden h-full shadow-md border border-transparent'
                                >
                                    <CornerBrackets />

                                    {/* Grid-like watermark background to simulate cartography */}
                                    <div className='absolute inset-0 bg-[linear-gradient(rgba(141,108,46,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(141,108,46,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none' />

                                    {/* Coordinates/Meta Header */}
                                    <div className='flex items-center justify-between border-b border-border/30 pb-3 mb-4 relative z-10 font-mono'>
                                        <span className='text-[9px] text-ink-tertiary group-hover:text-accent/80 transition-colors tracking-wider'>
                                            {coordinates}
                                        </span>
                                        <span className='font-pixel text-lg text-accent/15 group-hover:text-accent/30 transition-colors font-bold'>
                                            {String(counts[key]).padStart(2, '0')}
                                        </span>
                                    </div>

                                    {/* Index and Title */}
                                    <div className='flex items-center gap-3 mb-3 relative z-10'>
                                        <span className='font-display text-xs italic text-accent select-none w-14 shrink-0 text-left'>
                                            Domain 0{i+1}
                                        </span>
                                        <div>
                                            <span className='font-pixel text-[8px] tracking-widest text-accent uppercase block'>{meta.tagline}</span>
                                            <h3 className='font-display text-lg font-bold text-ink group-hover:text-accent transition-colors'>{realmName}</h3>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className='text-xs leading-relaxed text-ink-secondary flex-1 mb-5 relative z-10'>
                                        {meta.description}
                                    </p>

                                    {/* Top repos list */}
                                    <div className='border-t border-border/30 pt-4 mt-auto relative z-10'>
                                        <span className='font-pixel text-[8px] text-ink-tertiary block mb-2 tracking-widest uppercase'>TOP PROJECTS</span>
                                        <div className='flex flex-wrap gap-1.5'>
                                            {examples.map((repo) => (
                                                <span 
                                                    key={repo.id} 
                                                    className='font-pixel text-[9px] bg-bg-sunken border border-border/60 text-ink-secondary hover:text-accent hover:border-accent/40 px-2 py-1 rounded transition-all flex items-center gap-1 cursor-pointer'
                                                    onClick={() => {
                                                        if (sound) sound.playDulcimer()
                                                        window.open(repo.htmlUrl, '_blank')
                                                    }}
                                                >
                                                    <span
                                                        className='size-1.5 rounded-full'
                                                        style={{ background: languageColor(repo.language) } as CSSProperties}
                                                    />
                                                    {repo.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        )
                    })}
                </div>
            </div>

            {/* Signature marquee of every repo */}
            {marquee.length > 0 && (
                <div className='gx-marquee-track no-scrollbar relative mt-10 overflow-hidden py-3 border-t border-b border-border/25 bg-bg-raised/20' aria-hidden='true'>
                    <div
                        className='pointer-events-none absolute inset-y-0 left-0 z-10 w-20'
                        style={{ background: 'linear-gradient(90deg, var(--bg), transparent)' } as CSSProperties}
                    />
                    <div
                        className='pointer-events-none absolute inset-y-0 right-0 z-10 w-20'
                        style={{ background: 'linear-gradient(270deg, var(--bg), transparent)' } as CSSProperties}
                    />
                    <div className='gx-marquee gap-4'>
                        {[...marquee, ...marquee].map((repo, i) => (
                            <span 
                                key={`${repo.id}-${i}`} 
                                className='font-pixel text-[9px] text-ink-secondary hover:text-accent transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap'
                                onClick={() => window.open(repo.htmlUrl, '_blank')}
                            >
                                <span
                                    className='size-1.5 rounded-full'
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
export default Builds
