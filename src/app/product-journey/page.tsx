"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, ChevronDown, CheckCircle2, Lock, Star, Building, User, RefreshCw, LayoutDashboard, Search, SlidersHorizontal, HeartHandshake, Clock, FileSignature } from "lucide-react";
import Link from "next/link";
import { getVerificationBadge } from "@/context/AuthContext";

export default function ProductJourneyPage() {
  const [animStep, setAnimStep] = useState(0);
  
  // Matching Simulator State
  const [matchScore, setMatchScore] = useState(82);
  const [activeTraits, setActiveTraits] = useState<string[]>(["Early Bird", "Pet Friendly"]);
  const [isMatching, setIsMatching] = useState(false);

  const tenantTraits = ["Early Bird", "Pet Owner", "Quiet", "Long Term", "Non-Smoker"];
  const landlordPrefs = ["Early Bird", "Pet Friendly", "Quiet Preferred", "Long Term", "Non-Smoker Only"];

  const simulateMatch = (trait: string) => {
    setIsMatching(true);
    setTimeout(() => {
      if (activeTraits.includes(trait)) {
        setActiveTraits(prev => prev.filter(t => t !== trait));
        setMatchScore(prev => Math.max(30, prev - 15));
      } else {
        setActiveTraits(prev => [...prev, trait]);
        setMatchScore(prev => Math.min(100, prev + 15));
      }
      setIsMatching(false);
    }, 800);
  };

  // Cycle animation for the "Verification" step
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimStep((prev) => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const badgeStates = [
    { 
      score: 580, 
      badge: getVerificationBadge(2, 'owner'), 
      action: "Level 1: Basic Identity", 
      details: "Mobile OTP + Email Verification",
      docs: ["Valid Phone Number", "Email Access"]
    },
    { 
      score: 600, 
      badge: getVerificationBadge(3, 'owner'), 
      action: "Level 2: Trusted Member", 
      details: "Government Issued identity",
      docs: ["Aadhar / PAN Card", "Live Selfie Match"]
    },
    { 
      score: 750, 
      badge: getVerificationBadge(4, 'owner'), 
      action: "Level 3: Business Pro", 
      details: "Commercial & Licensing Depth",
      docs: ["RERA License", "GST Registration"]
    },
  ];

  const currentBadgeState = badgeStates[animStep];

  // Trust Ledger State
  const [demoScore, setDemoScore] = useState(600);
  const [ledger, setLedger] = useState<{ action: string; impact: number; id: number }[]>([]);
  const [isUpdatingScore, setIsUpdatingScore] = useState(false);

  const addLedgerEvent = (action: string, impact: number) => {
    setIsUpdatingScore(true);
    const newEvent = { action, impact, id: Date.now() };
    setLedger(prev => [newEvent, ...prev].slice(0, 5));
    
    // Animate score change
    setTimeout(() => {
      setDemoScore(prev => Math.min(900, Math.max(300, prev + impact)));
      setIsUpdatingScore(false);
    }, 500);
  };

  // Scroll Reveal Logic
  const [visibleSections, setVisibleSections] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionIdx = parseInt(entry.target.getAttribute('data-section') || '0');
          setVisibleSections(prev => [...new Set([...prev, sectionIdx])]);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('section[data-section]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#408A71] selection:text-white">
      
      {/* SECTION 0: HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-[#408A71]/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out flex flex-col items-center w-full max-w-4xl">
          <div className="p-4 bg-white rounded-full shadow-sm border border-gray-100 mb-8">
            <HeartHandshake className="text-[#408A71]" size={48} />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight mb-8">
            Find homes you can <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#408A71] to-emerald-400">trust</span>.
          </h1>

          {/* Search Bar UI Mock */}
          <div className="bg-white p-4 rounded-full shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center justify-between w-full max-w-2xl transform hover:scale-[1.02] transition-transform">
             <div className="flex flex-1 items-center gap-3 px-4">
               <Search className="text-gray-400" size={24} />
               <div className="text-left">
                 <p className="text-sm font-bold text-gray-900">Search</p>
                 <p className="text-xs text-gray-500">Anywhere • Any Budget</p>
               </div>
             </div>
             <div className="bg-[#408A71] text-white p-4 rounded-full shadow-md cursor-pointer hover:bg-emerald-600 transition-colors">
               <Search size={24} />
             </div>
          </div>
        </div>

        <div className="absolute bottom-12 flex flex-col items-center text-gray-400 animate-bounce">
          <p className="text-xs font-bold uppercase tracking-widest mb-2">The Journey Starts Here</p>
          <ChevronDown size={24} />
        </div>
      </section>

      {/* STRIP: Timeline */}
      <div className="relative max-w-5xl mx-auto border-l-2 border-gray-200/50 ml-12 md:ml-auto md:border-l-0">

        {/* SECTION 1: Smart Search & Matching */}
        <section data-section="1" className={`py-32 px-6 relative md:flex md:items-center md:gap-16 transition-all duration-1000 ${visibleSections.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="md:w-1/2 mb-12 md:mb-0 relative z-10">
            <div className="md:text-right pr-0 md:pr-12">
               <span className="text-[#408A71] font-black text-xl mb-2 block tracking-widest uppercase">Step 1</span>
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Smart Search & Matching</h2>
               <p className="text-xl text-gray-500 italic border-l-4 md:border-l-0 md:border-r-4 border-gray-300 pl-4 md:pl-0 md:pr-4">
                 “Not just listings — we match what fits you.”
               </p>
            </div>
          </div>

          <div className="md:w-1/2 relative">
             <div className="absolute top-1/2 -left-12 md:-left-8 -translate-y-1/2 w-6 h-6 bg-white border-4 border-gray-300 rounded-full z-20 shadow-sm" />
             
             {/* Interactive Matching Simulator */}
             <div className="bg-white rounded-[2rem] p-8 shadow-2xl border border-gray-100 transform transition-all hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900">Algo-Match Simulator</h3>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isMatching ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-green-100 text-green-700'}`}>
                    {isMatching ? 'Calculating...' : 'Ready'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tenant Traits</p>
                    {tenantTraits.map(trait => (
                      <button
                        key={trait}
                        onClick={() => simulateMatch(trait)}
                        disabled={isMatching}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${activeTraits.includes(trait) ? 'bg-[#408A71] text-white border-[#408A71] shadow-md' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-200'}`}
                      >
                        {trait}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Matches Prefs</p>
                    {landlordPrefs.map((pref, i) => (
                      <div key={pref} className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center justify-between ${activeTraits.includes(tenantTraits[i]) ? 'bg-white text-gray-900 border-[#408A71]/30 shadow-sm' : 'bg-gray-50/50 text-gray-300 border-gray-50'}`}>
                        {pref}
                        {activeTraits.includes(tenantTraits[i]) && <CheckCircle2 size={12} className="text-[#408A71]" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative w-full h-32 bg-gray-900 rounded-2xl border border-gray-100 flex items-center justify-center p-6 overflow-hidden">
                   {/* Background pulse when matching */}
                   {isMatching && <div className="absolute inset-0 bg-[#408A71]/20 animate-pulse" />}
                   
                   <div className="z-10 flex flex-col items-center">
                     <p className="text-[10px] font-bold text-[#408A71] uppercase tracking-widest mb-1">Compatibility Score</p>
                     <p className={`text-5xl font-black transition-all ${matchScore > 70 ? 'text-white' : matchScore > 40 ? 'text-amber-400' : 'text-red-400'}`}>
                       {matchScore}%
                     </p>
                     <div className="w-full max-w-[120px] h-1.5 bg-gray-800 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-[#408A71] transition-all duration-1000" style={{ width: `${matchScore}%` }} />
                     </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* SECTION 2: Trust Score Introduction */}
        <section data-section="2" className={`py-32 px-6 relative md:flex md:items-center md:flex-row-reverse md:gap-16 transition-all duration-1000 delay-100 ${visibleSections.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="md:w-1/2 mb-12 md:mb-0 relative z-10">
            <div className="pl-0 md:pl-12">
               <span className="text-[#408A71] font-black text-xl mb-2 block tracking-widest uppercase">Step 2</span>
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trust Scores</h2>
               <p className="text-xl text-gray-500 italic border-l-4 border-gray-300 pl-4">
                 “Because matching is not enough — trust matters.”
               </p>
            </div>
          </div>

          <div className="md:w-1/2 relative flex justify-end">
             <div className="absolute top-1/2 -left-12 md:right-auto md:-right-8 -translate-y-1/2 w-6 h-6 bg-white border-4 border-gray-300 rounded-full z-20 shadow-sm" />
             
             {/* Interactive Trust Ledger */}
             <div className="w-full bg-white rounded-[2rem] p-8 shadow-2xl border border-gray-100 flex flex-col gap-6 transform transition-all hover:scale-[1.02]">
               <div className="flex items-center justify-between">
                 <div className="text-left">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Dynamic Trust Score</p>
                   <div className="flex items-end gap-2">
                     <p className={`text-6xl font-black transition-all duration-500 ${isUpdatingScore ? 'scale-110 text-[#408A71]' : 'text-gray-900'}`}>
                       {demoScore}
                     </p>
                     <p className="text-sm font-bold text-gray-400 mb-2">/ 900</p>
                   </div>
                 </div>
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${demoScore >= 700 ? 'bg-green-50 border-green-200 text-green-600' : demoScore >= 500 ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-red-50 border-red-200 text-red-600'}`}>
                   <Star size={32} fill="currentColor" />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => addLedgerEvent("On-time Payment", 15)} className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-[10px] font-bold border border-green-100 transition-colors">+15 On-time</button>
                 <button onClick={() => addLedgerEvent("Early Payment", 25)} className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-bold border border-emerald-100 transition-colors">+25 Early</button>
                 <button onClick={() => addLedgerEvent("Late Payment", -25)} className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-[10px] font-bold border border-amber-100 transition-colors">-25 Late</button>
                 <button onClick={() => addLedgerEvent("Missed Payment", -50)} className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-[10px] font-bold border border-red-100 transition-colors">-50 Missed</button>
               </div>

               <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 min-h-[120px]">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Live Behavior Ledger</p>
                 <div className="space-y-2">
                   {ledger.length === 0 ? (
                     <p className="text-xs text-gray-400 italic py-4">Click buttons above to simulate behavior...</p>
                   ) : (
                     ledger.map(event => (
                       <div key={event.id} className="flex items-center justify-between animate-in slide-in-from-top-2 fade-in duration-300">
                         <span className="text-xs font-semibold text-gray-600">{event.action}</span>
                         <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${event.impact > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                           {event.impact > 0 ? '+' : ''}{event.impact}
                         </span>
                       </div>
                     ))
                   )}
                 </div>
               </div>
             </div>
          </div>
        </section>

        {/* SECTION 3: Decision Comparison */}
        <section data-section="3" className={`py-32 px-6 relative md:flex md:items-center md:gap-16 transition-all duration-1000 delay-200 ${visibleSections.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="md:w-1/2 mb-12 md:mb-0 relative z-10">
            <div className="md:text-right pr-0 md:pr-12">
               <span className="text-[#408A71] font-black text-xl mb-2 block tracking-widest uppercase">Step 3</span>
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Decision Making</h2>
               <p className="text-xl text-gray-500 italic border-l-4 md:border-l-0 md:border-r-4 border-gray-300 pl-4 md:pl-0 md:pr-4">
                 “Users naturally choose trust.”
               </p>
            </div>
          </div>

          <div className="md:w-1/2 relative">
             <div className="absolute top-1/2 -left-12 md:-left-8 -translate-y-1/2 w-6 h-6 bg-white border-4 border-gray-300 rounded-full z-20 shadow-sm" />
             
             <div className="flex flex-col gap-4">
               {/* Owner A (Unverified) */}
               <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm opacity-50 grayscale flex items-center gap-4 transition-all hover:grayscale-0 hover:opacity-100">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">Landlord A</h4>
                    <div className="flex gap-2 mt-2">
                       <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100">⚠️ Unverified</span>
                       <span className="bg-yellow-50 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-200"><Star size={10} className="inline mr-1" />550</span>
                    </div>
                  </div>
               </div>

               <div className="text-center font-black text-gray-300">VS</div>

               {/* Owner B (Verified) */}
               <div className="bg-white p-5 rounded-3xl border-2 border-[#408A71] shadow-xl shadow-[#408A71]/10 flex items-center gap-4 transform scale-105 z-10 transition-all hover:scale-110 cursor-pointer">
                  <div className="w-16 h-16 bg-[#408A71]/10 rounded-full flex items-center justify-center text-[#408A71]">
                    <CheckCircle2 size={32} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">Landlord B</h4>
                    <div className="flex gap-2 mt-2">
                       <span className="bg-green-50 text-[#408A71] text-[10px] font-bold px-2 py-0.5 rounded border border-green-200">✅ Verified</span>
                       <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200"><Star size={10} className="inline mr-1" />820</span>
                    </div>
                  </div>
               </div>
             </div>
          </div>
        </section>

        {/* SECTION 4: Verification System (Animated) */}
        <section data-section="4" className={`py-32 px-6 relative md:flex md:items-center md:flex-row-reverse md:gap-16 transition-all duration-1000 delay-300 ${visibleSections.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="md:width-1/2 mb-12 md:mb-0 relative z-10">
            <div className="pl-0 md:pl-12">
               <span className="text-[#408A71] font-black text-xl mb-2 block tracking-widest uppercase">Step 4</span>
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Verification System</h2>
               <p className="text-xl text-gray-500 italic border-l-4 border-gray-300 pl-4">
                 “Trust is verified, not assumed.”
               </p>
            </div>
          </div>

          <div className="md:w-1/2 relative flex justify-end">
             <div className="absolute top-1/2 -left-12 md:right-auto md:-right-8 -translate-y-1/2 w-6 h-6 bg-white border-4 border-gray-300 rounded-full z-20 shadow-sm" />
             
             {/* Detailed Verification Pipeline */}
             <div className="bg-white w-full max-w-md rounded-[2.5rem] p-0 shadow-2xl border border-gray-100 overflow-hidden transform transition-all hover:scale-[1.02]">
               <div className="bg-gray-900 p-6 text-white flex items-center justify-between">
                 <div>
                   <p className="text-[10px] font-bold text-[#408A71] uppercase tracking-widest mb-1">Verification Engine</p>
                   <h3 className="font-bold text-lg">Multi-Tier Pipeline</h3>
                 </div>
                 <div className="bg-[#408A71] p-3 rounded-2xl shadow-lg shadow-[#408A71]/20">
                   <ShieldCheck size={24} />
                 </div>
               </div>

               <div className="p-8">
                 <div className="flex items-center justify-between mb-8">
                   <div className="flex flex-col">
                     <p className="text-3xl font-black text-gray-900 leading-none">{currentBadgeState.score}</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Trust Rating</p>
                   </div>
                   <div className={`px-4 py-2 rounded-2xl font-bold text-sm ${currentBadgeState.badge.bg} flex items-center gap-2`}>
                     {currentBadgeState.badge.icon} {currentBadgeState.badge.label}
                   </div>
                 </div>

                 <div className="space-y-6">
                   <div className="relative">
                     <div className="flex items-center gap-4 mb-2">
                        <div className="w-8 h-8 bg-[#408A71]/10 rounded-full flex items-center justify-center text-[#408A71] font-bold text-xs ring-4 ring-white">
                          {animStep + 1}
                        </div>
                        <p className="font-bold text-gray-900">{currentBadgeState.action}</p>
                     </div>
                     <p className="text-xs text-gray-500 ml-12 mb-4">{currentBadgeState.details}</p>
                     
                     <div className="ml-12 grid grid-cols-1 gap-2">
                        {currentBadgeState.docs.map(doc => (
                          <div key={doc} className="flex items-center gap-2 text-[10px] font-bold text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                            <CheckCircle2 size={12} className="text-[#408A71]" />
                            {doc}
                          </div>
                        ))}
                     </div>
                   </div>

                   <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-[#408A71] transition-all duration-1000 ease-out" 
                       style={{ width: `${(animStep + 1) * 33.33}%` }} 
                     />
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </section>

        {/* SECTION 5: Incentive System */}
        <section data-section="5" className={`py-32 px-6 relative md:flex md:items-center md:gap-16 transition-all duration-1000 delay-400 ${visibleSections.includes(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="md:w-1/2 mb-12 md:mb-0 relative z-10">
             <div className="md:text-right pr-0 md:pr-12">
               <span className="text-[#408A71] font-black text-xl mb-2 block tracking-widest uppercase">Step 5</span>
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Incentive System</h2>
               <p className="text-xl text-gray-500 italic border-l-4 md:border-l-0 md:border-r-4 border-gray-300 pl-4 md:pl-0 md:pr-4">
                 “Trust unlocks opportunity.”
               </p>
             </div>
          </div>

          <div className="md:w-1/2 relative">
             <div className="absolute top-1/2 -left-12 md:-left-8 -translate-y-1/2 w-6 h-6 bg-white border-4 border-[#408A71] rounded-full z-20 shadow-md shadow-[#408A71]/20" />
             
             {/* Locked Override UI */}
             <div className="w-full max-w-sm rounded-[2rem] overflow-hidden shadow-xl border border-gray-200 relative transform transition-transform hover:-translate-y-2">
               <div className="p-6 bg-white opacity-40 blur-[2px] pointer-events-none">
                 <div className="flex items-center gap-2 mb-4">
                   <LayoutDashboard className="text-gray-400" /> <span className="font-bold text-gray-900">Post Property (3/2)</span>
                 </div>
                 <div className="w-full h-10 bg-gray-200 rounded-lg mb-3"></div>
                 <div className="w-3/4 h-10 bg-gray-200 rounded-lg mb-3"></div>
                 <div className="w-full h-24 bg-gray-200 rounded-lg mb-3"></div>
               </div>

               {/* Lock Modal */}
               <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                 <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 shadow-lg text-white">
                   <Lock size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2 border-b border-gray-200 pb-2">Limit Reached</h3>
                 <p className="text-sm font-semibold text-gray-600 mb-6">
                   Verify to unlock more listings.
                 </p>
                 <button className="bg-[#408A71] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md">
                   Verify Account
                 </button>
               </div>
             </div>
          </div>
        </section>

        {/* SECTION 6: Tenancy Management */}
        <section data-section="6" className={`py-32 px-6 relative md:flex md:items-center md:flex-row-reverse md:gap-16 transition-all duration-1000 delay-500 ${visibleSections.includes(6) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="md:w-1/2 mb-12 md:mb-0 relative z-10">
            <div className="pl-0 md:pl-12">
               <span className="text-[#408A71] font-black text-xl mb-2 block tracking-widest uppercase">Step 6</span>
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tenancy Management</h2>
               <p className="text-xl text-gray-500 italic border-l-4 border-gray-300 pl-4">
                 “Seamless digital agreements and transparent tracking.”
               </p>
            </div>
          </div>

          <div className="md:w-1/2 relative flex justify-end">
             <div className="absolute top-1/2 -left-12 md:right-auto md:-right-8 -translate-y-1/2 w-6 h-6 bg-white border-4 border-gray-300 rounded-full z-20 shadow-sm" />
             
             {/* Tenancy Dashboard Simulator */}
             <div className="w-full bg-white rounded-[2rem] p-8 shadow-2xl border border-gray-100 flex flex-col gap-6 transform transition-all hover:scale-[1.02]">
               <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                 <div>
                   <p className="text-[10px] font-bold text-[#408A71] uppercase tracking-widest">Active Tenancy</p>
                   <h3 className="font-bold text-gray-900 text-lg">Oceanview Apartment</h3>
                 </div>
                 <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                   Active
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                   <p className="text-xs text-gray-500 font-semibold mb-1">Monthly Rent</p>
                   <p className="font-black text-gray-900">₹24,000</p>
                 </div>
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                   <p className="text-xs text-gray-500 font-semibold mb-1">Next Due</p>
                   <p className="font-black text-amber-600 flex items-center gap-1"><Clock size={14}/> 5th Oct</p>
                 </div>
               </div>

               <div className="flex gap-2">
                 <button className="flex-1 bg-gray-900 text-white rounded-xl py-3 text-xs font-bold hover:bg-black transition-colors flex items-center justify-center gap-2">
                   <FileSignature size={14} /> Agreement
                 </button>
                 <button className="flex-1 bg-[#408A71] text-white rounded-xl py-3 text-xs font-bold hover:bg-emerald-600 transition-colors">
                   Payment History
                 </button>
               </div>
             </div>
          </div>
        </section>

      </div>

      
      {/* FINAL IMPACT SECTION */}
      <section data-section="7" className={`bg-gray-900 text-white py-40 px-6 text-center transition-all duration-2000 ${visibleSections.includes(7) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-12 animate-pulse">
            <ShieldCheck size={64} className="text-[#408A71]" />
          </div>
          <h2 className="text-5xl md:text-8xl font-black mb-10 leading-none tracking-tighter">
            We build <span className="text-[#408A71]">Accountability</span>.<br />
            You build <span className="text-white decoration-[#408A71] underline decoration-4 underline-offset-8">Trust</span>.
          </h2>
          <p className="text-2xl text-gray-400 mb-16 font-medium max-w-2xl leading-relaxed">
            The era of scrolling through scams is over. Join the verified rental ecosystem today.
          </p>
          <div className="flex flex-col md:flex-row gap-6">
            <Link href="/properties" className="bg-[#408A71] hover:bg-emerald-600 text-white px-12 py-6 rounded-2xl font-black text-xl shadow-2xl shadow-[#408A71]/40 transition-all hover:-translate-y-2 flex items-center gap-4">
              Get Started Now <CheckCircle2 size={24} />
            </Link>
            <Link href="/verification" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-12 py-6 rounded-2xl font-black text-xl transition-all hover:-translate-y-2">
              Learn More
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
