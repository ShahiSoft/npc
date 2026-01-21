import { RoundingStrategy, TaxItem, calculateCartTax } from '../tax';
import type { Knex } from 'knex';
import { InMemoryMerchantStore, getMerchantConfig as dbGetMerchantConfig, setMerchantConfig as dbSetMerchantConfig } from './merchant-store';

type MerchantConfig = {
  merchantId: string;
  rounding: RoundingStrategy;
  region?: string; // optional region code
};

// Pluggable store: default is in-memory. In production, provide a Knex instance to use DB.
let store: {
  get?: (merchantId: string) => Promise<{ merchant_id: string; rounding: string; region?: string | null } | undefined>;
  set?: (merchantId: string, rounding: string, region?: string) => Promise<void>;
} = new InMemoryMerchantStore();

export function useKnexStore(knex: Knex) {
  store = {
    get: (merchantId: string) => dbGetMerchantConfig(knex, merchantId),
    set: (merchantId: string, rounding: string, region?: string) => dbSetMerchantConfig(knex, merchantId, rounding, region),
  };
}

export async function setMerchantRounding(merchantId: string, rounding: RoundingStrategy, region?: string) {
  if (!store.set) throw new Error('merchant store not configured');
  await store.set(merchantId, rounding, region);
}

export async function getMerchantConfig(merchantId: string): Promise<MerchantConfig | undefined> {
  if (!store.get) return undefined;
  const row = await store.get(merchantId);
  if (!row) return undefined;
  return { merchantId: row.merchant_id, rounding: row.rounding as RoundingStrategy, region: row.region ?? undefined };
}

export async function calculateCartTaxForMerchant(merchantId: string | undefined, items: TaxItem[]) {
  const cfg = merchantId ? await getMerchantConfig(merchantId) : undefined;
  const strategy: RoundingStrategy = cfg?.rounding ?? 'round-at-end';
  return calculateCartTax(items, strategy);
}

export default {
  useKnexStore,
  setMerchantRounding,
  getMerchantConfig,
  calculateCartTaxForMerchant,
};
