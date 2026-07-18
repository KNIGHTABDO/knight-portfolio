import type { NextApiRequest, NextApiResponse } from 'next'
import type { ContribData } from '@/types/github'

import { getContributions } from '@/lib/github'

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse<ContribData | { error: string }>
) {
    const data = await getContributions()
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=21600')

    if (!data) {
        res.status(200).json({ error: 'unavailable' })
        return
    }

    res.status(200).json(data)
}
