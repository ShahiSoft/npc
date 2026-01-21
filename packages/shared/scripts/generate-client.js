const fs = require('fs');
const path = require('path');

const { execSync } = require('child_process');
const specJson = path.resolve(__dirname, '..', 'openapi', 'spec.json');
const spec2Json = path.resolve(__dirname, '..', 'openapi', 'spec2.json');
const specPath = fs.existsSync(spec2Json) ? spec2Json : specJson;
const outDir = path.resolve(__dirname, '..', 'dist', 'client');
fs.mkdirSync(outDir, { recursive: true });

const logDir = path.resolve(__dirname, '..', '..', '.ci');
fs.mkdirSync(logDir, { recursive: true });
const logFile = path.join(logDir, 'client-codegen.log');
function appendLog(...args) {
  try { fs.appendFileSync(logFile, args.join(' ') + '\n'); } catch (e) { /* ignore */ }
}

if (!fs.existsSync(specPath)) {
  console.error('OpenAPI spec not found:', specPath);
  process.exit(1);
} else {
  console.log('Using OpenAPI spec:', specPath);
  appendLog('Using OpenAPI spec:', specPath);
}

console.log('Running openapi-typescript to generate types...');
appendLog('Running openapi-typescript to generate types...');
try {
  const typesOut = path.join(outDir, 'types.d.ts');
  // Use the CLI via pnpm exec to avoid programmatic async/sync mismatch across versions
  try {
    execSync(`pnpm exec openapi-typescript ${specPath} --output ${typesOut}`, { stdio: 'inherit' });
  } catch (e2) {
    // fallback to npx if pnpm exec is not available
    execSync(`npx --yes openapi-typescript ${specPath} --output ${typesOut}`, { stdio: 'inherit' });
  }
  appendLog('openapi-typescript succeeded, types at', typesOut);
  console.log('Types generated at', typesOut);
} catch (e) {
  console.error('openapi-typescript failed', e && e.message);
  appendLog('openapi-typescript failed:', e && (e.stack || e.message));
  // do not exit here; continue to emit a best-effort client
}

// produce a tiny fetch-based client that uses the generated types
const clientFile = path.join(outDir, 'client.ts');
const clientTs = `// Auto-generated client wrapper (DO NOT EDIT)
import fetch from 'node-fetch';
import type { paths } from './types';

const BASE = process.env.NUSANTARA_API_BASE || '';

export type ClientOptions = {
  token?: string;
  fetch?: any;
  retries?: number;
  timeoutMs?: number;
  refreshToken?: () => Promise<string> | undefined;
};

export class ApiError<T = any> extends Error {
  status: number;
  body: T | null;
  constructor(message: string, status: number, body: T | null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

function getDefaultFetch(): any {
  if (typeof (globalThis as any).fetch === 'function') return (globalThis as any).fetch;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('node-fetch');
  } catch (e) {
    throw new Error('No fetch available. Install node-fetch or provide a fetch implementation via ClientOptions.');
  }
}

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function request<T = any>(path: string, init: RequestInit = {}, opts: ClientOptions = {}): Promise<T> {
  const fetchImpl = opts.fetch || getDefaultFetch();
  const retries = typeof opts.retries === 'number' ? opts.retries : 0;
  const timeoutMs = typeof opts.timeoutMs === 'number' ? opts.timeoutMs : 0;

  let lastErr: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const headers: Record<string,string> = Object.assign({}, (init.headers || {}));
      if (!headers['Content-Type'] && init.body) { headers['Content-Type'] = 'application/json'; }
      if (opts.token) { headers['Authorization'] = 'Bearer ' + opts.token; }

      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const signal = controller ? controller.signal : undefined;
      const finalInit = Object.assign({}, init, { headers, signal });

      const p = fetchImpl(BASE + path, finalInit);
      const res = timeoutMs && controller
        ? await Promise.race([p, (async () => { await sleep(timeoutMs); controller.abort(); throw new Error('timeout'); })()])
        : await p;

      const text = await (res.text ? res.text() : Promise.resolve(''));
      let body: any = null;
      try { body = text ? JSON.parse(text) : null; } catch (e) { body = text; }

      if (res.status === 401 && typeof opts.refreshToken === 'function') {
        // try to refresh token once and retry immediately
        const newToken = await opts.refreshToken();
        if (newToken && attempt === 0) {
          opts = Object.assign({}, opts, { token: newToken });
          continue; // retry immediately
        }
      }

      if (!res.ok) { throw new ApiError('Request failed ' + res.status + ' ' + res.statusText, res.status, body); }
      return body as T;
    } catch (e) {
      lastErr = e;
      // exponential backoff for retries
      if (attempt < retries) {
        await sleep(50 * Math.pow(2, attempt));
        continue;
      }
      throw lastErr;
    }
  }
  throw lastErr;
}

// wrapper functions
export async function post_auth_token(body: paths['/auth/token']['post']['requestBody'], opts?: ClientOptions): Promise<paths['/auth/token']['post']['responses']['200']['content']['application/json']> {
  return request('/auth/token', { method: 'POST', body: JSON.stringify(body) }, opts || {});
}

export async function post_users(body: paths['/users']['post']['requestBody'], opts?: ClientOptions): Promise<paths['/users']['post']['responses']['201']['content']['application/json']> {
  return request('/users', { method: 'POST', body: JSON.stringify(body) }, opts || {});
}

export async function get_users(opts?: ClientOptions): Promise<paths['/users']['get']['responses']['200']['content']['application/json']> {
  return request('/users', { method: 'GET' }, opts || {});
}

export async function get_users_userId(userId: string, opts?: ClientOptions): Promise<paths['/users/{userId}']['get']['responses']['200']['content']['application/json']> {
  return request('/users/' + encodeURIComponent(userId), { method: 'GET' }, opts || {});
}

export async function post_subscriptions(body: paths['/subscriptions']['post']['requestBody'], opts?: ClientOptions): Promise<paths['/subscriptions']['post']['responses']['201']['content']['application/json']> {
  return request('/subscriptions', { method: 'POST', body: JSON.stringify(body) }, opts || {});
}

export async function post_orders(body: paths['/orders']['post']['requestBody'], opts?: ClientOptions): Promise<paths['/orders']['post']['responses']['201']['content']['application/json']> {
  return request('/orders', { method: 'POST', body: JSON.stringify(body) }, opts || {});
}

export async function post_payments(body: paths['/payments']['post']['requestBody'], opts?: ClientOptions): Promise<paths['/payments']['post']['responses']['200']['content']['application/json']> {
  return request('/payments', { method: 'POST', body: JSON.stringify(body) }, opts || {});
}

export async function post_shipments(body: paths['/shipments']['post']['requestBody'], opts?: ClientOptions): Promise<paths['/shipments']['post']['responses']['201']['content']['application/json']> {
  return request('/shipments', { method: 'POST', body: JSON.stringify(body) }, opts || {});
}

// factory helper
export function createClient(defaultOpts: ClientOptions = {}) {
  return {
    post_auth_token: (body: any, opts?: ClientOptions) => post_auth_token(body, Object.assign({}, defaultOpts, opts)),
    post_users: (body: any, opts?: ClientOptions) => post_users(body, Object.assign({}, defaultOpts, opts)),
    get_users: (opts?: ClientOptions) => get_users(Object.assign({}, defaultOpts, opts)),
    get_users_userId: (userId: string, opts?: ClientOptions) => get_users_userId(userId, Object.assign({}, defaultOpts, opts)),
    post_subscriptions: (body: any, opts?: ClientOptions) => post_subscriptions(body, Object.assign({}, defaultOpts, opts)),
    post_orders: (body: any, opts?: ClientOptions) => post_orders(body, Object.assign({}, defaultOpts, opts)),
    post_payments: (body: any, opts?: ClientOptions) => post_payments(body, Object.assign({}, defaultOpts, opts)),
    post_shipments: (body: any, opts?: ClientOptions) => post_shipments(body, Object.assign({}, defaultOpts, opts)),
  };
}
`;

try {
  fs.writeFileSync(clientFile, clientTs, 'utf8');
  console.log('Generated improved client at', clientFile);
  appendLog('Generated improved client at', clientFile);
} catch (e) {
  console.error('Failed to write client file', e && e.message);
  appendLog('Failed to write client file:', e && (e.stack || e.message));
}
