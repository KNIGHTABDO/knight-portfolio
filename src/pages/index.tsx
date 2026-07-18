import type { FC, ReactNode } from 'react'
import type { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'
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

// Phase 2 components
import { Fireflies } from '@/components/portfolio/fireflies'
import { Console } from '@/components/portfolio/console'

interface HomeProps {
    overview?: GithubOverview
    contributions?: ContribData | null
}

const Home: FC<HomeProps> = ({ overview: initialOverview, contributions: initialContrib }): ReactNode => {
    const { overview, refreshing, refresh } = useLiveOverview(initialOverview)
    const { data: contributions, loading: contribLoading } = useContributions(initialContrib ?? null)
    const [isConsoleOpen, setIsConsoleOpen] = useState(false)

    useEffect(() => {
        const handleOpenConsole = () => {
            setIsConsoleOpen(true)
        }
        window.addEventListener('knight-open-console', handleOpenConsole)
        return () => window.removeEventListener('knight-open-console', handleOpenConsole)
    }, [])

    return (
        <>
            <Seo />
            <StructuredData />
            <ScrollProgress />
            <DockNav />

            {/* Retro Pixel Atmosphere Background Particles */}
            <Fireflies />

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

            {/* Secret Command Console Overlay */}
            <Console isOpen={isConsoleOpen} onClose={() => setIsConsoleOpen(false)} />
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
