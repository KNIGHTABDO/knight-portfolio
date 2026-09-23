import type { GithubProfile } from '@/types/github'

import { ArrowDown, ArrowUpRight } from 'lucide-react'

import { GITHUB } from '@/constants/github'

import HandArrow from '@/components/sketch/hand-arrow'
import Mark from '@/components/sketch/mark'
import SketchBox from '@/components/sketch/sketch-box'
import HeroFilm from '@/components/landing/hero-film'

interface HeroProps {
    profile: GithubProfile
}

const Hero = ({ profile }: HeroProps) => {
    return (
        <section id='top' aria-labelledby='hero-title' className='relative overflow-x-clip'>
            <div className='relative z-10 mx-auto max-w-6xl px-5 pt-28 sm:px-8 sm:pt-36'>
                <p className='font-mono text-[0.7rem] uppercase tracking-[0.22em] text-graphite-faint'>
                    the sketchbook of @{profile.login} · casablanca
                </p>

                <h1 id='hero-title' className='mt-5 font-display text-[clamp(2.9rem,6.5vw,6.4rem)] leading-[0.94] tracking-[-0.015em] text-graphite'>
                    I study the{' '}
                    <Mark kind='circle' ink='text-pink' seed={11} delay={0.6} width={3}>
                        heart
                    </Mark>{' '}
                    by day,
                    <br className='hidden sm:block' /> and build <em className='italic'>software</em>{' '}
                    <Mark kind='zigzag' ink='text-blue' seed={4} delay={1.2} width={2.4}>
                        by night.
                    </Mark>
                </h1>

                <div className='mt-7 max-w-xl sm:mt-9'>
                    <p className='text-lg leading-relaxed text-graphite-soft sm:text-[1.3rem]'>
                        I&apos;m Abdo; online I go by <span className='text-graphite'>KNIGHT</span>. Second-year medical student at FMPC,
                        self-taught maker of AI tools, med-tech and Arabic-first apps.{' '}
                        <span className='marker text-graphite'>{profile.publicRepos} repositories</span> so far, every one of them in the open.
                    </p>

                    <div className='mt-8 flex flex-wrap items-center gap-x-7 gap-y-4'>
                        <a href='#work' className='boil-hover group relative inline-flex items-center gap-2 px-5 py-2.5 font-hand text-[1.6rem] leading-none text-graphite'>
                            see what I made
                            <ArrowDown className='size-5 transition-transform duration-200 group-hover:translate-y-1' />
                            <SketchBox seed={3} width={2} drawOn delay={1.4} />
                        </a>
                        <a href={GITHUB.profileUrl} target='_blank' rel='noreferrer' className='group inline-flex items-center gap-1.5 font-hand text-[1.6rem] leading-none text-graphite-soft hover:text-graphite'>
                            <span className='marker-hover'>github</span>
                            <ArrowUpRight className='size-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
                        </a>
                    </div>
                </div>
            </div>

            <div className='relative -mt-[42vw] sm:-mt-[min(26.4vw,507px)]'>
                <HeroFilm />
                <div className='absolute left-[72%] top-[24%] hidden w-56 lg:block'>
                    <p className='rotate-[-4deg] font-hand text-[1.45rem] leading-tight text-graphite-soft'>
                        that&apos;s me, keeping pace with the ECG
                    </p>
                    <HandArrow width={90} height={70} from={[62, 6]} to={[14, 62]} seed={8} bend={-0.3} className='ml-2 mt-1 text-graphite-soft' delay={1.8} />
                </div>
            </div>
        </section>
    )
}

export default Hero
