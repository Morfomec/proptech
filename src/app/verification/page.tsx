"use client";

import { useState } from "react";
import { Star, ShieldCheck, TrendingUp, TrendingDown, Clock, MessageSquare, AlertTriangle, CheckCircle2, User, Building, ArrowRight, ThumbsUp } from "lucide-react";
import Link from "next/link";

export default function TrustScorePage() {
  const [score, setScore] = useState(600);
  const [streak, setStreak] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const getScoreCategory = (s: number) => {
    if (s >= 800) return { label: "Excellent", color: "text-emerald-700", bg: "bg-emerald-100", stroke: "text-emerald-500" };
    if (s >= 700) return { label: "Good", color: "text-blue-700", bg: "bg-blue-100", stroke: "text-blue-500" };
    if (s >= 600) return { label: "Average", color: "text-yellow-700", bg: "bg-yellow-100", stroke: "text-yellow-500" };
    return { label: "Risky", color: "text-red-700", bg: "bg-red-100", stroke: "text-red-500" };
  };

  const handleUpdate = (type: string) => {
    let amt = 0;
    let reason = "";
    let newStreak = streak;
    let applyBonus = false;

    if (type === 'early') {
      amt = 20;
      reason = 'Paid Rent Early';
      newStreak += 1;
    } else if (type === 'on-time') {
      amt = 10;
      reason = 'Paid Rent On-time';
      newStreak += 1;
    } else if (type === 'late') {
      amt = -25;
      reason = 'Paid Rent Late';
      newStreak = 0;
    } else if (type === 'missed') {
      amt = -50;
      reason = 'Missed Payment';
      newStreak = 0;
    } else if (type === 'quick') {
      amt = 10;
      reason = 'Quick Response';
    } else if (type === 'complaint') {
      amt = -30;
      reason = 'Complaint Registered';
    }

    if (newStreak === 3) {
      applyBonus = true;
      newStreak = 0;
    }

    setStreak(newStreak);

    setScore(prev => Math.min(900, Math.max(300, prev + amt + (applyBonus ? 25 : 0))));
    setLastAction(`${reason} (${amt > 0 ? '+' : ''}${amt})${applyBonus ? ' + Streak Bonus (+25)' : ''}`);
    
    // Clear last action text after a few seconds
    setTimeout(() => setLastAction(null), 3000);
  };

  const cat = getScoreCategory(score);
  
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const percent = (score - 300) / 600;
  const offset = circumference - (percent * circumference);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-green-100 text-[#408A71] rounded-2xl mb-6 shadow-sm">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Verification & Trust
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-6 max-w-3xl mx-auto">
          Trust is built through identity and behavior
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Our platform combines rigorous identity verification with a live behavioral score (300-900) to create a reliable and scam-resistant rental ecosystem for tenants, owners, and agents.
        </p>
      </section>

      {/* 1.5 Badge System Explaination */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
         <div className="text-center mb-12">
           <h3 className="text-3xl font-bold text-gray-900 mb-4">The Verification Pipeline</h3>
           <p className="text-gray-500 max-w-2xl mx-auto">Understanding how we secure our community. Each tier unlocks more capabilities and builds more trust with other users.</p>
         </div>
         
         <div className="grid md:grid-cols-2 gap-8 mb-16">
           <div className="bg-white border-2 border-red-100 shadow-sm p-8 rounded-3xl hover:shadow-md transition-shadow">
             <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-3xl mb-6">⚠️</div>
             <h4 className="text-2xl font-bold text-gray-900 mb-2">1. Base Level (Unverified)</h4>
             <p className="font-semibold text-red-600 mb-4">Base Trust Score: 550</p>
             <p className="text-gray-600 mb-6">Accounts created without any verification are heavily restricted to protect the community from spam and bad actors.</p>
             <ul className="space-y-3">
               <li className="flex items-start gap-3 text-sm text-gray-600"><div className="mt-1 text-red-500 font-bold">✕</div> No property listings allowed</li>
               <li className="flex items-start gap-3 text-sm text-gray-600"><div className="mt-1 text-red-500 font-bold">✕</div> Cannot initiate lease agreements</li>
               <li className="flex items-start gap-3 text-sm text-gray-600"><div className="mt-1 text-green-500 font-bold">✓</div> Read-only browsing access</li>
             </ul>
           </div>

           <div className="bg-white border-2 border-orange-100 shadow-sm p-8 rounded-3xl hover:shadow-md transition-shadow">
             <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center text-3xl mb-6">📱</div>
             <h4 className="text-2xl font-bold text-gray-900 mb-2">2. Phone Verified</h4>
             <p className="font-semibold text-orange-600 mb-4">Trust Score Boosted: +30 (Max 580)</p>
             <p className="text-gray-600 mb-6">The minimum requirement to actively participate. Requires a valid mobile number with OTP verification.</p>
             <ul className="space-y-3">
               <li className="flex items-start gap-3 text-sm text-gray-600"><div className="mt-1 text-green-500 font-bold">✓</div> Can post up to 2 properties</li>
               <li className="flex items-start gap-3 text-sm text-gray-600"><div className="mt-1 text-green-500 font-bold">✓</div> Can message verified users</li>
               <li className="flex items-start gap-3 text-sm text-gray-600"><div className="mt-1 text-orange-500 font-bold">!</div> "Unverified ID" warning shown to others</li>
             </ul>
           </div>

           <div className="bg-white border-2 border-[#408A71]/20 shadow-sm p-8 rounded-3xl hover:shadow-md transition-shadow relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-[#408A71] text-white text-xs font-bold px-4 py-1 rounded-bl-xl tracking-wider uppercase">Recommended</div>
             <div className="w-16 h-16 bg-green-50 text-[#408A71] rounded-2xl flex items-center justify-center text-3xl mb-6">✅</div>
             <h4 className="text-2xl font-bold text-gray-900 mb-2">3. Identity Verified</h4>
             <p className="font-semibold text-[#408A71] mb-4">Trust Score Boosted: +50 (Max 600)</p>
             <p className="text-gray-600 mb-6">Personal identity is validated using government-issued documents (Aadhar/PAN) matched against a live selfie check.</p>
             <ul className="space-y-3">
               <li className="flex items-start gap-3 text-sm text-gray-600"><div className="mt-1 text-green-500 font-bold">✓</div> Trusted badge displayed on profile</li>
               <li className="flex items-start gap-3 text-sm text-gray-600"><div className="mt-1 text-green-500 font-bold">✓</div> Unlimited property inquiries</li>
               <li className="flex items-start gap-3 text-sm text-gray-600"><div className="mt-1 text-green-500 font-bold">✓</div> Up to 5 property listings</li>
             </ul>
           </div>

           <div className="bg-white border-2 border-blue-100 shadow-sm p-8 rounded-3xl hover:shadow-md transition-shadow relative overflow-hidden">
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6">🏢</div>
             <h4 className="text-2xl font-bold text-gray-900 mb-2">4. Business / Asset Proof</h4>
             <p className="font-semibold text-blue-600 mb-4">Top Tier Capabilities</p>
             <p className="text-gray-600 mb-6">For Agents, Builders, and multiple property Owners. Requires RERA registration, Company details, or Property Title Deeds.</p>
             <ul className="space-y-3">
               <li className="flex items-start gap-3 text-sm text-gray-600"><div className="mt-1 text-green-500 font-bold">✓</div> Unlimited property listings</li>
               <li className="flex items-start gap-3 text-sm text-gray-600"><div className="mt-1 text-green-500 font-bold">✓</div> Ranked higher in search results</li>
               <li className="flex items-start gap-3 text-sm text-gray-600"><div className="mt-1 text-green-500 font-bold">✓</div> Access to digital tenancy agreement drafting</li>
             </ul>
           </div>
         </div>
         
         {/* Verification Steps Visual */}
         <div className="bg-gray-900 text-white p-8 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#408A71] opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
           <h4 className="text-2xl font-extrabold mb-8 text-center">Inside the Document Check</h4>
           <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
             <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-sm border border-gray-700 text-center">
               <div className="bg-gray-700 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"><span className="text-2xl">📸</span></div>
               <h5 className="font-bold text-lg mb-2">1. Liveness Check</h5>
               <p className="text-sm text-gray-400">User records a 3-second moving selfie to prove they are a live human, not a photo.</p>
             </div>
             <div className="text-[#408A71] text-2xl hidden md:block"><ArrowRight /></div>
             <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-sm border border-gray-700 text-center relative">
               <div className="absolute -top-3 -right-3 bg-[#408A71] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">AI Matched</div>
               <div className="bg-gray-700 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"><span className="text-2xl">🪪</span></div>
               <h5 className="font-bold text-lg mb-2">2. ID Scan</h5>
               <p className="text-sm text-gray-400">System securely scans official ID using optical character recognition and face extraction.</p>
             </div>
           </div>
         </div>
      </section>

      {/* 2. Live Demo Section */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900">Live Interactive Demo</h3>
            <p className="text-gray-500 mt-2">Click the actions below to see how behaviors instantly impact the score.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-16">
            
            {/* Visual Indicator */}
            <div className="flex flex-col items-center relative">
              <div className="relative w-64 h-64 mb-6">
                <div className="w-full h-full rounded-full flex items-center justify-center relative">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-sm">
                    <circle cx="128" cy="128" r={radius} stroke="currentColor" strokeWidth="16" fill="transparent" className="text-gray-100" />
                    <circle cx="128" cy="128" r={radius} stroke="currentColor" strokeWidth="16" fill="transparent" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={offset} 
                        className={`${cat.stroke} transition-all duration-1000 ease-out`} 
                        strokeLinecap="round" />
                  </svg>
                  <div className="text-center z-10 flex flex-col items-center">
                    <span className="text-6xl font-extrabold text-gray-900 leading-none">{score}</span>
                    <span className="block text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest">out of 900</span>
                  </div>
                </div>
              </div>
              
              <div className={`px-8 py-3 rounded-full text-lg font-extrabold shadow-sm transition-colors duration-500 ${cat.bg} ${cat.color}`}>
                {cat.label}
              </div>
              
              <div className="mt-4 text-center w-full min-h-[3rem]">
                {lastAction && (
                  <span className="text-sm font-semibold text-gray-500 animate-in fade-in slide-in-from-bottom-2 block mb-1">
                    Action applied: <span className="text-gray-900">{lastAction}</span>
                  </span>
                )}
                {streak > 0 && (
                  <span className="text-xs font-bold text-orange-500 flex items-center justify-center gap-1 animate-in fade-in">
                    🔥 Streak: {streak}/3 (Next reward: +25)
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              <h4 className="col-span-full text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Simulate Behaviors</h4>
              
              <button onClick={() => handleUpdate('early')} className="flex items-center justify-between px-5 py-4 bg-white border-2 border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 rounded-2xl transition-all shadow-sm group">
                <span className="text-sm font-bold text-gray-700 group-hover:text-emerald-700">Early Payment</span>
                <span className="text-sm font-extrabold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">+20</span>
              </button>
              
              <button onClick={() => handleUpdate('on-time')} className="flex items-center justify-between px-5 py-4 bg-white border-2 border-gray-100 hover:border-green-200 hover:bg-green-50 rounded-2xl transition-all shadow-sm group">
                <span className="text-sm font-bold text-gray-700 group-hover:text-green-700">On-time Payment</span>
                <span className="text-sm font-extrabold text-green-600 bg-green-100 px-2 py-1 rounded-md">+10</span>
              </button>

              <button onClick={() => handleUpdate('quick')} className="flex items-center justify-between px-5 py-4 bg-white border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50 rounded-2xl transition-all shadow-sm group">
                <span className="text-sm font-bold text-gray-700 group-hover:text-blue-700">Quick Response</span>
                <span className="text-sm font-extrabold text-blue-600 bg-blue-100 px-2 py-1 rounded-md">+10</span>
              </button>
              
              <button onClick={() => handleUpdate('late')} className="flex items-center justify-between px-5 py-4 bg-white border-2 border-gray-100 hover:border-orange-200 hover:bg-orange-50 rounded-2xl transition-all shadow-sm group">
                <span className="text-sm font-bold text-gray-700 group-hover:text-orange-700">Late Payment</span>
                <span className="text-sm font-extrabold text-orange-600 bg-orange-100 px-2 py-1 rounded-md">-25</span>
              </button>

              <button onClick={() => handleUpdate('complaint')} className="flex items-center justify-between px-5 py-4 bg-white border-2 border-gray-100 hover:border-red-200 hover:bg-red-50 rounded-2xl transition-all shadow-sm group">
                <span className="text-sm font-bold text-gray-700 group-hover:text-red-700">Complaint Raised</span>
                <span className="text-sm font-extrabold text-red-600 bg-red-100 px-2 py-1 rounded-md">-30</span>
              </button>
              
              <button onClick={() => handleUpdate('missed')} className="flex items-center justify-between px-5 py-4 bg-white border-2 border-gray-100 hover:border-red-300 hover:bg-red-50 rounded-2xl transition-all shadow-sm group">
                <span className="text-sm font-bold text-gray-700 group-hover:text-red-800">Missed Payment</span>
                <span className="text-sm font-extrabold text-red-700 bg-red-200 px-2 py-1 rounded-md">-50</span>
              </button>
            </div>
            
          </div>
        </div>
      </section>

      {/* 3. Score Breakdown Section */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <h3 className="text-3xl font-extrabold text-gray-900 text-center mb-12">How it is Calculated</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h4 className="text-xl font-bold flex items-center gap-3 text-gray-900 mb-6">
              <User className="text-[#408A71]" size={28} /> Tenant Scoring
            </h4>
            <div className="space-y-4">
               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                 <div className="p-2 bg-green-100 text-green-600 rounded-xl"><CheckCircle2 size={20} /></div>
                 <div>
                   <p className="font-bold text-gray-900">Payment Behavior</p>
                   <p className="text-sm text-gray-500 mt-1">Paying rent on time consistently forms the backbone of a high tenant score. Make 3 consecutive on-time payments for a valuable +25 streak bonus.</p>
                 </div>
               </div>
               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                 <div className="p-2 bg-red-100 text-red-600 rounded-xl"><AlertTriangle size={20} /></div>
                 <div>
                   <p className="font-bold text-gray-900">Late & Missed Payments</p>
                   <p className="text-sm text-gray-500 mt-1">Missing deadlines will aggressively lower a tenant's score, signaling risk to future landlords.</p>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h4 className="text-xl font-bold flex items-center gap-3 text-gray-900 mb-6">
              <Building className="text-[#408A71]" size={28} /> Owner & Agent Scoring
            </h4>
            <div className="space-y-4">
               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                 <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><MessageSquare size={20} /></div>
                 <div>
                   <p className="font-bold text-gray-900">Responsiveness</p>
                   <p className="text-sm text-gray-500 mt-1">Replying quickly to tenant inquiries, maintenance requests, and messages boosts an owner's score over time.</p>
                 </div>
               </div>
               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                 <div className="p-2 bg-orange-100 text-orange-600 rounded-xl"><ThumbsUp size={20} /></div>
                 <div>
                   <p className="font-bold text-gray-900">Dispute & Complaint History</p>
                   <p className="text-sm text-gray-500 mt-1">A high volume of unresolved tenant complaints or poor ratings directly hurts an owner or agent's trust ranking.</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Real Use Case Section */}
      <section className="bg-gray-900 text-white py-20 mb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-extrabold text-center mb-12">See it in Action</h3>
          
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* Scenario 1 */}
            <div>
              <div className="bg-gray-800 border border-gray-700 p-6 rounded-3xl mb-6 relative">
                 <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">High Risk</div>
                 <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 font-bold">TA</div>
                   <div>
                     <p className="font-bold text-lg">Tenant Application</p>
                     <p className="text-sm text-gray-400">Arjun K.</p>
                   </div>
                   <div className="ml-auto bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
                     <Star size={14} className="text-red-400" />
                     <span className="font-bold text-red-400">Score 550</span>
                   </div>
                 </div>
                 <div className="bg-gray-900/50 p-4 rounded-xl text-sm text-gray-300">
                   <p>⚠️ Warning: Has missed 2 payments in the last 6 months.</p>
                 </div>
              </div>
              <h4 className="text-xl font-bold mb-2">Owners avoid risky tenants</h4>
              <p className="text-gray-400">Before accepting a tenancy request, owners can instantly view the applicant's historical payment behavior and score.</p>
            </div>
            
            {/* Scenario 2 */}
            <div>
              <div className="bg-gray-800 border border-gray-700 p-6 rounded-3xl mb-6 relative">
                 <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">Highly Trusted</div>
                 <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 font-bold">PL</div>
                   <div>
                     <p className="font-bold text-lg">Property Listing</p>
                     <p className="text-sm text-gray-400">Private Landlord</p>
                   </div>
                   <div className="ml-auto bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
                     <Star size={14} className="text-emerald-400" />
                     <span className="font-bold text-emerald-400">Score 820</span>
                   </div>
                 </div>
                 <div className="bg-gray-900/50 p-4 rounded-xl text-sm text-gray-300">
                   <p>✨ Excellent: Usually responds within 1 hour. No complaints.</p>
                 </div>
              </div>
              <h4 className="text-xl font-bold mb-2">Tenants avoid bad landlords</h4>
              <p className="text-gray-400">Tenants can confidently sign leases knowing their landlord has a verified history of being responsive and fair.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Value Proposition Section */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
          Make rental decisions with <span className="text-[#408A71] relative">trust<svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0,10 Q50,20 100,10" fill="transparent" stroke="#408A71" strokeWidth="4" strokeLinecap="round" /></svg></span>, not guesswork.
        </h2>
        
        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-12">
          <div className="bg-white border border-gray-100 shadow-sm px-6 py-4 rounded-2xl font-bold text-gray-700">🛡️ Reduces Risk</div>
          <div className="bg-white border border-gray-100 shadow-sm px-6 py-4 rounded-2xl font-bold text-gray-700">🔍 Builds Transparency</div>
          <div className="bg-white border border-gray-100 shadow-sm px-6 py-4 rounded-2xl font-bold text-gray-700">🤝 Creates Accountability</div>
        </div>

        <Link href="/signup" className="inline-flex items-center gap-2 bg-[#408A71] hover:bg-[#34745c] text-white font-bold text-lg px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
          Join the Platform <ArrowRight size={20} />
        </Link>
      </section>

    </div>
  );
}
