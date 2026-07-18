import type { GithubRepo } from '@/types/github'

import { FEATURED_SLUGS } from '@/constants/github'
import { Section, SectionHeading } from '@/components/generals/section'
import { Reveal } from '@/components/generals/reveal'
import { FeaturedCard } from '@/components/portfolio/repo-card'

const pickFeatured = (repos: Array<GithubRepo>): Array<GithubRepo> => {
    const byName = new Map(repos.map((r) => [r.name.toLowerCase(), r]))
    const picked: Array<GithubRepo> = []
    const used = new Set<string>()

    for (const slug of FEATURED_SLUGS) {
        const repo = byName.get(slug.toLowerCase())
        if (repo) {
            picked.push(repo)
            used.add(repo.name.toLowerCase())
        }
    }

    if (picked.length < 6) {
        const rest = [...repos]
            .filter((r) => !used.has(r.name.toLowerCase()) && !r.isFork)
            .sort((a, b) => b.stars - a.stars || (b.pushedAt ?? '').localeCompare(a.pushedAt ?? ''))

        for (const repo of rest) {
            if (picked.length >= 6) break
            picked.push(repo)
        }
    }

    return picked.slice(0, 6)
}

interface FeaturedProps {
    repos: Array<GithubRepo>
}

export const Featured = ({ repos }: FeaturedProps) => {
    const featured = pickFeatured(repos)

    return (
        <Section id='work' size='wide'>
            <SectionHeading
                eyebrow='Featured work'
                title='Six that tell the story'
                description='Pinned projects and the most-loved repos — from a cinematic AI radio to a 215k-question med-school platform.'
            />

            <div className='mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                {featured.map((repo, i) => (
                    <Reveal key={repo.id} delay={(i % 3) * 90}>
                        <FeaturedCard repo={repo} />
                    </Reveal>
                ))}
            </div>
        </Section>
    )
}
