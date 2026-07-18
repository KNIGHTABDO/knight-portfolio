import type {
    GithubRepo,
    GithubStats,
    LanguageStat,
    ThemeKey
} from '@/types/github'

import { languageColor } from '@/lib/format'

export interface ThemeMeta {
    key: ThemeKey
    label: string
    tagline: string
    description: string
}

export const THEME_META: Record<ThemeKey, ThemeMeta> = {
    ai: {
        key: 'ai',
        label: 'AI & Agents',
        tagline: 'The obsession',
        description:
            'Autonomous coding agents, LLM benchmarks, memory engines and "describe it, get an app" tooling. KNIGHT tests every model and turns the good ones into products.'
    },
    medical: {
        key: 'medical',
        label: 'Med-Tech',
        tagline: 'The day job',
        description:
            'Built by a med student, for med students. Revision platforms, QCM banks and study tools aimed squarely at Moroccan medical faculties.'
    },
    arabic: {
        key: 'arabic',
        label: 'Arabic & Islamic',
        tagline: 'The roots',
        description:
            'Arabic-first games, prayer-time platforms and culturally-grounded apps for a Moroccan and Arabic-speaking audience.'
    },
    media: {
        key: 'media',
        label: 'Media & Streaming',
        tagline: 'The playground',
        description:
            'Cinematic AI radio, streaming front-ends, podcast apps and video explainers — where the experiments get loud.'
    },
    tools: {
        key: 'tools',
        label: 'Dev Tools & Craft',
        tagline: 'The workshop',
        description:
            'Design systems, DOM experiments, self-hosted utilities and the scaffolding that everything else is built on.'
    }
}

export const THEME_ORDER: Array<ThemeKey> = ['ai', 'medical', 'arabic', 'media', 'tools']

/** Curated overrides for KNIGHT's known repositories (name is matched case-insensitively). */
const THEME_OVERRIDES: Record<string, ThemeKey> = {
    zeroqcm: 'medical',
    'ancre-med': 'medical',
    medwork: 'medical',
    'medical-data': 'medical',
    relearn: 'medical',
    'relearn-website': 'medical',
    ambera: 'medical',
    'huroof-abdo': 'arabic',
    'prayer-times-platform': 'arabic',
    noor: 'arabic',
    nur: 'arabic',
    mashhad: 'arabic',
    mubeen: 'arabic',
    'mubeen-web': 'arabic',
    'fm-radio': 'media',
    cinextma: 'media',
    cinevai: 'media',
    scanmovie: 'media',
    'scanmovie-promo': 'media',
    arc: 'media',
    'arc-cinematics-v2': 'media',
    'arc-cinematics-showcase': 'media',
    knightypodcasts: 'media',
    'kage-manga': 'media',
    forge: 'ai',
    'forge-apps': 'ai',
    'forge-desktop-v2': 'ai',
    liveforge: 'ai',
    'knight-agent': 'ai',
    'knight-bench': 'ai',
    claudio: 'ai',
    'anti-api': 'ai',
    zeroclaw: 'ai',
    vault: 'ai',
    serve: 'ai',
    omnimind: 'ai',
    'omnimind-ai': 'ai',
    lumiq: 'ai',
    reelens: 'ai',
    'open-design': 'ai',
    kage: 'ai',
    portfolio: 'tools',
    'liquid-dom': 'tools',
    memos: 'tools',
    aurelia: 'tools'
}

const HEURISTICS: Array<[ThemeKey, RegExp]> = [
    ['medical', /\b(qcm|med|medic|medical|clinic|health|patient|anatomy|pharma|doctor|hospital|ecni|revision)\b/],
    ['arabic', /(arabic|islam|quran|coran|prayer|salat|adhan|athan|noor|nur|mubeen|huroof|hijri|moroc|darija|mashhad)/],
    ['media', /(movie|film|tv|stream|cinema|radio|podcast|manga|anime|video|remotion|music|\bdj\b|tiktok|instagram|reel|watch|\bgame\b|multiplayer)/],
    ['ai', /(\bai\b|llm|agent|gpt|claude|anthropic|openai|model|assistant|prompt|\brag\b|neural|genai|copilot|codex|autonomous|\bml\b)/]
]

export const classifyRepo = (repo: { name: string; description?: string | null; topics?: Array<string> }): ThemeKey => {
    const key = repo.name.toLowerCase()
    if (THEME_OVERRIDES[key]) return THEME_OVERRIDES[key]

    const haystack = [
        repo.name,
        repo.description ?? '',
        ...(repo.topics ?? [])
    ]
        .join(' ')
        .toLowerCase()

    for (const [theme, pattern] of HEURISTICS) {
        if (pattern.test(haystack)) return theme
    }

    return 'tools'
}

export const deriveLanguages = (repos: Array<GithubRepo>): Array<LanguageStat> => {
    const counts = new Map<string, number>()

    for (const repo of repos) {
        if (!repo.language) continue
        counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1)
    }

    const total = Array.from(counts.values()).reduce((sum, n) => sum + n, 0) || 1

    return Array.from(counts.entries())
        .map(([name, count]) => ({
            name,
            count,
            percent: Math.round((count / total) * 1000) / 10,
            color: languageColor(name)
        }))
        .sort((a, b) => b.count - a.count)
}

export const deriveStats = (repos: Array<GithubRepo>): GithubStats => {
    const languages = deriveLanguages(repos)

    return {
        totalStars: repos.reduce((sum, r) => sum + r.stars, 0),
        totalForks: repos.reduce((sum, r) => sum + r.forks, 0),
        originalRepos: repos.filter((r) => !r.isFork).length,
        forkedRepos: repos.filter((r) => r.isFork).length,
        topLanguage: languages[0]?.name ?? null,
        languages
    }
}

export const countByTheme = (repos: Array<GithubRepo>): Record<ThemeKey, number> => {
    const base: Record<ThemeKey, number> = { ai: 0, medical: 0, arabic: 0, media: 0, tools: 0 }
    for (const repo of repos) base[repo.theme] += 1
    return base
}
