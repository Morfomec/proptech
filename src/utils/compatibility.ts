export interface UserPreferences {
  sleepSchedule: string; // "early bird" | "night owl"
  food: string; // "veg" | "non-veg" | "any"
  cleanliness: string; // "low" | "medium" | "high" 
  workMode: string; // "wfh" | "office"
  guests: boolean;
  personality: string; // "quiet" | "social"
  coupleFriendly: boolean;
}

export interface PropertyRules {
  sleepSchedule: string; // "early bird" | "night owl" | "any"
  foodAllowed: string; // "veg" | "non-veg" | "any"
  cleanliness: string; // "low" | "medium" | "high" | "any"
  workModeAllowed: string; // "wfh" | "office" | "any"
  guestsAllowed: boolean;
  personality: string; // "quiet" | "social" | "any"
  coupleFriendly: boolean;
}

/**
 * Calculate compatibility percentage between a user's lifestyle preferences and a property's rules.
 * Returns a number between 0 and 100.
 */
export function getCompatibility(
  userPrefs: UserPreferences,
  propertyRules: PropertyRules
): number {
  let total = 0;
  let match = 0;

  // sleep schedule
  total++;
  if (propertyRules.sleepSchedule === "any" || userPrefs.sleepSchedule === propertyRules.sleepSchedule) match++;

  // food
  total++;
  if (propertyRules.foodAllowed === "any" || userPrefs.food === propertyRules.foodAllowed) match++;

  // cleanliness
  total++;
  if (propertyRules.cleanliness === "any" || userPrefs.cleanliness === propertyRules.cleanliness) match++;

  // work mode
  total++;
  if (propertyRules.workModeAllowed === "any" || userPrefs.workMode === propertyRules.workModeAllowed) match++;

  // guests
  total++;
  if (userPrefs.guests === propertyRules.guestsAllowed) match++;

  // personality
  total++;
  if (propertyRules.personality === "any" || userPrefs.personality === propertyRules.personality) match++;

  // couple friendly
  total++;
  if (userPrefs.coupleFriendly === propertyRules.coupleFriendly) match++;

  const percentage = Math.round((match / total) * 100);
  return percentage;
}
