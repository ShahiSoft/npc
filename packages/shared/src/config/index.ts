export interface SharedConfig {
  databaseUrl: string;
  redisUrl?: string;
  xenditApiKey?: string;
  shipperApiKey?: string;
}

export function getSharedConfig(): SharedConfig {
  return {
    databaseUrl: process.env.DATABASE_URL || 'postgres://localhost:5432/nusantara_dev',
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    xenditApiKey: process.env.XENDIT_API_KEY || '',
    shipperApiKey: process.env.SHIPPER_API_KEY || '',
  };
}

export default { getSharedConfig };
