"use client";

import { use } from "react";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, UserPlus, FileText, Calendar, IndianRupee, Bell, AlertTriangle, ShieldCheck } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { tenancyService } from "../../../../lib/tenancyService";

export default function CreateTenancyPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const { user, userProfile } = useAuth();
  const router = useRouter();

  // Mock property data
  const propertyRent = 12000 + Number(id) * 2000;
  const propertyTitle = `Modern Serenity Appt ${id}`;

  const [formData, setFormData] = useState({
    tenantName: "",
    tenantPhone: "",
    tenantEmail: "",
    rentAmount: propertyRent.toString(),
    depositAmount: (propertyRent * 3).toString(),
    startDate: "",
    endDate: "",
    paymentDueDay: "5",
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile || !user) return;
    
    setIsSubmitting(true);
    try {
      await tenancyService.createTenancy({
        property_id: id,
        owner_id: user.uid,
        created_by_user: user.uid,
        tenant_name: formData.tenantName,
        tenant_phone: formData.tenantPhone,
        tenant_email: formData.tenantEmail,
        rent_amount: Number(formData.rentAmount),
        deposit_amount: Number(formData.depositAmount),
        start_date: formData.startDate,
        end_date: formData.endDate,
        payment_due_day: Number(formData.paymentDueDay),
        notes: formData.notes
      });
      router.push('/tenancies');
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!userProfile || !['owner', 'agent', 'builder'].includes(userProfile.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
          <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-500">Only authorized property posters can create a tenancy.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        <Link href={`/properties/${id}`} className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#408A71] transition-colors mb-6">
          <ChevronLeft size={18} className="mr-1" /> Back to Property
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Create Tenancy Agreement</h1>
          <p className="text-gray-500 text-lg">Set up a digital tenancy for <strong className="text-gray-700">{propertyTitle}</strong>.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Tenant Details */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
              <UserPlus className="text-[#408A71]" size={24} /> 1. Tenant Information
            </h2>
            <p className="text-sm text-gray-500 mb-6 border-l-4 border-[#408A71] pl-4 bg-green-50/50 py-2">
              If the tenant doesn&apos;t have an account yet, a pending profile will be created and an invite link sent to them.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tenant Full Name <span className="text-red-500">*</span></label>
                <input required type="text" name="tenantName" value={formData.tenantName} onChange={handleChange} placeholder="e.g. John Doe" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 outline-none focus:bg-white focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tenant Phone <span className="text-red-500">*</span></label>
                <input required type="tel" name="tenantPhone" value={formData.tenantPhone} onChange={handleChange} placeholder="+91 00000 00000" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 outline-none focus:bg-white focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71] transition-all" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tenant Email <span>(Optional)</span></label>
                <input type="email" name="tenantEmail" value={formData.tenantEmail} onChange={handleChange} placeholder="Required for digital agreement signing" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 outline-none focus:bg-white focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71] transition-all" />
              </div>
            </div>
          </div>

          {/* Lease Details */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
              <FileText className="text-[#408A71]" size={24} /> 2. Lease Financials & Terms
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Rent (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="number" name="rentAmount" value={formData.rentAmount} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-9 p-3 outline-none focus:bg-white focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71] transition-all font-semibold" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Security Deposit (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="number" name="depositAmount" value={formData.depositAmount} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-9 p-3 outline-none focus:bg-white focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71] transition-all font-semibold" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-9 p-3 outline-none focus:bg-white focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71] transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-9 p-3 outline-none focus:bg-white focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71] transition-all" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Due Day <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Bell size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="number" min="1" max="31" name="paymentDueDay" value={formData.paymentDueDay} onChange={handleChange} placeholder="e.g. 5 for 5th of every month" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-9 p-3 outline-none focus:bg-white focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71] transition-all" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Rent will be due on the {formData.paymentDueDay || 'X'}th of every month.</p>
              </div>

              <div className="md:col-span-2">
                 <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes <span>(Optional)</span></label>
                 <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 outline-none focus:bg-white focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71] transition-all" placeholder="Any specific terms discussed with the tenant..." />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 pt-4">
             <button disabled={isSubmitting} type="submit" className="w-full sm:w-auto bg-[#408A71] hover:bg-[#34745c] text-white px-12 py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-lg">
               {isSubmitting ? "Creating Tenancy..." : <><ShieldCheck size={20}/> Submit Tenancy Record</>}
             </button>
             <p className="text-sm text-gray-500 text-center max-w-lg">
               By clicking submit, the tenant will receive an SMS/Email to accept the tenancy invite and digitize the agreement process.
             </p>
          </div>

        </form>
      </div>
    </div>
  );
}
