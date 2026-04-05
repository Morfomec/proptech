import { collection, doc, addDoc, getDocs, getDoc, updateDoc, query, where, Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import { Tenancy, TenancyStatus } from "../types/models";

const mockTenancies: Tenancy[] = [
  {
    id: "mock_t_1",
    property_id: "mock_p_1",
    owner_id: "mock_owner_1",
    tenant_id: "mock_tenant_1",
    tenant_name: "Alen (Demo Tenant)",
    status: "active",
    start_date: "2023-11-01",
    end_date: "2024-10-31",
    payment_due_day: 5,
    rent_amount: 22000,
    deposit_amount: 60000,
  },
  {
    id: "mock_t_2",
    property_id: "mock_p_2",
    owner_id: "mock_owner_1",
    tenant_id: "mock_tenant_2",
    tenant_name: "Sarah (Demo Tenant)",
    status: "active",
    start_date: "2023-01-15",
    end_date: "2024-01-14",
    payment_due_day: 1, // Often overdue in demo dates
    rent_amount: 18000,
    deposit_amount: 50000,
  },
  {
    id: "mock_t_3",
    property_id: "mock_p_3",
    owner_id: "mock_owner_1",
    tenant_id: "mock_tenant_3",
    tenant_name: "Michael (Demo)",
    status: "pending",
    start_date: "2024-05-01",
    end_date: "2025-04-30",
    payment_due_day: 10,
    rent_amount: 35000,
    deposit_amount: 100000,
  }
];

const mockTenantView: Tenancy[] = [
  {
    id: "mock_v_1",
    property_id: "mock_p_owner_1",
    owner_id: "mock_owner_real",
    tenant_id: "current_user",
    tenant_name: "You",
    status: "active",
    start_date: "2023-08-01",
    end_date: "2024-07-31",
    payment_due_day: 5,
    rent_amount: 15500,
    deposit_amount: 40000,
  },
  {
    id: "mock_v_2",
    property_id: "mock_p_owner_2",
    owner_id: "mock_owner_bad",
    tenant_id: "current_user",
    tenant_name: "You",
    status: "active",
    start_date: "2022-02-01",
    end_date: "2023-01-31", // Expired/Needs Renewal
    payment_due_day: 1, // Likely overdue
    rent_amount: 21000,
    deposit_amount: 50000,
  }
];

const TENANCIES_COLLECTION = "tenancies";

export const tenancyService = {
  createTenancy: async (tenancyData: any): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, TENANCIES_COLLECTION), {
        ...tenancyData,
        status: "pending" as TenancyStatus,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating tenancy:", error);
      throw error;
    }
  },

  getTenanciesByOwner: async (ownerId: string): Promise<Tenancy[]> => {
    try {
      const q = query(
        collection(db, TENANCIES_COLLECTION),
        where("owner_id", "==", ownerId)
      );
      const querySnapshot = await getDocs(q);
      const tenancies: Tenancy[] = [];
      querySnapshot.forEach((docSnap) => {
        tenancies.push({ id: docSnap.id, ...docSnap.data() } as Tenancy);
      });
      return [...tenancies, ...mockTenancies].sort((a, b) => new Date(b.start_date || 0).getTime() - new Date(a.start_date || 0).getTime());
    } catch (error) {
      console.error("Error fetching tenancies:", error);
      return [...mockTenancies];
    }
  },

  getTenanciesByTenant: async (tenantId: string): Promise<Tenancy[]> => {
    try {
      const q = query(
        collection(db, TENANCIES_COLLECTION),
        where("tenant_id", "==", tenantId)
      );
      const querySnapshot = await getDocs(q);
      const tenancies: Tenancy[] = [];
      querySnapshot.forEach((docSnap) => {
        tenancies.push({ id: docSnap.id, ...docSnap.data() } as Tenancy);
      });
      return [...tenancies, ...mockTenantView].sort((a, b) => new Date(b.start_date || 0).getTime() - new Date(a.start_date || 0).getTime());
    } catch (error) {
      console.error("Error fetching tenancies for tenant:", error);
      return [...mockTenantView];
    }
  },

  getTenanciesByProperty: async (propertyId: string): Promise<Tenancy[]> => {
    try {
      const q = query(
        collection(db, TENANCIES_COLLECTION),
        where("property_id", "==", propertyId)
      );
      const querySnapshot = await getDocs(q);
      const tenancies: Tenancy[] = [];
      querySnapshot.forEach((docSnap) => {
        tenancies.push({ id: docSnap.id, ...docSnap.data() } as Tenancy);
      });
      return tenancies.sort((a, b) => new Date(b.start_date || 0).getTime() - new Date(a.start_date || 0).getTime());
    } catch (error) {
      console.error("Error fetching tenancies for property:", error);
      return [];
    }
  },

  getTenancyById: async (id: string): Promise<Tenancy | null> => {
    try {
      const docRef = doc(db, TENANCIES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Tenancy;
      }
      return null;
    } catch (error) {
      console.error("Error fetching tenancy:", error);
      return null;
    }
  },

  updateTenancyStatus: async (id: string, status: TenancyStatus): Promise<void> => {
    try {
      const docRef = doc(db, TENANCIES_COLLECTION, id);
      await updateDoc(docRef, { status, updatedAt: Timestamp.now() });
    } catch (error) {
      console.error("Error updating tenancy status:", error);
      throw error;
    }
  }
};
