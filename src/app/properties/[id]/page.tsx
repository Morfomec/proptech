"use client";

import { use } from "react";
import { MapPin, Home, Building, Key, Clock, CheckCircle2, ChevronLeft, Heart, Share2, BadgeCheck, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { usePreferences } from "../../../context/PreferencesContext";
import { getCompatibility } from "../../../utils/compatibility";

export default function PropertyDetailsPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const unwrappedParams = use(params);
  const unwrappedSearchParams = use(searchParams);
  const { prefs } = usePreferences();
  
  const id = unwrappedParams.id;
  const isSale = unwrappedSearchParams.type === "sale";
  const isOwner = Number(id) % 2 === 0;

  // Mock rules based on ID to match the list page
  const mockRules = [
    { sleepSchedule: "early bird", foodAllowed: "veg", cleanliness: "high", workModeAllowed: "office", guestsAllowed: false, personality: "quiet", coupleFriendly: false },
    { sleepSchedule: "night owl", foodAllowed: "any", cleanliness: "medium", workModeAllowed: "wfh", guestsAllowed: true, personality: "social", coupleFriendly: true },
    { sleepSchedule: "any", foodAllowed: "veg", cleanliness: "medium", workModeAllowed: "any", guestsAllowed: false, personality: "quiet", coupleFriendly: false },
    { sleepSchedule: "early bird", foodAllowed: "any", cleanliness: "low", workModeAllowed: "wfh", guestsAllowed: true, personality: "social", coupleFriendly: true },
    { sleepSchedule: "night owl", foodAllowed: "any", cleanliness: "high", workModeAllowed: "office", guestsAllowed: false, personality: "any", coupleFriendly: false },
    { sleepSchedule: "any", foodAllowed: "any", cleanliness: "any", workModeAllowed: "any", guestsAllowed: true, personality: "any", coupleFriendly: true },
  ];
  
  const propertyRules = mockRules[(Number(id) - 1) % mockRules.length] || mockRules[0];
  const compatibility = !isSale ? getCompatibility(prefs, propertyRules) : null;
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-grow">
        
        {/* Back navigation & Actions */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/properties" className="flex items-center text-sm font-semibold text-gray-500 hover:text-[#408A71] transition-colors">
            <ChevronLeft size={18} className="mr-1" /> Back to Properties
          </Link>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#408A71] shadow-sm transition-colors">
              <Share2 size={16} /> Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-500 hover:border-red-100 shadow-sm transition-colors">
              <Heart size={16} /> Save
            </button>
          </div>
        </div>

        {/* Hero Gallery Placeholder */}
        <div className="w-full h-[400px] md:h-[500px] bg-gray-200 rounded-3xl mb-10 flex items-center justify-center relative shadow-sm border border-gray-100 overflow-hidden group">
           <Home size={80} className="text-gray-300 z-10" />
           <div className="absolute inset-0 bg-gradient-to-tr from-[#408A71]/5 to-transparent"></div>
           
           {/* Badges */}
           <div className="absolute top-6 left-6 flex flex-col gap-3 z-20">
              <div className="flex gap-3">
                <span className="bg-white/95 backdrop-blur-sm text-[#408A71] font-extrabold px-4 py-2 rounded-xl shadow-md tracking-wide uppercase">
                  {isSale ? 'For Sale' : 'For Rent'}
                </span>
                {!isSale && compatibility !== null && (
                  <span className="bg-green-100/95 backdrop-blur-sm text-green-800 font-extrabold px-4 py-2 rounded-xl shadow-md tracking-wide uppercase">
                    Your compatibility: {compatibility}%
                  </span>
                )}
              </div>
              <span className="bg-gray-900/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 w-max">
                <Clock size={12} /> Listed 3 days ago
              </span>
           </div>
        </div>

        {/* Main Content & Sidebar Layout */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Details */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Modern Serenity Appt {id}</h1>
              <p className="text-gray-500 text-lg flex items-center gap-2 font-medium">
                <MapPin size={20} className="text-gray-400" /> Thondayad Bypass, Kozhikode, Kerala
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-gray-100 mb-8 bg-white px-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded-xl text-[#408A71]"><Building size={24} /></div>
                <div><p className="text-sm text-gray-500 font-semibold">Bedrooms</p><p className="font-bold text-gray-900 text-lg">{2 + (Number(id) % 2)}</p></div>
              </div>
              <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Key size={24} /></div>
                <div><p className="text-sm text-gray-500 font-semibold">Bathrooms</p><p className="font-bold text-gray-900 text-lg">2</p></div>
              </div>
              <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 rounded-xl text-purple-600"><Home size={24} /></div>
                <div><p className="text-sm text-gray-500 font-semibold">Square Feet</p><p className="font-bold text-gray-900 text-lg">1,{id}00 sqft</p></div>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this property</h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Experience modern living in the heart of Kozhikode with this beautifully designed property. Boasting stunning architecture, plenty of natural light, and premium finishes across its spacious layout. 
                </p>
                <p>
                  Located comfortably near major shopping centers, excellent schools, and offering easy access to the bypass, it is perfectly suited for families or professionals looking for a blend of convenience and luxury.
                </p>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['High-Speed Internet', 'Air Conditioning', 'Balcony / Terrace', '24/7 Security', 'Dedicated Parking', 'Gym & Fitness Center'].map(feature => (
                   <div key={feature} className="flex items-center gap-3 text-gray-700 font-medium">
                     <CheckCircle2 size={18} className="text-[#408A71]" /> {feature}
                   </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
              
              <div className="mb-8">
                <p className="text-gray-500 font-semibold tracking-wide uppercase text-sm mb-1">{isSale ? 'Selling Price' : 'Monthly Rent'}</p>
                <div className="text-4xl font-extrabold text-[#408A71] flex items-end">
                  {isSale ? (
                    <>₹{4500000 + Number(id) * 500000}</>
                  ) : (
                    <>₹{12000 + Number(id) * 2000} <span className="text-xl text-gray-400 font-bold ml-1 mb-1">/mo</span></>
                  )}
                </div>
              </div>

              {/* Lister Information */}
              <Link href={`/profile/${isOwner ? 'owner123' : 'agent456'}`} className={`block p-5 rounded-2xl mb-8 border transition-all hover:shadow-md hover:-translate-y-1 ${isOwner ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${isOwner ? 'text-amber-600' : 'text-blue-600'}`}>
                      Listed By {isOwner ? 'Owner' : 'Verified Agent'}
                    </p>
                  </div>
                  {isOwner ? null : <BadgeCheck size={20} className="text-blue-500" />}
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-bold text-gray-400 text-xl">
                    {isOwner ? 'O' : 'A'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg group-hover:underline">{isOwner ? 'Private Landlord' : 'Proptech Reality Cop.'}</p>
                    <p className="text-sm font-medium text-gray-500">{isOwner ? 'No brokerage fees' : 'Trusted Partner'}</p>
                  </div>
                </div>
              </Link>

              {/* Contact Actions */}
              <div className="flex flex-col gap-3">
                <button className="w-full bg-[#408A71] hover:bg-[#34745c] text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 text-lg">
                  <Mail size={20} /> Request Details
                </button>
                <button className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 font-bold py-4 rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 text-lg">
                  <Phone size={20} /> Show Phone Number
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
