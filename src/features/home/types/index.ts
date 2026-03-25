/**
 * Home feature — shared interfaces and type aliases.
 */

/** Visual accent variant — drives dot colour in the feed card. Purely cosmetic; not a domain concept. */
export type AccentVariant = 'success' | 'primary' | 'info' | 'warning'

export type FeedItem = {
  id: string
  type: AccentVariant
  title: string
  subtitle: string
  time: string
  url?: string
  points?: number
  author?: string
  numComments?: number
}
