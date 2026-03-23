/**
 * @format
 */

import { ZodError, z } from 'zod'
import { normalizeError } from '@/shared/utils/normalize-error'

describe('normalizeError', () => {
  test('is idempotent — already-normalized error passes through unchanged', () => {
    const normalized = { code: 'AUTH_ERROR', message: 'Unauthorized', raw: {} }
    expect(normalizeError(normalized)).toBe(normalized)
  })

  test('normalizes a plain JS Error', () => {
    const err = new Error('something broke')
    const result = normalizeError(err)
    expect(result.message).toBe('something broke')
    expect(result.raw).toBe(err)
  })

  test('normalizes a thrown string', () => {
    const result = normalizeError('bad thing happened')
    expect(result.message).toBe('bad thing happened')
    expect(result.code).toBeNull()
  })

  test('detects offline from "Network Error" message', () => {
    const err = new Error('Network Error')
    const result = normalizeError(err)
    expect(result.code).toBe('NETWORK_OFFLINE')
    expect(result.message).toBe('No internet connection')
  })

  test('detects offline from "Offline:" prefix string', () => {
    const result = normalizeError('Offline: no route to host')
    expect(result.code).toBe('NETWORK_OFFLINE')
  })

  test('detects offline from NETWORK_OFFLINE code on object', () => {
    const result = normalizeError({
      code: 'NETWORK_OFFLINE',
      message: 'no net',
    })
    expect(result.code).toBe('NETWORK_OFFLINE')
  })

  test('normalizes ZodError with field path', () => {
    const schema = z.object({ email: z.string().email() })
    let zodErr: ZodError | null = null
    try {
      schema.parse({ email: 'not-an-email' })
    } catch (e) {
      zodErr = e as ZodError
    }
    const result = normalizeError(zodErr!)
    expect(result.code).toBe('VALIDATION_ERROR')
    expect(result.message).toContain('email')
  })

  test('extracts message from axios-style error shape', () => {
    const axiosLike = {
      isAxiosError: true,
      response: {
        status: 401,
        data: { message: 'Token expired' },
      },
    }
    const result = normalizeError(axiosLike)
    expect(result.message).toBe('Token expired')
    expect(result.status).toBe(401)
  })

  test('extracts code from response body', () => {
    const err = {
      response: {
        status: 403,
        data: { code: 'FORBIDDEN', message: 'No access' },
      },
    }
    const result = normalizeError(err)
    expect(result.code).toBe('FORBIDDEN')
    expect(result.status).toBe(403)
  })

  test('extracts message from GraphQL errors array', () => {
    const gqlErr = {
      graphQLErrors: [
        {
          message: 'Not authenticated',
          extensions: { code: 'UNAUTHENTICATED' },
        },
      ],
    }
    const result = normalizeError(gqlErr)
    expect(result.message).toBe('Not authenticated')
  })

  test('handles null/undefined gracefully', () => {
    expect(() => normalizeError(null)).not.toThrow()
    expect(() => normalizeError(undefined)).not.toThrow()
  })
})
