"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Menu, X, ArrowRight, ChevronDown, LogOut, Settings, User as UserIcon, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/smart-match", label: "Smart Match" },
  { href: "/verification", label: "Verification & Trust" },
  { href: "/tenancies", label: "Tenancies" },
  { href: "/product-journey", label: "Product Journey" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    setDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-[#408A71] text-white p-2 rounded-xl group-hover:bg-[#34745c] transition-colors shadow-md">
            <Building2 size={24} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            prop<span className="text-[#408A71]">tech</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors relative ${isActive ? "text-[#408A71]" : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-[26px] left-0 right-0 h-1 bg-[#408A71] rounded-t-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/post" className="text-sm font-bold text-[#408A71] bg-white hover:bg-gray-50 px-5 py-2.5 rounded-full transition-colors border border-gray-200 shadow-sm">
            List Property
          </Link>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full border border-gray-200"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon size={18} className="text-[#408A71]" />
              )}
              <span>{user?.displayName || user?.email?.split('@')[0] || "Demo User"}</span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-12 right-0 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 flex flex-col z-50"
                >
                  <Link
                    href="/my-properties"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#408A71] transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Building2 size={16} />
                    My Properties
                  </Link>
                  <Link
                    href="/tenancies"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#408A71] transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <ShieldCheck size={16} />
                    Tenancies
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#408A71] transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <UserIcon size={16} />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#408A71] transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  {user && (
                    <>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut size={16} />
                        Log Out
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {user ? (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#408A71]/20 flex items-center justify-center">
                      <UserIcon size={20} className="text-[#408A71]" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{user.displayName || "User"}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#408A71]/20 flex items-center justify-center">
                    <UserIcon size={20} className="text-[#408A71]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Demo User</p>
                    <p className="text-xs text-gray-500">Preview Mode</p>
                  </div>
                </div>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium p-3 rounded-lg transition-colors ${pathname === link.href
                      ? "bg-green-50 text-[#408A71]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              <hr className="border-gray-100 my-2" />

              <Link
                href="/post"
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold p-3 rounded-lg bg-green-50 text-[#408A71] text-center shadow-sm"
              >
                List Property
              </Link>

              <Link
                href="/my-properties"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-lg font-medium p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Building2 size={20} />
                My Properties
              </Link>
              <Link
                href="/tenancies"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-lg font-medium p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ShieldCheck size={20} />
                Tenancies
              </Link>
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-lg font-medium p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <UserIcon size={20} />
                Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-lg font-medium p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Settings size={20} />
                Settings
              </Link>
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 text-lg font-medium p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut size={20} />
                  Log Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
