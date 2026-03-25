import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { homeKeys } from '@/features/home/api/keys'
import { fetchHnFeed } from '@/features/home/services/hn/hn.service'
import type { FeedItem } from '@/features/home/types'
import { Freshness } from '@/shared/services/api/query/policy/freshness'
import { formatRelativeTime } from '@/shared/utils/format-relative-time'

export function useFeedQuery() {
  const query = useQuery<FeedItem[]>({
    queryKey: homeKeys.feed(),
    queryFn: fetchHnFeed,
    staleTime: Freshness.nearRealtime.staleTime,
    gcTime: Freshness.nearRealtime.gcTime,
    meta: { persistence: 'nearRealtime' },
    placeholderData: prev => prev,
  })

  const syncedAtLabel = useMemo(() => {
    const ts = query.dataUpdatedAt
    return ts ? formatRelativeTime(ts) : null
  }, [query.dataUpdatedAt])

  return {
    feed: query.data ?? [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    hasCache: !!query.data,
    syncedAtLabel,
  }
}
