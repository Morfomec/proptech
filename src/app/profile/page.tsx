"use client";

import { useAuth, ProfileRole } from "@/context/AuthContext";
import { CheckCircle2, Circle, ShieldCheck, Phone, IdCard, Building, User as UserIcon, MapPin, Briefcase, Globe, Mail, Link as LinkIcon, Edit3, Activity, TrendingUp, TrendingDown, Star } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { user, userProfile, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    role: "owner" as ProfileRole,
    name: "",
    email: "",
    phone: "",
    city: "",
    profilePhoto: "",
    agencyName: "",
    officeAddress: "",
    licenseRera: "",
    companyName: "",
    website: "",
    gstNumber: "",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (userProfile && user) {
      setTimeout(() => {
        setFormData({
          role: userProfile.role || "owner",
          name: userProfile.name || user.displayName || "",
          email: userProfile.email || user.email || "",
          phone: userProfile.phone || "",
          city: userProfile.city || "",
          profilePhoto: userProfile.profilePhoto || "",
          agencyName: userProfile.agencyName || "",
          officeAddress: userProfile.officeAddress || "",
          licenseRera: userProfile.licenseRera || "",
          companyName: userProfile.companyName || "",
          website: userProfile.website || "",
          gstNumber: userProfile.gstNumber || "",
        });
      }, 0);
    }
  }, [userProfile, user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex flex-col items-center justify-center px-6">
        <UserIcon size={64} className="text-gray-300 mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h1>
        <p className="text-gray-500 mb-8 max-w-md text-center">You must be logged in to view and edit your profile.</p>
        <Link href="/login" className="bg-[#408A71] text-white px-8 py-3 rounded-full font-bold hover:bg-[#34745c] transition-colors">
          Go to Login
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRole = (role: ProfileRole) => {
    setFormData({ ...formData, role });
    updateUserProfile({ role });
  };

  const handleSaveProfile = () => {
    setSaving(true);
    setTimeout(() => {
      updateUserProfile(formData);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 600);
  };

  // Trust Score Helpers
  const getScoreCategory = (score: number) => {
    if (score >= 800) return { label: "Excellent", color: "text-emerald-600", bg: "bg-emerald-100", stroke: "text-emerald-500" };
    if (score >= 700) return { label: "Good", color: "text-blue-600", bg: "bg-blue-100", stroke: "text-blue-500" };
    if (score >= 600) return { label: "Average", color: "text-yellow-600", bg: "bg-yellow-100", stroke: "text-yellow-500" };
    return { label: "Risky", color: "text-red-600", bg: "bg-red-100", stroke: "text-red-500" };
  };

  const handleScoreEvent = (reason: string, change: number) => {
    const currentScore = userProfile.trustScore ?? 600;
    
    let newScore = currentScore + change;
    if (newScore > 900) newScore = 900;
    if (newScore < 300) newScore = 300;

    const newActivity = {
      id: Date.now().toString(),
      reason,
      change,
      timestamp: new Date().toISOString()
    };

    updateUserProfile({
      trustScore: newScore,
      scoreActivity: [newActivity, ...(userProfile.scoreActivity || [])].slice(0, 10)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 text-left">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Profile Setup</h1>

        {/* Role Selector */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
          <h2 className="text-xl font-bold text-gray-900 mb-4">I am operating as:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setRole("owner")}
              className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${formData.role === "owner" ? "border-[#408A71] bg-green-50/50" : "border-gray-100 bg-white hover:border-gray-200"}`}
            >
              <UserIcon size={32} className={formData.role === "owner" ? "text-[#408A71]" : "text-gray-400"} />
              <span className={`font-bold ${formData.role === "owner" ? "text-gray-900" : "text-gray-600"}`}>Owner / Individual</span>
            </button>
            <button
              onClick={() => setRole("agent")}
              className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${formData.role === "agent" ? "border-[#408A71] bg-green-50/50" : "border-gray-100 bg-white hover:border-gray-200"}`}
            >
              <Briefcase size={32} className={formData.role === "agent" ? "text-[#408A71]" : "text-gray-400"} />
              <span className={`font-bold ${formData.role === "agent" ? "text-gray-900" : "text-gray-600"}`}>Agent / Broker</span>
            </button>
            <button
              onClick={() => setRole("builder")}
              className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${formData.role === "builder" ? "border-[#408A71] bg-green-50/50" : "border-gray-100 bg-white hover:border-gray-200"}`}
            >
              <Building size={32} className={formData.role === "builder" ? "text-[#408A71]" : "text-gray-400"} />
              <span className={`font-bold ${formData.role === "builder" ? "text-gray-900" : "text-gray-600"}`}>Builder / Developer</span>
            </button>
          </div>
        </div>

        {/* Dynamic Profile Information */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
            <Edit3 className="text-[#408A71]" size={28} />
            Profile Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Common Name & Email & Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <UserIcon size={16} className="text-gray-400" /> Full Name
              </label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="First & Last Name" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71]" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail size={16} className="text-gray-400" /> Email Address
              </label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="hello@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71]" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Phone size={16} className="text-gray-400" /> Phone Number
              </label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 00000 00000" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71]" />
            </div>

            {/* Role Specific Fields */}
            {formData.role === "owner" && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MapPin size={16} className="text-gray-400" /> City
                </label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Kozhikode" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71]" />
              </div>
            )}

            {formData.role === "agent" && (
              <>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Briefcase size={16} className="text-gray-400" /> Agency Name
                  </label>
                  <input type="text" name="agencyName" value={formData.agencyName} onChange={handleChange} placeholder="Your Agency Name" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71]" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={16} className="text-gray-400" /> Office Address
                  </label>
                  <input type="text" name="officeAddress" value={formData.officeAddress} onChange={handleChange} placeholder="Full Address" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71]" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <ShieldCheck size={16} className="text-gray-400" /> License / RERA Number
                  </label>
                  <input type="text" name="licenseRera" value={formData.licenseRera} onChange={handleChange} placeholder="Optional" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71]" />
                </div>
              </>
            )}

            {formData.role === "builder" && (
              <>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Building size={16} className="text-gray-400" /> Company Name
                  </label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="E.g. Sobha Developers" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71]" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <LinkIcon size={16} className="text-gray-400" /> Website Link
                  </label>
                  <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71]" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={16} className="text-gray-400" /> Office Address
                  </label>
                  <input type="text" name="officeAddress" value={formData.officeAddress} onChange={handleChange} placeholder="Corporate Address" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71]" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <ShieldCheck size={16} className="text-gray-400" /> RERA Number
                  </label>
                  <input type="text" name="licenseRera" value={formData.licenseRera} onChange={handleChange} placeholder="RERA ID" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71]" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Globe size={16} className="text-gray-400" /> GST Number
                  </label>
                  <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="GST ID" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71]" />
                </div>
              </>
            )}

            <div className="md:col-span-2 pt-4">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-[#408A71] hover:bg-[#34745c] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
              >
                {saving ? "Saving..." : "Save Profile Details"}
              </button>
              {saved && <span className="ml-4 text-green-600 font-semibold text-sm">Profile saved successfully!</span>}
            </div>
          </div>
        </div>

        {/* Trust Score Section (MVP Demo) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 border-r border-gray-100 pr-0 md:pr-8 flex flex-col items-center md:items-start">
               <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <Star className="text-yellow-500" size={28} />
                Trust Score
              </h2>
              
              <div className="flex flex-col items-center w-full">
                <div className="relative w-48 h-48 mb-4">
                  <div className="w-full h-full rounded-full flex items-center justify-center relative">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                       <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                       <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                           strokeDasharray={2 * Math.PI * 88} 
                           strokeDashoffset={2 * Math.PI * 88 * (1 - ((userProfile.trustScore ?? 600) - 300) / 600)} 
                           className={`${getScoreCategory(userProfile.trustScore ?? 600).stroke} transition-all duration-1000 ease-out`} 
                           strokeLinecap="round" />
                    </svg>
                    <div className="text-center z-10 flex flex-col items-center">
                      <span className="text-5xl font-extrabold text-gray-900 leading-none">{userProfile.trustScore ?? 600}</span>
                      <span className="block text-sm font-semibold text-gray-400 mt-1">out of 900</span>
                    </div>
                  </div>
                </div>
                
                <div className={`px-5 py-2 rounded-full text-sm font-extrabold ${getScoreCategory(userProfile.trustScore ?? 600).bg} ${getScoreCategory(userProfile.trustScore ?? 600).color}`}>
                  {getScoreCategory(userProfile.trustScore ?? 600).label}
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Demo Simulator Actions</h3>
               <div className="flex flex-wrap gap-2 mb-8">
                 {userProfile.role === 'owner' || userProfile.role === 'agent' || userProfile.role === 'builder' ? (
                   <>
                     <button onClick={() => handleScoreEvent("Quick Response", 10)} className="text-xs font-semibold px-3 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 shadow-sm transition-colors">Quick Response (+10)</button>
                     <button onClick={() => handleScoreEvent("Positive Interaction", 10)} className="text-xs font-semibold px-3 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 shadow-sm transition-colors">Pos. Interaction (+10)</button>
                     <button onClick={() => handleScoreEvent("No/Poor Response", -20)} className="text-xs font-semibold px-3 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 shadow-sm transition-colors">No Response (-20)</button>
                     <button onClick={() => handleScoreEvent("Complaint Raised", -30)} className="text-xs font-semibold px-3 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 shadow-sm transition-colors">Complaint (-30)</button>
                   </>
                 ) : (
                   <>
                     <button onClick={() => handleScoreEvent("Early Rent Payment", 25)} className="text-xs font-semibold px-3 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 shadow-sm transition-colors">Paid Early (+25)</button>
                     <button onClick={() => handleScoreEvent("On-time Rent Payment", 15)} className="text-xs font-semibold px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 hover:bg-emerald-100 shadow-sm transition-colors">Paid On-time (+15)</button>
                     <button onClick={() => handleScoreEvent("Late Rent Payment", -20)} className="text-xs font-semibold px-3 py-2 bg-orange-50 text-orange-700 rounded-lg border border-orange-200 hover:bg-orange-100 shadow-sm transition-colors">Paid Late (-20)</button>
                     <button onClick={() => handleScoreEvent("Missed Rent Payment", -50)} className="text-xs font-semibold px-3 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 shadow-sm transition-colors">Missed Payment (-50)</button>
                   </>
                 )}
               </div>

               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                 <Activity size={16} /> Recent Activity
               </h3>
               
               <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                 {!(userProfile.scoreActivity && userProfile.scoreActivity.length > 0) ? (
                    <p className="text-sm text-gray-500 italic">No recent score activity. Complete actions to build your trust score.</p>
                 ) : (
                    userProfile.scoreActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{activity.reason}</p>
                          <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                        </div>
                        <div className={`font-bold flex items-center gap-1 ${activity.change > 0 ? "text-green-600" : "text-red-600"}`}>
                           {activity.change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                           {activity.change > 0 ? "+" : ""}{activity.change}
                        </div>
                      </div>
                    ))
                 )}
               </div>
            </div>
          </div>
        </div>

        {/* Verification Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
              <ShieldCheck className="text-[#408A71]" size={28} />
              Identity & Business Verification
            </h2>
            <p className="text-gray-500 mb-8">
              Complete verifications to unlock more listing capabilities and earn trusted badges.
            </p>

            <div className="space-y-4">
              {/* Phone Verification - applies to everyone */}
              <div className={`flex items-center justify-between p-5 rounded-xl border ${userProfile.phoneVerified ? 'bg-green-50/50 border-green-100' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    {userProfile.phoneVerified ? <CheckCircle2 className="text-green-500" size={24} /> : <Circle className="text-gray-300" size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Phone size={18} className="text-gray-400" /> Phone OTP Verification
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Required to post any properties.</p>
                  </div>
                </div>
                {!userProfile.phoneVerified && (
                  <button onClick={() => updateUserProfile({ phoneVerified: true })} className="shrink-0 bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    Get OTP
                  </button>
                )}
              </div>

              {/* Roles that need ID Verification */}
              {(userProfile.role === "owner" || userProfile.role === "agent") && (
                <div className={`flex items-center justify-between p-5 rounded-xl border ${userProfile.idVerified ? 'bg-green-50/50 border-green-100' : 'bg-white border-gray-100 shadow-sm'} ${!userProfile.phoneVerified && 'opacity-60 grayscale'}`}>
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5">
                      {userProfile.idVerified ? <CheckCircle2 className="text-green-500" size={24} /> : <Circle className="text-gray-300" size={24} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <IdCard size={18} className="text-gray-400" /> Personal ID Proof
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Optional. Unlocks verified badge.</p>
                    </div>
                  </div>
                  {!userProfile.idVerified && (
                    <button onClick={() => updateUserProfile({ idVerified: true })} disabled={!userProfile.phoneVerified} className="shrink-0 bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
                      Upload
                    </button>
                  )}
                </div>
              )}

              {/* Owner Specific */}
              {userProfile.role === "owner" && (
                <div className={`flex items-center justify-between p-5 rounded-xl border ${userProfile.propertyProofVerified ? 'bg-green-50/50 border-green-100' : 'bg-white border-gray-100 shadow-sm'} ${!userProfile.idVerified && 'opacity-60 grayscale'}`}>
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5">
                      {userProfile.propertyProofVerified ? <CheckCircle2 className="text-green-500" size={24} /> : <Circle className="text-gray-300" size={24} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Building size={18} className="text-gray-400" /> Property Proof
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Optional. Establish genuine ownership.</p>
                    </div>
                  </div>
                  {!userProfile.propertyProofVerified && (
                    <button onClick={() => updateUserProfile({ propertyProofVerified: true })} disabled={!userProfile.idVerified} className="shrink-0 bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
                      Upload
                    </button>
                  )}
                </div>
              )}

              {/* Agent Specific */}
              {userProfile.role === "agent" && (
                <div className={`flex items-center justify-between p-5 rounded-xl border ${userProfile.agencyProofVerified ? 'bg-green-50/50 border-green-100' : 'bg-white border-gray-100 shadow-sm'} ${!userProfile.idVerified && 'opacity-60 grayscale'}`}>
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5">
                      {userProfile.agencyProofVerified ? <CheckCircle2 className="text-green-500" size={24} /> : <Circle className="text-gray-300" size={24} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Briefcase size={18} className="text-gray-400" /> Agency Proof
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Required for featured listings & broker verification.</p>
                    </div>
                  </div>
                  {!userProfile.agencyProofVerified && (
                    <button onClick={() => updateUserProfile({ agencyProofVerified: true })} disabled={!userProfile.idVerified} className="shrink-0 bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
                      Verify
                    </button>
                  )}
                </div>
              )}

              {/* Builder Specific */}
              {userProfile.role === "builder" && (
                <>
                  <div className={`flex items-center justify-between p-5 rounded-xl border ${userProfile.companyProofVerified ? 'bg-green-50/50 border-green-100' : 'bg-white border-gray-100 shadow-sm'} ${!userProfile.phoneVerified && 'opacity-60 grayscale'}`}>
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5">
                        {userProfile.companyProofVerified ? <CheckCircle2 className="text-green-500" size={24} /> : <Circle className="text-gray-300" size={24} />}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          <Building size={18} className="text-gray-400" /> Company Details Proof
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Optional. Get verified company page.</p>
                      </div>
                    </div>
                    {!userProfile.companyProofVerified && (
                      <button onClick={() => updateUserProfile({ companyProofVerified: true })} disabled={!userProfile.phoneVerified} className="shrink-0 bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
                        Upload
                      </button>
                    )}
                  </div>

                  <div className={`flex items-center justify-between p-5 rounded-xl border ${userProfile.reraVerified ? 'bg-green-50/50 border-green-100' : 'bg-white border-gray-100 shadow-sm'} ${!userProfile.phoneVerified && 'opacity-60 grayscale'}`}>
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5">
                        {userProfile.reraVerified ? <CheckCircle2 className="text-green-500" size={24} /> : <Circle className="text-gray-300" size={24} />}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          <ShieldCheck size={18} className="text-gray-400" /> Developer RERA
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Optional. Official developer recognition.</p>
                      </div>
                    </div>
                    {!userProfile.reraVerified && (
                      <button onClick={() => updateUserProfile({ reraVerified: true })} disabled={!userProfile.phoneVerified} className="shrink-0 bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
                        Verify
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
