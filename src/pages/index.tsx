import type { FC, ReactNode } from 'react'
import type { GetStaticProps } from 'next'
import type { ContribData, GithubOverview } from '@/types/github'

import { getContributions, getOverview } from '@/lib/github'
import { useActivity, useContributions, useLiveOverview } from '@/hooks/use-live-github'

import { Seo } from '@/components/generals/seo'
import { StructuredData } from '@/components/generals/structured-data'

import About from '@/components/landing/about'
import Contact from '@/components/landing/contact'
import Footer from '@/components/landing/footer'
import Hero from '@/components/landing/hero'
import Pulse from '@/components/landing/pulse'
import Shelf from '@/components/landing/shelf'
import TopBar from '@/components/landing/top-bar'
import Work from '@/components/landing/work'

interface HomeProps {
    overview?: GithubOverview
    contributions?: ContribData | null
}

const Home: FC<HomeProps> = ({ overview: initialOverview, contributions: initialContrib }): ReactNode => {
    const { overview, refreshing, refresh } = useLiveOverview(initialOverview)
    const { data: contributions, loading: contribLoading } = useContributions(initialContrib ?? null)
    const { events, loading: eventsLoading } = useActivity()

    return (
        <>
            <Seo />
            <StructuredData />
            <a href='#main' className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-paper focus:px-4 focus:py-2 focus:font-hand focus:text-xl'>
                skip to the sketchbook
            </a>
            <TopBar />
            <main id='main'>
                <Hero profile={overview.profile} />
                <About profile={overview.profile} />
                <Work repos={overview.repos} profile={overview.profile} />
                <Shelf overview={overview} refreshing={refreshing} onRefresh={refresh} />
                <Pulse overview={overview} contributions={contributions} contributionsLoading={contribLoading} events={events} eventsLoading={eventsLoading} />
                <Contact profile={overview.profile} />
            </main>
            <Footer />
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
