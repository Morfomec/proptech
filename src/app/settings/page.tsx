"use client";

import { useAuth } from "@/context/AuthContext";
import { Settings as SettingsIcon, Bell, Lock, Globe, UserCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { user } = useAuth();



  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 text-left">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Settings Content */}
          <div className="md:col-span-2 space-y-6">
            
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <Bell className="text-[#408A71]" size={24} />
                Notifications
              </h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-gray-800">Email Notifications</span>
                    <p className="text-sm text-gray-500">Receive updates about new properties and messages.</p>
                  </div>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none">
                    <input type="checkbox" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-[#408A71]" style={{right: 0, borderColor: '#408A71'}}/>
                    <label className="toggle-label block overflow-hidden h-6 rounded-full bg-[#408A71] cursor-pointer"></label>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <Lock className="text-[#408A71]" size={24} />
                Security
              </h2>
              <button className="text-sm font-semibold text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                Change Password
              </button>
            </div>

          </div>

          {/* Sidebar / Links */}
          <div className="space-y-6">
            <Link href="/profile" className="block bg-[#408A71] text-white rounded-3xl shadow-md p-6 group hover:bg-[#34745c] transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="relative z-10">
                <ShieldCheck size={32} className="mb-4 text-white/90" />
                <h3 className="text-xl font-bold mb-2 group-hover:underline">Verification & Profile</h3>
                <p className="text-green-50 text-sm">Update your personal information and complete verification to unlock features.</p>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
