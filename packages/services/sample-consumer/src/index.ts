import {
  applyPPN,
  nextBusinessDay,
  chargeSandbox,
  createShipmentMock,
} from '@nusantara/shared';
import type { User, Subscription, Order, IndonesianAddress } from '@nusantara/shared';

async function main() {
  console.log('Sample consumer running...');
  const price = 100000; // IDR
  const taxed = applyPPN(price);
  console.log('Taxed sample:', taxed);
  console.log('Next business day for 2026-12-25:', nextBusinessDay(new Date('2026-12-25')));
  const pay = await chargeSandbox(price);
  console.log('Payment result:', pay);
  const ship = await createShipmentMock({ id: 'order-sample' });
  console.log('Shipment result:', ship);

  // Demonstrate cross-package type usage (compile-time only)
  const exampleAddress: IndonesianAddress = {
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    district: 'Kebayoran Baru',
    village: 'Gandaria',
    street: 'Jalan Example No.1',
    rt: '004',
    rw: '003',
    postal_code: '12130',
  };

  const exampleUser: User = {
    id: 'user-123',
    email: 'user@example.com',
    phone: '+6281234567890',
    addresses: [exampleAddress],
    taste_profile: { spice_tolerance: 'medium', region_preferences: ['DKI Jakarta'] },
  };

  const exampleSubscription: Subscription = {
    id: 'sub-123',
    user_id: exampleUser.id,
    plan: 'monthly',
    status: 'active',
    next_billing_date: new Date().toISOString(),
  };

  const exampleOrder: Order = {
    id: 'order-123',
    subscription_id: exampleSubscription.id,
    user_id: exampleUser.id,
  };

  console.log('Example user/types constructed (compile-time check):', exampleUser.id, exampleSubscription.id, exampleOrder.id);
}

if (require.main === module) main().catch((e) => {
  console.error(e);
  process.exit(1);
});
