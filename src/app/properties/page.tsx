"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MapPin, Home, Building, Key, Clock, Filter, ChevronDown, SlidersHorizontal, Check, Settings2, X, BadgeCheck } from "lucide-react";
import { getCompatibility, UserPreferences } from "../../utils/compatibility";
import { usePreferences } from "../../context/PreferencesContext";
import { propertyService } from "@/lib/propertyService";
import { Property } from "@/types/models";

type SelectOption = { value: string | boolean; label: string };
const CustomSelect = ({ label, options, value, onChange }: { label: string, options: SelectOption[], value: string | boolean, onChange: (val: string | boolean) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o: SelectOption) => o.value === value) || options[0];

  return (
    <div className="relative" ref={ref}>
      <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-sm font-semibold bg-white border ${isOpen ? 'border-[#408A71] ring-2 ring-[#408A71]/20' : 'border-gray-200'} rounded-xl p-3 outline-none text-gray-800 shadow-sm transition-all hover:border-gray-300`}
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#408A71]' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map((option: SelectOption) => (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors ${value === option.value ? 'bg-[#408A71]/10 text-[#408A71]' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {option.label}
                {value === option.value && <Check size={14} className="text-[#408A71]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function PropertiesPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [listingType, setListingType] = useState<"rent" | "sale">("rent");
  const { prefs, setPrefs } = usePreferences();
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);
  
  // Draft filter states
  const [minCompatibility, setMinCompatibility] = useState(0);
  const [bedrooms, setBedrooms] = useState<string | null>(null);

  // Applied filter states (used for rendering listings)
  const [appliedPrefs, setAppliedPrefs] = useState<UserPreferences>(prefs);
  const [appliedMinCompatibility, setAppliedMinCompatibility] = useState(0);
  const [appliedBedrooms, setAppliedBedrooms] = useState<string | null>(null);
  
  const [visibleCount, setVisibleCount] = useState(4);
  const [dbProperties, setDbProperties] = useState<Property[]>([]);

  useEffect(() => {
    propertyService.getProperties().then(setDbProperties).catch(console.error);
  }, []);

  const handleApplyFilters = () => {
    setAppliedPrefs(prefs);
    setAppliedMinCompatibility(minCompatibility);
    setAppliedBedrooms(bedrooms);
    setVisibleCount(4); // Reset pagination on new filter
    if (window.innerWidth < 1024) setIsMobileFilterOpen(false);
  };
  
  const handleResetFilters = () => {
    setListingType("rent");
    setMinCompatibility(0);
    setAppliedMinCompatibility(0);
    setBedrooms(null);
    setAppliedBedrooms(null);
    setVisibleCount(4);
    
    // Default preferences
    const defaultPrefs = {
      sleepSchedule: 'early bird',
      food: 'any',
      cleanliness: 'medium',
      workMode: 'wfh',
      guests: false,
      coupleFriendly: false,
      personality: 'quiet'
    };
    setPrefs(defaultPrefs);
    setAppliedPrefs(defaultPrefs);

    // Reset DOM inputs for Location and Price Range
    const textInputs = document.querySelectorAll('input[type="text"]');
    textInputs.forEach(el => { (el as HTMLInputElement).value = ''; });
    
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(el => {
      const input = el as HTMLInputElement;
      if (input.placeholder === "Min") input.value = "5000";
      if (input.placeholder === "Max") input.value = "50000";
    });

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((el, idx) => {
      (el as HTMLInputElement).checked = (idx === 0);
    });
  };
  
  // Mock property data with rules
  const mockRules = [
    { sleepSchedule: "early bird", foodAllowed: "veg", cleanliness: "high", workModeAllowed: "office", guestsAllowed: false, personality: "quiet", coupleFriendly: false },
    { sleepSchedule: "night owl", foodAllowed: "any", cleanliness: "medium", workModeAllowed: "wfh", guestsAllowed: true, personality: "social", coupleFriendly: true },
    { sleepSchedule: "any", foodAllowed: "veg", cleanliness: "medium", workModeAllowed: "any", guestsAllowed: false, personality: "quiet", coupleFriendly: false },
    { sleepSchedule: "early bird", foodAllowed: "any", cleanliness: "low", workModeAllowed: "wfh", guestsAllowed: true, personality: "social", coupleFriendly: true },
    { sleepSchedule: "night owl", foodAllowed: "any", cleanliness: "high", workModeAllowed: "office", guestsAllowed: false, personality: "any", coupleFriendly: false },
    { sleepSchedule: "any", foodAllowed: "any", cleanliness: "any", workModeAllowed: "any", guestsAllowed: true, personality: "any", coupleFriendly: true },
  ];

  const mockProperties = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    listerLevel: (i % 4) + 1,
    rules: mockRules[i % mockRules.length],
    bedrooms: (i % 4) + 1
  }));

  // Compute compatibility for rent listings using the APPLIED preferences
  const combinedProperties = [
    ...dbProperties.map(p => ({
      ...p,
      isDbQuery: true,
      listerLevel: 2, // default for DB mock rendering
      rules: p.rules || mockRules[0],
      bedrooms: p.beds || 1,
      baths: p.baths || 1,
      sqft: p.sqft || 1000,
    })),
    ...mockProperties.map(p => ({
      ...p,
      isDbQuery: false,
      title: `Modern Serenity Appt ${p.id}`,
      city: "Thondayad Bypass, Kozhikode, Kerala",
      rent: 12000 + (p.id as number) * 2000,
      salePrice: 4500000 + (p.id as number) * 500000,
      type: "rent",
      baths: 2,
      sqft: 1000 + (p.id as number) * 100,
    }))
  ];

  const propertiesWithCompat = combinedProperties.map(p => ({
    ...p,
    compatibility: listingType === "rent" ? getCompatibility(appliedPrefs, p.rules) : null,
  }));

  // Filter and sort displayed properties using APPLIED filters
  const displayedProperties = propertiesWithCompat
    .filter(p => listingType !== "rent" || (p.compatibility ?? 0) >= appliedMinCompatibility)
    .filter(p => !appliedBedrooms || (appliedBedrooms === '4+' ? p.bedrooms >= 4 : p.bedrooms === parseInt(appliedBedrooms)))
    .sort((a, b) => {
      // Prioritize verified listers (level 3 and 4)
      const aVerified = a.listerLevel >= 3 ? 1 : 0;
      const bVerified = b.listerLevel >= 3 ? 1 : 0;
      
      if (aVerified !== bVerified) {
        return bVerified - aVerified;
      }
      
      if (listingType === "rent") {
        return (b.compatibility ?? 0) - (a.compatibility ?? 0);
      }
      return 0;
    });
    
  const paginatedProperties = displayedProperties.slice(0, visibleCount);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-grow">
        
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Explore Properties</h1>
            <p className="text-gray-500 mt-2 text-lg">Find your perfect home from our curated selection.</p>
          </div>
          
          {/* Buy / Rent Toggle */}
          <div className="flex bg-gray-200/60 p-1.5 rounded-xl self-start sm:self-auto shadow-inner">
            <button 
              onClick={() => setListingType("rent")}
              className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${
                listingType === "rent" ? "bg-white text-[#408A71] shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              For Rent
            </button>
            <button 
              onClick={() => setListingType("sale")}
              className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${
                listingType === "sale" ? "bg-white text-[#408A71] shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              For Sale
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <button 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl font-medium shadow-sm active:scale-95 transition-all text-gray-700 hover:text-gray-900"
            >
              <SlidersHorizontal size={18} /> Filters
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium bg-white px-4 py-2.5 border border-gray-200 rounded-xl shadow-sm">
              Sort by: <span className="text-gray-900 font-semibold flex items-center gap-1">Recommended <ChevronDown size={14} /></span>
            </div>
          </div>

          {/* Left Sidebar - Filters */}
          <aside className={`w-full lg:w-72 flex-shrink-0 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                  <Filter size={20} className="text-[#408A71]" /> Filters
                </h2>
                <button onClick={handleResetFilters} className="text-sm text-[#408A71] font-semibold hover:underline">Reset All</button>
              </div>

              {/* Location Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="City, neighborhood..." 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#408A71] focus:border-transparent outline-none transition-all text-sm font-medium" 
                  />
                </div>
              </div>

              <hr className="border-gray-100 my-6" />

              {/* Property Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Property Type</label>
                <div className="flex flex-col gap-3">
                  {['Apartment', 'House', 'Villa', 'Commercial', 'Flatmate'].map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-5 h-5 rounded border-2 border-gray-300 group-hover:border-[#408A71] transition-colors">
                        <input type="checkbox" className="peer sr-only" defaultChecked={type === 'Apartment'} />
                        <div className="scale-0 peer-checked:scale-100 transition-transform bg-[#408A71] w-full h-full rounded-sm flex items-center justify-center text-white">
                          <Check size={12} strokeWidth={4} />
                        </div>
                      </div>
                      <span className="text-gray-600 font-medium text-sm group-hover:text-gray-900 transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="border-gray-100 my-6" />

               {listingType === "rent" && (
                 <>
                   <div className="mb-6">
                     <div className="flex items-center justify-between mb-3">
                       <label className="block text-sm font-semibold text-gray-900">Your Match Profile</label>
                       <button onClick={() => setIsPrefsOpen(!isPrefsOpen)} className="text-[#408A71] text-sm font-bold hover:underline flex items-center gap-1 active:scale-95 transition-all">
                         <Settings2 size={16} /> {isPrefsOpen ? 'Close' : 'Edit'}
                       </button>
                     </div>
                     {isPrefsOpen && (
                       <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-6">
                         <CustomSelect label="Sleep Schedule" value={prefs.sleepSchedule} onChange={(val) => setPrefs({...prefs, sleepSchedule: val as string})} options={[{value: 'early bird', label: 'Early Bird'}, {value: 'night owl', label: 'Night Owl'}]} />
                         <CustomSelect label="Diet" value={prefs.food} onChange={(val) => setPrefs({...prefs, food: val as string})} options={[{value: 'veg', label: 'Vegetarian'}, {value: 'non-veg', label: 'Non-Vegetarian'}, {value: 'any', label: 'Any'}]} />
                         <div className="flex gap-4">
                           <div className="flex-1">
                             <CustomSelect label="Tidiness" value={prefs.cleanliness} onChange={(val) => setPrefs({...prefs, cleanliness: val as string})} options={[{value: 'low', label: 'Low'}, {value: 'medium', label: 'Medium'}, {value: 'high', label: 'High'}]} />
                           </div>
                           <div className="flex-1">
                             <CustomSelect label="Work Mode" value={prefs.workMode} onChange={(val) => setPrefs({...prefs, workMode: val as string})} options={[{value: 'wfh', label: 'WFH'}, {value: 'office', label: 'Office'}]} />
                           </div>
                         </div>
                         <div className="flex gap-4">
                           <div className="flex-1">
                             <CustomSelect label="Guests" value={prefs.guests} onChange={(val) => setPrefs({...prefs, guests: val as boolean})} options={[{value: true, label: 'Allowed'}, {value: false, label: 'Strict No'}]} />
                           </div>
                           <div className="flex-1">
                             <CustomSelect label="Couples" value={prefs.coupleFriendly} onChange={(val) => setPrefs({...prefs, coupleFriendly: val as boolean})} options={[{value: true, label: 'Friendly'}, {value: false, label: 'Strict No'}]} />
                           </div>
                         </div>
                         <CustomSelect label="Personality" value={prefs.personality} onChange={(val) => setPrefs({...prefs, personality: val as string})} options={[{value: 'quiet', label: 'Quiet & Reserved'}, {value: 'social', label: 'Social & Talkative'}]} />
                       </div>
                     )}
                   </div>
                   <hr className="border-gray-100 my-6" />

                   <div className="mb-6">
                     <label className="block text-sm font-semibold text-gray-900 mb-3">Minimum Match (%)</label>
                     <div className="flex items-center gap-3">
                       <input
                         type="range"
                         min="0" max="100" step="10"
                         value={minCompatibility}
                         onChange={(e) => setMinCompatibility(Number(e.target.value))}
                         className="flex-1 accent-[#408A71]"
                       />
                       <span className="text-sm font-bold text-gray-700">{minCompatibility}%</span>
                     </div>
                   </div>
                   <hr className="border-gray-100 my-6" />
                 </>
               )}

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Price Range (₹)</label>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <input type="number" placeholder="Min" defaultValue="5000" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#408A71] outline-none" />
                  </div>
                  <span className="text-gray-400 font-medium">-</span>
                  <div className="flex-1">
                    <input type="number" placeholder="Max" defaultValue="50000" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#408A71] outline-none" />
                  </div>
                </div>
              </div>

              <hr className="border-gray-100 my-6" />

              {/* Rooms */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Bedrooms</label>
                <div className="flex items-center gap-2">
                  {['1', '2', '3', '4+'].map((num) => (
                    <button 
                      key={num} 
                      onClick={() => setBedrooms(bedrooms === num ? null : num)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${bedrooms === num ? 'bg-[#408A71] text-white shadow-md' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

               {/* Apply Button */}
               <button onClick={handleApplyFilters} className="w-full bg-[#408A71] hover:bg-[#34745c] text-white font-semibold py-3.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center mt-8">
                Apply Filters
               </button>
            </div>
          </aside>

          {/* Right Content - Properties Grid */}
          <div className="flex-1">
            {/* Top Bar - Desktop */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <p className="text-gray-600 font-medium">Showing <span className="font-bold text-gray-900">{displayedProperties.length}</span> properties</p>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-500">Sort by:</span>
                <div className="relative group cursor-pointer">
                  <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold text-gray-900 shadow-sm transition-all group-hover:border-[#408A71]">
                    Recommended <ChevronDown size={14} className="text-gray-400 group-hover:text-[#408A71] transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* Properties List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {paginatedProperties.map((property) => {
                const item = property.id;
                const sampleImages = [
                  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ];
                const itemHash = typeof item === 'number' ? item : String(item).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const imageSrc = sampleImages[itemHash % sampleImages.length];

                return (
                <Link key={item} href={`/properties/${item}?type=${listingType}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer flex flex-col h-full">
                  <div className="h-56 w-full bg-gray-100 relative overflow-hidden">
                    <div className="absolute top-4 w-full flex justify-between items-start px-4 z-10">
                      <div className="flex gap-2">
                        <span className="bg-white/95 backdrop-blur-sm text-[#408A71] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wide uppercase">
                          {listingType === "rent" ? "For Rent" : "For Sale"}
                        </span>
                        {listingType === "rent" && property.compatibility !== null && (
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wide uppercase">
                            Match: {property.compatibility}%
                          </span>
                        )}
                      </div>
                      <span className="bg-gray-900/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1.5 ml-auto">
                        <Clock size={12} /> {property.isDbQuery ? 'Just now' : `${item}w ago`}
                      </span>
                    </div>
                    {/* Mock Image Placeholder */}
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                       <img src={imageSrc} alt="Property" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#408A71] transition-colors line-clamp-1 pr-2">
                          {property.title}
                        </h3>
                        <div className="text-lg font-extrabold text-[#408A71] shrink-0">
                          {listingType === "rent" ? (
                            <>₹{property.rent?.toLocaleString() || 12000} <span className="text-sm text-gray-400 font-medium">/mo</span></>
                          ) : (
                            <>₹{((property as any).salePrice || property.rent * 400)?.toLocaleString()}</>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-500 text-sm mb-4 flex items-center gap-1.5 line-clamp-1 font-medium">
                        <MapPin size={16} className="shrink-0 text-gray-400" /> {property.city}
                      </p>

                      {/* Verification Badges */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {property.listerLevel === 4 && (
                          <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            <BadgeCheck size={12} /> Trusted Agent
                          </div>
                        )}
                        {property.listerLevel === 3 && (
                          <div className="inline-flex items-center gap-1 bg-green-50 text-[#408A71] text-[10px] font-bold px-2 py-0.5 rounded border border-green-100 uppercase tracking-wider">
                            <Check size={12} /> ID Verified Owner
                          </div>
                        )}
                        {/* Fallback space for layout consistency if no badge */}
                        {property.listerLevel < 3 && <div className="h-5" />}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-gray-600 text-sm pt-4 border-t border-gray-100 font-medium">
                      <div className="flex items-center gap-1.5"><Building size={16} className="text-gray-400" /> {property.bedrooms} Beds</div>
                      <div className="flex items-center gap-1.5"><Key size={16} className="text-gray-400" /> {property.baths} Baths</div>
                      <div className="flex items-center gap-1.5"><Home size={16} className="text-gray-400" /> {property.sqft} sqft</div>
                    </div>
                  </div>
                </Link>
              )})}
            </div>

            {/* Pagination / Load More */}
            {visibleCount < displayedProperties.length && (
              <div className="mt-12 flex justify-center">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 4)}
                  className="bg-white border-2 border-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-xl hover:border-[#408A71] hover:text-[#408A71] transition-all shadow-sm active:scale-95"
                >
                  Load More Properties
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
