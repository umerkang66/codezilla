"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Lock, User, ArrowLeft, BookOpen, Mail, Briefcase, UserCheck, Package, MessageSquareQuote, FolderGit2 } from "lucide-react";

interface AdminSidebarProps {
  userEmail: string;
  fullName: string;
  avatarUrl?: string;
  isSuperAdmin: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({
  userEmail,
  fullName,
  avatarUrl,
  isSuperAdmin,
  isOpenMobile = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      name: "Portfolio Projects",
      href: "/admin/portfolio",
      icon: FolderGit2,
      active: pathname.startsWith("/admin/portfolio"),
    },
    {
      name: "Packages Management",
      href: "/admin/packages",
      icon: Package,
      active: pathname.startsWith("/admin/packages"),
    },
    {
      name: "Team Management",
      href: "/admin/teams",
      icon: UserCheck,
      active: pathname.startsWith("/admin/teams"),
    },
    {
      name: "Client Reviews",
      href: "/admin/testimonials",
      icon: MessageSquareQuote,
      active: pathname.startsWith("/admin/testimonials"),
    },
    {
      name: "Talent Acquisition",
      href: "/admin/talent-acquisition",
      icon: Briefcase,
      active: pathname.startsWith("/admin/talent-acquisition"),
    },
    {
      name: "Contact Messages",
      href: "/admin/contact-messages",
      icon: Mail,
      active: pathname.startsWith("/admin/contact-messages"),
    },
    {
      name: "Blogs Management",
      href: "/admin/blogs",
      icon: BookOpen,
      active: pathname.startsWith("/admin/blogs"),
    },
    {
      name: "Admin Management",
      href: "/admin/adminmanagement",
      icon: Users,
      active: pathname === "/admin/adminmanagement",
    },
  ];

  const SidebarContent = (
    <div className="flex flex-col justify-between h-full p-5 text-left select-none">
      <div className="space-y-6">
        {/* Sidebar Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#111111] border border-[#81D607] flex items-center justify-center text-[#81D607] rounded-none">
              <Lock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-mono font-bold text-sm text-[#E1E6EB]">
                CODZILLA
              </span>
              <span className="text-[10px] font-mono text-[#81D607] uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="space-y-1 text-left">
          <div className="text-[10px] font-mono text-[#9DA4B0] uppercase tracking-widest px-3 mb-2">
            Navigation
          </div>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2.5 font-mono font-bold text-xs transition-colors rounded-none ${
                item.active
                  ? "bg-[#81D607] text-[#111111]"
                  : "text-[#E1E6EB] hover:text-[#81D607] hover:bg-[#111111]"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer Account Badge */}
      <div className="pt-4 border-t border-[#E1E6EB]/10 space-y-3 text-left">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-8 h-8 border border-[#81D607] object-cover shrink-0 rounded-none"
            />
          ) : (
            <div className="w-8 h-8 bg-[#111111] border border-[#81D607] flex items-center justify-center text-[#81D607] shrink-0 rounded-none">
              <User className="w-4 h-4" />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-mono font-bold text-[#E1E6EB] truncate">
              {fullName}
            </span>
            <span className="text-[10px] font-mono text-[#81D607] truncate">
              {isSuperAdmin ? "Main Admin" : "Sub-Admin"}
            </span>
          </div>
        </div>

        <Link
          href="/"
          onClick={onCloseMobile}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-[#111111] border border-[#81D607]/40 text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] font-mono font-bold text-xs transition-colors rounded-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Website</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on screens < lg) */}
      <aside className="w-64 bg-[#1A1A1A] border-r border-[#81D607]/20 hidden lg:flex flex-col shrink-0">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer Overlay (visible when open on < lg) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative w-72 bg-[#1A1A1A] border-r border-[#81D607]/40 h-full shadow-2xl z-10 overflow-y-auto">
            {SidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
