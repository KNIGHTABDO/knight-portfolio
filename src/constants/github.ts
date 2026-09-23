import type { GithubOverview, GithubProfile, GithubRepo } from '@/types/github'

import { classifyRepo, deriveStats } from '@/lib/repo-utils'

export const GITHUB = {
    username: 'knightabdo',
    displayName: 'KNIGHT',
    profileUrl: 'https://github.com/knightabdo',
    avatarFallback: 'https://github.com/knightabdo.png?size=400',
    email: null as string | null,
    location: 'Morocco'
}

/** GitHub achievement badges shown on the profile. */
export const ACHIEVEMENTS: Array<{ name: string; tier: string; blurb: string }> = [
    { name: 'Pull Shark', tier: '×2', blurb: 'Opened merged pull requests' },
    { name: 'Pair Extraordinaire', tier: '×2', blurb: 'Co-authored merged commits' },
    { name: 'YOLO', tier: '', blurb: 'Merged without review' }
]

/** Known live homepages (used when the API homepage field is empty). */
export const KNOWN_HOMEPAGES: Record<string, string> = {
    claudio: 'http://51.170.130.44:8080/',
    forge: 'https://forge-app-peach.vercel.app',
    zeroqcm: 'https://zeroqcm.me',
    'huroof-abdo': 'https://huroof-abdo.vercel.app'
}

export const SEED_PROFILE: GithubProfile = {
    login: 'knightabdo',
    name: 'KNIGHT',
    avatarUrl: 'https://github.com/knightabdo.png?size=400',
    bio: '👋 UMMM',
    htmlUrl: 'https://github.com/knightabdo',
    company: null,
    blog: 'https://zeroqcm.me',
    location: 'Morocco',
    followers: 15,
    following: 48,
    publicRepos: 89,
    createdAt: null
}

type SeedRaw = Omit<GithubRepo, 'theme'>

const RAW: Array<SeedRaw> = [
    { id: 1001, name: 'fm-radio', description: 'A personal AI radio station with cinematic narration from your own DJ named Claudio', htmlUrl: 'https://github.com/knightabdo/fm-radio', homepage: null, language: 'TypeScript', stars: 4, forks: 1, watchers: 4, openIssues: 0, isFork: false, archived: false, topics: ['ai', 'radio', 'nextjs', 'tts'], createdAt: '2026-04-20', updatedAt: '2026-05-07', pushedAt: '2026-05-07' },
    { id: 1002, name: 'zeroqcm', description: 'ZeroQCM — La révision médicale, réinventée. Free, AI-powered QCM platform for Moroccan med students — 215,000+ questions.', htmlUrl: 'https://github.com/knightabdo/zeroqcm', homepage: 'https://zeroqcm.me', language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['medical', 'education', 'nextjs', 'supabase', 'ai'], createdAt: '2026-03-01', updatedAt: '2026-07-14', pushedAt: '2026-07-14' },
    { id: 1003, name: 'forge', description: 'FORGE — describe a tool, get a working app', htmlUrl: 'https://github.com/knightabdo/forge', homepage: 'https://forge-app-peach.vercel.app', language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['ai', 'nextjs', 'tauri', 'sandpack'], createdAt: '2026-02-10', updatedAt: '2026-06-28', pushedAt: '2026-06-28' },
    { id: 1004, name: 'serve', description: 'AI that sees patterns. A quiet space for conversations that matter', htmlUrl: 'https://github.com/knightabdo/serve', homepage: null, language: 'TypeScript', stars: 2, forks: 0, watchers: 2, openIssues: 0, isFork: false, archived: false, topics: ['ai', 'chat'], createdAt: '2026-04-10', updatedAt: '2026-05-19', pushedAt: '2026-05-19' },
    { id: 1005, name: 'huroof-ABDO', description: 'Interactive Arabic Letters Game — Real-time Team Challenge', htmlUrl: 'https://github.com/knightabdo/huroof-ABDO', homepage: 'https://huroof-abdo.vercel.app', language: 'JavaScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['game', 'arabic', 'interactive', 'peerjs', 'nextjs', 'pwa'], createdAt: '2026-06-20', updatedAt: '2026-07-02', pushedAt: '2026-07-02' },
    { id: 1006, name: 'relearn', description: 'ReLearn — AI-powered educational platform that transforms study material into interactive lessons', htmlUrl: 'https://github.com/knightabdo/relearn', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['ai', 'education', 'desktop'], createdAt: '2026-03-15', updatedAt: '2026-04-30', pushedAt: '2026-04-30' },
    { id: 1007, name: 'ancre-med', description: null, htmlUrl: 'https://github.com/knightabdo/ancre-med', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: [], createdAt: '2026-07-01', updatedAt: '2026-07-17', pushedAt: '2026-07-17' },
    { id: 1008, name: 'anti-api', description: 'Turn Antigravity / codex / github copilot into Anthropic & OpenAI API compatible servers. Usable with Claude Code / Xcode.', htmlUrl: 'https://github.com/knightabdo/anti-api', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: true, archived: false, topics: ['ai', 'api', 'proxy'], createdAt: '2026-07-05', updatedAt: '2026-07-12', pushedAt: '2026-07-12' },
    { id: 1009, name: 'knight-agent', description: 'Autonomous agent runtime — KNIGHT edition', htmlUrl: 'https://github.com/knightabdo/knight-agent', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['ai', 'agent'], createdAt: '2026-06-30', updatedAt: '2026-07-10', pushedAt: '2026-07-10' },
    { id: 1010, name: 'knight-bench', description: 'Benchmark harness for LLMs and coding agents', htmlUrl: 'https://github.com/knightabdo/knight-bench', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['ai', 'benchmark', 'llm'], createdAt: '2026-06-28', updatedAt: '2026-07-10', pushedAt: '2026-07-10' },
    { id: 1011, name: 'MedWork', description: 'Clinical workflow tooling for medical students', htmlUrl: 'https://github.com/knightabdo/MedWork', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['medical'], createdAt: '2026-06-25', updatedAt: '2026-07-05', pushedAt: '2026-07-05' },
    { id: 1012, name: 'claudio', description: 'A personal radio station hosted by Claudio, an AI DJ.', htmlUrl: 'https://github.com/knightabdo/claudio', homepage: 'http://51.170.130.44:8080/', language: 'JavaScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['ai', 'tts', 'voice'], createdAt: '2026-06-20', updatedAt: '2026-07-04', pushedAt: '2026-07-04' },
    { id: 1013, name: 'forge-apps', description: 'Storage layer for FORGE-generated tools — each tool is an HTML file', htmlUrl: 'https://github.com/knightabdo/forge-apps', homepage: null, language: 'HTML', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['ai', 'storage'], createdAt: '2026-06-10', updatedAt: '2026-06-30', pushedAt: '2026-06-30' },
    { id: 1014, name: 'forge-desktop-v2', description: 'Autonomous AI coding agent desktop app — full agent loop with authenticated sync', htmlUrl: 'https://github.com/knightabdo/forge-desktop-v2', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['ai', 'agent', 'tauri'], createdAt: '2026-06-05', updatedAt: '2026-06-27', pushedAt: '2026-06-27' },
    { id: 1015, name: 'vault', description: 'Vault — your personal AI that remembers everything and understands you', htmlUrl: 'https://github.com/knightabdo/vault', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['ai', 'memory'], createdAt: '2026-05-20', updatedAt: '2026-06-18', pushedAt: '2026-06-18' },
    { id: 1016, name: 'lumiq', description: 'LUMIQ — speak a concept, watch it become an interactive lesson', htmlUrl: 'https://github.com/knightabdo/lumiq', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['ai', 'education'], createdAt: '2026-05-10', updatedAt: '2026-06-15', pushedAt: '2026-06-15' },
    { id: 1017, name: 'ambera', description: 'AMBERA — production medical AI web + API stack', htmlUrl: 'https://github.com/knightabdo/ambera', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['ai', 'medical'], createdAt: '2026-05-01', updatedAt: '2026-06-10', pushedAt: '2026-06-10' },
    { id: 1018, name: 'nur', description: 'Light, fast Arabic-first utility app', htmlUrl: 'https://github.com/knightabdo/nur', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['arabic'], createdAt: '2026-06-01', updatedAt: '2026-06-21', pushedAt: '2026-06-21' },
    { id: 1019, name: 'prayer-times-platform', description: '🕌 Full Islamic Prayer Times Platform — live prayer times, adhan and Hijri calendar', htmlUrl: 'https://github.com/knightabdo/prayer-times-platform', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['islam', 'prayer', 'nextjs'], createdAt: '2026-04-15', updatedAt: '2026-05-30', pushedAt: '2026-05-30' },
    { id: 1020, name: 'MASHHAD', description: 'Arabic-language experience with a cinematic feel', htmlUrl: 'https://github.com/knightabdo/MASHHAD', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['arabic'], createdAt: '2026-04-20', updatedAt: '2026-05-12', pushedAt: '2026-05-12' },
    { id: 1021, name: 'cinextma', description: '🍿 CINEXTMA — an open-source, free movies and TV shows streaming platform', htmlUrl: 'https://github.com/knightabdo/cinextma', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: true, archived: false, topics: ['streaming', 'movies'], createdAt: '2026-05-10', updatedAt: '2026-05-20', pushedAt: '2026-05-20' },
    { id: 1022, name: 'arc-cinematics-v2', description: 'Next-gen serverless streaming — Next.js 15 + Edge + BYOD', htmlUrl: 'https://github.com/knightabdo/arc-cinematics-v2', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['streaming', 'edge', 'nextjs'], createdAt: '2026-04-10', updatedAt: '2026-04-24', pushedAt: '2026-04-24' },
    { id: 1023, name: 'KNIGHTYPODCASTS', description: 'Knighty Podcasts — a modern, responsive app for discovering podcasts', htmlUrl: 'https://github.com/knightabdo/KNIGHTYPODCASTS', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['podcast', 'media'], createdAt: '2026-03-20', updatedAt: '2026-04-15', pushedAt: '2026-04-15' },
    { id: 1024, name: 'scanmovie', description: 'Point your camera at a movie and get instant info', htmlUrl: 'https://github.com/knightabdo/scanmovie', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['movies', 'ai', 'vision'], createdAt: '2026-03-10', updatedAt: '2026-04-05', pushedAt: '2026-04-05' },
    { id: 1025, name: 'reelens', description: 'AI-powered TikTok & Instagram video explainer — bilingual', htmlUrl: 'https://github.com/knightabdo/reelens', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['ai', 'video'], createdAt: '2026-03-25', updatedAt: '2026-04-18', pushedAt: '2026-04-18' },
    { id: 1026, name: 'open-design', description: "Local-first open replica of Anthropic's Claude Design. 19 Skills, 71 design systems", htmlUrl: 'https://github.com/knightabdo/open-design', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: true, archived: false, topics: ['design', 'ai'], createdAt: '2026-04-15', updatedAt: '2026-04-29', pushedAt: '2026-04-29' },
    { id: 1027, name: 'omnimind', description: 'A unified brain for your AI models and tools', htmlUrl: 'https://github.com/knightabdo/omnimind', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['ai'], createdAt: '2026-04-25', updatedAt: '2026-05-09', pushedAt: '2026-05-09' },
    { id: 1028, name: 'zeroclaw', description: 'Fast, small, fully autonomous AI assistant infrastructure', htmlUrl: 'https://github.com/knightabdo/zeroclaw', homepage: null, language: 'Rust', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: true, archived: false, topics: ['ai', 'rust', 'agent'], createdAt: '2026-03-01', updatedAt: '2026-04-01', pushedAt: '2026-04-01' },
    { id: 1029, name: 'AURELIA', description: 'AURELIA — premium Firebase-powered journal app', htmlUrl: 'https://github.com/knightabdo/AURELIA', homepage: null, language: 'Go', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['journal', 'firebase'], createdAt: '2026-02-20', updatedAt: '2026-03-18', pushedAt: '2026-03-18' },
    { id: 1030, name: 'liquid-dom', description: 'Liquid-glass primitives for the DOM', htmlUrl: 'https://github.com/knightabdo/liquid-dom', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: true, archived: false, topics: ['ui', 'design'], createdAt: '2026-05-01', updatedAt: '2026-05-20', pushedAt: '2026-05-20' },
    { id: 1031, name: 'portfolio', description: 'Personal site experiments', htmlUrl: 'https://github.com/knightabdo/portfolio', homepage: null, language: 'TypeScript', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['portfolio'], createdAt: '2026-04-20', updatedAt: '2026-05-16', pushedAt: '2026-05-16' },
    { id: 1032, name: 'ada_v2', description: 'Python agent experiments (ADA v2)', htmlUrl: 'https://github.com/knightabdo/ada_v2', homepage: null, language: 'Python', stars: 1, forks: 0, watchers: 1, openIssues: 0, isFork: false, archived: false, topics: ['ai', 'python'], createdAt: '2026-06-01', updatedAt: '2026-06-24', pushedAt: '2026-06-24' }
]

export const SEED_REPOS: Array<GithubRepo> = RAW.map((r) => ({
    ...r,
    theme: classifyRepo(r)
}))

/** Complete, client-safe fallback overview so the page always has real data. */
export const SEED_OVERVIEW: GithubOverview = {
    profile: SEED_PROFILE,
    repos: SEED_REPOS,
    stats: deriveStats(SEED_REPOS),
    source: 'seed',
    generatedAt: '1970-01-01T00:00:00.000Z'
}
