import { mapHnHitToFeedItem, parseDomain } from './hn.mappers'
import type { HnHit } from './hn.schemas'

// ─── parseDomain ─────────────────────────────────────────────────────────────

describe('parseDomain', () => {
  it('extracts domain from https URL', () => {
    expect(parseDomain('https://example.com/article/123')).toBe('example.com')
  })

  it('strips www prefix', () => {
    expect(parseDomain('https://www.nytimes.com/path')).toBe('nytimes.com')
  })

  it('handles http', () => {
    expect(parseDomain('http://blog.github.com/')).toBe('blog.github.com')
  })

  it('returns null for null input', () => {
    expect(parseDomain(null)).toBeNull()
  })

  it('returns null for undefined input', () => {
    expect(parseDomain(undefined)).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(parseDomain('')).toBeNull()
  })
})

// ─── mapHnHitToFeedItem ───────────────────────────────────────────────────────

function makeHit(overrides: Partial<HnHit> = {}): HnHit {
  return {
    objectID: '40000000',
    title: 'Test Title',
    url: 'https://example.com/article',
    points: 100,
    num_comments: 42,
    author: 'testuser',
    created_at_i: Math.floor(Date.now() / 1000) - 3600, // 1h ago
    ...overrides,
  }
}

describe('mapHnHitToFeedItem', () => {
  it('maps all fields correctly', () => {
    const item = mapHnHitToFeedItem(makeHit())
    expect(item.id).toBe('40000000')
    expect(item.title).toBe('Test Title')
    expect(item.subtitle).toBe('example.com')
    expect(item.points).toBe(100)
    expect(item.numComments).toBe(42)
    expect(item.author).toBe('testuser')
    expect(item.url).toBe('https://example.com/article')
  })

  it('uses "Untitled" when title is null', () => {
    const item = mapHnHitToFeedItem(makeHit({ title: null }))
    expect(item.title).toBe('Untitled')
  })

  it('falls back to author attribution when no URL', () => {
    const item = mapHnHitToFeedItem(makeHit({ url: null, author: 'johndoe' }))
    expect(item.subtitle).toBe('by johndoe')
    expect(item.url).toBeUndefined()
  })

  it('falls back to "unknown" when both URL and author are missing', () => {
    const item = mapHnHitToFeedItem(makeHit({ url: null, author: null }))
    expect(item.subtitle).toBe('by unknown')
  })

  it('produces a deterministic accent from objectID', () => {
    const ACCENT_VARIANTS = ['success', 'primary', 'info', 'warning'] as const
    const item0 = mapHnHitToFeedItem(makeHit({ objectID: '0' }))
    const item1 = mapHnHitToFeedItem(makeHit({ objectID: '1' }))
    const item2 = mapHnHitToFeedItem(makeHit({ objectID: '2' }))
    const item3 = mapHnHitToFeedItem(makeHit({ objectID: '3' }))
    expect(item0.type).toBe(ACCENT_VARIANTS[0])
    expect(item1.type).toBe(ACCENT_VARIANTS[1])
    expect(item2.type).toBe(ACCENT_VARIANTS[2])
    expect(item3.type).toBe(ACCENT_VARIANTS[3])
    // Wraps around
    const item4 = mapHnHitToFeedItem(makeHit({ objectID: '4' }))
    expect(item4.type).toBe(ACCENT_VARIANTS[0])
  })

  it('formats recent time as relative string', () => {
    const recent = Math.floor(Date.now() / 1000) - 30 // 30s ago
    const item = mapHnHitToFeedItem(makeHit({ created_at_i: recent }))
    expect(item.time).toBe('just now')
  })

  it('formats old time as hour-based relative string', () => {
    const twoHoursAgo = Math.floor(Date.now() / 1000) - 7200
    const item = mapHnHitToFeedItem(makeHit({ created_at_i: twoHoursAgo }))
    expect(item.time).toBe('2h ago')
  })

  it('numComments defaults to 0 when null', () => {
    const item = mapHnHitToFeedItem(makeHit({ num_comments: null }))
    expect(item.numComments).toBe(0)
  })
})
