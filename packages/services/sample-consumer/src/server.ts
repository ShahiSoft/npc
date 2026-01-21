import express, { Request, Response } from 'express';
import knexLib from 'knex';
import { createOrderHandler } from '@nusantara/shared/src/examples/order-express';
import { useKnexStore as useTaxKnexStore, setMerchantRounding } from '@nusantara/shared/src/config/tax-config';

const app = express();
app.use(express.json());

const knex = knexLib({
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/nusantara_dev',
});

// wire shared tax-config to use DB
useTaxKnexStore(knex as any);

// admin endpoints for merchant config
app.post('/admin/merchant', async (req: Request, res: Response) => {
  const { merchantId, rounding, region } = req.body || {};
  if (!merchantId || !rounding) return res.status(400).json({ error: 'merchantId and rounding required' });
  try {
    await setMerchantRounding(merchantId, rounding, region);
    return res.status(200).json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ error: String(err?.message ?? err) });
  }
});

// order endpoint
app.post('/orders', createOrderHandler(knex as any, undefined));

if (require.main === module) {
  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  app.listen(port, () => console.log(`sample-consumer listening on ${port}`));
}

export default app;
