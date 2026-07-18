import type { NextApiRequest, NextApiResponse } from 'next'
import type { GithubOverview } from '@/types/github'

import { getOverview } from '@/lib/github'

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse<GithubOverview>
) {
    const overview = await getOverview()
    res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')
    res.status(200).json(overview)
}
