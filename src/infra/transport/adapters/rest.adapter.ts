/**
 * FILE: rest.adapter.ts
 * LAYER: infra/transport/adapters
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Implement Transport interface using REST-style HTTP endpoints
 *   on top of axiosInstance.
 *
 * RESPONSIBILITIES:
 *   - Map transport.query/mutate/upload calls to GET/POST requests.
 *   - Use axiosInstance so all interceptors (auth/logging/error) apply.
 *
 * DATA-FLOW:
 *   service
 *      → transport.query/mutate/upload
 *         → restAdapter.query/mutate/upload
 *            → axiosInstance
 *            → backend
 *
 * EXTENSION GUIDELINES:
 *   - Customize path mapping (e.g. "/api/v1/" + operation).
 *   - Add support for PUT/PATCH/DELETE if needed.
 * ---------------------------------------------------------------------
 */
import type { Transport } from '@/infra/transport/transport.types';
import { axiosInstance } from '@/infra/http/axios.instance';

export const restAdapter: Transport = {
  async query<TResponse = unknown, TVariables = unknown>(
    operation: string,
    variables?: TVariables,
  ): Promise<TResponse> {
    const path = `/${operation}`;
    const res = await axiosInstance.get<TResponse>(path, { params: variables as any });
    return res.data;
  },

  async mutate<TResponse = unknown, TVariables = unknown>(
    operation: string,
    variables?: TVariables,
  ): Promise<TResponse> {
    const path = `/${operation}`;
    const res = await axiosInstance.post<TResponse>(path, variables);
    return res.data;
  },

  subscribe() {
    // REST has no native subscriptions.
    return () => {};
  },

  async upload<TResponse = unknown>(
    operation: string,
    payload: { file: unknown; extra?: Record<string, unknown> },
  ): Promise<TResponse> {
    const path = `/${operation}`;
    const form = new FormData();
    if (payload.file != null) {
      form.append('file', payload.file);
    }
    if (payload.extra) {
      Object.entries(payload.extra).forEach(([k, v]) => {
        form.append(k, String(v));
      });
    }
    const res = await axiosInstance.post<TResponse>(path, form);
    return res.data;
  },
};
