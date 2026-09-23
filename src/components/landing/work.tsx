import type { GithubProfile, GithubRepo } from '@/types/github'

import { useMemo } from 'react'
import { ArrowDown } from 'lucide-react'

import { PROJECTS } from '@/constants/content'

import HandArrow from '@/components/sketch/hand-arrow'
import Reveal from '@/components/sketch/reveal'
import ProjectCard from '@/components/landing/project-card'
import SectionHead from '@/components/landing/section-head'

interface WorkProps {
    repos: Array<GithubRepo>
    profile: GithubProfile
}

const TILTS = [-0.5, 0.9, -0.8, 0.5, -0.4, 0.7]

const Work = ({ repos, profile }: WorkProps) => {
    const byName = useMemo(() => new Map(repos.map((r) => [r.name.toLowerCase(), r])), [repos])
    const rest = Math.max(0, profile.publicRepos - PROJECTS.length)

    return (
        <section id='work' aria-labelledby='work-title' className='relative mx-auto max-w-6xl px-5 pt-28 sm:px-8 sm:pt-40'>
            <SectionHead
                id='work-title'
                index='02'
                kicker='selected work'
                title={<>Things I made, <em className='italic'>pinned to the wall.</em></>}
                aside={<span className='inline-block rotate-[1deg]'>hover a card: the drawing does its job.</span>}
            />

            <div className='mt-16 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3'>
                {PROJECTS.map((p, i) => (
                    <ProjectCard key={p.slug} project={p} repo={byName.get(p.slug)} index={i} wide={i === 0} tilt={TILTS[i]} />
                ))}
                <Reveal tilt={1.2} className='flex flex-col items-start justify-center gap-2 px-4 py-6 lg:col-span-2 lg:items-center lg:text-center'>
                    <p className='font-hand text-[2.1rem] leading-tight text-graphite'>…and {rest} more on the shelf below.</p>
                    <p className='max-w-md text-graphite-soft'>Experiments, forks I learned from, half-finished ideas. All of it is public, because that is how I learn.</p>
                    <a href='#shelf' className='mt-2 inline-flex items-center gap-2 font-hand text-2xl text-blue hover:underline'>
                        take me there <ArrowDown className='size-5' />
                    </a>
                    <HandArrow width={120} height={80} from={[10, 10]} to={[92, 72]} seed={17} bend={0.35} className='mt-1 hidden text-graphite-faint lg:block' />
                </Reveal>
            </div>
        </section>
    )
}

export default Work
