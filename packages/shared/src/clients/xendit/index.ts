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
