import { useScrollProgress, useScrollSpy } from '@/hooks/use-interactions'
import { NAV_IDS } from '@/constants/nav'

export const GoldenRoot = () => {
    const progress = useScrollProgress()
    const active = useScrollSpy(NAV_IDS)

    // Maps section IDs to approximate scroll percentage triggers
    const sectionNodes = [
        { id: 'about', yPercent: 20 },
        { id: 'stats', yPercent: 40 },
        { id: 'work', yPercent: 60 },
        { id: 'arsenal', yPercent: 75 },
        { id: 'activity', yPercent: 88 },
        { id: 'connect', yPercent: 96 }
    ]

    return (
        <div className='fixed left-2.5 xl:left-6 top-0 bottom-0 z-30 flex flex-col items-center justify-center pointer-events-none w-6 xl:w-8' aria-hidden='true'>
            {/* SVG Vine Root */}
            <svg
                className='w-full h-full'
                viewBox='0 0 32 1000'
                preserveAspectRatio='none'
                fill='none'
            >
                {/* Background path (tarnished/faint) */}
                <path
                    d='M 16 0 Q 30 100 16 200 T 16 400 T 16 600 T 16 800 T 16 1000'
                    stroke='#8D6C2E'
                    strokeWidth='2'
                    strokeOpacity='0.25'
                />
                
                {/* Scroll progress drawing path (glowing gold) */}
                <path
                    d='M 16 0 Q 30 100 16 200 T 16 400 T 16 600 T 16 800 T 16 1000'
                    stroke='#F6C64E'
                    strokeWidth='2'
                    strokeDasharray='1000'
                    strokeDashoffset={Math.max(0, 1000 - progress * 1000)}
                    className='transition-all duration-75 ease-out'
                    style={{
                        filter: 'drop-shadow(0px 0px 3px rgba(246, 198, 78, 0.6))'
                    }}
                />
            </svg>

            {/* Glowing nodes (placed absolutely relative to Y percentage) */}
            {sectionNodes.map((node) => {
                const isActive = active === node.id
                return (
                    <div
                        key={node.id}
                        className='absolute left-1/2 -translate-x-1/2 flex items-center justify-center transition-all duration-300'
                        style={{ top: `${node.yPercent}%` }}
                    >
                        {/* Outer Glow Ring */}
                        <div
                            className={`absolute size-5 rounded-full border transition-all duration-500 ${
                                isActive
                                    ? 'border-accent scale-125 opacity-100 animate-ping'
                                    : 'border-tarnished/30 scale-100 opacity-0'
                            }`}
                        />
                        {/* Node Core */}
                        <a
                            href={`#${node.id}`}
                            className={`pointer-events-auto size-3 rounded-full border transition-all duration-300 ${
                                isActive
                                    ? 'bg-accent border-accent-hover scale-110 shadow-[0_0_8px_#F6C64E]'
                                    : 'bg-bg-raised border-tarnished hover:border-accent hover:scale-105'
                            }`}
                            title={`Jump to ${node.id}`}
                        />
                    </div>
                )
            })}
        </div>
    )
}
export default GoldenRoot
