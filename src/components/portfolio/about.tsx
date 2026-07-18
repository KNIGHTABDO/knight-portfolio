import { useEffect, useState } from 'react'
import type { GithubProfile } from '@/types/github'
import { CornerBrackets } from '@/components/generals/corner-brackets'
import { Section } from '@/components/generals/section'
import { Reveal } from '@/components/generals/reveal'
import { cn } from '@/lib/utils'

interface AboutProps {
    profile: GithubProfile
}

export const About = ({ profile }: AboutProps) => {
    const [path, setPath] = useState<'all' | 'clinic' | 'workshop'>('all')

    useEffect(() => {
        const savedPath = localStorage.getItem('knight-path') as 'all' | 'clinic' | 'workshop' | null
        if (savedPath) setPath(savedPath)

        const handlePathChange = (e: CustomEvent<'all' | 'clinic' | 'workshop'>) => {
            setPath(e.detail)
        }

        window.addEventListener('knight-path-change', handlePathChange as any)
        return () => window.removeEventListener('knight-path-change', handlePathChange as any)
    }, [])

    return (
        <Section id='about'>
            <div className='grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 items-start'>
                {/* Left Column: Narrative + Split Oaths */}
                <div className='flex flex-col gap-6'>
                    <Reveal>
                        <h2 className='font-display text-4xl font-light leading-[1.1] tracking-wide text-ink sm:text-[3rem]'>
                            One trunk, <span className='text-accent font-medium'>two disciplines</span>.
                        </h2>
                    </Reveal>

                    {/* Duality Split Columns */}
                    <div className='grid auto-rows-fr gap-5 sm:grid-cols-2'>
                        {/* Clinic Column */}
                        <article 
                            className={cn(
                                'flex h-full flex-col rounded-[var(--radius-glass-md)] border p-4.5 transition-all duration-300',
                                path === 'clinic' 
                                    ? 'bg-bg-raised border-accent/40 shadow-[0_0_15px_rgba(246,198,78,0.1)]' 
                                    : path === 'workshop' 
                                    ? 'opacity-40 border-border/20 scale-98'
                                    : 'bg-bg-raised/35 border-border/40'
                            )}
                        >
                            <h3 className='font-display text-base font-semibold text-ink mb-2'>The Scholar’s Oath</h3>
                            <p className='text-xs leading-relaxed text-ink-secondary'>
                                I study the body, diagnostics, and human systems as a 2nd-year medical student at FMPC. Medicine teaches acute observation: examining variables, building clinical intuition, and debugging anomalies under severe load.
                            </p>
                        </article>

                        {/* Workshop Column */}
                        <article 
                            className={cn(
                                'flex h-full flex-col rounded-[var(--radius-glass-md)] border p-4.5 transition-all duration-300',
                                path === 'workshop' 
                                    ? 'bg-bg-raised border-accent/40 shadow-[0_0_15px_rgba(246,198,78,0.1)]' 
                                    : path === 'clinic' 
                                    ? 'opacity-40 border-border/20 scale-98'
                                    : 'bg-bg-raised/35 border-border/40'
                            )}
                        >
                            <h3 className='font-display text-base font-semibold text-ink mb-2'>The Maker’s Oath</h3>
                            <p className='text-xs leading-relaxed text-ink-secondary'>
                                I build open-source tools, stress-test AI benchmarks, and orchestrate developer workflows. Vibe coding allows me to rapidly manifest tools for the problems I encounter directly—learning through shipping.
                            </p>
                        </article>
                    </div>

                    <Reveal delay={80} className='flex flex-col gap-4 text-sm leading-relaxed text-ink-secondary'>
                        <p>
                            I did not study computer science. I learned by making things and publishing them. That work includes <span className='font-semibold text-accent'>ZeroQCM</span> — a revision platform with more than 215,000 medical questions for Moroccan students, and <span className='font-semibold text-accent'>Claudio</span> — a personal radio station hosted by an AI DJ.
                        </p>
                    </Reveal>
                </div>

                {/* Right Column: Character Folio Sheet */}
                <Reveal delay={120} scale className='h-full'>
                    <div className='bg-bg-raised/35 p-6 rounded-[var(--radius-glass-md)] relative overflow-hidden group shadow-sm border border-transparent h-full flex flex-col justify-between'>
                        <CornerBrackets />
                        <div className='absolute right-0 top-0 w-32 h-32 bg-radial-gradient from-accent-soft to-transparent opacity-10 pointer-events-none' />
                        
                        <div>
                            <div className='border-b border-border pb-3 mb-5'>
                                <span className='font-display text-xs italic text-accent tracking-wide block'>Character Ledger</span>
                                <h3 className='font-display text-lg font-bold text-ink'>Scholar & Artificer</h3>
                                <span className='font-mono text-[10px] text-ink-tertiary'>Level: 2nd Year Med // {profile.publicRepos} Repos</span>
                            </div>

                            <dl className='divide-y divide-border/30'>
                                {[
                                    ['Home', 'Casablanca, Morocco'],
                                    ['Study', 'Medicine at FMPC'],
                                    ['Tools', 'TypeScript, Python, Rust, and Go'],
                                    ['Focus', 'Language models, developer tools, and medical education'],
                                    ['Flagship', 'ZeroQCM · 215,000+ medical questions'],
                                    ['Built for', 'Fellow students and the Arabic-speaking web']
                                ].map(([term, detail]) => (
                                    <div key={term} className='grid gap-1 py-3.5 sm:grid-cols-[7rem_1fr]'>
                                        <dt className='text-xs font-semibold text-ink-tertiary uppercase tracking-wider font-mono'>{term}</dt>
                                        <dd className='text-xs text-ink leading-relaxed'>{detail}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </Reveal>
            </div>
        </Section>
    )
}
export default About
