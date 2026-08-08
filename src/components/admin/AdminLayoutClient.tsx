"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { AdminNavigationProvider, useAdminNavigation } from "./AdminNavigationContext";

interface AdminLayoutClientProps {
  userEmail: string;
  fullName: string;
  avatarUrl?: string;
  isSuperAdmin: boolean;
  children: React.ReactNode;
}

function AdminLayoutInner({
  userEmail,
  fullName,
  avatarUrl,
  isSuperAdmin,
  children,
}: AdminLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isNavigating } = useAdminNavigation();

  return (
    <main className="h-screen max-h-screen w-screen overflow-hidden bg-[#111111] text-[#E1E6EB] flex font-sans select-none relative">
      {/* Sidebar (Desktop + Mobile Drawer) */}
      <AdminSidebar
        userEmail={userEmail}
        fullName={fullName}
        avatarUrl={avatarUrl}
        isSuperAdmin={isSuperAdmin}
        isOpenMobile={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Panel Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#111111] relative">
        <AdminHeader
          userEmail={userEmail}
          fullName={fullName}
          avatarUrl={avatarUrl}
          isSuperAdmin={isSuperAdmin}
          onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
        />

        {/* Content Workspace */}
        <div className="flex-1 overflow-y-auto relative">
          {children}
        </div>
      </div>
    </main>
  );
}

export default function AdminLayoutClient(props: AdminLayoutClientProps) {
  return (
    <AdminNavigationProvider>
      <AdminLayoutInner {...props} />
    </AdminNavigationProvider>
  );
}

