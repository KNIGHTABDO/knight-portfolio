export type DoodleKey = 'qcm' | 'anvil' | 'radio' | 'hex' | 'book' | 'chat'

export interface Project {
    slug: string
    name: string
    arabic?: string
    line: string
    story: string
    note: string
    tags: Array<string>
    live?: string
    repo: string
    doodle: DoodleKey
    stat?: { value: string; label: string }
}

/** The six things on the wall, in the order they are pinned. */
export const PROJECTS: Array<Project> = [
    {
        slug: 'zeroqcm',
        name: 'ZeroQCM',
        line: 'La révision médicale, réinventée.',
        story: 'Free, AI-powered QCM revision for Moroccan medical students: a bank of more than 215,000 questions, organised the way our faculties actually examine us.',
        note: 'built for my own exam season',
        tags: ['Next.js', 'Supabase', 'AI'],
        live: 'https://zeroqcm.me',
        repo: 'https://github.com/knightabdo/zeroqcm',
        doodle: 'qcm',
        stat: { value: '215,000+', label: 'questions' }
    },
    {
        slug: 'forge',
        name: 'FORGE',
        line: 'Describe a tool, get a working app.',
        story: 'Type what you need in plain words and FORGE builds a working little web app for it. A desktop edition runs a full autonomous coding-agent loop.',
        note: 'no code required',
        tags: ['Next.js', 'Tauri', 'Sandpack'],
        live: 'https://forge-app-peach.vercel.app',
        repo: 'https://github.com/knightabdo/forge',
        doodle: 'anvil'
    },
    {
        slug: 'fm-radio',
        name: 'Claudio FM',
        line: 'A personal radio station with its own AI DJ.',
        story: 'A radio station that is only yours, hosted by Claudio, an AI DJ who narrates between tracks like a late-night show.',
        note: 'most-starred thing I own',
        tags: ['TypeScript', 'TTS', 'Next.js'],
        repo: 'https://github.com/knightabdo/fm-radio',
        doodle: 'radio'
    },
    {
        slug: 'huroof-abdo',
        name: 'Huroof',
        arabic: 'حروف مع عبدو',
        line: 'An Arabic letters game for two teams, live.',
        story: 'A real-time team challenge built around Arabic letters: two teams, one board, peer-to-peer and installable as an app.',
        note: 'made for game nights',
        tags: ['PeerJS', 'PWA', 'Next.js'],
        live: 'https://huroof-abdo.vercel.app',
        repo: 'https://github.com/knightabdo/huroof-ABDO',
        doodle: 'hex'
    },
    {
        slug: 'relearn',
        name: 'ReLearn',
        line: 'Study material in, interactive lessons out.',
        story: 'An AI-powered platform that takes your study material and turns it into interactive lessons, so reading becomes practice.',
        note: 'for the night before',
        tags: ['AI', 'Education', 'Desktop'],
        repo: 'https://github.com/knightabdo/relearn',
        doodle: 'book'
    },
    {
        slug: 'serve',
        name: 'Serve',
        line: 'A quiet space for conversations that matter.',
        story: 'AI that sees patterns. No feed and no noise: a patient place for the conversations that matter.',
        note: 'the calm one',
        tags: ['AI', 'Chat', 'TypeScript'],
        repo: 'https://github.com/knightabdo/serve',
        doodle: 'chat'
    }
]

export interface NavLink {
    id: string
    label: string
}

export const NAV: Array<NavLink> = [
    { id: 'about', label: 'about' },
    { id: 'work', label: 'work' },
    { id: 'shelf', label: 'shelf' },
    { id: 'pulse', label: 'pulse' },
    { id: 'contact', label: 'say salam' }
]

export const LEDGER: Array<[string, string]> = [
    ['home', 'Casablanca, Morocco'],
    ['studies', 'Medicine, FMPC — 2nd year'],
    ['writes', 'TypeScript, Python, Rust, Go'],
    ['obsessed with', 'language models, agents, dev tools'],
    ['builds for', 'med students & the Arabic-speaking web']
]
