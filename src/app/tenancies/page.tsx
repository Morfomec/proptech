"use client";

import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, FileText, CheckCircle2, ChevronRight, IndianRupee, Clock, Home, AlertCircle, FileSignature, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { tenancyService } from "@/lib/tenancyService";
import { propertyService } from "@/lib/propertyService";
import { Tenancy, Property } from "@/types/models";

export default function TenanciesDashboard() {
  const { userProfile, user } = useAuth();
  
  const [tenancies, setTenancies] = useState<Tenancy[]>([]);
  const [propertyMap, setPropertyMap] = useState<Record<string, Property>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      const fetchData = async () => {
        try {
          const [fetchedTenancies, fetchedProps] = await Promise.all([
            tenancyService.getTenanciesByOwner(user.uid),
            propertyService.getProperties({ ownerId: user.uid })
          ]);
          
          const propMap: Record<string, Property> = {};
          fetchedProps.forEach(p => { propMap[p.id] = p; });
          
          setTenancies(fetchedTenancies);
          setPropertyMap(propMap);
        } catch (error) {
          console.error("Failed to load tenancies dashboard:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [user]);
  if (!user || !userProfile || !['owner', 'agent', 'builder'].includes(userProfile.role)) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex flex-col items-center justify-center">
        <div className="bg-red-50 p-6 rounded-full mb-6">
          <AlertCircle className="text-red-500" size={48} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
        <p className="text-gray-500">Only authorized property posters can manage tenancies.</p>
        <Link href="/" className="mt-8 bg-[#408A71] text-white px-8 py-3 rounded-xl font-bold">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Tenancy Management</h1>
            <p className="text-gray-500 text-lg">Manage your active tenants, digital agreements, and track payments.</p>
          </div>
          <Link href="/post" className="shrink-0 bg-white border-2 border-[#408A71] text-[#408A71] px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors hidden md:block">
            Post New Property
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Home className="text-[#408A71]" size={24} /> My Properties & Tenants
            </h2>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-sm border border-gray-100">
                <Loader2 className="animate-spin text-[#408A71] mb-4" size={48} />
                <p className="font-semibold text-gray-500">Loading your tenancies...</p>
              </div>
            ) : (
              <>
            {tenancies.map((tenancy) => (
              <div key={tenancy.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{propertyMap[tenancy.property_id]?.title || `Property #${tenancy.property_id}`}</h3>
                    <p className="text-sm font-semibold text-gray-500 flex items-center gap-1.5">
                      <ShieldCheck size={16} className={tenancy.status === 'active' ? "text-green-500" : "text-amber-500"} />
                      Tenant: <span className="text-gray-800">{tenancy.tenantName || tenancy.tenant_name}</span>
                    </p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${tenancy.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {tenancy.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Rent</p>
                    <p className="font-bold text-gray-900">₹{tenancy.rentAmount?.toLocaleString() || tenancy.rent_amount?.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Start Date</p>
                    <p className="font-bold text-gray-900">{tenancy.startDate || tenancy.start_date}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Due Date</p>
                    <p className="font-bold flex items-center gap-1 text-amber-600">
                       <Clock size={16}/> {tenancy.paymentDueDay || tenancy.payment_due_day}th
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Deposit</p>
                    <p className="font-bold text-gray-900">
                      ₹{tenancy.depositAmount?.toLocaleString() || tenancy.deposit_amount?.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex-1 justify-center sm:flex-none">
                    <FileSignature size={18} /> Digital Agreement
                  </button>
                  <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex-1 justify-center sm:flex-none">
                    <IndianRupee size={18} /> View Payments
                  </button>
                  <button className="flex items-center gap-1 text-[#408A71] hover:underline px-3 py-2.5 rounded-xl text-sm font-bold ml-auto">
                    Details <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}

            {!loading && tenancies.length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 border-dashed">
                <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Active Tenancies</h3>
                <p className="text-gray-500">You haven&apos;t created any tenancies yet. Go to your listings to start an agreement.</p>
              </div>
            )}
            </>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#408A71] bg-opacity-10 rounded-3xl p-6 border border-[#408A71] border-opacity-20 sticky top-28">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                  <span className="text-gray-600 font-medium">Active Tenants</span>
                  <span className="text-2xl font-black text-[#408A71]">{tenancies.filter(t => t.status==='active').length}</span>
                </div>
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                  <span className="text-gray-600 font-medium">Pending Invites</span>
                  <span className="text-xl font-bold text-amber-500">{tenancies.filter(t => t.status==='pending').length}</span>
                </div>
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                  <span className="text-gray-600 font-medium">Monthly Revenue</span>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{tenancies.reduce((acc, curr) => acc + (curr.rentAmount || curr.rent_amount || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wider">Payments Overview</h4>
                <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 border-l-4 border-amber-500">
                  <AlertCircle className="text-amber-500 shrink-0" size={24} />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Action Needed</p>
                    <p className="text-xs text-gray-500">Priya Singh&apos;s payment is pending clearance since 2 days.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
