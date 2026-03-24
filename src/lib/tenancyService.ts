import { collection, doc, addDoc, getDocs, getDoc, updateDoc, query, where, Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import { Tenancy, TenancyStatus } from "../types/models";

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
      return tenancies.sort((a, b) => new Date(b.start_date || 0).getTime() - new Date(a.start_date || 0).getTime());
    } catch (error) {
      console.error("Error fetching tenancies:", error);
      return [];
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
