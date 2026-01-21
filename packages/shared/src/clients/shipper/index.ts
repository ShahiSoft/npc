// Shipper client utilities
export interface ShipmentRequest {
  id: string;
  courier?: string; // preferred courier code
  address: {
    province?: string;
    city?: string;
    district?: string;
    village?: string;
    street?: string;
    rt?: string;
    rw?: string;
    postal_code?: string;
    [k: string]: any;
  };
  items?: Array<{ sku?: string; name?: string; quantity: number; weight_grams?: number; price?: number }>; 
  service?: string; // service code e.g., REG/OKE/YES
}

export interface ShipmentResult {
  awb: string;
  courier: string;
  status: 'CREATED' | 'ERROR';
  raw?: any;
}

export type ShipperTransport = {
  post: (path: string, body: any, headers?: Record<string,string>) => Promise<any>;
  get?: (path: string, headers?: Record<string,string>) => Promise<any>;
};

// Basic AWB normalizer: ensures AWB is uppercase string without spaces
export function normalizeAwb(raw: string): string {
  if (!raw) return '';
  return String(raw).replace(/\s+/g, '').toUpperCase();
}

async function retry<T>(fn: () => Promise<T>, retries = 2, backoff = 100): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      await new Promise((r) => setTimeout(r, backoff * attempt));
    }
  }
}

// Default in-memory/mock transport (no network). Consumers can inject a real transport.
export const defaultTransport: ShipperTransport = {
  post: async (path: string, body: any) => {
    // simple simulated response
    return { awb: `AWB-${Date.now()}`, courier: body.courier || 'JNE', status: 'CREATED', raw: body };
  },
};

export class ShipperClient {
  private transport: ShipperTransport;

  constructor(opts?: { transport?: ShipperTransport }) {
    this.transport = opts?.transport ?? defaultTransport;
  }

  async createShipment(req: ShipmentRequest): Promise<ShipmentResult> {
    const payload = {
      order_id: req.id,
      to: req.address,
      items: req.items || [],
      courier: req.courier,
      service: req.service,
    };

    const res = await retry(() => this.transport.post('/shipments', payload), 2, 150);
    const awb = normalizeAwb(res.awb || res.airwaybill || (res.raw && res.raw.awb) || '');
    return { awb, courier: res.courier || 'UNKNOWN', status: res.status === 'ERROR' ? 'ERROR' : 'CREATED', raw: res };
  }
}

// Keep the original simple mock for tests/dev convenience
export async function createShipmentMock(order: { id: string; address?: any; items?: any[] }): Promise<ShipmentResult> {
  await new Promise((r) => setTimeout(r, 10));
  return {
    awb: `AWB_${Date.now()}`,
    courier: 'JNE',
    status: 'CREATED',
  };
}

export default { ShipperClient, createShipmentMock, normalizeAwb };
