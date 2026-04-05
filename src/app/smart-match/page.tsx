"use client";

import { useState, useEffect } from "react";
import { Sparkles, Home, User as UserIcon, CheckCircle2, ChevronRight, Activity, Zap, Info, Dog, Carrot, IndianRupee, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SmartMatchDemoPage() {
  // Tenant Preferences
  const [tenantBudget, setTenantBudget] = useState(25000);
  const [tenantBeds, setTenantBeds] = useState(2);
  const [tenantPets, setTenantPets] = useState(false);
  const [tenantVeg, setTenantVeg] = useState(false);

  // Property Rules
  const [propRent, setPropRent] = useState(26000);
  const [propBeds, setPropBeds] = useState(2);
  const [propPetsAllowed, setPropPetsAllowed] = useState(true);
  const [propVegOnly, setPropVegOnly] = useState(false);

  // Computed Match State
  const [matchScore, setMatchScore] = useState(0);
  const [breakdown, setBreakdown] = useState<{label: string, score: number, desc: string}[]>([]);

  useEffect(() => {
    // Re-calculate match locally for the demo
    let totalScore = 0;
    const maxScore = 100;
    const newBreakdown = [];

    // 1. Budget Match (40% weight)
    const diff = Math.abs(tenantBudget - propRent);
    let budgetScore = 40;
    let budgetDesc = "Exact fit or under budget";
    if (diff > 0) {
      if (propRent > tenantBudget) {
         const overagePercent = (diff / tenantBudget) * 100;
         if (overagePercent <= 5) { budgetScore = 35; budgetDesc = "Slightly over budget"; }
         else if (overagePercent <= 10) { budgetScore = 20; budgetDesc = "Over budget but negotiable"; }
         else { budgetScore = 0; budgetDesc = "Exceeds strict budget constraints"; }
      } else {
         budgetScore = 40; budgetDesc = "Fantastic deal under budget";
      }
    }
    totalScore += budgetScore;
    newBreakdown.push({ label: "Budget Alignment", score: (budgetScore/40)*100, desc: budgetDesc });

    // 2. Spatial Match (30% weight)
    let bedsScore = 30;
    let bedsDesc = "Perfect spatial match";
    if (tenantBeds !== propBeds) {
       if (propBeds > tenantBeds) {
          bedsScore = 25; bedsDesc = "Extra space available";
       } else {
          bedsScore = 0; bedsDesc = "Insufficient bedrooms";
       }
    }
    totalScore += bedsScore;
    newBreakdown.push({ label: "Space Requirements", score: Math.round((bedsScore/30)*100), desc: bedsDesc });

    // 3. Pet Policy Match (15% weight)
    let petScore = 15;
    let petDesc = "Compatible pet policy";
    if (tenantPets && !propPetsAllowed) {
       petScore = 0;
       petDesc = "Property does not allow pets";
    } else if (!tenantPets) {
       petDesc = "No pets required";
    }
    totalScore += petScore;
    newBreakdown.push({ label: "Pet Policy", score: Math.round((petScore/15)*100), desc: petDesc });

    // 4. Dietary/Lifestyle Match (15% weight)
    let vegScore = 15;
    let vegDesc = "Lifestyle compatible";
    if (propVegOnly && !tenantVeg) {
       vegScore = 0;
       vegDesc = "Owner requires vegetarians only";
    } else if (tenantVeg && !propVegOnly) {
       vegDesc = "Tenant is vegetarian, property has no restriction";
    }
    totalScore += vegScore;
    newBreakdown.push({ label: "Lifestyle Rules", score: Math.round((vegScore/15)*100), desc: vegDesc });

    setMatchScore(totalScore);
    setBreakdown(newBreakdown);
  }, [tenantBudget, tenantBeds, tenantPets, tenantVeg, propRent, propBeds, propPetsAllowed, propVegOnly]);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 overflow-hidden">
      
      {/* Background aesthetics */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-green-900/5 to-transparent pointer-events-none" />
      <div className="absolute top-40 right-0 w-[600px] h-[600px] bg-[#408A71]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />


      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#408A71]/10 to-green-500/10 border border-[#408A71]/20 px-4 py-2 rounded-full mb-6 text-[#408A71] font-bold text-sm tracking-wide shadow-sm">
            <Sparkles size={16} /> Proprietary Core Technology
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-6">
            Smart Match <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#408A71] to-emerald-500">Algorithm</span>
          </h1>
          <p className="text-xl text-gray-600 font-medium leading-relaxed">
            Unlike traditional searches, our engine actively computes mutual compatibility scores in real-time, matching tenant lifestyles with owner requirements perfectly.
          </p>
        </div>

        {/* Studio Layout */}
        <div className="grid lg:grid-cols-[1fr,400px,1fr] gap-8 items-start mb-20">
          
          {/* Left Column: Tenant Needs */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative group overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                <UserIcon size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Tenant Profile</h2>
                <p className="text-sm text-gray-500 font-medium">Desired Requirements</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Budget */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <IndianRupee size={16} className="text-gray-400"/> Max Budget
                  </label>
                  <span className="font-extrabold text-[#408A71] text-lg">₹{tenantBudget.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="10000" max="60000" step="1000" 
                  value={tenantBudget} onChange={(e) => setTenantBudget(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#408A71]"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                  <span>10k</span><span>60k</span>
                </div>
              </div>

              {/* Beds */}
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-3">Bedrooms Needed</label>
                <div className="flex gap-2">
                  {[1,2,3,4].map(num => (
                    <button 
                      key={`t-bed-${num}`}
                      onClick={() => setTenantBeds(num)}
                      className={`flex-1 py-2 font-bold text-sm rounded-xl border transition-all ${tenantBeds === num ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      {num} {num === 4 ? 'BHK+' : 'BHK'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setTenantPets(!tenantPets)}
                  className={`p-4 rounded-2xl border text-left transition-colors ${tenantPets ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                >
                  <Dog size={20} className={tenantPets ? 'text-indigo-600 mb-2' : 'text-gray-400 mb-2'} />
                  <div className={`font-bold text-sm ${tenantPets ? 'text-indigo-900' : 'text-gray-700'}`}>Have Pets</div>
                </button>

                <button 
                  onClick={() => setTenantVeg(!tenantVeg)}
                  className={`p-4 rounded-2xl border text-left transition-colors ${tenantVeg ? 'bg-green-50 border-green-200 ring-1 ring-green-500' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                >
                  <Carrot size={20} className={tenantVeg ? 'text-green-600 mb-2' : 'text-gray-400 mb-2'} />
                  <div className={`font-bold text-sm ${tenantVeg ? 'text-green-900' : 'text-gray-700'}`}>Vegetarian</div>
                </button>
              </div>
            </div>
          </div>

          {/* Center Column: Live Dial */}
          <div className="flex flex-col justify-center items-center h-full relative py-8">
            <div className="absolute hidden lg:block inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iMTAwJSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMEwzMCAxMDAwIiBzdHJva2U9IiNFMjU4MjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iOCAzIiBmaWxsPSJub25lIi8+PC9zdmc+')] bg-repeat-y bg-center opacity-30 -z-10" />
            
            <div className="text-center mb-4">
              <span className="text-xs uppercase tracking-widest font-extrabold text-gray-400">Live Calculation</span>
            </div>

            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] drop-shadow-md" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#F3F4F6" strokeWidth="6" />
                <circle cx="50" cy="50" r="45" fill="none" 
                  stroke={matchScore >= 90 ? '#22C55E' : matchScore >= 70 ? '#EAB308' : '#EF4444'} 
                  strokeWidth="6" strokeLinecap="round" 
                  strokeDasharray={`${(matchScore / 100) * 283} 283`}
                  className="transition-all duration-700 ease-out origin-center -rotate-90 transform"
                />
              </svg>
              <div className="bg-white rounded-full w-56 h-56 flex flex-col items-center justify-center shadow-2xl relative z-10 border border-gray-50">
                <Zap size={24} className={matchScore >= 90 ? 'text-green-500 mb-2' : matchScore >= 70 ? 'text-yellow-500 mb-2' : 'text-red-500 mb-2'} />
                <span className="text-6xl font-black text-gray-900 tracking-tighter">{matchScore}%</span>
                <span className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-wide">Match Rate</span>
              </div>
            </div>

            <div className="mt-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 max-w-[280px] w-full text-center">
              <div className={`font-bold text-sm ${matchScore >= 90 ? 'text-green-600' : matchScore >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                {matchScore >= 90 ? "★ Perfect Synergy" : matchScore >= 70 ? "Good Candidate" : "Low Compatibility"}
              </div>
            </div>
          </div>

          {/* Right Column: Property Rules */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative group overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-400 to-red-500" />
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-orange-50 p-3 rounded-2xl text-orange-600">
                <Home size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Property Rules</h2>
                <p className="text-sm text-gray-500 font-medium">Owner Stipulations</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Rent */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <IndianRupee size={16} className="text-gray-400"/> Asking Rent
                  </label>
                  <span className="font-extrabold text-orange-600 text-lg">₹{propRent.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="10000" max="60000" step="1000" 
                  value={propRent} onChange={(e) => setPropRent(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                  <span>10k</span><span>60k</span>
                </div>
              </div>

              {/* Beds */}
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-3">Property Layout</label>
                <div className="flex gap-2">
                  {[1,2,3,4].map(num => (
                    <button 
                      key={`p-bed-${num}`}
                      onClick={() => setPropBeds(num)}
                      className={`flex-1 py-2 font-bold text-sm rounded-xl border transition-all ${propBeds === num ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      {num} {num === 4 ? 'BHK+' : 'BHK'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setPropPetsAllowed(!propPetsAllowed)}
                  className={`p-4 rounded-2xl border text-left transition-colors ${propPetsAllowed ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500' : 'bg-red-50 border-red-200 text-red-500'}`}
                >
                  <Dog size={20} className={propPetsAllowed ? 'text-indigo-600 mb-2' : 'text-red-500 mb-2'} />
                  <div className={`font-bold text-sm ${propPetsAllowed ? 'text-indigo-900' : 'text-red-900'}`}>
                    {propPetsAllowed ? 'Pets Allowed' : 'Strictly No Pets'}
                  </div>
                </button>

                <button 
                  onClick={() => setPropVegOnly(!propVegOnly)}
                  className={`p-4 rounded-2xl border text-left transition-colors ${propVegOnly ? 'bg-amber-50 border-amber-200 ring-1 ring-amber-500' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                >
                  <Carrot size={20} className={propVegOnly ? 'text-amber-600 mb-2' : 'text-gray-400 mb-2'} />
                  <div className={`font-bold text-sm ${propVegOnly ? 'text-amber-900' : 'text-gray-700'}`}>
                    {propVegOnly ? 'Veg Only Req.' : 'No Dietary Rules'}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Ledger */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-12">
          <div className="bg-gray-900 px-8 py-5 flex items-center gap-3">
             <Activity className="text-[#408A71]" />
             <h3 className="text-white font-bold text-lg">Detailed Compatibility Ledger</h3>
          </div>
          <div className="p-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {breakdown.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-start gap-4">
                    <div className="relative shrink-0 w-12 h-12 flex items-center justify-center font-black text-sm text-gray-900 bg-white rounded-xl shadow-sm border border-gray-200">
                      {item.score}%
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.label}</h4>
                      <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
             
             {/* Security Note */}
             <div className="mt-8 bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900 font-medium">
                  <strong>Trust & Safety Layer:</strong> If the tenant's Trust Score drops below the owner's minimum requirement, the match rate drastically lowers, regardless of budget or preferences.
                </p>
             </div>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="text-center">
          <Link href="/properties" className="inline-flex items-center gap-2 bg-[#408A71] hover:bg-[#34745c] text-white font-bold text-lg px-8 py-4 rounded-full transition-shadow hover:shadow-lg shadow-md">
            Find Your Match <ChevronRight />
          </Link>
        </div>

      </div>
    </div>
  );
}
