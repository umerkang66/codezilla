"use client";

import Link from "next/link";
import { ShieldCheck, ArrowLeft, LogOut, User } from "lucide-react";

interface AdminHeaderProps {
  userEmail: string;
  fullName: string;
  avatarUrl?: string;
  isSuperAdmin: boolean;
}

export default function AdminHeader({
  userEmail,
  fullName,
  avatarUrl,
  isSuperAdmin,
}: AdminHeaderProps) {
  return (
    <header className="h-16 bg-[#1A1A1A] border-b border-[#81D607]/20 px-8 flex items-center justify-between shrink-0 select-none">
      <div className="flex items-center gap-3">
        <span className="px-2.5 py-1 bg-[#111111] border border-[#81D607]/40 text-[#81D607] font-mono font-bold text-[10px] uppercase tracking-wider rounded-none flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isSuperAdmin ? "Main Admin Active" : "Sub-Admin Active"}</span>
        </span>

        {/* Header User Profile Badge */}
        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#E1E6EB]/10">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-6 h-6 border border-[#81D607] object-cover rounded-none"
            />
          ) : (
            <div className="w-6 h-6 bg-[#111111] border border-[#81D607]/60 flex items-center justify-center text-[#81D607] rounded-none">
              <User className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="text-xs font-mono text-[#9DA4B0]">
            {fullName} (<span className="text-[#E1E6EB]">{userEmail}</span>)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="px-4 py-2 bg-[#111111] border border-[#E1E6EB]/15 text-xs font-mono text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] transition-colors rounded-none flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Website</span>
        </Link>

        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs transition-colors rounded-none flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </header>
  );
}
