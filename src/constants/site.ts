import type { SiteConfig } from '@/types'
import { getOrigin } from '@/lib/window'

export const siteConfig: SiteConfig = {
    name: 'KNIGHT — Live GitHub Portfolio',
    description:
        'The living portfolio of KNIGHT (knightabdo): a Moroccan med student and vibe coder shipping AI agents, med-tech and Arabic-first apps. 89 repos, streamed live from GitHub.',
    url: getOrigin(),
    ogImage: '/og-image.png',
    links: {
        github: 'https://github.com/knightabdo'
    }
}
