/**
 * Returns a human-readable relative time string from an epoch timestamp.
 *
 * @param epochMs - Unix timestamp in **milliseconds** (pass `Date.now()` style)
 */
export function formatRelativeTime(epochMs: number): string {
  const diffMs = Date.now() - epochMs
  const m = Math.floor(diffMs / 60_000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}
