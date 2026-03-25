import type { FeedItem } from '@/features/home/types'
import { formatRelativeTime } from '@/shared/utils/format-relative-time'
import type { HnHit } from './hn.schemas'

const ACCENT_VARIANTS: FeedItem['type'][] = [
  'success',
  'primary',
  'info',
  'warning',
]

/** Deterministic accent colour from objectID — gives visual variety without random flicker. */
function mapAccent(objectID: string): FeedItem['type'] {
  return (
    ACCENT_VARIANTS[parseInt(objectID, 10) % ACCENT_VARIANTS.length] ??
    'primary'
  )
}

export function parseDomain(url: string | null | undefined): string | null {
  if (!url) return null
  const match = url.match(/^https?:\/\/(?:www\.)?([^/]+)/)
  return match?.[1] ?? null
}

export function mapHnHitToFeedItem(hit: HnHit): FeedItem {
  const domain = parseDomain(hit.url)

  return {
    id: hit.objectID,
    type: mapAccent(hit.objectID),
    title: hit.title ?? 'Untitled',
    subtitle: domain ?? `by ${hit.author ?? 'unknown'}`,
    time: formatRelativeTime(hit.created_at_i * 1_000),
    url: hit.url ?? undefined,
    points: hit.points ?? undefined,
    author: hit.author ?? undefined,
    numComments: hit.num_comments ?? 0,
  }
}
