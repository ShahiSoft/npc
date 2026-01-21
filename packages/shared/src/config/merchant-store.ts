import type { Knex } from 'knex';

export type MerchantConfigRow = {
  merchant_id: string;
  rounding: string;
  region?: string | null;
};

export async function setMerchantConfig(knex: Knex, merchantId: string, rounding: string, region?: string) {
  const exists = await knex('merchant_configs').where({ merchant_id: merchantId }).first();
  if (exists) {
    await knex('merchant_configs').where({ merchant_id: merchantId }).update({ rounding, region, updated_at: knex.fn.now() });
  } else {
    await knex('merchant_configs').insert({ merchant_id: merchantId, rounding, region });
  }
}

export async function getMerchantConfig(knex: Knex, merchantId: string): Promise<MerchantConfigRow | undefined> {
  const row = await knex('merchant_configs').where({ merchant_id: merchantId }).first();
  return row as MerchantConfigRow | undefined;
}

// Simple in-memory fallback store for tests / dev without DB
export class InMemoryMerchantStore {
  private map = new Map<string, MerchantConfigRow>();
  async set(merchantId: string, rounding: string, region?: string) {
    this.map.set(merchantId, { merchant_id: merchantId, rounding, region });
  }
  async get(merchantId: string) {
    return this.map.get(merchantId);
  }
}

export default { setMerchantConfig, getMerchantConfig, InMemoryMerchantStore };
