"use client";

import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, FileText, CheckCircle2, ChevronRight, IndianRupee, Clock, Home, AlertCircle, FileSignature, Loader2, Star, BadgeCheck, Bell, Building, ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { tenancyService } from "@/lib/tenancyService";
import { propertyService } from "@/lib/propertyService";
import { Tenancy, Property } from "@/types/models";

// --- Trust Badge Component ---
const TrustBadge = ({ score }: { score: number }) => (
  <div className="flex items-center gap-1.5 mt-1">
    <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider w-max ${score >= 600 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
        <span>{score >= 600 ? '✅' : '⚠️'}</span> {score >= 600 ? 'Verified' : 'Pending Verification'}
    </div>
    <div className="inline-flex items-center gap-1 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-gray-700 uppercase tracking-wider w-max">
        <Star size={12} className="text-yellow-400 fill-yellow-400" /> Score: {score}
    </div>
  </div>
);

// --- Component: Tenant Dashboard ---
const TenantDashboard = ({ tenancies, propertyMap, loading, trustScore }: { tenancies: Tenancy[], propertyMap: Record<string, Property>, loading: boolean, trustScore: number }) => {
  const today = new Date();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: My Rentals */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Home className="text-[#408A71]" size={24} /> My Rented Properties
        </h2>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Loader2 className="animate-spin text-[#408A71] mb-4" size={48} />
            <p className="font-semibold text-gray-500">Loading your rentals...</p>
          </div>
        ) : (
          tenancies.map((tenancy) => {
            const renewalThreshold = new Date();
            renewalThreshold.setMonth(renewalThreshold.getMonth() + 1);
            const isRenewalNeeded = new Date(tenancy.end_date || 0) < renewalThreshold;
            return (
              <div key={tenancy.id} className={`bg-white rounded-3xl p-6 shadow-sm border transition-shadow ${isRenewalNeeded ? 'border-amber-200 ring-2 ring-amber-50' : 'border-gray-100 hover:shadow-md'}`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{propertyMap[tenancy.property_id]?.title || "Premium Apartment Suite"}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-2">
                      <Building size={16} /> Landlord: {tenancy.owner_id === 'mock_owner_real' ? 'Alice Reality Corp' : 'Private Landlord'}
                    </div>
                    {/* Inject mock trust score for Landlord */}
                    <TrustBadge score={tenancy.owner_id === 'mock_owner_real' ? 850 : 550} />
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${tenancy.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {tenancy.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Monthly Rent</p>
                    <p className="font-bold text-[#408A71] text-lg">₹{tenancy.rent_amount?.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Due Date</p>
                    <p className="font-bold text-gray-900 flex items-center gap-1">
                      <Clock size={16} className="text-amber-500"/> {tenancy.payment_due_day}th
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Deposit</p>
                    <p className="font-bold text-gray-900">₹{tenancy.deposit_amount?.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">End Date</p>
                    <p className={`font-bold ${isRenewalNeeded ? 'text-red-500' : 'text-gray-900'}`}>{tenancy.end_date}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-2 bg-[#408A71] hover:bg-[#34745c] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex-1 justify-center sm:flex-none">
                    <IndianRupee size={18} /> Pay Rent
                  </button>
                  <button className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex-1 justify-center sm:flex-none">
                    <FileSignature size={18} /> View Agreement
                  </button>
                  <Link href={`/properties/${tenancy.property_id}`} className="flex items-center gap-1 text-gray-500 hover:text-gray-900 hover:underline px-3 py-2.5 rounded-xl text-sm font-bold ml-auto">
                    Listing <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            );
          })
        )}
        
        {!loading && tenancies.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 border-dashed">
            <FileText className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Active Rentals</h3>
            <p className="text-gray-500">You haven&apos;t rented any properties yet. Discover places and sign your first digital agreement!</p>
            <Link href="/properties" className="mt-6 inline-block bg-[#408A71] text-white px-6 py-3 rounded-xl font-bold">Explore Listings</Link>
          </div>
        )}
      </div>

      {/* Right Column: Alerts & Actions */}
      <div className="space-y-6">
        {/* Gamified Trust Score Block */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-6 shadow-xl border border-gray-700 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Your Trust Score</p>
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 fill-yellow-400 mb-1" size={28} />
                <span className="text-4xl font-black text-white">{trustScore}</span>
              </div>
              <div className="bg-green-500/20 px-3 py-1.5 rounded-lg border border-green-500/30 mb-1">
                <span className="text-xs font-bold text-green-400 uppercase tracking-wide">✅ Good Standing</span>
              </div>
            </div>
            <div className="w-full bg-gray-700 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${Math.min((trustScore / 1000) * 100, 100)}%` }}></div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 bg-white/5 w-32 h-32 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm sticky top-28">
           <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Bell size={20} className="text-amber-500" /> Upcoming Actions</h3>
           
           <div className="space-y-3">
             {(() => {
                const overdueList = tenancies.filter(t => t.status === 'active' && new Date().getDate() > (t.payment_due_day || 1));
                const renewalList = tenancies.filter(t => t.status === 'active' && new Date(t.end_date || 0) < new Date(new Date().setMonth(new Date().getMonth() + 1)));

                if (overdueList.length === 0 && renewalList.length === 0) {
                  return (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-start gap-3">
                      <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="font-bold text-green-900 text-sm">All Caught Up!</p>
                        <p className="text-xs text-green-700 mt-1">No pending payments or agreements to sign.</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <>
                    {overdueList.map(t => (
                      <div key={`od_${t.id}`} className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer">
                        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                          <p className="font-bold text-red-900 text-sm">Rent Overdue</p>
                          <p className="text-xs text-red-700 mt-1">₹{t.rent_amount?.toLocaleString()} was due on the {t.payment_due_day}th.</p>
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 bg-red-500 text-white flex items-center justify-center px-3 translate-x-full group-hover:translate-x-0 transition-transform font-bold text-xs">
                          Pay Now
                        </div>
                      </div>
                    ))}
                    {renewalList.map(t => (
                      <div key={`rn_${t.id}`} className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer">
                        <FileSignature className="text-amber-600 shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                          <p className="font-bold text-amber-900 text-sm">Agreement Expiring</p>
                          <p className="text-xs text-amber-700 mt-1">Your lease ends on {t.end_date}. Tap to renew.</p>
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 bg-amber-500 text-white flex items-center justify-center px-3 translate-x-full group-hover:translate-x-0 transition-transform font-bold text-xs">
                          Renew
                        </div>
                      </div>
                    ))}
                  </>
                );
             })()}
           </div>
           
           <div className="mt-8 pt-6 border-t border-gray-100">
             <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col items-center text-center">
               <ShieldCheck className="text-blue-500 mb-2" size={32} />
               <p className="text-sm font-bold text-blue-900">Build Your Trust Score!</p>
               <p className="text-xs text-blue-700 mt-1">Paying rent on time automatically increases your tenant trust score, unlocking zero-deposit options.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Component: Owner & Agent Dashboard ---
const OwnerDashboard = ({ tenancies, propertyMap, loading }: { tenancies: Tenancy[], propertyMap: Record<string, Property>, loading: boolean }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main List */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Building className="text-[#408A71]" size={24} /> Properties & Tenants
        </h2>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Loader2 className="animate-spin text-[#408A71] mb-4" size={48} />
            <p className="font-semibold text-gray-500">Loading your portfolio...</p>
          </div>
        ) : (
          <>
          {tenancies.map((tenancy) => (
            <div key={tenancy.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-[#408A71] cursor-pointer inline-block">
                    {propertyMap[tenancy.property_id]?.title || `Property #${tenancy.property_id.slice(-4)}`}
                  </h3>
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 inline-block w-full">
                    <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 mb-1 uppercase tracking-wider">
                      Tenant Details
                    </p>
                    <p className="text-base font-bold text-gray-900">{tenancy.tenant_name}</p>
                    {/* Add rich mock trust scores for Tenants based on id */}
                    <TrustBadge score={tenancy.id === 'mock_t_1' ? 820 : tenancy.id === 'mock_t_2' ? 710 : 540} />
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${tenancy.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {tenancy.status}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Rent</p>
                  <p className="font-bold text-gray-900 text-lg">₹{tenancy.rent_amount?.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Start Date</p>
                  <p className="font-bold text-gray-900">{tenancy.start_date}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Due Date</p>
                  <p className="font-bold flex items-center gap-1 text-amber-600">
                     <Clock size={16}/> {tenancy.payment_due_day}th
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Deposit</p>
                  <p className="font-bold text-gray-900">
                    ₹{tenancy.deposit_amount?.toLocaleString()}
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

      {/* Right Sidebar: Quick Stats */}
      <div className="space-y-6">
        <div className="bg-[#408A71] bg-opacity-10 rounded-3xl p-6 border border-[#408A71] border-opacity-20 sticky top-28">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Portfolio Outlook</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
              <span className="text-gray-600 font-semibold text-sm uppercase tracking-wide">Active Tenants</span>
              <span className="text-2xl font-black text-[#408A71]">{tenancies.filter(t => t.status==='active').length}</span>
            </div>
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
              <span className="text-gray-600 font-semibold text-sm uppercase tracking-wide">Pending Invites</span>
              <span className="text-xl font-bold text-amber-500">{tenancies.filter(t => t.status==='pending').length}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-900 p-4 rounded-xl shadow-md border border-gray-800">
              <span className="text-gray-300 font-semibold text-sm uppercase tracking-wide">Est. Monthly</span>
              <span className="text-xl font-black text-white tracking-tight">
                ₹{tenancies.reduce((acc, curr) => acc + (curr.rent_amount || 0), 0).toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="mt-8">
            <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
              <AlertCircle size={16}/> Payments Overview
            </h4>
            {(() => {
              const today = new Date();
              const overdueList = tenancies.filter(t => {
                if (t.status !== 'active') return false;
                const dueDay = t.payment_due_day || 1;
                return today.getDate() > dueDay;
              });
              if (overdueList.length === 0) {
                return (
                  <div className="bg-white p-4 rounded-xl shadow-sm flex items-start gap-3 border-l-4 border-green-500">
                    <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">All Up to Date</p>
                      <p className="text-xs text-gray-500 mt-0.5">No overdue rent this month.</p>
                    </div>
                  </div>
                );
              }
              return (
                <div className="space-y-3">
                  {overdueList.map(t => (
                    <div key={t.id} className="bg-white p-4 rounded-xl shadow-sm flex items-start gap-3 border-l-4 border-amber-500">
                      <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Overdue Payment</p>
                        <p className="text-xs text-gray-600 mt-0.5 font-medium">{t.tenant_name}&apos;s rent (₹{t.rent_amount}) was due on the {t.payment_due_day}th.</p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function TenanciesDashboard() {
  const { userProfile, user, loading: authLoading } = useAuth();
  
  const [tenancies, setTenancies] = useState<Tenancy[]>([]);
  const [propertyMap, setPropertyMap] = useState<Record<string, Property>>({});
  const [loading, setLoading] = useState(true);
  const [viewModeOverride, setViewModeOverride] = useState<'tenant' | 'owner' | null>(null);

  // Derive active view mode based on explicit toggle, or fallback to profile role
  const isTenant = viewModeOverride !== null ? viewModeOverride === 'tenant' : userProfile?.role === 'tenant';

  useEffect(() => {
    if (authLoading) return; // Wait for auth to settle (either logged in or anonymous)

    const fetchData = async () => {
      try {
        let fetchedTenancies: Tenancy[] = [];
        let fetchedProps: Property[] = [];
        
        // If it's the unauthenticated MVP demo, completely skip Firebase network roundtrips for zero latency!
        if (!user?.uid) {
          if (isTenant) {
            fetchedTenancies = await tenancyService.getTenanciesByTenant("demo_user"); // Has internal network query, but we can bypass it
          } else {
            fetchedTenancies = await tenancyService.getTenanciesByOwner("demo_user");
          }
          // Remove the slow property fetch for MVP presentation
          fetchedProps = []; 
        } else {
          // Authorized User - Fetch Real Data
          if (isTenant) {
            fetchedTenancies = await tenancyService.getTenanciesByTenant(user.uid);
          } else {
            fetchedTenancies = await tenancyService.getTenanciesByOwner(user.uid);
          }
          fetchedProps = await propertyService.getProperties(isTenant ? {} : { ownerId: user.uid });
        }
        
        // Optionally fetch properties (mocked map for now mostly relying on fallback UI strings if DB empty)
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
  }, [user, isTenant, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#408A71] mb-4" size={48} />
        <p className="text-gray-500 font-semibold">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Universal Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Tenancy Management</h1>
               <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isTenant ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                 {isTenant ? 'Tenant View' : 'Manager View'}
               </span>
            </div>
            <p className="text-gray-500 text-lg mb-4">
              {isTenant 
                ? "Manage your active rentals, track upcoming payments, and sign agreements." 
                : "Manage your active tenants, digital agreements, and track payments."}
            </p>
            
            {/* Demo Toggle */}
            <div className="flex items-center gap-3 bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm w-max">
              <button 
                onClick={() => setViewModeOverride('tenant')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isTenant ? 'bg-purple-50 text-purple-700' : 'hover:bg-gray-50 text-gray-500'}`}
              >
                <Home size={16} /> Tenant View
              </button>
              <button 
                onClick={() => setViewModeOverride('owner')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${!isTenant ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-500'}`}
              >
                <Building size={16} /> Owner View
              </button>
            </div>
          </div>
          {!isTenant && (
            <Link href="/post" className="shrink-0 bg-[#408A71] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[#34745c] transition-colors hidden md:block">
              List New Property
            </Link>
          )}
        </div>

        {/* Dynamic Role Render */}
        {isTenant ? (
          <TenantDashboard tenancies={tenancies} propertyMap={propertyMap} loading={loading} trustScore={userProfile.trustScore || 650} />
        ) : (
          <OwnerDashboard tenancies={tenancies} propertyMap={propertyMap} loading={loading} />
        )}

      </div>
    </div>
  );
}
