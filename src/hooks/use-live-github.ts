import type {
    ActivityEvent,
    ContribData,
    GithubOverview
} from '@/types/github'

import {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react'

import { SEED_OVERVIEW } from '@/constants/github'

/** Hydrate from server props, then refresh from the live API in the background. */
export const useLiveOverview = (initial: GithubOverview | undefined) => {
    const [overview, setOverview] = useState<GithubOverview>(initial ?? SEED_OVERVIEW)
    const [refreshing, setRefreshing] = useState(false)
    const mountedRef = useRef(true)

    const refresh = useCallback(async () => {
        setRefreshing(true)
        try {
            const res = await fetch('/api/github/overview')
            if (!res.ok) return
            const data = (await res.json()) as GithubOverview
            if (mountedRef.current && Array.isArray(data.repos) && data.repos.length > 0) {
                setOverview(data)
            }
        } catch {
            /* keep current data */
        } finally {
            if (mountedRef.current) setRefreshing(false)
        }
    }, [])

    useEffect(() => {
        mountedRef.current = true
        void refresh()
        return () => {
            mountedRef.current = false
        }
    }, [refresh])

    return { overview, refreshing, refresh }
}

export const useContributions = (initial: ContribData | null) => {
    const [data, setData] = useState<ContribData | null>(initial)
    const [loading, setLoading] = useState(initial === null)

    useEffect(() => {
        let active = true

        const load = async () => {
            try {
                const res = await fetch('/api/github/contributions')
                const json = await res.json()
                if (active && json && Array.isArray(json.weeks)) setData(json as ContribData)
            } catch {
                /* keep whatever we have */
            } finally {
                if (active) setLoading(false)
            }
        }

        void load()
        return () => {
            active = false
        }
    }, [])

    return { data, loading }
}

export const useActivity = () => {
    const [events, setEvents] = useState<Array<ActivityEvent>>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let active = true

        const load = async () => {
            try {
                const res = await fetch('/api/github/activity')
                const json = (await res.json()) as Array<ActivityEvent>
                if (active && Array.isArray(json)) setEvents(json)
            } catch {
                /* ignore */
            } finally {
                if (active) setLoading(false)
            }
        }

        void load()
        return () => {
            active = false
        }
    }, [])

    return { events, loading }
}
