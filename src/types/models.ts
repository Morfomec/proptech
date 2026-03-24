export type Role = 'tenant' | 'owner' | 'broker' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  verified: boolean;
  createdAt: string; // ISO string representation
}

export interface Property {
  id: string;
  title: string;
  description: string;
  rent: number;
  city: string;
  address: string;
  ownerId: string;
  verified: boolean;
  createdAt: string;

  // New fields
  type?: 'rent' | 'sale' | 'project';
  beds?: number;
  baths?: number;
  sqft?: number;
  rules?: any;
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  imageUrl: string;
  createdAt: string;
}

export interface ContactRequest {
  id: string;
  propertyId: string;
  senderId: string;
  message: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  rating: number; // 1-5
  review: string;
  createdAt: string;
}

export type TenancyStatus = 'pending' | 'active' | 'ended' | 'renewed' | 'cancelled';

export interface Tenancy {
  id: string;
  property_id: string;
  owner_id: string;
  tenant_id?: string; // Null if pending sign-up
  created_by_user?: string;
  start_date: string;
  end_date: string;
  rent_amount: number;
  deposit_amount: number;
  payment_due_day: number;
  status: TenancyStatus;
  agreement_id?: string;
  
  // Renter snapshot info
  tenant_name: string;
  tenant_phone: string;
  tenant_email?: string;
  notes?: string;
}

export interface Agreement {
  id: string;
  tenancy_id: string;
  agreement_text: string;
  file_url?: string;
  signed_by_owner: boolean;
  signed_by_tenant: boolean;
  signed_date?: string;
  renewal_date?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  tenancy_id: string;
  month: string; // e.g. "2026-03"
  amount: number;
  due_date: string;
  paid_date?: string;
  status: 'pending' | 'paid' | 'overdue';
  receipt_url?: string;
  createdAt: string;
}
