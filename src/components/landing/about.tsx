import type { GithubProfile } from '@/types/github'

import { useState } from 'react'

import { ACHIEVEMENTS } from '@/constants/github'
import { LEDGER } from '@/constants/content'

import Doodle from '@/components/sketch/doodle'
import Mark from '@/components/sketch/mark'
import Reveal from '@/components/sketch/reveal'
import Tape from '@/components/sketch/tape'
import SectionHead from '@/components/landing/section-head'

import { heartDoodle, laptopDoodle } from '@/components/landing/doodles'

interface AboutProps {
    profile: GithubProfile
}

/** A rubber stamp, a little crooked, in riso ink. */
const Stamp = ({ name, tier, blurb, i }: { name: string; tier: string; blurb: string; i: number }) => {
    const inks = ['text-pink', 'text-blue', 'text-green']
    return (
        <div className='flex items-center gap-3' title={blurb}>
            <svg viewBox='0 0 84 84' className={`size-16 shrink-0 ${inks[i % 3]}`} style={{ rotate: `${[-8, 6, -3][i % 3]}deg` }} aria-hidden='true'>
                <defs>
                    <path id={`stamp-${i}`} d='M42 42 m-29 0 a29 29 0 1 1 58 0 a29 29 0 1 1 -58 0' />
                </defs>
                <circle cx='42' cy='42' r='38' fill='none' stroke='currentColor' strokeWidth='2.4' strokeDasharray='190 4 30 3' />
                <circle cx='42' cy='42' r='20' fill='none' stroke='currentColor' strokeWidth='1.4' opacity='.8' />
                <text fontSize='9.5' letterSpacing='1.6' fill='currentColor' className='font-mono uppercase'>
                    <textPath href={`#stamp-${i}`}>{`${name} · ${name} ·`}</textPath>
                </text>
                <text x='42' y='47' textAnchor='middle' fontSize='15' fill='currentColor' className='font-hand'>
                    {tier || '!'}
                </text>
            </svg>
            <div className='leading-tight'>
                <p className='font-hand text-xl text-graphite'>{name}</p>
                <p className='text-sm text-graphite-faint'>{blurb}</p>
            </div>
        </div>
    )
}

const About = ({ profile }: AboutProps) => {
    const [hover, setHover] = useState<'clinic' | 'workshop' | null>(null)

    return (
        <section id='about' aria-labelledby='about-title' className='relative mx-auto max-w-6xl px-5 pt-24 sm:px-8 sm:pt-32'>
            <SectionHead
                id='about-title'
                index='01'
                kicker='two notebooks'
                title={<>One head, <em className='italic'>two notebooks.</em></>}
                aside={<span className='inline-block rotate-[-1.5deg]'>same habit in both: look closely, then fix it.</span>}
            />

            <Reveal className='relative mt-14' tilt={-0.4}>
                <div className='paper-card relative grid md:grid-cols-2'>
                    <Tape className='-top-3 left-[18%]' rotate={-5} />
                    <Tape className='-top-3 right-[16%]' rotate={4} />
                    {/* the spine */}
                    <div aria-hidden='true' className='pointer-events-none absolute inset-y-0 left-1/2 hidden w-16 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.07)_45%,rgba(0,0,0,0.11)_50%,rgba(0,0,0,0.05)_55%,transparent)] md:block' />

                    <article
                        className='ruled relative px-7 pb-10 pt-9 sm:px-10'
                        onMouseEnter={() => setHover('clinic')}
                        onMouseLeave={() => setHover(null)}
                    >
                        <p className='font-mono text-[0.68rem] uppercase tracking-[0.2em] text-pink'>left page · the clinic</p>
                        <h3 className='mt-3 font-display text-4xl leading-none'>By day, <em className='italic'>medicine.</em></h3>
                        <div className='mx-auto mt-4 w-40 sm:float-right sm:-mr-2 sm:ml-3 sm:mt-2 sm:w-44'>
                            <Doodle draw={heartDoodle} width={300} height={300} idle label='A pencil heart, beating' />
                        </div>
                        <p className='mt-5 text-[1.08rem] leading-8 text-graphite-soft'>
                            I&apos;m in my second year at the Faculty of Medicine and Pharmacy of Casablanca. Medicine is teaching me to observe before acting:
                            take the history, read the signs, find what is actually wrong, and only then treat it.
                        </p>
                        <p className='mt-4 font-hand text-2xl text-graphite'>
                            anatomy, physiology, <Mark kind='underline' ink='text-pink' seed={21}>a lot of QCMs</Mark>
                        </p>
                    </article>

                    <article
                        className='squared relative border-t border-dashed border-rule-strong px-7 pb-10 pt-9 sm:px-10 md:border-l md:border-t-0 md:border-solid md:border-rule'
                        onMouseEnter={() => setHover('workshop')}
                        onMouseLeave={() => setHover(null)}
                    >
                        <p className='font-mono text-[0.68rem] uppercase tracking-[0.2em] text-blue'>right page · the workshop</p>
                        <h3 className='mt-3 font-display text-4xl leading-none'>By night, <em className='italic'>software.</em></h3>
                        <div className='mx-auto mt-4 w-44 sm:float-right sm:-mr-2 sm:ml-3 sm:mt-3 sm:w-48'>
                            <Doodle draw={laptopDoodle} width={300} height={220} idle label='A laptop typing code at 2am' />
                        </div>
                        <p className='mt-5 text-[1.08rem] leading-8 text-graphite-soft'>
                            I never studied computer science. I learned by shipping: I test every new language model the week it lands, build with the good ones,
                            and publish everything. That is how ZeroQCM, FORGE and Claudio happened.
                        </p>
                        <p className='mt-4 font-hand text-2xl text-graphite'>
                            {profile.publicRepos} repos, {profile.followers} followers, <Mark kind='circle' ink='text-blue' seed={27}>zero CS degrees</Mark>
                        </p>
                    </article>
                </div>

                <p aria-hidden='true' className={`pointer-events-none absolute -bottom-9 left-1/2 hidden -translate-x-1/2 font-hand text-2xl text-pink transition-opacity duration-300 md:block ${hover ? 'opacity-100' : 'opacity-0'}`}>
                    {hover === 'clinic' ? '← diagnose' : '→ debug'} · same muscle
                </p>
            </Reveal>

            <div className='mt-20 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20'>
                <Reveal>
                    <h3 className='font-hand text-3xl text-graphite'>the ledger</h3>
                    <dl className='mt-4'>
                        {LEDGER.map(([term, detail]) => (
                            <div key={term} className='flex flex-col gap-1 border-b border-dashed border-rule py-2.5 sm:flex-row sm:items-baseline sm:gap-3 sm:border-0'>
                                <dt className='shrink-0 font-mono text-xs uppercase tracking-[0.16em] text-graphite-faint'>{term}</dt>
                                <span aria-hidden='true' className='leader hidden sm:block' />
                                <dd className='text-[1.05rem] text-graphite sm:text-right'>{detail}</dd>
                            </div>
                        ))}
                    </dl>
                </Reveal>
                <Reveal delay={120}>
                    <h3 className='font-hand text-3xl text-graphite'>stamps from github</h3>
                    <div className='mt-6 flex flex-col gap-6'>
                        {ACHIEVEMENTS.map((a, i) => (
                            <Stamp key={a.name} {...a} i={i} />
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    )
}

export default About
