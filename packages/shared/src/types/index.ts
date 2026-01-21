// Core shared TypeScript interfaces derived from Master-plan.txt

export interface IndonesianAddress {
  province: string;
  city: string;
  district: string;
  village: string;
  street: string;
  rt: string; // Neighborhood unit
  rw: string; // Community unit
  postal_code: string;
}

export interface TasteProfile {
  spice_tolerance?: 'low' | 'medium' | 'high';
  region_preferences?: string[]; // province/city codes
}

export interface User {
  id: string;
  email: string;
  phone: string; // Indonesian format (+62)
  addresses: IndonesianAddress[];
  taste_profile: TasteProfile;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'monthly' | 'quarterly';
  status: 'active' | 'paused' | 'cancelled';
  next_billing_date: string; // ISO date string
}

export interface Order {
  id: string;
  subscription_id?: string;
  user_id: string;
  shipping_id?: string;
  payment_id?: string;
}
