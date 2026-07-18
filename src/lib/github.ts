import type {
    ActivityEvent,
    ContribData,
    ContribDay,
    GithubOverview,
    GithubProfile,
    GithubRepo
} from '@/types/github'

import {
    GITHUB,
    KNOWN_HOMEPAGES,
    SEED_PROFILE,
    SEED_REPOS
} from '@/constants/github'
import { classifyRepo, deriveStats } from '@/lib/repo-utils'
import { getObjectText, putObject } from '@/lib/modulify/storage'

const API = 'https://api.github.com'
const USER = GITHUB.username

const TTL = {
    overview: 20 * 60 * 1000,
    contrib: 3 * 60 * 60 * 1000,
    activity: 10 * 60 * 1000
}

interface CacheEntry<T> {
    at: number
    data: T
}

const memory = new Map<string, CacheEntry<unknown>>()

const now = () => Date.now()

const readMemory = <T>(key: string): CacheEntry<T> | null =>
    (memory.get(key) as CacheEntry<T> | undefined) ?? null

const writeMemory = <T>(key: string, data: T) => {
    memory.set(key, { at: now(), data })
}

/* ---- best-effort persistent cache (survives cold starts / rate limits) ---- */

const storageKey = (key: string) => `cache/github/${key}.json`

const readStorage = async <T>(key: string): Promise<CacheEntry<T> | null> => {
    try {
        const raw = await getObjectText(storageKey(key))
        return JSON.parse(raw) as CacheEntry<T>
    } catch {
        return null
    }
}

const writeStorage = async <T>(key: string, entry: CacheEntry<T>): Promise<void> => {
    try {
        await putObject(storageKey(key), JSON.stringify(entry), { contentType: 'application/json' })
    } catch {
        /* storage not provisioned yet — ignore */
    }
}

/* ---- fetch ---- */

const headers = (): Record<string, string> => {
    const base: Record<string, string> = {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'knight-portfolio',
        'X-GitHub-Api-Version': '2022-11-28'
    }
    const token = process.env.GITHUB_TOKEN?.trim()
    // Ignore empty / placeholder tokens — a bogus token 401s and would break
    // the working unauthenticated path.
    if (token && token !== 'REPLACE_ME' && token.length > 20) {
        base.Authorization = `Bearer ${token}`
    }
    return base
}

const ghFetch = async <T>(url: string): Promise<T> => {
    const res = await fetch(url, { headers: headers() })
    if (!res.ok) throw new Error(`GitHub ${res.status} for ${url}`)
    return (await res.json()) as T
}

/* ---- mappers ---- */

/* eslint-disable @typescript-eslint/no-explicit-any */
const mapProfile = (raw: any): GithubProfile => ({
    login: raw.login,
    name: raw.name || GITHUB.displayName,
    avatarUrl: raw.avatar_url || GITHUB.avatarFallback,
    bio: raw.bio || SEED_PROFILE.bio,
    htmlUrl: raw.html_url || GITHUB.profileUrl,
    company: raw.company ?? null,
    blog: raw.blog || null,
    location: raw.location ?? GITHUB.location,
    followers: raw.followers ?? 0,
    following: raw.following ?? 0,
    publicRepos: raw.public_repos ?? 0,
    createdAt: raw.created_at ?? null
})

const mapRepo = (raw: any): GithubRepo => {
    const homepage =
        (raw.homepage && String(raw.homepage).trim()) ||
        KNOWN_HOMEPAGES[String(raw.name).toLowerCase()] ||
        null

    const base = {
        id: raw.id,
        name: raw.name,
        description: raw.description ?? null,
        htmlUrl: raw.html_url,
        homepage,
        language: raw.language ?? null,
        stars: raw.stargazers_count ?? 0,
        forks: raw.forks_count ?? 0,
        watchers: raw.watchers_count ?? 0,
        openIssues: raw.open_issues_count ?? 0,
        isFork: Boolean(raw.fork),
        archived: Boolean(raw.archived),
        topics: Array.isArray(raw.topics) ? raw.topics : [],
        createdAt: raw.created_at ?? null,
        updatedAt: raw.updated_at ?? null,
        pushedAt: raw.pushed_at ?? null
    }

    return { ...base, theme: classifyRepo(base) }
}

const eventText = (raw: any): { action: string; icon: string } | null => {
    switch (raw.type) {
        case 'PushEvent': {
            const n = raw.payload?.commits?.length ?? raw.payload?.size ?? 1
            return { action: `pushed ${n} commit${n === 1 ? '' : 's'} to`, icon: 'git-commit' }
        }
        case 'CreateEvent': {
            const ref = raw.payload?.ref_type ?? 'repository'
            return { action: `created ${ref}`, icon: 'git-branch' }
        }
        case 'WatchEvent':
            return { action: 'starred', icon: 'star' }
        case 'ForkEvent':
            return { action: 'forked', icon: 'git-fork' }
        case 'PullRequestEvent':
            return { action: `${raw.payload?.action ?? 'updated'} a pull request in`, icon: 'git-pull-request' }
        case 'IssuesEvent':
            return { action: `${raw.payload?.action ?? 'updated'} an issue in`, icon: 'circle-dot' }
        case 'ReleaseEvent':
            return { action: 'published a release in', icon: 'package' }
        case 'PublicEvent':
            return { action: 'open-sourced', icon: 'globe' }
        default:
            return null
    }
}

const mapEvent = (raw: any): ActivityEvent | null => {
    const text = eventText(raw)
    if (!text) return null
    const repo = raw.repo?.name ?? ''
    return {
        id: String(raw.id),
        type: raw.type,
        action: text.action,
        repo,
        repoUrl: repo ? `https://github.com/${repo}` : GITHUB.profileUrl,
        createdAt: raw.created_at,
        icon: text.icon
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ---- seed ---- */

export const seedOverview = (): GithubOverview => ({
    profile: SEED_PROFILE,
    repos: SEED_REPOS,
    stats: deriveStats(SEED_REPOS),
    source: 'seed',
    generatedAt: new Date().toISOString()
})

/* ---- public: overview ---- */

export const getOverview = async (): Promise<GithubOverview> => {
    const key = 'overview'

    const mem = readMemory<GithubOverview>(key)
    if (mem && now() - mem.at < TTL.overview) return mem.data

    const persisted = await readStorage<GithubOverview>(key)
    if (persisted && now() - persisted.at < TTL.overview) {
        writeMemory(key, persisted.data)
        return { ...persisted.data, source: 'cache' }
    }

    try {
        const [profileRaw, reposRaw] = await Promise.all([
            ghFetch<unknown>(`${API}/users/${USER}`),
            ghFetch<Array<unknown>>(`${API}/users/${USER}/repos?per_page=100&sort=pushed&direction=desc`)
        ])

        const profile = mapProfile(profileRaw)
        const repos = (reposRaw as Array<unknown>)
            .map(mapRepo)
            .sort((a, b) => (b.pushedAt ?? '').localeCompare(a.pushedAt ?? ''))

        const overview: GithubOverview = {
            profile,
            repos,
            stats: deriveStats(repos),
            source: 'live',
            generatedAt: new Date().toISOString()
        }

        writeMemory(key, overview)
        void writeStorage(key, { at: now(), data: overview })
        return overview
    } catch {
        if (mem) return { ...mem.data, source: 'cache' }
        if (persisted) return { ...persisted.data, source: 'cache' }
        return seedOverview()
    }
}

/* ---- public: contributions (parsed from the public profile calendar) ---- */

const parseContributions = (html: string): ContribData | null => {
    let tags = html.match(/<td[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g)
    if (!tags || tags.length === 0) {
        tags = html.match(/<td[^>]*data-date="\d{4}-\d{2}-\d{2}"[^>]*>/g)
    }
    if (!tags || tags.length === 0) return null

    const days: Array<ContribDay> = []
    for (const tag of tags) {
        const date = tag.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1]
        if (!date) continue
        const levelRaw = tag.match(/data-level="([0-4])"/)?.[1]
        const level = (levelRaw ? Number(levelRaw) : 0) as ContribDay['level']
        days.push({ date, count: 0, level })
    }
    if (days.length === 0) return null

    days.sort((a, b) => a.date.localeCompare(b.date))

    // Total: sum of per-day tooltip counts ("12 contributions on ...").
    let total = 0
    const countMatches = html.matchAll(/(\d[\d,]*)\s+contributions?\s+on\b/g)
    for (const m of countMatches) total += Number(m[1].replace(/,/g, ''))
    if (total === 0) {
        const heading = html.match(/([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/i)
        if (heading) total = Number(heading[1].replace(/,/g, ''))
    }

    const weeks: Array<Array<ContribDay>> = []
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))

    return { total, weeks, updatedAt: new Date().toISOString() }
}

export const getContributions = async (): Promise<ContribData | null> => {
    const key = 'contributions'

    const mem = readMemory<ContribData>(key)
    if (mem && now() - mem.at < TTL.contrib) return mem.data

    const persisted = await readStorage<ContribData>(key)
    if (persisted && now() - persisted.at < TTL.contrib) {
        writeMemory(key, persisted.data)
        return persisted.data
    }

    try {
        const res = await fetch(`https://github.com/users/${USER}/contributions`, {
            headers: { 'User-Agent': 'knight-portfolio', Accept: 'text/html' }
        })
        if (!res.ok) throw new Error(`contributions ${res.status}`)
        const html = await res.text()
        const parsed = parseContributions(html)
        if (!parsed) throw new Error('contributions parse failed')

        writeMemory(key, parsed)
        void writeStorage(key, { at: now(), data: parsed })
        return parsed
    } catch {
        if (mem) return mem.data
        if (persisted) return persisted.data
        return null
    }
}

/* ---- public: activity feed ---- */

export const getActivity = async (): Promise<Array<ActivityEvent>> => {
    const key = 'activity'

    const mem = readMemory<Array<ActivityEvent>>(key)
    if (mem && now() - mem.at < TTL.activity) return mem.data

    try {
        const raw = await ghFetch<Array<unknown>>(`${API}/users/${USER}/events/public?per_page=30`)
        const events = (raw as Array<unknown>)
            .map(mapEvent)
            .filter((e): e is ActivityEvent => e !== null)
            .slice(0, 14)

        writeMemory(key, events)
        void writeStorage(key, { at: now(), data: events })
        return events
    } catch {
        if (mem) return mem.data
        const persisted = await readStorage<Array<ActivityEvent>>(key)
        if (persisted) return persisted.data
        return []
    }
}
