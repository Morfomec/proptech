"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { userService } from "@/lib/userService";

export type VerificationLevel = 1 | 2 | 3 | 4;
export type ProfileRole = 'tenant' | 'owner' | 'agent' | 'builder';

export const getVerificationBadge = (level: VerificationLevel, role: ProfileRole) => {
  if (level === 1) return { label: "Unverified", icon: "⚠️", bg: "bg-red-50 text-red-700 border-red-100" };
  if (level === 2) return { label: "Phone Verified", icon: "📱", bg: "bg-orange-50 text-orange-700 border-orange-100" };
  if (level >= 3 && role !== 'agent' && role !== 'builder') return { label: "Verified", icon: "✅", bg: "bg-green-50 text-[#408A71] border-green-100" };
  if (level >= 3 && (role === 'agent' || role === 'builder')) return { label: "Business Verified", icon: "🏢", bg: "bg-blue-50 text-blue-700 border-blue-100" };
  return { label: "Unverified", icon: "⚠️", bg: "bg-red-50 text-red-700 border-red-100" };
};

export interface UserProfile {
  role: ProfileRole;
  // Shared
  name: string;
  email: string;
  phone: string;
  city: string;
  profilePhoto: string;
  
  // Owner
  propertyProofVerified: boolean;

  // Agent
  agencyName: string;
  officeAddress: string;
  licenseRera: string;
  agencyProofVerified: boolean;

  // Builder
  companyName: string;
  website: string;
  gstNumber: string;
  companyProofVerified: boolean;
  reraVerified: boolean;

  // Shared Verifications & Legacy Status
  phoneVerified: boolean;
  idVerified: boolean;
  level: VerificationLevel;

  // Trust Score MVP
  trustScore: number;
  scoreActivity: Array<{ id: string; reason: string; change: number; timestamp: string }>;
  onTimeStreak: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

const defaultUserProfile: UserProfile = {
  role: 'tenant',
  name: "",
  email: "",
  phone: "",
  city: "",
  profilePhoto: "",
  propertyProofVerified: false,
  agencyName: "",
  officeAddress: "",
  licenseRera: "",
  agencyProofVerified: false,
  companyName: "",
  website: "",
  gstNumber: "",
  companyProofVerified: false,
  reraVerified: false,
  phoneVerified: false,
  idVerified: false,
  level: 1,
  trustScore: 550,
  scoreActivity: [],
  onTimeStreak: 0,
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userProfile: defaultUserProfile,
  updateUserProfile: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // 1. Try Firestore first (cross-device, persistent)
        const firestoreProfile = await userService.loadUserProfile(currentUser.uid);
        if (firestoreProfile) {
          setUserProfile(firestoreProfile);
          // Keep localStorage in sync as local cache
          localStorage.setItem(`profile_${currentUser.uid}`, JSON.stringify(firestoreProfile));
        } else {
          // 2. Fall back to localStorage cache
          const cachedProfile = localStorage.getItem(`profile_${currentUser.uid}`);
          if (cachedProfile) {
            const parsed = JSON.parse(cachedProfile) as UserProfile;
            setUserProfile(parsed);
            // Backfill Firestore with the cached data
            userService.saveUserProfile(currentUser.uid, parsed).catch(console.error);
          } else {
            // 3. Brand new user — use defaults
            setUserProfile(defaultUserProfile);
          }
        }
      } else {
        setUserProfile(defaultUserProfile);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const newProfile = { ...prev, ...updates };
      // Calculate new level dynamically
      let newLevel: VerificationLevel = 1;
      let newScore = newProfile.trustScore ?? 550;

      if (newProfile.role === 'owner') {
        if (newProfile.phoneVerified) newLevel = 2;
        if (newProfile.phoneVerified && (newProfile.idVerified || newProfile.propertyProofVerified)) newLevel = 3;
      } else if (newProfile.role === 'tenant') {
        if (newProfile.phoneVerified) newLevel = 2;
        if (newProfile.phoneVerified && newProfile.idVerified) newLevel = 3;
      } else if (newProfile.role === 'agent') {
        if (newProfile.phoneVerified) newLevel = 2;
        if (newProfile.phoneVerified && newProfile.idVerified) newLevel = 3;
        if (newProfile.phoneVerified && newProfile.agencyProofVerified) newLevel = 4;
      } else if (newProfile.role === 'builder') {
        if (newProfile.phoneVerified) newLevel = 2;
        if (newProfile.phoneVerified && (newProfile.companyProofVerified || newProfile.reraVerified)) newLevel = 4;
      }

      // Verification bump intercept
      if (newLevel === 2 && newScore < 580) {
        newScore = 580;
      } else if (newLevel >= 3 && newScore < 600) {
        newScore = 600;
      }

      newProfile.level = newLevel;
      newProfile.trustScore = newScore;

      if (user) {
        // Save to both Firestore and localStorage cache
        localStorage.setItem(`profile_${user.uid}`, JSON.stringify(newProfile));
        userService.saveUserProfile(user.uid, newProfile).catch(console.error);
      }
      return newProfile;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, userProfile, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
