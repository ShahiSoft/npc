// Minimal Shipper.id client mock for dev
export interface ShipmentResult {
  awb: string;
  courier: string;
  status: 'CREATED' | 'ERROR';
}

export async function createShipmentMock(order: {
  id: string;
  address?: any;
  items?: any[];
}): Promise<ShipmentResult> {
  await new Promise((r) => setTimeout(r, 10));
  return {
    awb: `AWB_${Date.now()}`,
    courier: 'JNE',
    status: 'CREATED',
  };
}

export default { createShipmentMock };
