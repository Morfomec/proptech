import { db } from './firebase';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { Property, PropertyImage } from '../types/models';
import { IPropertyService } from '../types/services';

const PROPERTIES_COLLECTION = 'properties';

export const propertyService: IPropertyService = {
  
  createProperty: async (propertyData) => {
    try {
      const dbData = {
        ...propertyData,
        createdAt: Timestamp.now(),
        verified: false
      };
      
      const docRef = await addDoc(collection(db, PROPERTIES_COLLECTION), dbData);
      
      return {
        id: docRef.id,
        ...propertyData,
        createdAt: new Date().toISOString(),
        verified: false
      };
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  },

  getPropertyById: async (id: string) => {
    try {
      const docRef = doc(db, PROPERTIES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
        } as Property;
      }
      return null;
    } catch (error) {
      console.error("Error fetching property by ID:", error);
      throw error;
    }
  },

  getProperties: async (filters?: Record<string, unknown>) => {
    try {
      let q = query(collection(db, PROPERTIES_COLLECTION), orderBy("createdAt", "desc"));
      
      if (filters && filters.ownerId) {
        q = query(collection(db, PROPERTIES_COLLECTION), where("ownerId", "==", filters.ownerId));
      }

      const querySnapshot = await getDocs(q);
      const properties: Property[] = [];
      
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        properties.push({
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
        } as Property);
      });
      
      // Manual sort for when we can't use orderBy due to missing index
      if (filters && filters.ownerId) {
        properties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      
      return properties;
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    }
  },

  updateProperty: async (id: string, updates: Partial<Property>) => {
    try {
      const docRef = doc(db, PROPERTIES_COLLECTION, id);
      await updateDoc(docRef, updates);
      const updated = await propertyService.getPropertyById(id);
      if (!updated) throw new Error("Property not found after update");
      return updated;
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  },

  deleteProperty: async (id: string) => {
    try {
      const docRef = doc(db, PROPERTIES_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  },

  // Image upload via Cloudinary
  uploadImage: async (propertyId: string, file: File): Promise<PropertyImage> => {
    const { uploadImageToCloudinary } = await import('./cloudinary');
    const url = await uploadImageToCloudinary(file);
    
    const imageObj: PropertyImage = {
      id: Math.random().toString(36).substring(7),
      propertyId,
      imageUrl: url,
      createdAt: new Date().toISOString()
    };

    // Store URL on the property document under an 'images' array
    const docRef = doc(db, PROPERTIES_COLLECTION, propertyId);
    const { arrayUnion } = await import('firebase/firestore');
    await updateDoc(docRef, { images: arrayUnion(url) });
    
    return imageObj;
  },

  getPropertyImages: async (propertyId: string): Promise<PropertyImage[]> => {
    const property = await propertyService.getPropertyById(propertyId);
    if (!property) return [];
    const imageUrls = (property as any).images || [];
    return imageUrls.map((url: string, index: number) => ({
      id: index.toString(),
      propertyId,
      imageUrl: url,
      createdAt: property.createdAt // Fallback to property creation date
    }));
  }
};
