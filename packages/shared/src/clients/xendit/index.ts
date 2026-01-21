import https from 'https';
import { URL } from 'url';

export type XenditInvoiceRequest = {
  external_id: string;
  amount: number;
  payer_email?: string;
  description?: string;
};

export type XenditInvoiceResponse = {
  id: string;
  external_id: string;
  amount: number;
  status: string;
  invoice_url?: string;
  [k: string]: any;
};

export type Transport = {
  post: (path: string, body: any, headers?: Record<string,string>) => Promise<any>;
  get: (path: string, headers?: Record<string,string>) => Promise<any>;
};

function defaultHeaders(apiKey?: string) {
  const h: Record<string,string> = { 'Content-Type': 'application/json' };
  if (apiKey) h['Authorization'] = `Basic ${Buffer.from(apiKey + ':').toString('base64')}`;
  return h;
}

function httpRequest(method: 'GET'|'POST', fullUrl: string, body?: any, headers: Record<string,string> = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = new URL(fullUrl);
    const opts: https.RequestOptions = {
      method,
      hostname: url.hostname,
      path: url.pathname + (url.search || ''),
      port: url.port || 443,
      headers,
    };

    const req = https.request(opts, res => {
      const chunks: Buffer[] = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8') || '';
        try {
          const parsed = raw ? JSON.parse(raw) : undefined;
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) return resolve(parsed);
          const err: any = new Error(`HTTP ${res.statusCode}: ${raw}`);
          err.status = res.statusCode;
          err.body = parsed;
          return reject(err);
        } catch (e) {
          return reject(e);
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function createDefaultTransport(baseUrl: string, apiKey?: string): Transport {
  return {
    post: (path, body, headers = {}) => httpRequest('POST', `${baseUrl}${path}`, body, { ...defaultHeaders(apiKey), ...headers }),
    get: (path, headers = {}) => httpRequest('GET', `${baseUrl}${path}`, undefined, { ...defaultHeaders(apiKey), ...headers }),
  };
}

async function retry<T>(fn: () => Promise<T>, retries = 3, backoff = 150): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const delay = Math.round(backoff * Math.pow(2, attempt - 1) * (0.75 + Math.random() * 0.5));
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

export class XenditClient {
  private transport: Transport;
  private baseUrl: string;

  constructor(opts?: { apiKey?: string; baseUrl?: string; transport?: Transport }) {
    this.baseUrl = opts?.baseUrl ?? 'https://api.xendit.co';
    this.transport = opts?.transport ?? createDefaultTransport(this.baseUrl, opts?.apiKey ?? process.env.XENDIT_API_KEY);
  }

  async createInvoice(payload: XenditInvoiceRequest) : Promise<XenditInvoiceResponse> {
    return retry(() => this.transport.post('/v2/invoices', payload), 3, 200);
  }

  async getInvoice(idOrExternalId: string): Promise<XenditInvoiceResponse> {
    // Xendit has endpoints to fetch by id or external_id; try by id first
    return retry(async () => {
      // try by id
      try {
        return await this.transport.get(`/v2/invoices/${encodeURIComponent(idOrExternalId)}`);
      } catch (e) {
        // fallback: search by external_id
        const res = await this.transport.get(`/v2/invoices?external_id=${encodeURIComponent(idOrExternalId)}`);
        // if array response, return first
        if (Array.isArray(res)) return res[0];
        return res;
      }
    }, 2, 150);
  }
}

export default XenditClient;
// Minimal Xendit sandbox client (mocked for dev)
export interface XenditChargeResult {
  id: string;
  status: 'PAID' | 'PENDING' | 'FAILED';
  amount: number;
}

export async function chargeSandbox(
  amount: number,
  opts?: Record<string, any>
): Promise<XenditChargeResult> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 10));
  return {
    id: `xendit_mock_${Date.now()}`,
    status: 'PAID',
    amount,
  };
}

export default { chargeSandbox };
