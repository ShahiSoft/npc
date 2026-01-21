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
