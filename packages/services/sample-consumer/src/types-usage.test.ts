// This file exists solely to demonstrate cross-package TypeScript typings compile correctly.
import type { User, Subscription, Order } from '@nusantara/shared';

const addr = {
  province: 'Jawa Barat',
  city: 'Bandung',
  district: 'Coblong',
  village: 'Dago',
  street: 'Jl. Example',
  rt: '001',
  rw: '002',
  postal_code: '40135',
};

const u: User = {
  id: 'u-1',
  email: 'a@b.com',
  phone: '+62811223344',
  addresses: [addr],
  taste_profile: { spice_tolerance: 'low' }
};

const s: Subscription = {
  id: 's-1',
  user_id: u.id,
  plan: 'monthly',
  status: 'active',
  next_billing_date: new Date().toISOString()
};

const o: Order = { id: 'o-1', subscription_id: s.id, user_id: u.id };

export { u, s, o };
