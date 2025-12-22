/**
 * FILE: api.ts
 * LAYER: infra/http
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Thin helper wrapper around axiosInstance for simple REST-style calls.
 *   Used only for trivial GET/POST/PUT/DELETE cases. All complex flows
 *   must use transport + REST adapter to preserve offline & multi-adapter
 *   capabilities.
 *
 * RESPONSIBILITIES:
 *   - Provide apiGet/apiPost/apiPut/apiDelete helpers.
 *   - Ensure consistent error normalization across all requests.
 *   - Serve as lightweight alternative to transport when offline behavior
 *     is not required (e.g., unauthenticated endpoints, static endpoints).
 *
 * DATA-FLOW:
 *   service → api.X()
 *      → axiosInstance
 *         → interceptors (auth/logging/error)
 *         → backend
 *
 * EXTENSION GUIDELINES:
 *   - Do NOT use for domain logic requiring offline queue or adapter routing.
 *   - Keep helpers thin — no retries/backoff.
 *   - Use only for simple classical REST endpoints.
 *
 *   - Thin helper wrapper around axiosInstance for simple REST-style calls.
 *   - IMPORTANT:
 *   - Do NOT normalize errors here. Throw raw error.
 *   - Global normalization happens in QueryClient (QueryCache/MutationCache).
 *
 * ---------------------------------------------------------------------
 */
import { axiosInstance } from '@/infra/http/axios.instance';

async function apiRequest<TResponse>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  options?: {
    params?: Record<string, unknown>;
    body?: unknown;
  },
): Promise<TResponse> {
  let res;

  switch (method) {
    case 'GET':
      res = await axiosInstance.get<TResponse>(path, {
        params: options?.params,
      });
      break;

    case 'POST':
      res = await axiosInstance.post<TResponse>(path, options?.body);
      break;

    case 'PUT':
      res = await axiosInstance.put<TResponse>(path, options?.body);
      break;

    case 'DELETE':
      res = await axiosInstance.delete<TResponse>(path, {
        params: options?.params,
      });
      break;

    default:
      throw new Error(`Unsupported method: ${method}`);
  }

  return res.data;
}

export async function apiGet<TResponse = unknown>(
  path: string,
  params?: Record<string, unknown>,
): Promise<TResponse> {
  return apiRequest<TResponse>('GET', path, { params });
}

export async function apiPost<TResponse = unknown, TBody = unknown>(
  path: string,
  body?: TBody,
): Promise<TResponse> {
  return apiRequest<TResponse>('POST', path, { body });
}

export async function apiPut<TResponse = unknown, TBody = unknown>(
  path: string,
  body?: TBody,
): Promise<TResponse> {
  return apiRequest<TResponse>('PUT', path, { body });
}

export async function apiDelete<TResponse = unknown>(
  path: string,
  params?: Record<string, unknown>,
): Promise<TResponse> {
  return apiRequest<TResponse>('DELETE', path, { params });
}