import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { UserProfile } from "@/context/AuthContext";

const USERS_COLLECTION = "users";

export const userService = {
  saveUserProfile: async (uid: string, profile: UserProfile): Promise<void> => {
    try {
      const docRef = doc(db, USERS_COLLECTION, uid);
      await setDoc(docRef, { ...profile, updatedAt: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.error("Error saving user profile to Firestore:", error);
      throw error;
    }
  },

  loadUserProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const docRef = doc(db, USERS_COLLECTION, uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Remove Firestore metadata fields before returning
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { updatedAt, ...profile } = data;
        return profile as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error loading user profile from Firestore:", error);
      return null;
    }
  },
};
