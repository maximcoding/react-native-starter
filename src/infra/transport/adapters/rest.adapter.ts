// src/infra/transport/adapters/rest.adapter.ts
/**
 * FILE: rest.adapter.ts
 * LAYER: infra/transport/adapters
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Implement Transport interface using REST-style HTTP endpoints
 *   on top of axiosInstance.
 *
 * NOTES:
 *   - Operations are typed (Operation), so every op must be declared in OPS.
 *   - ROUTES maps ops to real REST endpoints (GET/PUT/etc).
 *   - Fallback keeps legacy behavior: GET/POST /{operation} for ops that exist in OPS.
 * ---------------------------------------------------------------------
 */

import type {
  Transport,
  TransportRequestMeta,
} from '@/infra/transport/transport.types';
import { axiosInstance } from '@/infra/http/axios.instance';
import { OPS } from '@/infra/transport/operations';
import type { Operation } from '@/infra/transport/operations';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type Route = {
  method: HttpMethod;
  path: string;
};

const ROUTES: Partial<Record<Operation, Route>> = {
  [OPS.USER_ME]: { method: 'GET', path: '/me' },
  [OPS.USER_UPDATE_PROFILE]: { method: 'PUT', path: '/me' },

  [OPS.AUTH_LOGIN]: { method: 'POST', path: '/auth/login' },
  [OPS.AUTH_REFRESH]: { method: 'POST', path: '/auth/refresh' },
};

function resolveRoute(
  kind: 'query' | 'mutate' | 'upload',
  operation: Operation,
): Route {
  const mapped = ROUTES[operation];
  if (mapped) return mapped;

  // fallback for ops that exist in OPS but are not mapped yet
  if (kind === 'query') return { method: 'GET', path: `/${operation}` };
  return { method: 'POST', path: `/${operation}` };
}

export const restAdapter: Transport = {
  async query<TResponse = unknown, TVariables = unknown>(
    operation: Operation,
    variables?: TVariables,
    _meta?: TransportRequestMeta,
  ): Promise<TResponse> {
    const { method, path } = resolveRoute('query', operation);

    const res = await axiosInstance.request<TResponse>({
      method,
      url: path,
      params: method === 'GET' ? (variables as any) : undefined,
      data: method !== 'GET' ? (variables as any) : undefined,
    });

    return res.data;
  },

  async mutate<TResponse = unknown, TVariables = unknown>(
    operation: Operation,
    variables?: TVariables,
    _meta?: TransportRequestMeta,
  ): Promise<TResponse> {
    const { method, path } = resolveRoute('mutate', operation);

    const res = await axiosInstance.request<TResponse>({
      method,
      url: path,
      data: variables as any,
    });

    return res.data;
  },

  subscribe<TData = unknown>(
    _channel: string,
    _handler: (data: TData) => void,
    _meta?: TransportRequestMeta,
  ) {
    return () => {};
  },

  async upload<TResponse = unknown>(
    operation: Operation,
    payload: { file: unknown; extra?: Record<string, unknown> },
    _meta?: TransportRequestMeta,
  ): Promise<TResponse> {
    const { method, path } = resolveRoute('upload', operation);

    const form = new FormData();

    if (payload.file != null) {
      form.append('file', payload.file as any);
    }

    if (payload.extra) {
      for (const [k, v] of Object.entries(payload.extra)) {
        form.append(k, String(v));
      }
    }

    const res = await axiosInstance.request<TResponse>({
      method,
      url: path,
      data: form,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data;
  },
};
