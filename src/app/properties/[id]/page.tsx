"use client";

import { use } from "react";
import { MapPin, Home, Building, Key, Clock, CheckCircle2, ChevronLeft, Heart, Share2, BadgeCheck, Phone, Mail, FileText, Star } from "lucide-react";
import Link from "next/link";
import { usePreferences } from "../../../context/PreferencesContext";
import { getCompatibility } from "../../../utils/compatibility";
import { useAuth, getVerificationBadge, VerificationLevel, ProfileRole } from "../../../context/AuthContext";
import { propertyService } from "../../../lib/propertyService";
import { tenancyService } from "../../../lib/tenancyService";
import { Property } from "../../../types/models";
import { useState, useEffect } from "react";

export default function PropertyDetailsPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const unwrappedParams = use(params);
  const unwrappedSearchParams = use(searchParams);
  const { prefs } = usePreferences();
  const { user, userProfile } = useAuth();
  
  const id = unwrappedParams.id;
  const isSale = unwrappedSearchParams.type === "sale";
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasTenancy, setHasTenancy] = useState(false);

  useEffect(() => {
    propertyService.getPropertyById(id)
      .then((data) => {
        setProperty(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
      
    tenancyService.getTenanciesByProperty(id)
      .then((tenancies) => {
        setHasTenancy(tenancies.length > 0);
      })
      .catch(console.error);
  }, [id]);

  const numId = isNaN(Number(id)) ? 1 : Number(id);
  const isOwner = property ? property.ownerId === user?.uid : numId % 2 === 0;

  // Mock rules based on ID to match the list page
  const mockRules = [
    { sleepSchedule: "early bird", foodAllowed: "veg", cleanliness: "high", workModeAllowed: "office", guestsAllowed: false, personality: "quiet", coupleFriendly: false },
    { sleepSchedule: "night owl", foodAllowed: "any", cleanliness: "medium", workModeAllowed: "wfh", guestsAllowed: true, personality: "social", coupleFriendly: true },
    { sleepSchedule: "any", foodAllowed: "veg", cleanliness: "medium", workModeAllowed: "any", guestsAllowed: false, personality: "quiet", coupleFriendly: false },
    { sleepSchedule: "early bird", foodAllowed: "any", cleanliness: "low", workModeAllowed: "wfh", guestsAllowed: true, personality: "social", coupleFriendly: true },
    { sleepSchedule: "night owl", foodAllowed: "any", cleanliness: "high", workModeAllowed: "office", guestsAllowed: false, personality: "any", coupleFriendly: false },
    { sleepSchedule: "any", foodAllowed: "any", cleanliness: "any", workModeAllowed: "any", guestsAllowed: true, personality: "any", coupleFriendly: true },
  ];
  
  const propertyRules = property?.rules || (mockRules[(numId - 1) % mockRules.length] || mockRules[0]);
  const compatibility = (property?.type === 'rent' || (!property && !isSale)) ? getCompatibility(prefs, propertyRules) : null;
  
  if (loading) {
    return <div className="min-h-screen pt-32 text-center text-gray-500 font-bold">Loading details...</div>;
  }
  
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

        {/* Premium Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 mb-10 h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden group/gallery relative shadow-sm">
           {/* Badges Overlay */}
           <div className="absolute top-6 left-6 flex flex-col gap-3 z-20 pointer-events-none">
              <div className="flex gap-3">
                <span className="bg-white/95 backdrop-blur-sm shadow-xl text-[#408A71] font-extrabold px-4 py-2 rounded-xl tracking-wide uppercase">
                  {(property?.type === 'sale' || (!property && isSale)) ? 'For Sale' : 'For Rent'}
                </span>
                {!isSale && compatibility !== null && (
                  <span className="bg-green-100/95 backdrop-blur-sm shadow-xl text-green-800 font-extrabold px-4 py-2 rounded-xl tracking-wide uppercase">
                    Your match: {compatibility}%
                  </span>
                )}
              </div>
           </div>

           {/* Main Large Image */}
           <div className="md:col-span-2 md:row-span-2 relative overflow-hidden bg-gray-200">
             <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Main Property View" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
           </div>
           
           {/* Side Images */}
           <div className="hidden md:block relative overflow-hidden bg-gray-200">
             <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Interior View" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
           </div>
           <div className="hidden md:block relative overflow-hidden bg-gray-200">
             <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Kitchen View" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
           </div>
           <div className="hidden md:block md:col-span-2 relative overflow-hidden bg-gray-200 group/more cursor-pointer">
             <img src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Living Room View" className="w-full h-full object-cover transition-transform duration-700 group-hover/more:scale-105" />
             <div className="absolute inset-0 bg-black/40 group-hover/more:bg-black/50 transition-colors flex items-center justify-center">
                <span className="text-white font-extrabold text-xl tracking-wide flex items-center gap-2">View Full Gallery</span>
             </div>
           </div>
        </div>

        {/* Main Content & Sidebar Layout */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Details */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">{property?.title || `Modern Serenity Appt ${id}`}</h1>
              <p className="text-gray-500 text-lg flex items-center gap-2 font-medium">
                <MapPin size={20} className="text-gray-400" /> {property?.city || 'Thondayad Bypass, Kozhikode, Kerala'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-gray-100 mb-8 bg-white px-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded-xl text-[#408A71]"><Building size={24} /></div>
                <div><p className="text-sm text-gray-500 font-semibold">Bedrooms</p><p className="font-bold text-gray-900 text-lg">{property?.beds || 2 + (numId % 2)}</p></div>
              </div>
              <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Key size={24} /></div>
                <div><p className="text-sm text-gray-500 font-semibold">Bathrooms</p><p className="font-bold text-gray-900 text-lg">{property?.baths || 2}</p></div>
              </div>
              <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 rounded-xl text-purple-600"><Home size={24} /></div>
                <div><p className="text-sm text-gray-500 font-semibold">Square Feet</p><p className="font-bold text-gray-900 text-lg">{property?.sqft || 1000 + numId * 100} sqft</p></div>
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
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 sticky top-28 mb-8">
              
              <div className="mb-8">
                <p className="text-gray-500 font-bold tracking-widest uppercase text-xs mb-2">
                  {(property?.type === 'sale' || (!property && isSale)) ? 'Selling Price' : 'Monthly Rent'}
                </p>
                <div className="text-4xl font-black text-[#408A71] flex items-end tracking-tight">
                  {(property?.type === 'sale' || (!property && isSale)) ? (
                    <>₹{((property as any)?.salePrice || (property?.rent || 10000) * 400 || 4500000 + numId * 500000).toLocaleString()}</>
                  ) : (
                    <>₹{(property?.rent || 12000 + numId * 2000).toLocaleString()} <span className="text-xl text-gray-400 font-bold ml-1 mb-1">/mo</span></>
                  )}
                </div>
              </div>

              {/* Lister Information */}
              <Link href={`/profile/${isOwner ? 'owner123' : 'agent456'}`} className={`block p-6 rounded-2xl mb-8 border transition-all hover:shadow-lg hover:-translate-y-1 ${isOwner ? 'bg-amber-50/50 border-amber-200' : 'bg-blue-50/50 border-blue-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className={`text-xs font-black uppercase tracking-widest ${isOwner ? 'text-amber-600' : 'text-blue-600'}`}>
                      Listed By {isOwner ? 'Owner' : 'Verified Agent'}
                    </p>
                  </div>
                  {isOwner ? null : <BadgeCheck size={20} className="text-blue-600 drop-shadow-sm" />}
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 shrink-0 rounded-full bg-white border-2 hover:border-[#408A71] transition-colors shadow-md overflow-hidden flex items-center justify-center font-bold text-gray-400 text-2xl">
                    <img src={isOwner ? "https://ui-avatars.com/api/?name=P+L&background=fef3c7&color=d97706" : "https://ui-avatars.com/api/?name=P+R&background=eff6ff&color=2563eb"} alt="Avatar" />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-xl group-hover:underline leading-tight mb-1">{isOwner ? 'Private Landlord' : 'Proptech Reality'}</p>
                    <p className="text-sm font-semibold text-gray-500 mb-3">{isOwner ? 'No brokerage fees' : 'Trusted Partner'}</p>
                    <div className="flex flex-col gap-2">
                      <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider w-max ${getVerificationBadge(((property as any)?.listerLevel || (isOwner ? 3 : 4)) as VerificationLevel, ((property as any)?.role || (isOwner ? 'owner' : 'agent')) as ProfileRole).bg}`}>
                          <span>{getVerificationBadge(((property as any)?.listerLevel || (isOwner ? 3 : 4)) as VerificationLevel, ((property as any)?.role || (isOwner ? 'owner' : 'agent')) as ProfileRole).icon}</span> {getVerificationBadge(((property as any)?.listerLevel || (isOwner ? 3 : 4)) as VerificationLevel, ((property as any)?.role || (isOwner ? 'owner' : 'agent')) as ProfileRole).label}
                      </div>
                      <div className="inline-flex items-center gap-1.5 bg-gray-900 text-white shadow-md text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider w-max">
                         <Star size={12} className="text-yellow-400 fill-yellow-400" /> Trust Score: {(property as any)?.listerLevel ? ((property as any).listerLevel >= 3 ? '850' : '550') : (isOwner ? '850' : '920')}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Contact Actions */}
              <div className="flex flex-col gap-3">
                <button className="w-full bg-[#408A71] hover:bg-[#34745c] text-white font-extrabold py-4 rounded-xl shadow-lg shadow-[#408A71]/30 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg">
                  <Mail size={22} /> Request Details
                </button>
                <button className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 font-extrabold py-4 rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 text-lg">
                  <Phone size={22} /> Show Phone Number
                </button>
              </div>

              {/* Owner Actions */}
              {userProfile && ['owner', 'agent', 'builder'].includes(userProfile.role) && (
                <div className="mt-8 border-t border-gray-100 pt-8">
                  <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase mb-4">Property Management</h3>
                  {hasTenancy ? (
                    <Link href="/tenancies" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 text-lg">
                      <FileText size={20} /> Manage Tenancy
                    </Link>
                  ) : (
                    <Link href={`/properties/${id}/tenancy-create`} className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 text-lg">
                      <FileText size={20} /> Create Tenancy
                    </Link>
                  )}
                  <p className="text-xs font-medium text-gray-400 mt-3 text-center">Digitally manage your tenant, payments, and agreements.</p>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
