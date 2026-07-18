import {
    BriefcaseMedical,
    Cpu,
    Languages,
    MapPin,
    Rocket,
    Terminal
} from 'lucide-react'

import type { GithubProfile } from '@/types/github'

import { Section } from '@/components/generals/section'
import { Reveal } from '@/components/generals/reveal'

const TAGS = [
    'Vibe coder',
    'LLM tester-in-chief',
    'FMPC · Morocco',
    'AI agents',
    'Arabic-first',
    'Med-tech',
    'TypeScript',
    'Ships fast'
]

const FACTS = [
    { icon: MapPin, label: 'Based in', value: 'Morocco 🇲🇦' },
    { icon: BriefcaseMedical, label: 'Studies', value: 'Medicine · FMPC, 2nd year' },
    { icon: Terminal, label: 'Writes', value: 'TypeScript, Python, Rust' },
    { icon: Cpu, label: 'Obsessed with', value: 'AI agents & every new LLM' },
    { icon: Rocket, label: 'Flagship', value: 'zeroqcm.me — 215k+ QCM' },
    { icon: Languages, label: 'Builds for', value: 'Med students & Arabic speakers' }
]

interface AboutProps {
    profile: GithubProfile
}

export const About = ({ profile }: AboutProps) => {
    return (
        <Section id='about'>
            <div className='grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16'>
                <div className='flex flex-col gap-6'>
                    <span className='gx-chip gx-chip-accent w-fit font-mono uppercase tracking-[0.18em]'>
                        The operator
                    </span>
                    <Reveal>
                        <h2 className='font-display text-3xl font-bold leading-[1.05] tracking-tight text-ink sm:text-[2.75rem]'>
                            Med student by day,{' '}
                            <span className='text-accent'>agent-builder</span> by 2&nbsp;a.m.
                        </h2>
                    </Reveal>

                    <Reveal delay={80} className='flex flex-col gap-4 text-base leading-relaxed text-ink-secondary sm:text-lg'>
                        <p>
                            I&apos;m KNIGHT — a second-year medical student at FMPC in Morocco who fell
                            hard for building. I don&apos;t come from a computer-science background;
                            I&apos;m a <span className='font-semibold text-ink'>vibe coder</span> who
                            learns by shipping, and I test every AI model and LLM I can reach, then bend
                            the good ones into real products.
                        </p>
                        <p>
                            That loop turned into {profile.publicRepos}+ public repositories: autonomous
                            coding agents, LLM benchmarks, a cinematic AI radio, an Arabic letters game,
                            and <span className='font-semibold text-ink'>ZeroQCM</span> — a free revision
                            platform with 215,000+ questions for Moroccan med students like me.
                        </p>
                    </Reveal>

                    <Reveal delay={140} className='flex flex-wrap gap-2 pt-1'>
                        {TAGS.map((tag) => (
                            <span key={tag} className='gx-chip'>
                                {tag}
                            </span>
                        ))}
                    </Reveal>
                </div>

                <Reveal delay={100} scale>
                    <div className='gx-card p-2'>
                        <ul className='flex flex-col'>
                            {FACTS.map((fact, i) => (
                                <li
                                    key={fact.label}
                                    className='flex items-center gap-4 rounded-[var(--radius-glass-md)] px-4 py-3.5 transition-colors hover:bg-[var(--bg-hover)]'
                                    style={i < FACTS.length - 1 ? { borderBottom: '1px solid var(--border)' } : undefined}
                                >
                                    <span className='grid size-10 shrink-0 place-items-center rounded-[var(--radius-glass-sm)] bg-accent-soft text-accent'>
                                        <fact.icon className='size-5' />
                                    </span>
                                    <div className='min-w-0'>
                                        <p className='text-xs font-medium uppercase tracking-wider text-ink-tertiary'>
                                            {fact.label}
                                        </p>
                                        <p className='font-medium text-ink'>{fact.value}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Reveal>
            </div>
        </Section>
    )
}
