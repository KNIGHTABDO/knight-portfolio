import { ArrowUpRight, Github } from 'lucide-react'

import type { GithubProfile } from '@/types/github'
import { GITHUB } from '@/constants/github'
import { Section } from '@/components/generals/section'
import { Reveal } from '@/components/generals/reveal'
import { sound } from '@/lib/sound'
import { CornerBrackets } from '@/components/generals/corner-brackets'

const PRODUCTS = [
    { name: 'ZeroQCM', url: 'https://zeroqcm.me', desc: 'Medical revision engine serving 215k+ QCM for Moroccan peers.' },
    { name: 'FORGE', url: 'https://forge-app-peach.vercel.app', desc: 'AI app builder: specify a utility, get a working web tool.' },
    { name: 'Huroof مع عبدو', url: 'https://huroof-abdo.vercel.app', desc: 'Real-time multiplayer Arabic letters game built local-first.' }
]

interface ConnectProps {
    profile: GithubProfile
}

export const Connect = ({ profile }: ConnectProps) => {

    const handleHover = () => {
        if (sound) sound.playTick()
    }

    const handleClick = () => {
        if (sound) sound.playDulcimer()
    }

    return (
        <Section id='connect'>
            <Reveal scale>
                <div className='relative overflow-hidden bg-bg-raised/35 p-8 text-center sm:p-14 rounded-[var(--radius-glass-md)] shadow-xl group border border-transparent'>
                    <CornerBrackets />
                    {/* The Summoning Gate Background Glow (Gold) */}
                    <div
                        aria-hidden='true'
                        className='absolute -right-20 -top-20 size-80 rounded-full blur-[80px] opacity-15 pointer-events-none'
                        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
                    />
                    
                    <span className='font-display text-xs italic text-accent bg-bg-sunken/65 border border-border/30 px-3.5 py-1.5 inline-flex items-center gap-1.5 mx-auto select-none'>
                        Open to Alliances
                    </span>
                    
                    <h2 className='mx-auto mt-6 max-w-2xl font-display text-3xl font-light leading-[1.1] tracking-wide text-ink sm:text-5xl'>
                        Building with AI? <span className='text-accent font-medium'>Let&apos;s forge it.</span>
                    </h2>
                    
                    <p className='mx-auto mt-4 max-w-xl font-display text-sm leading-relaxed text-ink-secondary sm:text-base'>
                        I am always testing the next LLM, forking experimental repositories, and looking to collaborate on tools for students, creators, and the Arabic web. Bring me a difficult idea.
                    </p>

                    <div className='mt-8 flex flex-wrap items-center justify-center gap-3 relative z-10'>
                        <a 
                            href={GITHUB.profileUrl} 
                            target='_blank' 
                            rel='noreferrer' 
                            onMouseEnter={handleHover}
                            onClick={handleClick}
                            className='gx-btn gx-btn-primary bg-gradient-to-b from-accent to-accent-hover text-accent-ink border border-tarnished/30'
                        >
                            <Github className='size-4' />
                            Follow @{profile.login}
                        </a>
                        <a 
                            href='https://zeroqcm.me' 
                            target='_blank' 
                            rel='noreferrer' 
                            onMouseEnter={handleHover}
                            onClick={handleClick}
                            className='gx-btn gx-btn-secondary border-border/60 text-ink bg-bg-raised/40 hover:border-accent'
                        >
                            Explore ZeroQCM
                            <ArrowUpRight className='size-4' />
                        </a>
                    </div>

                    {/* Pedestal style product link blocks */}
                    <div className='mt-12 grid gap-4 sm:grid-cols-3 relative z-10'>
                        {PRODUCTS.map((product) => (
                            <a
                                key={product.name}
                                href={product.url}
                                target='_blank'
                                rel='noreferrer'
                                onMouseEnter={handleHover}
                                onClick={handleClick}
                                className='group flex flex-col gap-2 p-5 text-left border border-border/50 bg-bg-raised/40 hover:bg-bg-raised/85 hover:border-accent/40 rounded-[var(--radius-glass-lg)] transition-all duration-300 shadow-sm'
                                style={{
                                    boxShadow: 'inset 0 1px 0 rgba(246, 198, 78, 0.03)'
                                }}
                            >
                                <span className='flex items-center justify-between font-display text-sm font-bold text-ink group-hover:text-accent transition-colors'>
                                    {product.name}
                                    <ArrowUpRight className='size-3.5 text-ink-tertiary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent' />
                                </span>
                                <span className='text-xs leading-relaxed text-ink-secondary font-sans'>{product.desc}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </Reveal>
        </Section>
    )
}
export default Connect
