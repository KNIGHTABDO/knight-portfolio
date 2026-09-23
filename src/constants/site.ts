import type { SiteConfig } from '@/types'

import { getOrigin } from '@/lib/window'

export const siteConfig: SiteConfig = {
    name: 'KNIGHT — a med student who builds',
    description:
        'The sketchbook of KNIGHT (knightabdo): a second-year medical student in Casablanca who builds AI tools, med-tech and Arabic-first apps by night. 89 repositories, drawn live from GitHub.',
    url: getOrigin(),
    ogImage: '/og-image.jpg',
    links: {
        github: 'https://github.com/knightabdo'
    }
}
