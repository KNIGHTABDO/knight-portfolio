import { useState, useEffect, useRef } from 'react'
import { Terminal as TerminalIcon, X } from 'lucide-react'
import { sound } from '@/lib/sound'

interface ConsoleProps {
    isOpen: boolean
    onClose: () => void
}

export const Console = ({ isOpen, onClose }: ConsoleProps) => {
    const [input, setInput] = useState('')
    const [history, setHistory] = useState<Array<string>>([
        'THE NIGHT WATCH CMD CONSOLE v1.0.0',
        'Type "help" for a list of available command runes.',
        ''
    ])
    const inputRef = useRef<HTMLInputElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus()
            if (sound) sound.playPageOpen()
        }
    }, [isOpen])

    // Scroll to bottom on history change
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [history])

    if (!isOpen) return null

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault()
        const cmd = input.trim().toLowerCase()
        if (!cmd) return

        if (sound) sound.playRelayClick()
        const newHistory = [...history, `> ${input}`]

        const args = cmd.split(' ')
        const command = args[0]
        const param = args[1]

        switch (command) {
            case 'help':
                newHistory.push(
                    'Available Command Runes:',
                    '  help             Display this grimoire',
                    '  clear            Purge scroll history',
                    '  now              Get location time and watch coordinates',
                    '  relics           Check collected relics log',
                    '  repos <theme>    Filter tree to: ai, medical, arabic, media, tools',
                    '  open <project>   Launch zeroqcm, claudio, forge, huroof, serve',
                    '  close            Seal this console gate'
                )
                break
            case 'clear':
                setHistory([])
                setInput('')
                return
            case 'now':
                newHistory.push(
                    `LOCATION: Morocco (Casablanca)`,
                    `WATCH TIME: ${new Date().toLocaleTimeString()}`,
                    `STATUS: Stable, active connection`
                )
                break
            case 'relics':
                try {
                    const saved = localStorage.getItem('knight-discovered-relics')
                    const list = saved ? JSON.parse(saved) : []
                    if (list.length === 0) {
                        newHistory.push('No relics discovered yet. Explore flagship cards or tree leaves.')
                    } else {
                        newHistory.push(`Discovered Relics (${list.length}/6):`, `  ${list.join(', ')}`)
                    }
                } catch {
                    newHistory.push('Failed to load relic state.')
                }
                break
            case 'repos':
                if (!param || !['ai', 'medical', 'arabic', 'media', 'tools', 'all'].includes(param)) {
                    newHistory.push('Invalid theme. Specify: ai, medical, arabic, media, tools, or all')
                } else {
                    document.documentElement.setAttribute('data-path', param)
                    localStorage.setItem('knight-path', param)
                    window.dispatchEvent(new CustomEvent('knight-path-change', { detail: param }))
                    newHistory.push(`Canopy tree path biased to: ${param}`)
                }
                break
            case 'open':
                const linkMap: Record<string, string> = {
                    zeroqcm: 'https://zeroqcm.me',
                    claudio: 'http://51.170.130.44:8080/',
                    forge: 'https://forge-app-peach.vercel.app',
                    huroof: 'https://huroof-abdo.vercel.app',
                    serve: 'https://github.com/knightabdo/serve'
                }
                if (param && linkMap[param]) {
                    window.open(linkMap[param], '_blank')
                    newHistory.push(`Launching gate to: ${param}`)
                } else {
                    newHistory.push('Invalid project name. Try: zeroqcm, claudio, forge, huroof, serve')
                }
                break
            case 'close':
                onClose()
                return
            default:
                newHistory.push(`Unknown command: "${command}". Type "help" for spelling.`)
        }

        setHistory(newHistory)
        setInput('')
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/85 backdrop-blur-sm animate-fade-in'>
            <div 
                className='w-full max-w-xl border border-accent bg-bg-raised flex flex-col h-[350px] rounded-[var(--radius-glass-md)] shadow-2xl relative overflow-hidden'
                style={{
                    boxShadow: '0 10px 40px rgba(246, 198, 78, 0.15)'
                }}
            >
                {/* Header */}
                <div className='flex items-center justify-between border-b border-border/40 px-4 py-2.5 bg-bg-sunken/80'>
                    <div className='flex items-center gap-2 font-pixel text-[9px] text-accent tracking-widest'>
                        <TerminalIcon className='size-3.5 animate-pulse' />
                        <span>THE CONSOLE GATE</span>
                    </div>
                    <button 
                        onClick={() => {
                            onClose()
                            if (sound) sound.playTick()
                        }}
                        className='text-ink-tertiary hover:text-accent transition-colors'
                    >
                        <X className='size-4' />
                    </button>
                </div>

                {/* Log screen */}
                <div 
                    ref={containerRef}
                    className='flex-1 overflow-y-auto p-4 font-mono text-xs text-ink-secondary space-y-1.5'
                >
                    {history.map((line, idx) => (
                        <div key={idx} className={line.startsWith('>') ? 'text-accent' : ''}>
                            {line}
                        </div>
                    ))}
                </div>

                {/* Form */}
                <form 
                    onSubmit={handleCommand}
                    className='border-t border-border/40 p-3 bg-bg-sunken/55 flex items-center'
                >
                    <span className='font-mono text-xs text-accent mr-2 font-bold'>&gt;</span>
                    <input
                        ref={inputRef}
                        type='text'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='Type a command rune...'
                        className='flex-1 bg-transparent border-0 outline-none text-xs font-mono text-ink placeholder:text-ink-tertiary focus:ring-0 p-0'
                    />
                </form>
            </div>
        </div>
    )
}
export default Console
