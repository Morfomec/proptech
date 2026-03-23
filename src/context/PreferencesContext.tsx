"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserPreferences } from "../utils/compatibility";

const defaultPrefs: UserPreferences = {
  sleepSchedule: "early bird",
  food: "any",
  cleanliness: "medium",
  workMode: "office",
  guests: true,
  personality: "social",
  coupleFriendly: true,
};

interface PreferencesContextType {
  prefs: UserPreferences;
  setPrefs: (newPrefs: UserPreferences) => void;
}

const PreferencesContext = createContext<PreferencesContextType>({
  prefs: defaultPrefs,
  setPrefs: () => {},
});

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefsState] = useState<UserPreferences>(defaultPrefs);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("proptech_user_prefs");
      if (stored) {
        setPrefsState(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load prefs", err);
    }
    setIsLoaded(true);
  }, []);

  const setPrefs = (newPrefs: UserPreferences) => {
    setPrefsState(newPrefs);
    localStorage.setItem("proptech_user_prefs", JSON.stringify(newPrefs));
  };

  // Prevent hydration mismatch by waiting for localstorage
  if (!isLoaded) return <div className="hidden" />;

  return (
    <PreferencesContext.Provider value={{ prefs, setPrefs }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export const usePreferences = () => useContext(PreferencesContext);
