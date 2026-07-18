import { ArrowUpRight, Github, Sparkles } from 'lucide-react'

import type { GithubProfile } from '@/types/github'

import { GITHUB } from '@/constants/github'
import { Section } from '@/components/generals/section'
import { Reveal } from '@/components/generals/reveal'

const PRODUCTS = [
    { name: 'ZeroQCM', url: 'https://zeroqcm.me', desc: '215k+ medical QCM for Moroccan students' },
    { name: 'FORGE', url: 'https://forge-app-peach.vercel.app', desc: 'Describe a tool — get a working app' },
    { name: 'Huroof مع عبدو', url: 'https://huroof-abdo.vercel.app', desc: 'Real-time Arabic letters game' }
]

interface ConnectProps {
    profile: GithubProfile
}

export const Connect = ({ profile }: ConnectProps) => {
    return (
        <Section id='connect'>
            <Reveal scale>
                <div className='glass-strong relative overflow-hidden rounded-[var(--radius-glass-xl)] p-8 text-center sm:p-14'>
                    <div
                        aria-hidden='true'
                        className='gx-blob anim-drift-a absolute -right-10 -top-10 size-60'
                        style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 50%, transparent), transparent 70%)' }}
                    />
                    <span className='gx-chip gx-chip-accent mx-auto'>
                        <Sparkles className='size-3.5' />
                        Open to collaboration
                    </span>
                    <h2 className='mx-auto mt-5 max-w-2xl font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl'>
                        Building something with AI? <span className='text-accent'>Let&apos;s ship it.</span>
                    </h2>
                    <p className='mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-secondary sm:text-lg'>
                        I&apos;m always experimenting, always testing the next model, and always down to
                        collaborate on tools for developers, students and the Arabic web. Follow the work,
                        fork a repo, or reach out on GitHub.
                    </p>

                    <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
                        <a href={GITHUB.profileUrl} target='_blank' rel='noreferrer' className='gx-btn gx-btn-primary'>
                            <Github className='size-4' />
                            Follow @{profile.login}
                        </a>
                        <a href='https://zeroqcm.me' target='_blank' rel='noreferrer' className='gx-btn gx-btn-secondary'>
                            Try ZeroQCM
                            <ArrowUpRight className='size-4' />
                        </a>
                    </div>

                    <div className='mt-10 grid gap-4 sm:grid-cols-3'>
                        {PRODUCTS.map((product) => (
                            <a
                                key={product.name}
                                href={product.url}
                                target='_blank'
                                rel='noreferrer'
                                className='gx-card-tint gx-card-hover group flex flex-col gap-1 p-5 text-left'
                            >
                                <span className='flex items-center justify-between font-display text-base font-bold text-ink'>
                                    {product.name}
                                    <ArrowUpRight className='size-4 text-ink-tertiary transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent' />
                                </span>
                                <span className='text-sm text-ink-secondary'>{product.desc}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </Reveal>
        </Section>
    )
}
