import Head from 'next/head'

import { GITHUB } from '@/constants/github'
import { siteConfig } from '@/constants/site'

export const StructuredData = () => {
    const graph = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Person',
                '@id': `${GITHUB.profileUrl}#person`,
                name: 'KNIGHT',
                alternateName: 'knightabdo',
                url: GITHUB.profileUrl,
                image: GITHUB.avatarFallback,
                description:
                    'Second-year medical student at FMPC in Casablanca who builds AI tools, med-tech and Arabic-first apps.',
                jobTitle: 'Software builder & medical student',
                address: {
                    '@type': 'PostalAddress',
                    addressCountry: 'MA'
                },
                knowsAbout: [
                    'Artificial Intelligence',
                    'Large Language Models',
                    'Web Development',
                    'TypeScript',
                    'Medical Education Technology'
                ],
                sameAs: [
                    GITHUB.profileUrl,
                    'https://zeroqcm.me',
                    'https://forge-app-peach.vercel.app',
                    'https://huroof-abdo.vercel.app'
                ]
            },
            {
                '@type': 'WebSite',
                '@id': `${GITHUB.profileUrl}#website`,
                name: siteConfig.name,
                description: siteConfig.description,
                inLanguage: 'en',
                author: { '@id': `${GITHUB.profileUrl}#person` }
            }
        ]
    }

    return (
        <Head>
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
            />
        </Head>
    )
}
