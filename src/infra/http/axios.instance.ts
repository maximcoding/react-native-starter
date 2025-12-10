/**
 * FILE: axios.instance.ts
 * LAYER: infra/http
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Centralized Axios instance for all REST HTTP traffic.
 *   All REST adapters and api.* helpers must use ONLY this instance
 *   to ensure that logging, auth, and error normalization ALWAYS apply.
 *
 * RESPONSIBILITIES:
 *   - Configure baseURL dynamically from env/config.
 *   - Attach interceptors: logging → auth → error.
 *   - Provide a stable, typed HTTP entry point.
 *
 * DATA-FLOW:
 *   service → transport (REST adapter) → axiosInstance
 *      → logging.interceptor
 *      → auth.interceptor
 *      → backend
 *      → error.interceptor
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

// TODO: Replace with your env/config provider
// @ts-ignore
const BASE_URL = process.env.API_URL ?? '';

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
 * 3. Error    → normalizes all errors
 */
attachLoggingInterceptor(axiosInstance);
attachAuthInterceptor(axiosInstance);
attachErrorInterceptor(axiosInstance);
