// src/infra/http/axios.instance.ts
/**
 * FILE: axios.instance.ts
 * LAYER: infra/http
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Centralized Axios instance for all REST HTTP traffic.
 *   All REST adapters and api.* helpers must use ONLY this instance
 *   to ensure that logging, auth, refresh, and error normalization ALWAYS apply.
 *
 * RESPONSIBILITIES:
 *   - Configure baseURL dynamically from env/config.
 *   - Attach interceptors: logging → auth → refresh → error.
 *   - Provide a stable, typed HTTP entry point.
 *
 * DATA-FLOW:
 *   service → transport (REST adapter) → axiosInstance
 *      → logging.interceptor
 *      → auth.interceptor
 *      → refresh.interceptor (401 → refresh → retry original)
 *      → backend
 *      → error.interceptor (normalize)
 *
 * EXTENSION GUIDELINES:
 *   - Update baseURL based on build env (dev/stage/prod).
 *   - Add locale headers, user-agent, device info, etc.
 *   - Add retry logic ONLY in axios-level interceptors (never in services).
 * ---------------------------------------------------------------------
 */

import axios from 'axios';
import { attachLoggingInterceptor } from '@/infra/http/interceptors/logging.interceptor';
import { attachAuthInterceptor } from '@/infra/http/interceptors/auth.interceptor';
import { attachErrorInterceptor } from '@/infra/http/interceptors/error.interceptor';
import { attachRefreshTokenInterceptor } from '@/infra/http/interceptors/refresh.interceptor';

// TODO: Replace with your env/config provider
// @ts-ignore
import { env } from '@/core/config/env';
const BASE_URL = env.API_URL?.trim() ?? '';


export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor order MATTERS:
 * 1. Logging  → logs both request and response
 * 2. Auth     → attaches token
 * 3. Refresh  → handles 401 once, retries original
 * 4. Error    → normalizes all errors
 */
attachLoggingInterceptor(axiosInstance);
attachAuthInterceptor(axiosInstance);
attachRefreshTokenInterceptor(axiosInstance);
attachErrorInterceptor(axiosInstance);
