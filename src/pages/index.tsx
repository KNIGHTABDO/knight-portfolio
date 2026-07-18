import type { FC, ReactNode } from 'react'
import type { GetStaticProps } from 'next'
import type { ContribData, GithubOverview } from '@/types/github'

import { getContributions, getOverview } from '@/lib/github'
import { useLiveOverview, useContributions } from '@/hooks/use-live-github'
import { Seo } from '@/components/generals/seo'
import { StructuredData } from '@/components/generals/structured-data'
import { DockNav } from '@/components/portfolio/dock-nav'
import { ScrollProgress } from '@/components/portfolio/scroll-progress'
import { Hero } from '@/components/portfolio/hero'
import { About } from '@/components/portfolio/about'
import { Stats } from '@/components/portfolio/stats'
import { Featured } from '@/components/portfolio/featured'
import { Builds } from '@/components/portfolio/builds'
import { Arsenal } from '@/components/portfolio/arsenal'
import { Activity } from '@/components/portfolio/activity'
import { Connect } from '@/components/portfolio/connect'
import { SiteFooter } from '@/components/portfolio/site-footer'

interface HomeProps {
    overview?: GithubOverview
    contributions?: ContribData | null
}

const Home: FC<HomeProps> = ({ overview: initialOverview, contributions: initialContrib }): ReactNode => {
    const { overview, refreshing, refresh } = useLiveOverview(initialOverview)
    const { data: contributions, loading: contribLoading } = useContributions(initialContrib ?? null)

    return (
        <>
            <Seo />
            <StructuredData />
            <ScrollProgress />
            <DockNav />

            <main>
                <Hero overview={overview} />
                <About profile={overview.profile} />
                <Stats
                    overview={overview}
                    contributions={contributions}
                    contributionsLoading={contribLoading}
                    refreshing={refreshing}
                    onRefresh={refresh}
                />
                <Featured repos={overview.repos} />
                <Builds repos={overview.repos} />
                <Arsenal repos={overview.repos} refreshing={refreshing} />
                <Activity />
                <Connect profile={overview.profile} />
            </main>

            <SiteFooter />
        </>
    )
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    const [overview, contributions] = await Promise.all([getOverview(), getContributions()])

    return {
        props: { overview, contributions },
        revalidate: 900
    }
}

export default Home
