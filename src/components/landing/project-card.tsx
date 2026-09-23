import type { Project } from '@/constants/content'
import type { GithubRepo } from '@/types/github'
import type { DoodleDraw } from '@/components/sketch/doodle'

import { useState } from 'react'
import { ArrowUpRight, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

import Doodle from '@/components/sketch/doodle'
import Reveal from '@/components/sketch/reveal'
import SketchBox from '@/components/sketch/sketch-box'
import Tape from '@/components/sketch/tape'

import {
    anvilDoodle,
    bookDoodle,
    chatDoodle,
    hexDoodle,
    qcmDoodle,
    radioDoodle
} from '@/components/landing/doodles'

const DOODLES: Record<Project['doodle'], DoodleDraw> = {
    qcm: qcmDoodle,
    anvil: anvilDoodle,
    radio: radioDoodle,
    hex: hexDoodle,
    book: bookDoodle,
    chat: chatDoodle
}

interface ProjectCardProps {
    project: Project
    repo?: GithubRepo
    index: number
    wide?: boolean
    tilt?: number
}

/** A pinned index card: a live pencil doodle above, the story below. */
const ProjectCard = ({ project, repo, index, wide = false, tilt = 0 }: ProjectCardProps) => {
    const [active, setActive] = useState(false)
    const live = project.live ?? repo?.homepage ?? undefined

    return (
        <Reveal tilt={tilt} delay={(index % 3) * 90} className={cn('h-full', wide && 'lg:col-span-2')}>
            <article
                className={cn(
                    'boil-hover paper-card group relative flex h-full flex-col transition-[rotate,translate] duration-300 hover:-translate-y-1.5 hover:rotate-[0.4deg]',
                    wide && 'lg:grid lg:grid-cols-[1.3fr_1fr]'
                )}
                onMouseEnter={() => setActive(true)}
                onMouseLeave={() => setActive(false)}
                onFocus={() => setActive(true)}
                onBlur={() => setActive(false)}
                onTouchStart={() => setActive(true)}
            >
                <Tape className={cn('-top-3', index % 2 ? 'right-8' : 'left-8')} rotate={index % 2 ? 5 : -4} />
                <div className={cn('relative border-b border-dashed border-rule-strong p-4', wide && 'lg:flex lg:flex-col lg:justify-center lg:border-b-0 lg:border-r lg:p-5')}>
                    <Doodle draw={DOODLES[project.doodle]} width={400} height={300} active={active} label={`${project.name}, drawn in pencil`} />
                    <span className='absolute left-4 top-3 font-mono text-[0.68rem] tracking-[0.2em] text-graphite-faint'>{String(index + 1).padStart(2, '0')}</span>
                </div>

                <div className={cn('flex flex-1 flex-col p-6 sm:p-7', wide && 'lg:justify-center lg:p-10')}>
                    <div className='flex items-baseline justify-between gap-4'>
                        <h3 className={cn('font-display leading-none text-graphite', wide ? 'text-5xl sm:text-6xl' : 'text-4xl')}>
                            {project.name}
                            {project.arabic && <span className='ml-3 font-arabic text-2xl text-pink' lang='ar' dir='rtl'>{project.arabic}</span>}
                        </h3>
                        {repo && repo.stars > 0 && (
                            <span className='flex shrink-0 items-center gap-1 font-mono text-xs text-graphite-faint' title='GitHub stars'>
                                <Star className='size-3.5' /> {repo.stars}
                            </span>
                        )}
                    </div>
                    <p className='mt-3 font-display text-xl italic leading-snug text-graphite-soft'>{project.line}</p>
                    <p className='mt-3 text-[1.02rem] leading-7 text-graphite-soft'>{project.story}</p>

                    {project.stat && (
                        <p className='mt-5 flex items-baseline gap-2'>
                            <span className='font-display text-5xl leading-none text-graphite'>{project.stat.value}</span>
                            <span className='font-hand text-2xl text-pink'>{project.stat.label}</span>
                        </p>
                    )}

                    <p className='mt-5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-graphite-faint'>{project.tags.join(' · ')}</p>

                    <div className='mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-6'>
                        {live && (
                            <a href={live} target='_blank' rel='noreferrer' className='relative inline-flex items-center gap-1.5 px-3.5 py-1.5 font-hand text-xl leading-none text-graphite'>
                                open it <ArrowUpRight className='size-4' />
                                <SketchBox seed={40 + index} width={1.6} bleed={2} />
                            </a>
                        )}
                        <a href={project.repo} target='_blank' rel='noreferrer' className='inline-flex items-center gap-1.5 font-hand text-xl leading-none text-graphite-soft hover:text-graphite'>
                            <span className='marker-hover'>read the code</span> <ArrowUpRight className='size-4' />
                        </a>
                        <span className='ml-auto rotate-[-3deg] font-hand text-lg text-blue'>{project.note}</span>
                    </div>
                </div>
            </article>
        </Reveal>
    )
}

export default ProjectCard
