"use client";

import { useAuth } from "@/context/AuthContext";
import { propertyService } from "@/lib/propertyService";
import { tenancyService } from "@/lib/tenancyService";
import { Building, Home, Key, MapPin, Clock, Plus, ShieldCheck, FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Property } from "@/types/models";

export default function MyPropertiesPage() {
  const { user, userProfile } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenantedProperties, setTenantedProperties] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        propertyService.getProperties({ ownerId: user.uid }),
        tenancyService.getTenanciesByOwner(user.uid)
      ]).then(([propsData, tenanciesData]) => {
          setProperties(propsData);
          setTenantedProperties(new Set(tenanciesData.map(t => t.property_id)));
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (!user || !userProfile || !['owner', 'agent', 'builder'].includes(userProfile.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pt-24 pb-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500">Only authorized property posters can view this dashboard.</p>
        <Link href="/" className="mt-6 bg-[#408A71] text-white px-8 py-3 rounded-xl font-bold">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">My Properties</h1>
            <p className="text-gray-500 text-lg mt-1">Manage your active property listings and tenancies.</p>
          </div>
          <Link href="/post" className="shrink-0 flex items-center gap-2 bg-[#408A71] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#34745c] transition-colors shadow-sm">
            <Plus size={20} /> List New Property
          </Link>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
             <div className="bg-green-50 p-4 rounded-xl text-[#408A71]"><Home size={28} /></div>
             <div><p className="text-sm font-semibold text-gray-500">Active Listings</p><p className="text-2xl font-black text-gray-900">{properties.length}</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
             <div className="bg-blue-50 p-4 rounded-xl text-blue-600"><ShieldCheck size={28} /></div>
             <div><p className="text-sm font-semibold text-gray-500">Verified</p><p className="text-2xl font-black text-gray-900">{properties.filter(p => p.verified).length}</p></div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="w-10 h-10 border-4 border-[#408A71] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white border focus:border-gray-200 border-dashed rounded-3xl p-16 text-center">
            <Building className="mx-auto text-gray-300 mb-4" size={56} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Properties Listed</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't posted any properties yet. Once you post a property, it will appear here for management.</p>
            <Link href="/post" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors">
              <Plus size={20} /> Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group flex flex-col h-full hover:shadow-md transition-all">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${property.type === 'rent' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                      For {property.type}
                    </span>
                    {property.verified && (
                      <span className="text-green-600 shrink-0"><ShieldCheck size={20} /></span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{property.title}</h3>
                  <div className="text-2xl font-extrabold text-[#408A71] mb-4">
                    ₹{property.rent?.toLocaleString()} {property.type === 'rent' && <span className="text-sm text-gray-400 font-medium">/mo</span>}
                  </div>
                  
                  <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-6 line-clamp-1 font-medium">
                    <MapPin size={16} className="shrink-0" /> {property.city}
                  </p>
                  
                  <div className="flex items-center gap-4 text-gray-600 text-sm font-medium bg-gray-50 p-3 rounded-xl">
                    <div className="flex items-center gap-1"><Building size={16} /> {property.beds} Beds</div>
                    <div className="flex items-center gap-1"><Key size={16} /> {property.baths} Baths</div>
                    <div className="flex items-center gap-1"><Home size={16} /> {property.sqft} sqft</div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-100 flex flex-col gap-2 bg-gray-50">
                   {tenantedProperties.has(property.id) ? (
                     <Link href="/tenancies" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all text-sm shadow-sm ring-1 ring-blue-700">
                       <FileText size={16} /> Manage Tenancy
                     </Link>
                   ) : (
                     <Link href={`/properties/${property.id}/tenancy-create`} className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all text-sm">
                       <FileText size={16} /> Create Tenancy
                     </Link>
                   )}
                   <Link href={`/properties/${property.id}`} className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold py-3 rounded-xl transition-all text-sm">
                     View Listing
                   </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
