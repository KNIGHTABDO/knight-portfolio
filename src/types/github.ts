export type ThemeKey = 'ai' | 'medical' | 'arabic' | 'media' | 'tools'

export type DataSource = 'live' | 'cache' | 'seed'

export interface GithubProfile {
    login: string
    name: string
    avatarUrl: string
    bio: string
    htmlUrl: string
    company: string | null
    blog: string | null
    location: string | null
    followers: number
    following: number
    publicRepos: number
    createdAt: string | null
}

export interface GithubRepo {
    id: number
    name: string
    description: string | null
    htmlUrl: string
    homepage: string | null
    language: string | null
    stars: number
    forks: number
    watchers: number
    openIssues: number
    isFork: boolean
    archived: boolean
    topics: Array<string>
    createdAt: string | null
    updatedAt: string | null
    pushedAt: string | null
    theme: ThemeKey
}

export interface LanguageStat {
    name: string
    count: number
    percent: number
    color: string
}

export interface GithubStats {
    totalStars: number
    totalForks: number
    originalRepos: number
    forkedRepos: number
    topLanguage: string | null
    languages: Array<LanguageStat>
}

export interface ContribDay {
    date: string
    count: number
    level: 0 | 1 | 2 | 3 | 4
}

export interface ContribData {
    total: number
    weeks: Array<Array<ContribDay>>
    updatedAt: string
}

export interface ActivityEvent {
    id: string
    type: string
    action: string
    repo: string
    repoUrl: string
    createdAt: string
    icon: string
}

export interface GithubOverview {
    profile: GithubProfile
    repos: Array<GithubRepo>
    stats: GithubStats
    source: DataSource
    generatedAt: string
}
