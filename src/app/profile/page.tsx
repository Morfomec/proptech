"use client";

import { useAuth, ProfileRole, getVerificationBadge } from "@/context/AuthContext";
import { CheckCircle2, Circle, ShieldCheck, Phone, IdCard, Building, User as UserIcon, MapPin, Briefcase, Globe, Mail, Link as LinkIcon, Edit3, Activity, TrendingUp, TrendingDown, Star, ChevronDown, Lock, Shield, Key } from "lucide-react";
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
          role: userProfile.role || "tenant",
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
    let currentStreak = userProfile.onTimeStreak ?? 0;
    let applyBonus = false;

    // Apply streak logic rules
    if (reason === "Early Rent Payment" || reason === "On-time Rent Payment") {
      currentStreak += 1;
    } else if (reason === "Late Rent Payment" || reason === "Missed Rent Payment") {
      currentStreak = 0;
    }

    if (currentStreak === 3) {
      applyBonus = true;
      currentStreak = 0;
    }
    
    if (applyBonus) {
      newScore += 25;
    }

    if (newScore > 900) newScore = 900;
    if (newScore < 300) newScore = 300;

    const newActivity = {
      id: Date.now().toString(),
      reason: `${reason} ${applyBonus ? '+ Streak Bonus!' : ''}`,
      change: change + (applyBonus ? 25 : 0),
      timestamp: new Date().toISOString()
    };

    updateUserProfile({
      trustScore: newScore,
      onTimeStreak: currentStreak,
      scoreActivity: [newActivity, ...(userProfile.scoreActivity || [])].slice(0, 10)
    });
  };

  const getVerificationProgress = () => {
    if (!userProfile) return 0;
    let completed = 0;
    let total = 2; // Phone and ID
    if (userProfile.phoneVerified) completed++;
    if (userProfile.idVerified) completed++;

    if (userProfile.role === 'owner') {
      total += 1;
      if (userProfile.propertyProofVerified) completed++;
    } else if (userProfile.role === 'agent') {
      total += 1;
      if (userProfile.agencyProofVerified) completed++;
    } else if (userProfile.role === 'builder') {
      total += 2;
      if (userProfile.companyProofVerified) completed++;
      if (userProfile.reraVerified) completed++;
    }

    return Math.round((completed / total) * 100);
  };
  const progressPercent = getVerificationProgress();
  const progressColor = progressPercent < 50 ? "bg-red-500" : progressPercent < 100 ? "bg-amber-500" : "bg-[#408A71]";

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 text-left">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Profile Setup</h1>

        {/* Role Selector */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
          <h2 className="text-xl font-bold text-gray-900 mb-4">I am operating as:</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setRole("tenant")}
              className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${formData.role === "tenant" ? "border-[#408A71] bg-green-50/50" : "border-gray-100 bg-white hover:border-gray-200"}`}
            >
              <Key size={32} className={formData.role === "tenant" ? "text-[#408A71]" : "text-gray-400"} />
              <span className={`font-bold text-sm text-center ${formData.role === "tenant" ? "text-gray-900" : "text-gray-600"}`}>Tenant / Renter</span>
            </button>
            <button
              onClick={() => setRole("owner")}
              className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${formData.role === "owner" ? "border-[#408A71] bg-green-50/50" : "border-gray-100 bg-white hover:border-gray-200"}`}
            >
              <UserIcon size={32} className={formData.role === "owner" ? "text-[#408A71]" : "text-gray-400"} />
              <span className={`font-bold text-sm text-center ${formData.role === "owner" ? "text-gray-900" : "text-gray-600"}`}>Owner / Individual</span>
            </button>
            <button
              onClick={() => setRole("agent")}
              className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${formData.role === "agent" ? "border-[#408A71] bg-green-50/50" : "border-gray-100 bg-white hover:border-gray-200"}`}
            >
              <Briefcase size={32} className={formData.role === "agent" ? "text-[#408A71]" : "text-gray-400"} />
              <span className={`font-bold text-sm text-center ${formData.role === "agent" ? "text-gray-900" : "text-gray-600"}`}>Agent / Broker</span>
            </button>
            <button
              onClick={() => setRole("builder")}
              className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${formData.role === "builder" ? "border-[#408A71] bg-green-50/50" : "border-gray-100 bg-white hover:border-gray-200"}`}
            >
              <Building size={32} className={formData.role === "builder" ? "text-[#408A71]" : "text-gray-400"} />
              <span className={`font-bold text-sm text-center ${formData.role === "builder" ? "text-gray-900" : "text-gray-600"}`}>Builder / Developer</span>
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
               <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                <Star className="text-yellow-500" size={28} />
                Manage & Improve Your Score
              </h2>
              <p className="text-sm text-gray-500 mb-6 font-medium">Dashboard & History</p>
              
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
                      <span className="text-5xl font-extrabold text-gray-900 leading-none">{userProfile.trustScore ?? 550}</span>
                      <span className="block text-sm font-semibold text-gray-400 mt-1">out of 900</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <div className={`px-5 py-2 rounded-full text-sm font-extrabold ${getScoreCategory(userProfile.trustScore ?? 550).bg} ${getScoreCategory(userProfile.trustScore ?? 550).color}`}>
                    {getScoreCategory(userProfile.trustScore ?? 550).label}
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm flex items-center gap-1.5 font-bold border shadow-sm ${getVerificationBadge(userProfile.level, userProfile.role).bg}`}>
                    <span>{getVerificationBadge(userProfile.level, userProfile.role).icon}</span>
                    {getVerificationBadge(userProfile.level, userProfile.role).label}
                  </div>
                </div>
                <span className="block text-xs font-semibold text-gray-400 mt-3">Last updated: This month</span>
                
                {(userProfile.role === 'owner' || userProfile.role === 'agent' || userProfile.role === 'builder') ? null : (
                  (userProfile.onTimeStreak ?? 0) > 0 && (
                    <span className="text-xs font-bold text-orange-500 flex items-center justify-center gap-1 mt-2">
                       🔥 Streak: {userProfile.onTimeStreak}/3
                    </span>
                  )
                )}
              </div>

              <div className="mt-8 bg-blue-50/50 p-4 rounded-xl border border-blue-100 w-full hidden md:block">
                <h4 className="text-sm font-bold text-blue-900 mb-2">Tips to Improve</h4>
                <ul className="text-xs text-blue-800 space-y-1.5 list-disc pl-4 font-medium">
                  {userProfile.role === 'owner' || userProfile.role === 'agent' || userProfile.role === 'builder' ? (
                     <li>Respond quickly to queries and leads</li>
                  ) : (
                     <li>Pay your rent on time to securely increase score</li>
                  )}
                  <li>Maintain a complete and verified profile</li>
                  <li>Avoid unresolved complaints or flags</li>
                </ul>
              </div>
            </div>
            
            <div className="md:w-2/3 flex flex-col">
               <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                 <Activity size={16} className="text-[#408A71]" /> Score History & Breakdown
               </h3>
               
               <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar mb-8 flex-1">
                 {!(userProfile.scoreActivity && userProfile.scoreActivity.length > 0) ? (
                    <p className="text-sm text-gray-500 italic">No score history. Your breakdown will appear here once activities occur.</p>
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

               <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-5 mt-auto">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Simulate Trust Impact (Demo Mode)</h3>
                 <div className="flex flex-wrap gap-2">
                   {userProfile.role === 'owner' || userProfile.role === 'agent' || userProfile.role === 'builder' ? (
                     <>
                       <button onClick={() => handleScoreEvent("Quick Response", 10)} className="text-xs font-semibold px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 shadow-sm transition-colors">Quick Response (+10)</button>
                       <button onClick={() => handleScoreEvent("Positive Interaction", 10)} className="text-xs font-semibold px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 shadow-sm transition-colors">Pos. Interaction (+10)</button>
                       <button onClick={() => handleScoreEvent("No/Poor Response", -20)} className="text-xs font-semibold px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 shadow-sm transition-colors">No Response (-20)</button>
                       <button onClick={() => handleScoreEvent("Complaint Raised", -30)} className="text-xs font-semibold px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 shadow-sm transition-colors">Complaint (-30)</button>
                     </>
                   ) : (
                     <>
                       <button onClick={() => handleScoreEvent("Early Rent Payment", 20)} className="text-xs font-semibold px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 shadow-sm transition-colors">Paid Early (+20)</button>
                       <button onClick={() => handleScoreEvent("On-time Rent Payment", 10)} className="text-xs font-semibold px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 shadow-sm transition-colors">Paid On-time (+10)</button>
                       <button onClick={() => handleScoreEvent("Late Rent Payment", -25)} className="text-xs font-semibold px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 shadow-sm transition-colors">Paid Late (-25)</button>
                       <button onClick={() => handleScoreEvent("Missed Rent Payment", -50)} className="text-xs font-semibold px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 shadow-sm transition-colors">Missed Payment (-50)</button>
                     </>
                   )}
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Verification Section */}
        <div className="bg-gray-900 rounded-[2rem] shadow-xl p-1 mb-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#408A71]/20 to-blue-500/20 opacity-50 transition-opacity group-hover:opacity-100" />
          
          <div className="bg-white rounded-[1.9rem] p-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3 mb-2 tracking-tight">
                  <Shield size={32} className="text-[#408A71]" />
                  Trust & Verification Center
                </h2>
                <p className="text-gray-500 font-medium">Complete verifications to securely unlock listing capabilities.</p>
              </div>

              {/* Progress Ring / Bar */}
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 shrink-0 border border-gray-100 shadow-inner">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Progress</span>
                  <span className="text-2xl font-black text-gray-900">{progressPercent}%</span>
                </div>
                <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${progressColor} transition-all duration-1000 rounded-full`} style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Phone Verification */}
              <details className="group bg-white border border-gray-200 rounded-2xl shadow-sm open:shadow-md transition-all outline-none overflow-hidden" open={!userProfile.phoneVerified}>
                <summary className="flex items-center justify-between p-5 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden bg-gray-50/50 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 p-2 rounded-xl bg-white shadow-sm border border-gray-100">
                       <Phone size={24} className={userProfile.phoneVerified ? "text-[#408A71]" : "text-gray-400"} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                         <h3 className="font-bold text-gray-900 text-lg">Phone Verification</h3>
                         {userProfile.phoneVerified && <div className="text-[10px] font-bold text-[#408A71] bg-green-100 px-2 py-0.5 rounded uppercase tracking-wider">Verified</div>}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">Required base security layer</p>
                    </div>
                  </div>
                  <ChevronDown className="text-gray-400 group-open:-rotate-180 transition-transform duration-300" />
                </summary>
                <div className="p-5 pt-2 border-t border-gray-100 bg-white flex flex-col md:flex-row md:items-end justify-between gap-6">
                   <div className="max-w-xl">
                      <p className="text-sm text-gray-600 mb-4">We use OTP verification to ensure you have a valid communication channel. This helps eliminate bots and creates a secure environment for property interactions.</p>
                      <div className="flex gap-2">
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">Unlocks: View Listings</span>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">Unlocks: Post 2 Properties</span>
                      </div>
                   </div>
                   {!userProfile.phoneVerified ? (
                     <button onClick={() => updateUserProfile({ phoneVerified: true })} className="shrink-0 bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition-colors shadow-md w-full md:w-auto">
                       Send OTP
                     </button>
                   ) : (
                     <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-5 py-3 rounded-xl border border-green-100">
                       <CheckCircle2 size={20} /> Phone Secured
                     </div>
                   )}
                </div>
              </details>

              {/* ID Verification */}
              <details className="group bg-white border border-gray-200 rounded-2xl shadow-sm open:shadow-md transition-all outline-none overflow-hidden" open={userProfile.phoneVerified && !userProfile.idVerified}>
                <summary className={`flex items-center justify-between p-5 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden ${!userProfile.phoneVerified ? "opacity-50 grayscale pointer-events-none bg-gray-100" : "bg-gray-50/50 hover:bg-gray-50"}`}>
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 p-2 rounded-xl bg-white shadow-sm border border-gray-100 relative">
                       {!userProfile.phoneVerified && <div className="absolute -top-2 -right-2 bg-gray-600 rounded-full p-1 text-white shadow"><Lock size={12} /></div>}
                       <IdCard size={24} className={userProfile.idVerified ? "text-[#408A71]" : "text-gray-400"} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                         <h3 className="font-bold text-gray-900 text-lg">Identity Verification</h3>
                         {userProfile.idVerified && <div className="text-[10px] font-bold text-[#408A71] bg-green-100 px-2 py-0.5 rounded uppercase tracking-wider">Verified</div>}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">Government ID & Liveness Check</p>
                    </div>
                  </div>
                  <ChevronDown className="text-gray-400 group-open:-rotate-180 transition-transform duration-300" />
                </summary>
                <div className="p-5 pt-2 border-t border-gray-100 bg-white flex flex-col md:flex-row md:items-end justify-between gap-6">
                   <div className="max-w-xl">
                      <p className="text-sm text-gray-600 mb-4">We ask for a valid Government ID (Aadhar, PAN) matched against a quick live selfie. Your data is processed with <span className="font-bold text-gray-800">Bank-grade encryption</span> and is never shared.</p>
                      <div className="flex gap-2">
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">Unlocks: 'Verified' Badge</span>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">Unlocks: 5 Listings total</span>
                      </div>
                   </div>
                   {!userProfile.idVerified ? (
                     <button onClick={() => updateUserProfile({ idVerified: true })} disabled={!userProfile.phoneVerified} className="shrink-0 bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition-colors shadow-md w-full md:w-auto flex items-center justify-center gap-2">
                       <ShieldCheck size={18} /> Start ID Check
                     </button>
                   ) : (
                     <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-5 py-3 rounded-xl border border-green-100">
                       <CheckCircle2 size={20} /> Verified ID
                     </div>
                   )}
                </div>
              </details>

              {/* Owner Specific */}
              {userProfile.role === "owner" && (
                <details className="group bg-white border border-gray-200 rounded-2xl shadow-sm open:shadow-md transition-all outline-none overflow-hidden" open={userProfile.idVerified && !userProfile.propertyProofVerified}>
                  <summary className={`flex items-center justify-between p-5 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden ${!userProfile.idVerified ? "opacity-50 grayscale pointer-events-none bg-gray-100" : "bg-gray-50/50 hover:bg-gray-50"}`}>
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 p-2 rounded-xl bg-white shadow-sm border border-gray-100 relative">
                         {!userProfile.idVerified && <div className="absolute -top-2 -right-2 bg-gray-600 rounded-full p-1 text-white shadow"><Lock size={12} /></div>}
                         <Building size={24} className={userProfile.propertyProofVerified ? "text-[#408A71]" : "text-gray-400"} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <h3 className="font-bold text-gray-900 text-lg">Property Proof</h3>
                           {userProfile.propertyProofVerified && <div className="text-[10px] font-bold text-[#408A71] bg-green-100 px-2 py-0.5 rounded uppercase tracking-wider">Verified</div>}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">Establish genuine ownership</p>
                      </div>
                    </div>
                    <ChevronDown className="text-gray-400 group-open:-rotate-180 transition-transform duration-300" />
                  </summary>
                  <div className="p-5 pt-2 border-t border-gray-100 bg-white flex flex-col md:flex-row md:items-end justify-between gap-6">
                     <div className="max-w-xl">
                        <p className="text-sm text-gray-600 mb-4">Provide title deeds, recent utility bills, or encumbrance certificates. This proves you are the legitimate owner and prevents unauthorized listings.</p>
                        <div className="flex gap-2">
                          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">Unlocks: 'Premium Owner' Badge</span>
                          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">Unlocks: Digital Tenancy Agreement Generation</span>
                        </div>
                     </div>
                     {!userProfile.propertyProofVerified ? (
                       <button onClick={() => updateUserProfile({ propertyProofVerified: true })} disabled={!userProfile.idVerified} className="shrink-0 bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition-colors shadow-md w-full md:w-auto">
                         Upload Documents
                       </button>
                     ) : (
                       <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-5 py-3 rounded-xl border border-green-100">
                         <CheckCircle2 size={20} /> Documents Approved
                       </div>
                     )}
                  </div>
                </details>
              )}

              {/* Agent Specific */}
              {userProfile.role === "agent" && (
                <details className="group bg-white border border-gray-200 rounded-2xl shadow-sm open:shadow-md transition-all outline-none overflow-hidden" open={userProfile.idVerified && !userProfile.agencyProofVerified}>
                  <summary className={`flex items-center justify-between p-5 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden ${!userProfile.idVerified ? "opacity-50 grayscale pointer-events-none bg-gray-100" : "bg-gray-50/50 hover:bg-gray-50"}`}>
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 p-2 rounded-xl bg-white shadow-sm border border-gray-100 relative">
                         {!userProfile.idVerified && <div className="absolute -top-2 -right-2 bg-gray-600 rounded-full p-1 text-white shadow"><Lock size={12} /></div>}
                         <Briefcase size={24} className={userProfile.agencyProofVerified ? "text-[#408A71]" : "text-gray-400"} />
                      </div>
                      <div>
                         <div className="flex items-center gap-2">
                           <h3 className="font-bold text-gray-900 text-lg">Agency Proof</h3>
                           {userProfile.agencyProofVerified && <div className="text-[10px] font-bold text-[#408A71] bg-green-100 px-2 py-0.5 rounded uppercase tracking-wider">Verified</div>}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">Required for featured listings & broker verification</p>
                      </div>
                    </div>
                    <ChevronDown className="text-gray-400 group-open:-rotate-180 transition-transform duration-300" />
                  </summary>
                  <div className="p-5 pt-2 border-t border-gray-100 bg-white flex flex-col md:flex-row md:items-end justify-between gap-6">
                     <div className="max-w-xl">
                        <p className="text-sm text-gray-600 mb-4">Upload agency credentials or RERA broker certification to unlock business tier capabilities.</p>
                        <div className="flex gap-2">
                          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">Unlocks: 'Verified Agent' Badge</span>
                          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">Unlocks: Unlimited Listings</span>
                        </div>
                     </div>
                     {!userProfile.agencyProofVerified ? (
                       <button onClick={() => updateUserProfile({ agencyProofVerified: true })} disabled={!userProfile.idVerified} className="shrink-0 bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition-colors shadow-md w-full md:w-auto">
                         Upload Credentials
                       </button>
                     ) : (
                       <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-5 py-3 rounded-xl border border-green-100">
                         <CheckCircle2 size={20} /> Agency Approved
                       </div>
                     )}
                  </div>
                </details>
              )}

              {/* Builder Specific */}
              {userProfile.role === "builder" && (
                <>
                  <details className="group bg-white border border-gray-200 rounded-2xl shadow-sm open:shadow-md transition-all outline-none overflow-hidden" open={userProfile.idVerified && !userProfile.companyProofVerified}>
                    <summary className={`flex items-center justify-between p-5 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden ${!userProfile.idVerified ? "opacity-50 grayscale pointer-events-none bg-gray-100" : "bg-gray-50/50 hover:bg-gray-50"}`}>
                      <div className="flex items-center gap-4">
                        <div className="shrink-0 p-2 rounded-xl bg-white shadow-sm border border-gray-100 relative">
                           {!userProfile.idVerified && <div className="absolute -top-2 -right-2 bg-gray-600 rounded-full p-1 text-white shadow"><Lock size={12} /></div>}
                           <Building size={24} className={userProfile.companyProofVerified ? "text-[#408A71]" : "text-gray-400"} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <h3 className="font-bold text-gray-900 text-lg">Company Details</h3>
                             {userProfile.companyProofVerified && <div className="text-[10px] font-bold text-[#408A71] bg-green-100 px-2 py-0.5 rounded uppercase tracking-wider">Verified</div>}
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">Entity proof for developers</p>
                        </div>
                      </div>
                      <ChevronDown className="text-gray-400 group-open:-rotate-180 transition-transform duration-300" />
                    </summary>
                    <div className="p-5 pt-2 border-t border-gray-100 bg-white flex flex-col md:flex-row md:items-end justify-between gap-6">
                       <div className="max-w-xl">
                          <p className="text-sm text-gray-600 mb-4">Upload GST registration or Incorporation certificate to get a dedicated business landing page and project grouping.</p>
                          <div className="flex gap-2">
                            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">Unlocks: Custom Builder Page</span>
                          </div>
                       </div>
                       {!userProfile.companyProofVerified ? (
                         <button onClick={() => updateUserProfile({ companyProofVerified: true })} disabled={!userProfile.idVerified} className="shrink-0 bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition-colors shadow-md w-full md:w-auto">
                           Upload Docs
                         </button>
                       ) : (
                         <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-5 py-3 rounded-xl border border-green-100">
                           <CheckCircle2 size={20} /> Entity Verified
                         </div>
                       )}
                    </div>
                  </details>

                  <details className="group bg-white border border-gray-200 rounded-2xl shadow-sm open:shadow-md transition-all outline-none overflow-hidden" open={userProfile.companyProofVerified && !userProfile.reraVerified}>
                    <summary className={`flex items-center justify-between p-5 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden ${!userProfile.companyProofVerified ? "opacity-50 grayscale pointer-events-none bg-gray-100" : "bg-gray-50/50 hover:bg-gray-50"}`}>
                      <div className="flex items-center gap-4">
                        <div className="shrink-0 p-2 rounded-xl bg-white shadow-sm border border-gray-100 relative">
                           {!userProfile.companyProofVerified && <div className="absolute -top-2 -right-2 bg-gray-600 rounded-full p-1 text-white shadow"><Lock size={12} /></div>}
                           <ShieldCheck size={24} className={userProfile.reraVerified ? "text-[#408A71]" : "text-gray-400"} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <h3 className="font-bold text-gray-900 text-lg">Developer RERA</h3>
                             {userProfile.reraVerified && <div className="text-[10px] font-bold text-[#408A71] bg-green-100 px-2 py-0.5 rounded uppercase tracking-wider">Verified</div>}
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">Top-level developer recognition</p>
                        </div>
                      </div>
                      <ChevronDown className="text-gray-400 group-open:-rotate-180 transition-transform duration-300" />
                    </summary>
                    <div className="p-5 pt-2 border-t border-gray-100 bg-white flex flex-col md:flex-row md:items-end justify-between gap-6">
                       <div className="max-w-xl">
                          <p className="text-sm text-gray-600 mb-4">RERA Verification establishes absolute authenticity for new project launches and attracts maximum investor/homebuyer trust.</p>
                          <div className="flex gap-2">
                            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">Unlocks: 'RERA Certified' Badge</span>
                            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">Unlocks: Featured Projects</span>
                          </div>
                       </div>
                       {!userProfile.reraVerified ? (
                         <button onClick={() => updateUserProfile({ reraVerified: true })} disabled={!userProfile.companyProofVerified} className="shrink-0 bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition-colors shadow-md w-full md:w-auto">
                           Verify RERA
                         </button>
                       ) : (
                         <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-5 py-3 rounded-xl border border-green-100">
                           <CheckCircle2 size={20} /> RERA Approved
                         </div>
                       )}
                    </div>
                  </details>
                </>
              )}
            </div>
            
            {/* Security Footnote */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-6 opacity-60">
               <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                 <Shield size={14} /> Bank-Level Encryption
               </div>
               <div className="w-1 h-1 bg-gray-300 rounded-full" />
               <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                 <IdCard size={14} /> UIDAI Compliant
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
