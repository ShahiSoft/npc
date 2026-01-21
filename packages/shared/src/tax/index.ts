// Tax calculation utilities (PPN 11%)

export const PPN_RATE = 0.11;

export function calculatePPN(amount: number): number {
  if (!isFinite(amount) || amount < 0) throw new Error('invalid amount');
  return Number((amount * PPN_RATE).toFixed(2));
}

export function applyPPN(amount: number) {
  const tax = calculatePPN(amount);
  return {
    amount: Number(amount.toFixed ? amount.toFixed(2) : Number(amount)),
    tax,
    total: Number((amount + tax).toFixed(2)),
  };
}

export default {
  calculatePPN,
  applyPPN,
};

// Advanced helpers
export type TaxItem = {
  id?: string;
  name?: string;
  price: number; // unit price
  quantity?: number; // default 1
  tax_exempt?: boolean; // whether PPN applies
};

export type RoundingStrategy = 'round-per-item' | 'round-at-end';

export function calculateItemTax(item: TaxItem): number {
  const qty = item.quantity ?? 1;
  const base = item.price * qty;
  if (item.tax_exempt) return 0;
  return calculatePPN(base);
}

export function calculateCartTax(items: TaxItem[], strategy: RoundingStrategy = 'round-at-end') {
  if (!Array.isArray(items)) throw new Error('items must be array');
  if (strategy === 'round-per-item') {
    // tax per item line, then sum
    const lines = items.map((it) => ({
      item: it,
      tax: calculateItemTax(it),
      line_total: Number(((it.price * (it.quantity ?? 1)) + calculateItemTax(it)).toFixed(2)),
    }));
    const tax = Number(lines.reduce((s, l) => s + l.tax, 0).toFixed(2));
    const subtotal = Number(items.reduce((s, it) => s + it.price * (it.quantity ?? 1), 0).toFixed(2));
    return { subtotal, tax, total: Number((subtotal + tax).toFixed(2)), lines };
  }

  // round-at-end: sum base amounts then compute tax on subtotal
  const subtotal = Number(items.reduce((s, it) => s + it.price * (it.quantity ?? 1), 0).toFixed(2));
  const taxable = items.reduce((s, it) => s + (it.tax_exempt ? 0 : it.price * (it.quantity ?? 1)), 0);
  const tax = Number((taxable * PPN_RATE).toFixed(2));
  return { subtotal, tax, total: Number((subtotal + tax).toFixed(2)) };
}
