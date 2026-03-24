"use client";

import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, CheckCircle, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { propertyService } from "@/lib/propertyService";

type SelectOption = { value: string | boolean; label: string };
const CustomSelect = ({ label, options, value, onChange }: { label: string, options: SelectOption[], value: any, onChange: (val: any) => void }) => {
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
        <span>{selectedOption?.label || "Select..."}</span>
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

export default function PostPropertyPage() {
  const { user, userProfile } = useAuth();
  const [activeListings] = useState(0); // Mocking active listings

  const [formState, setFormState] = useState({
    title: "",
    type: "rent",
    price: "",
    location: "",
    beds: "1",
    baths: "1",
    sqft: "",
  });

  const [tenantPrefs, setTenantPrefs] = useState({
    sleepSchedule: "any",
    food: "any",
    cleanliness: "medium",
    workMode: "any",
    guests: true,
    coupleFriendly: true,
    personality: "any"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await propertyService.createProperty({
        title: formState.title,
        description: `Stunning ${formState.type} property in ${formState.location}`, // Mock description
        rent: parseInt(formState.price) || 0,
        city: formState.location,
        address: formState.location,
        ownerId: user.uid,
        type: formState.type as any,
        beds: parseInt(formState.beds),
        baths: parseInt(formState.baths),
        sqft: parseInt(formState.sqft),
        rules: formState.type === 'rent' ? tenantPrefs : undefined,
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to create property. See console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
        <p className="text-gray-500 mb-6 text-center max-w-sm">You need an account to post properties. Join our community today!</p>
        <Link href="/login" className="bg-[#408A71] text-white px-8 py-3 rounded-full font-bold hover:bg-[#34745c] transition-colors">
          Log In or Sign Up
        </Link>
      </div>
    );
  }

  // Level 1 Guard
  if (userProfile.level === 1) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="text-orange-500" size={40} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Verification Required</h1>
          <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
            To maintain a high-quality marketplace, we require all property owners and agents to verify their phone number before posting listings.
          </p>
          <Link href="/profile" className="bg-[#408A71] text-white px-8 py-3.5 rounded-full font-bold shadow-md hover:bg-[#34745c] transition-transform active:scale-95 inline-flex items-center gap-2">
            Verify Phone via Profile
          </Link>
        </div>
      </div>
    );
  }

  // Limit Guard based on Role
  if (userProfile.role === 'owner' && activeListings >= 2 && userProfile.level < 3) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white border border-gray-100 shadow-sm w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="text-[#408A71]" size={40} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Listing Limit Reached</h1>
          <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
            As an Individual Owner, you can only have 2 active listings at a time. To unlock <strong className="text-gray-900 font-black">unlimited listings</strong>, please verify your Government ID or Property Proof.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/profile" className="bg-[#408A71] text-white px-8 py-3.5 rounded-full font-bold shadow-md hover:bg-[#34745c] transition-transform active:scale-95">
              Upgrade Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (userProfile.role === 'agent' && activeListings >= 5 && userProfile.level < 4) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white border border-gray-100 shadow-sm w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="text-[#408A71]" size={40} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Account Verification Required</h1>
          <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
            As an unverified Agent, you are limited to 5 active listings. To post unlimited properties for your clients, please verify your Agency or RERA details in your profile.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/profile" className="bg-[#408A71] text-white px-8 py-3.5 rounded-full font-bold shadow-md hover:bg-[#34745c] transition-transform active:scale-95">
              Verify Agency
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto px-6 text-center flex flex-col items-center">
          <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="text-green-500" size={48} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Property Listed Successfully!</h1>
          <p className="text-gray-600 text-lg mb-8 max-w-xl">
            Your property has been indexed and is now live. {formState.type === 'rent' && "Our compatibility engine is actively matching ideal tenants to your preferences."}
          </p>
          <Link href="/properties" className="bg-[#408A71] text-white px-8 py-3.5 rounded-full font-bold shadow-md hover:bg-[#34745c] transition-transform active:scale-95">
            View Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 text-left">
      <div className="max-w-4xl mx-auto px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Post a New Property</h1>
          <p className="text-gray-500">Reach thousands of potential renters and buyers with verified matching.</p>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
          <CheckCircle className="text-green-600" size={18} />
          <span className="text-green-800 font-bold text-sm capitalize">
            {userProfile.role} Account
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Details */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            1. Basic Properties
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="col-span-1 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 block mb-2">Listing Type</label>
              <div className="flex p-1 bg-gray-50 rounded-xl gap-1 border border-gray-200 w-full md:w-auto overflow-x-auto">
                <button type="button" onClick={() => setFormState({...formState, type: "rent"})} className={`min-w-[100px] flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all ${formState.type === "rent" ? "bg-white text-[#408A71] shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-900"}`}>For Rent</button>
                <button type="button" onClick={() => setFormState({...formState, type: "sale"})} className={`min-w-[100px] flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all ${formState.type === "sale" ? "bg-white text-[#408A71] shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-900"}`}>For Sale</button>
                {userProfile.role === 'builder' && (
                  <button type="button" onClick={() => setFormState({...formState, type: "project"})} className={`min-w-[100px] flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all ${formState.type === "project" ? "bg-white text-[#408A71] shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-900"}`}>New Project</button>
                )}
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 block mb-2">Property Title</label>
              <input required value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} type="text" placeholder="e.g. Modern Apartment with City Views" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#408A71]/50 transition-all font-medium" />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">
                Price {formState.type === 'rent' ? '(/month)' : ''} {formState.type === 'project' ? '(Starting from)' : ''}
              </label>
              <input required value={formState.price} onChange={e => setFormState({...formState, price: e.target.value})} type="number" placeholder="₹" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#408A71]/50 transition-all font-medium" />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">Area / Location</label>
              <input required value={formState.location} onChange={e => setFormState({...formState, location: e.target.value})} type="text" placeholder="e.g. Kozhikode Bypass" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#408A71]/50 transition-all font-medium" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">Beds</label>
              <input required value={formState.beds} onChange={e => setFormState({...formState, beds: e.target.value})} type="number" min="1" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#408A71]/50 transition-all font-medium" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">Baths</label>
              <input required value={formState.baths} onChange={e => setFormState({...formState, baths: e.target.value})} type="number" min="1" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#408A71]/50 transition-all font-medium" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">Sqft</label>
              <input required value={formState.sqft} onChange={e => setFormState({...formState, sqft: e.target.value})} type="number" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#408A71]/50 transition-all font-medium" />
            </div>
          </div>
        </div>

        {/* Tenant Preferences (Rent Only) */}
        {formState.type === "rent" && (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              2. Ideal Tenant Profile
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Establish the rules for this property. Only seekers who match these criteria will score a 100% compatibility rating.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              <CustomSelect
                label="Accepted Diet"
                value={tenantPrefs.food}
                onChange={(val: string) => setTenantPrefs({...tenantPrefs, food: val})}
                options={[
                  { value: "any", label: "Any" },
                  { value: "veg", label: "Veg Only" },
                  { value: "non-veg", label: "Non-Veg OK" }
                ]}
              />

              <CustomSelect
                label="Accepted Work Mode"
                value={tenantPrefs.workMode}
                onChange={(val: string) => setTenantPrefs({...tenantPrefs, workMode: val})}
                options={[
                  { value: "any", label: "Any" },
                  { value: "wfh", label: "WFH Friendly" },
                  { value: "office", label: "Office Goers" }
                ]}
              />

              <CustomSelect
                label="Guests Allowed?"
                value={tenantPrefs.guests}
                onChange={(val: boolean) => setTenantPrefs({...tenantPrefs, guests: val})}
                options={[
                  { value: true, label: "Yes, allowed" },
                  { value: false, label: "Strict No Guests" }
                ]}
              />

              <CustomSelect
                label="Couple Friendly?"
                value={tenantPrefs.coupleFriendly}
                onChange={(val: boolean) => setTenantPrefs({...tenantPrefs, coupleFriendly: val})}
                options={[
                  { value: true, label: "Yes, Couples OK" },
                  { value: false, label: "Strict No Couples" }
                ]}
              />

            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button disabled={isSubmitting} type="submit" className="bg-[#408A71] text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-[#34745c] hover:-translate-y-0.5 transition-all text-lg flex items-center gap-2">
            {isSubmitting ? "Publishing..." : "Publish Property Listing"}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
