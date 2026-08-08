"use client";

import { useState } from "react";
import { Search, User, ShieldCheck, ShieldAlert, Lock, CheckCircle2, RefreshCw } from "lucide-react";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: string;
  created_at?: string;
  isMainAdmin?: boolean;
}

interface AdminUserManagementProps {
  isSuperAdmin: boolean;
  initialUsers: UserProfile[];
}

export default function AdminUserManagement({
  isSuperAdmin,
  initialUsers,
}: AdminUserManagementProps) {
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filter users by email or full name
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const matchEmail = u.email.toLowerCase().includes(query);
    const matchName = u.full_name ? u.full_name.toLowerCase().includes(query) : false;
    return matchEmail || matchName;
  });

  const handleToggleRole = async (userId: string, currentRole: string, targetEmail: string) => {
    if (!isSuperAdmin) {
      setMessage({
        type: "error",
        text: "Permission Denied: Only the Main Admin can assign or revoke admin roles.",
      });
      return;
    }

    const newRole = currentRole === "admin" ? "user" : "admin";
    setUpdatingId(userId);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/toggle-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, targetRole: newRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update role");
      }

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );

      setMessage({
        type: "success",
        text: `Successfully updated ${targetEmail} to '${newRole.toUpperCase()}'.`,
      });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update user role." });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#1A1A1A] border border-[#81D607]/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#81D607] text-[#111111] text-[10px] font-mono font-extrabold uppercase">
              Admin Module
            </span>
            <h1 className="text-xl font-mono font-extrabold text-[#E1E6EB]">
              User Management & Admin Roles
            </h1>
          </div>
          <p className="text-xs text-[#9DA4B0]">
            Search registered users by name or email. {isSuperAdmin ? "Main Admin can promote users to Admin or demote them to normal users." : "Only Main Admin can modify roles."}
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-[#81D607] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-[#111111] border border-[#81D607]/40 text-[#E1E6EB] placeholder-[#9DA4B0] text-xs font-mono pl-9 pr-4 py-2.5 rounded-none focus:outline-none focus:border-[#81D607]"
          />
        </div>
      </div>

      {/* Notice for Sub-Admins */}
      {!isSuperAdmin && (
        <div className="p-4 bg-[#111111] border border-[#81D607]/40 text-xs text-[#9DA4B0] flex items-start gap-3 rounded-none">
          <ShieldAlert className="w-4 h-4 text-[#81D607] shrink-0 mt-0.5" />
          <div>
            <span className="text-[#81D607] font-mono font-bold block mb-0.5">Sub-Admin Access Active</span>
            <span>You have full administrative capabilities across the dashboard. However, promoting or demoting user admin roles is strictly reserved for the Main Admin configured in <code className="text-[#81D607]">.env</code>.</span>
          </div>
        </div>
      )}

      {/* Alert Notification */}
      {message && (
        <div
          className={`p-3 text-xs font-mono flex items-center justify-between rounded-none border ${
            message.type === "success"
              ? "bg-[#111111] border-[#81D607] text-[#81D607]"
              : "bg-[#111111] border-red-500 text-red-400"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="font-bold underline ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="border border-[#E1E6EB]/10 bg-[#1A1A1A] overflow-x-auto rounded-none">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-[#111111] border-b border-[#E1E6EB]/10 font-mono text-[11px] uppercase text-[#9DA4B0]">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Current Role</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E1E6EB]/10 text-[#E1E6EB]">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[#9DA4B0] font-mono text-xs">
                  No users found matching "{searchQuery}".
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const isUserMainAdmin = u.isMainAdmin;
                const isAdmin = u.role === "admin";
                const isUpdating = updatingId === u.id;

                return (
                  <tr key={u.id} className="hover:bg-[#111111]/50 transition-colors">
                    {/* User Profile Cell */}
                    <td className="py-3 px-4 font-mono font-bold">
                      <div className="flex items-center gap-3">
                        {u.avatar_url ? (
                          <img
                            src={u.avatar_url}
                            alt={u.full_name || u.email}
                            className="w-7 h-7 border border-[#81D607] object-cover shrink-0 rounded-none"
                          />
                        ) : (
                          <div className="w-7 h-7 bg-[#111111] border border-[#81D607]/40 flex items-center justify-center text-[#81D607] shrink-0 rounded-none">
                            <User className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <span>{u.full_name || "Registered User"}</span>
                      </div>
                    </td>

                    {/* Email Cell */}
                    <td className="py-3 px-4 font-mono text-[#9DA4B0]">
                      {u.email}
                    </td>

                    {/* Role Badge Cell */}
                    <td className="py-3 px-4">
                      {isUserMainAdmin ? (
                        <span className="px-2.5 py-1 bg-[#81D607] text-[#111111] font-mono font-extrabold text-[10px] uppercase rounded-none inline-flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Main Admin (Env)</span>
                        </span>
                      ) : isAdmin ? (
                        <span className="px-2.5 py-1 bg-[#111111] border border-[#81D607] text-[#81D607] font-mono font-bold text-[10px] uppercase rounded-none inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-[#81D607]" />
                          <span>Admin</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#9DA4B0] font-mono text-[10px] uppercase rounded-none">
                          User
                        </span>
                      )}
                    </td>

                    {/* Action Buttons Cell */}
                    <td className="py-3 px-4 text-right">
                      {isUserMainAdmin ? (
                        <span className="text-[10px] font-mono text-[#9DA4B0] italic">
                          Protected Main Admin
                        </span>
                      ) : isSuperAdmin ? (
                        <button
                          onClick={() => handleToggleRole(u.id, u.role, u.email)}
                          disabled={isUpdating}
                          className={`px-3 py-1.5 font-mono font-bold text-[11px] transition-colors rounded-none ${
                            isAdmin
                              ? "bg-red-950/80 text-red-400 border border-red-500/50 hover:bg-red-600 hover:text-white"
                              : "bg-[#81D607] text-[#111111] hover:bg-[#72BE06]"
                          } disabled:opacity-50`}
                        >
                          {isUpdating ? (
                            <span className="flex items-center gap-1">
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Updating...</span>
                            </span>
                          ) : isAdmin ? (
                            "Make Normal User"
                          ) : (
                            "Make Admin"
                          )}
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-[#9DA4B0]">
                          Read-Only (Sub-Admin)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
