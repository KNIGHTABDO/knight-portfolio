import Head from 'next/head'

import type { FC, ReactNode } from 'react'
import type { SeoProps } from '@/types'

import { siteConfig } from '@/constants/site'

export const Seo: FC<SeoProps> = ({
    title,
    description = siteConfig.description,
    ogImage = siteConfig.ogImage
}): ReactNode => {
    const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name

    return (
        <Head>
            <title>{pageTitle}</title>

            <meta name='description' content={description} />
            <meta
                name='keywords'
                content='KNIGHT, knightabdo, Abdo, portfolio, medical student, FMPC, Casablanca, Morocco, AI tools, LLM, agents, ZeroQCM, FORGE, Claudio, Huroof, Next.js, TypeScript'
            />
            <meta name='author' content='KNIGHT' />
            <meta name='robots' content='index, follow' />

            <meta property='og:site_name' content='KNIGHT' />
            <meta property='og:title' content={pageTitle} />
            <meta property='og:description' content={description} />
            <meta property='og:type' content='profile' />
            <meta property='og:image:width' content='1200' />
            <meta property='og:image:height' content='630' />
            {siteConfig.url && <meta property='og:url' content={siteConfig.url} />}
            {ogImage && <meta property='og:image' content={ogImage} />}

            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:title' content={pageTitle} />
            <meta name='twitter:description' content={description} />
            {ogImage && <meta name='twitter:image' content={ogImage} />}
        </Head>
    )
}
