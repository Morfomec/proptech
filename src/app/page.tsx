import Link from "next/link";
import { Search, MapPin, Home as HomeIcon, Building, Key, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full min-h-[500px] flex items-center justify-center bg-[#408A71] overflow-hidden pt-32 pb-24">
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Discover Your Next <span className="text-[#a5e0cb]">Dream Home</span>
          </h1>
          <p className="text-lg md:text-xl text-green-50 mb-10 max-w-2xl">
            Whether you&apos;re looking to buy, sell, or rent &mdash; explore thousands of properties tailored to your lifestyle.
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-3xl bg-white rounded-2xl md:rounded-full p-3 md:p-2 flex flex-col md:flex-row items-center shadow-2xl text-gray-900 border border-gray-100 gap-3 md:gap-0">
            <div className="flex-1 flex items-center px-4 w-full md:w-auto border-b md:border-b-0 md:border-r border-gray-100 py-2">
              <MapPin size={20} className="text-[#408A71] md:text-gray-400 mr-3 md:mr-2 shrink-0" />
              <input type="text" placeholder="Location, neighborhood, or city" className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400 text-base" />
            </div>
            <div className="flex-1 flex items-center px-4 w-full md:w-auto py-2">
              <HomeIcon size={20} className="text-[#408A71] md:text-gray-400 mr-3 md:mr-2 shrink-0" />
              <select className="w-full bg-transparent text-gray-800 outline-none appearance-none cursor-pointer text-base">
                <option value="">Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="commercial">Commercial Shop</option>
                <option value="land">Land</option>
              </select>
            </div>
            <button className="w-full md:w-auto bg-[#408A71] hover:bg-[#34745c] text-white px-8 py-3.5 md:py-3 rounded-xl md:rounded-full font-semibold transition-all active:scale-95 flex items-center justify-center border-2 border-transparent hover:border-white/20">
              <Search size={18} className="mr-2" /> Search
            </button>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Properties</h2>
              <p className="text-gray-500">Hand-picked selections tailored for you.</p>
            </div>
            <Link href="/properties" className="text-[#408A71] font-semibold hover:underline hidden md:flex items-center gap-1 transition-all hover:gap-2">
              View all listings &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer flex flex-col h-full">
                <div className="h-64 w-full bg-gray-200 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute top-4 w-full flex justify-between items-start px-4 z-10">
                    <span className="bg-white/95 backdrop-blur-sm text-[#408A71] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wide">
                      FOR SALE
                    </span>
                    <span className="bg-gray-900/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1.5">
                      <Clock size={12} /> 3 Days Ago
                    </span>
                  </div>
                  {/* Mock Image Placeholder */}
                  <HomeIcon size={48} className="text-gray-300 z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#408A71]/10 to-gray-300 transition-transform duration-500 group-hover:scale-105"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#408A71] transition-colors line-clamp-1">
                      Modern Luxury Apartment
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 flex items-center gap-1.5 line-clamp-1">
                      <MapPin size={16} className="shrink-0" /> 123 Skyline Ave, Metro City
                    </p>
                    <div className="text-2xl font-extrabold text-[#408A71] mb-6">
                      $450,000
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-gray-500 text-sm pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5"><Building size={16} className="text-[#408A71]" /> 3 Beds</div>
                    <div className="flex items-center gap-1.5"><Key size={16} className="text-[#408A71]" /> 2 Baths</div>
                    <div className="flex items-center gap-1.5"><HomeIcon size={16} className="text-[#408A71]" /> 1,200 sqft</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
             <Link href="/properties" className="inline-block bg-[#408A71] text-white px-8 py-3 rounded-full font-semibold shadow-md active:scale-95 transition-all">
              View all listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
