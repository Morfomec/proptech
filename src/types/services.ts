import { User, Property, PropertyImage, ContactRequest, Rating, Tenancy, Agreement, Payment } from './models';

export interface IAuthService {
  getCurrentUser(): Promise<User | null>;
  login(email: string, password?: string): Promise<User>;
  register(email: string, password: string, name: string, role: string): Promise<User>;
  logout(): Promise<void>;
}

export interface IPropertyService {
  getPropertyById(id: string): Promise<Property | null>;
  getProperties(filters?: Record<string, unknown>): Promise<Property[]>;
  createProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'verified'>): Promise<Property>;
  updateProperty(id: string, updates: Partial<Property>): Promise<Property>;
  deleteProperty(id: string): Promise<void>;
  
  uploadImage(propertyId: string, file: File): Promise<PropertyImage>;
  getPropertyImages(propertyId: string): Promise<PropertyImage[]>;
}

export interface IContactService {
  createContactRequest(requestData: Omit<ContactRequest, 'id' | 'createdAt'>): Promise<ContactRequest>;
  getRequestsForProperty(propertyId: string): Promise<ContactRequest[]>;
  getRequestsByUser(userId: string): Promise<ContactRequest[]>;
}

export interface IRatingService {
  createRating(ratingData: Omit<Rating, 'id' | 'createdAt'>): Promise<Rating>;
  getRatingsForUser(userId: string): Promise<Rating[]>;
}

export interface IAdminService {
  verifyProperty(propertyId: string, verified: boolean): Promise<void>;
  verifyUser(userId: string, verified: boolean): Promise<void>;
  getPendingProperties(): Promise<Property[]>;
  getPendingUsers(): Promise<User[]>;
}

export interface ITenancyService {
  createTenancy(data: Omit<Tenancy, 'id' | 'status'>): Promise<Tenancy>;
  getTenancyById(id: string): Promise<Tenancy | null>;
  getTenanciesByOwner(ownerId: string): Promise<Tenancy[]>;
  getTenanciesByTenant(tenantId: string): Promise<Tenancy[]>;
  updateTenancyStatus(id: string, status: Tenancy['status']): Promise<void>;
  
  createAgreement(data: Omit<Agreement, 'id' | 'createdAt'>): Promise<Agreement>;
  getAgreementByTenancy(tenancyId: string): Promise<Agreement | null>;
  signAgreement(id: string, role: 'owner' | 'tenant'): Promise<void>;
  
  createPayment(data: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment>;
  getPaymentsByTenancy(tenancyId: string): Promise<Payment[]>;
  markPaymentPaid(paymentId: string, receiptUrl?: string): Promise<void>;
}
