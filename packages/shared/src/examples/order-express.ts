import type { Knex } from 'knex';
import { calculateCartTax } from '../tax';
import { calculateCartTaxForMerchant } from '../config/tax-config';

// Example: create an Express-compatible handler (no express dependency required here).
export function createOrderHandler(knex: Knex, merchantId?: string) {
  return async function orderHandler(req: any, res: any) {
    try {
      const items = req.body?.items || [];
      if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'items required' });

      // choose per-merchant rounding if configured
      const calc = await calculateCartTaxForMerchant(merchantId, items as any);

      const orderId = req.body?.orderId || `order_${Date.now()}`;

      // persist order with breakdown
      await knex('orders').insert({
        id: orderId,
        user_id: req.body?.userId || null,
        amount: calc.subtotal,
        subtotal: calc.subtotal,
        tax: calc.tax,
        total: calc.total,
        status: 'created',
      });

      return res.status(201).json({ id: orderId, subtotal: calc.subtotal, tax: calc.tax, total: calc.total });
    } catch (err: any) {
      return res.status(500).json({ error: String(err?.message ?? err) });
    }
  };
}

export default { createOrderHandler };
