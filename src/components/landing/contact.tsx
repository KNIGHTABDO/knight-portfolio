import type { GithubProfile } from '@/types/github'

import { ArrowUpRight } from 'lucide-react'

import { GITHUB } from '@/constants/github'

import Doodle from '@/components/sketch/doodle'
import Mark from '@/components/sketch/mark'
import Reveal from '@/components/sketch/reveal'
import SketchBox from '@/components/sketch/sketch-box'

import { planeDoodle } from '@/components/landing/doodles'

interface ContactProps {
    profile: GithubProfile
}

const Contact = ({ profile }: ContactProps) => (
    <section id='contact' aria-labelledby='contact-title' className='relative mx-auto max-w-6xl px-5 pt-28 sm:px-8 sm:pt-40'>
        <Reveal className='relative text-center'>
            <p className='font-mono text-[0.7rem] uppercase tracking-[0.22em] text-graphite-faint'>§ 05 — the door is open</p>
            <div className='relative mx-auto mt-6 w-fit'>
                <span aria-hidden='true' lang='ar' className='pointer-events-none absolute -right-3 -top-[1.2em] rotate-[-7deg] font-arabic text-[clamp(2.4rem,5.5vw,4.4rem)] leading-none text-pink sm:-right-10'>
                    سلام
                </span>
                <h2 id='contact-title' className='font-display text-[clamp(3.6rem,11vw,9.5rem)] leading-[0.9] tracking-[-0.02em] text-graphite'>
                    Say <em className='italic'>salam.</em>
                </h2>
            </div>
            <p className='mx-auto mt-8 max-w-xl text-lg leading-relaxed text-graphite-soft sm:text-xl'>
                Building something with AI, for students, or for the Arabic-speaking web?{' '}
                <Mark kind='underline' ink='text-blue' seed={33}>Bring me a difficult idea.</Mark> The fastest way to reach me is GitHub.
            </p>

            <div className='mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-5'>
                <a href={GITHUB.profileUrl} target='_blank' rel='noreferrer' className='boil-hover group relative inline-flex items-center gap-2 px-6 py-3 font-hand text-[1.8rem] leading-none text-graphite'>
                    find me at @{profile.login}
                    <ArrowUpRight className='size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
                    <SketchBox seed={71} width={2.2} drawOn />
                </a>
                <a href='https://zeroqcm.me' target='_blank' rel='noreferrer' className='group inline-flex items-center gap-1.5 font-hand text-[1.8rem] leading-none text-graphite-soft hover:text-graphite'>
                    <span className='marker-hover'>or try ZeroQCM</span>
                    <ArrowUpRight className='size-5' />
                </a>
            </div>

            <div className='mx-auto mt-10 w-full max-w-md opacity-90'>
                <Doodle draw={planeDoodle} width={400} height={200} idle label='A paper plane looping on a dotted line' />
            </div>
        </Reveal>
    </section>
)

export default Contact
