import { create } from 'apisauce'
import type { FeedItem } from '@/features/home/types'
import { attachLogging } from '@/shared/services/api/http/interceptors/logging.interceptor'
import { normalizeError } from '@/shared/utils/normalize-error'
import { mapHnHitToFeedItem } from './hn.mappers'
import { HnSearchResponseSchema } from './hn.schemas'

const hnClient = create({
  baseURL: 'https://hn.algolia.com/api/v1',
  timeout: 10_000,
  headers: { Accept: 'application/json' },
})

attachLogging(hnClient)

export async function fetchHnFeed(): Promise<FeedItem[]> {
  const res = await hnClient.get<unknown>('/search', { tags: 'front_page' })
  if (!res.ok) {
    throw normalizeError(
      res.originalError ?? new Error('HN API request failed'),
    )
  }
  const parsed = HnSearchResponseSchema.parse(res.data)
  return parsed.hits.map(mapHnHitToFeedItem)
}
