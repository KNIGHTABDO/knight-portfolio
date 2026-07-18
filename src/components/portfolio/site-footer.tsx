import { useEffect, useState } from 'react'
import { Github, Heart, Volume2, VolumeX } from 'lucide-react'

import { GITHUB } from '@/constants/github'
import { NAV_ITEMS } from '@/constants/nav'
import { Container } from '@/components/generals/section'
import { sound } from '@/lib/sound'

export const SiteFooter = () => {
    const year = new Date().getFullYear()
    const [isMuted, setIsMuted] = useState(true)

    useEffect(() => {
        if (sound) {
            setIsMuted(sound.getMuteStatus())
        }
    }, [])

    const handleSoundToggle = () => {
        if (sound) {
            const nextMutedStatus = sound.toggleMute()
            setIsMuted(nextMutedStatus)
            if (!nextMutedStatus) sound.playDulcimer()
        }
    }

    return (
        <footer className='mt-16 border-t border-border/40 py-12 bg-bg-raised/20 relative z-10'>
            <Container>
                <div className='flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between'>
                    <div className='max-w-sm'>
                        <a href='#hero' className='flex items-center gap-3'>
                            <span className='grid size-8 place-items-center rounded-[var(--radius-glass-sm)] bg-accent-soft font-pixel text-xs font-bold text-accent border border-accent/25'>
                                K
                            </span>
                            <span className='font-display text-sm font-bold tracking-[0.25em] text-ink'>KNIGHT</span>
                        </a>
                        <p className='mt-4 text-xs leading-relaxed text-ink-secondary font-sans'>
                            A living catalog forged from the GitHub public API. Built with Next.js and the Night Codex cartography. Assembled from Casablanca, Morocco.
                        </p>
                    </div>

                    <nav aria-label='Footer' className='grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-1'>
                        <span className='font-pixel text-[8px] tracking-widest text-accent uppercase mb-1.5 block'>
                            Navigation
                        </span>
                        {NAV_ITEMS.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={() => sound?.playTick()}
                                className='text-xs text-ink-secondary hover:text-accent transition-colors font-display tracking-wide'
                            >
                                {item.plain}
                            </a>
                        ))}
                    </nav>

                    <div className='flex flex-col items-start gap-4'>
                        <span className='font-pixel text-[8px] tracking-widest text-accent uppercase block'>
                            Almanac Ledger
                        </span>
                        <a
                            href={GITHUB.profileUrl}
                            target='_blank'
                            rel='noreferrer'
                            onClick={() => sound?.playTick()}
                            className='gx-btn gx-btn-secondary h-8 px-3 border-border/60 text-xs font-pixel bg-bg-raised/40 hover:border-accent'
                        >
                            <Github className='size-3.5' />
                            @{GITHUB.username}
                        </a>
                        
                        {/* Sound shortcut */}
                        <button
                            onClick={handleSoundToggle}
                            className='text-xs font-pixel text-ink-secondary hover:text-accent flex items-center gap-1.5'
                        >
                            {isMuted ? <VolumeX className='size-3.5' /> : <Volume2 className='size-3.5' />}
                            {isMuted ? 'HEAR THE NIGHT' : 'MUTE WINDS'}
                        </button>
                    </div>
                </div>

                {/* Post-credits credits */}
                <div className='mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/30 pt-6 text-[10px] text-ink-tertiary font-mono sm:flex-row'>
                    <div className='flex flex-col gap-0.5'>
                        <p>© {year} KNIGHT. Forged via Next.js Pages Router.</p>
                        <p className='text-[9px]'>Background pixel landscape by <a href='https://anasabdin.tumblr.com' target='_blank' rel='noreferrer' className='hover:text-accent underline'>@anasabdin</a>.</p>
                    </div>
                    
                    <p className='flex items-center gap-1.5 font-pixel text-[8px] tracking-wide text-accent/80'>
                        FORGED BENEATH THE GOLDEN TREE
                    </p>
                </div>
            </Container>
        </footer>
    )
}
export default SiteFooter
