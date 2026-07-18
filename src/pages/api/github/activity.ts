import type { NextApiRequest, NextApiResponse } from 'next'
import type { ActivityEvent } from '@/types/github'

import { getActivity } from '@/lib/github'

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse<Array<ActivityEvent>>
) {
    const events = await getActivity()
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1800')
    res.status(200).json(events)
}
