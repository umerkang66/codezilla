"use client";

import { useState } from "react";
import {
  Mail,
  MailOpen,
  Search,
  CheckCircle2,
  Trash2,
  X,
  ExternalLink,
  RefreshCw,
  MessageSquare,
  Clock,
  User,
  Inbox,
  Filter,
  CheckCheck,
} from "lucide-react";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  is_read: boolean;
  created_at: string;
  read_at?: string | null;
}

interface AdminContactMessagesProps {
  initialMessages: ContactMessage[];
}

export default function AdminContactMessages({ initialMessages }: AdminContactMessagesProps) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Unread count and Total count
  const unreadCount = messages.filter((m) => !m.is_read).length;
  const totalCount = messages.length;

  // Filter messages based on active tab and search query
  const filteredMessages = messages.filter((msg) => {
    if (activeTab === "unread" && msg.is_read) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = msg.name.toLowerCase().includes(q);
      const emailMatch = msg.email.toLowerCase().includes(q);
      const serviceMatch = msg.service.toLowerCase().includes(q);
      const contentMatch = msg.message.toLowerCase().includes(q);
      return nameMatch || emailMatch || serviceMatch || contentMatch;
    }

    return true;
  });

  // Refresh messages list from API
  const refreshMessages = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/contact-messages");
      const data = await res.json();
      if (res.ok && data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to refresh contact messages", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Toggle mark as read/unread
  const handleToggleRead = async (id: string, currentReadStatus: boolean) => {
    const newStatus = !currentReadStatus;

    // Optimistic UI update
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              is_read: newStatus,
              read_at: newStatus ? new Date().toISOString() : null,
            }
          : msg
      )
    );

    if (selectedMessage?.id === id) {
      setSelectedMessage((prev) =>
        prev
          ? {
              ...prev,
              is_read: newStatus,
              read_at: newStatus ? new Date().toISOString() : null,
            }
          : null
      );
    }

    try {
      const res = await fetch("/api/admin/contact-messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_read: newStatus }),
      });

      if (!res.ok) {
        // Revert on error
        setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, is_read: currentReadStatus } : msg));
      }
    } catch (err) {
      console.error("Error toggling read status", err);
    }
  };

  // Open Message Modal + Automatically Mark as Read if unread
  const handleOpenModal = (msg: ContactMessage) => {
    setSelectedMessage(msg);

    // If message is unread, automatically mark as read upon opening
    if (!msg.is_read) {
      handleToggleRead(msg.id, false);
    }
  };

  // Delete message
  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact message?")) return;

    // Optimistic remove
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }

    try {
      const res = await fetch(`/api/admin/contact-messages?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setActionMessage("Contact message deleted.");
        setTimeout(() => setActionMessage(null), 3000);
      } else {
        refreshMessages();
      }
    } catch (err) {
      console.error("Error deleting message", err);
      refreshMessages();
    }
  };

  // Mark all unread as read
  const handleMarkAllAsRead = async () => {
    const unreadMsgs = messages.filter((m) => !m.is_read);
    if (unreadMsgs.length === 0) return;

    setMessages((prev) =>
      prev.map((msg) => ({
        ...msg,
        is_read: true,
        read_at: new Date().toISOString(),
      }))
    );

    for (const msg of unreadMsgs) {
      fetch("/api/admin/contact-messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg.id, is_read: true }),
      }).catch(console.error);
    }

    setActionMessage("All messages marked as read.");
    setTimeout(() => setActionMessage(null), 3000);
  };

  return (
    <div className="flex-1 p-6 sm:p-8 flex flex-col h-full overflow-y-auto text-left space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E1E6EB]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-mono font-extrabold text-[#E1E6EB] tracking-tight">
              Contact Messages
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 bg-[#81D607] text-[#111111] text-xs font-mono font-extrabold rounded-none flex items-center gap-1 animate-pulse">
                <span>{unreadCount} Unread</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#9DA4B0]">
            Review, manage, and respond to incoming project inquiries and contact form submissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-3.5 py-2 bg-[#1A1A1A] border border-[#81D607]/60 text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] text-xs font-mono font-bold transition-colors rounded-none flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All as Read</span>
            </button>
          )}

          <button
            onClick={refreshMessages}
            disabled={isRefreshing}
            className="px-3.5 py-2 bg-[#1A1A1A] border border-[#E1E6EB]/15 text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] text-xs font-mono transition-colors rounded-none flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-[#81D607]/10 border border-[#81D607] text-[#81D607] text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionMessage}</span>
          </div>
        </div>
      )}

      {/* Tabs and Search Navigation Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center border border-[#E1E6EB]/15 bg-[#1A1A1A] p-1 rounded-none">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 font-mono text-xs font-bold transition-all flex items-center gap-2 rounded-none ${
              activeTab === "all"
                ? "bg-[#81D607] text-[#111111]"
                : "text-[#9DA4B0] hover:text-[#E1E6EB]"
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>All Messages</span>
            <span
              className={`px-1.5 py-0.2 text-[10px] rounded-none ${
                activeTab === "all" ? "bg-[#111111] text-[#81D607]" : "bg-[#111111] text-[#9DA4B0]"
              }`}
            >
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("unread")}
            className={`px-4 py-2 font-mono text-xs font-bold transition-all flex items-center gap-2 rounded-none ${
              activeTab === "unread"
                ? "bg-[#81D607] text-[#111111]"
                : "text-[#9DA4B0] hover:text-[#E1E6EB]"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Unread Messages</span>
            <span
              className={`px-1.5 py-0.2 text-[10px] rounded-none ${
                activeTab === "unread" ? "bg-[#111111] text-[#81D607]" : "bg-[#81D607]/20 text-[#81D607]"
              }`}
            >
              {unreadCount}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#9DA4B0] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, service, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-[#1A1A1A] border border-[#E1E6EB]/15 text-xs text-[#E1E6EB] focus:border-[#81D607] focus:outline-none font-mono rounded-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9DA4B0] hover:text-[#E1E6EB]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages List / Table */}
      <div className="bg-[#1A1A1A] border border-[#E1E6EB]/15 rounded-none overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-[#111111] border border-[#E1E6EB]/10 flex items-center justify-center text-[#9DA4B0] mx-auto rounded-none">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-mono font-bold text-[#E1E6EB]">
              No Contact Messages Found
            </h3>
            <p className="text-xs text-[#9DA4B0] max-w-sm mx-auto">
              {searchQuery
                ? `No results found matching "${searchQuery}". Try clearing search.`
                : activeTab === "unread"
                ? "You have read all incoming messages! Great job."
                : "No contact submissions received yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E1E6EB]/10">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-[#111111] text-[10px] font-mono uppercase tracking-wider text-[#9DA4B0]">
              <div className="col-span-1">Status</div>
              <div className="col-span-3">Sender</div>
              <div className="col-span-2">Service</div>
              <div className="col-span-4">Message Snippet</div>
              <div className="col-span-2 text-right">Date / Action</div>
            </div>

            {/* Message Item Rows */}
            {filteredMessages.map((msg) => {
              const formattedDate = new Date(msg.created_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={msg.id}
                  onClick={() => handleOpenModal(msg)}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-4 md:px-6 md:py-4 items-center cursor-pointer transition-colors hover:bg-[#111111]/80 ${
                    !msg.is_read
                      ? "bg-[#81D607]/5 border-l-4 border-l-[#81D607]"
                      : "border-l-4 border-l-transparent opacity-90"
                  }`}
                >
                  {/* Status Indicator */}
                  <div className="md:col-span-1 flex items-center gap-2">
                    {!msg.is_read ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#81D607] text-[#111111] font-mono font-bold text-[10px] uppercase rounded-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#111111] animate-ping" />
                        <span>Unread</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#111111] border border-[#E1E6EB]/20 text-[#9DA4B0] font-mono text-[10px] uppercase rounded-none">
                        <MailOpen className="w-3 h-3 text-[#9DA4B0]" />
                        <span>Read</span>
                      </span>
                    )}
                  </div>

                  {/* Sender Details */}
                  <div className="md:col-span-3 text-left">
                    <div className="text-xs font-mono font-bold text-[#E1E6EB] truncate">
                      {msg.name}
                    </div>
                    <div className="text-[11px] font-mono text-[#81D607] truncate">
                      {msg.email}
                    </div>
                  </div>

                  {/* Service Badge */}
                  <div className="md:col-span-2 text-left">
                    <span className="px-2 py-1 bg-[#111111] border border-[#E1E6EB]/15 text-[11px] font-mono text-[#E1E6EB] inline-block truncate max-w-full">
                      {msg.service}
                    </span>
                  </div>

                  {/* Message Snippet */}
                  <div className="md:col-span-4 text-left">
                    <p className="text-xs text-[#9DA4B0] truncate line-clamp-1 font-sans">
                      {msg.message}
                    </p>
                  </div>

                  {/* Received Date & Quick Actions */}
                  <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[10px] font-mono text-[#9DA4B0] whitespace-nowrap">
                      {formattedDate}
                    </span>

                    <div className="flex items-center gap-1">
                      {/* Mark Read/Unread Button */}
                      <button
                        title={msg.is_read ? "Mark as Unread" : "Mark as Read"}
                        onClick={() => handleToggleRead(msg.id, msg.is_read)}
                        className="p-1.5 text-[#9DA4B0] hover:text-[#81D607] hover:bg-[#111111] transition-colors rounded-none"
                      >
                        {msg.is_read ? (
                          <Mail className="w-4 h-4" />
                        ) : (
                          <MailOpen className="w-4 h-4 text-[#81D607]" />
                        )}
                      </button>

                      {/* Delete Button */}
                      <button
                        title="Delete Message"
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-1.5 text-[#9DA4B0] hover:text-red-400 hover:bg-[#111111] transition-colors rounded-none"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MESSAGE DETAILS MODAL */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#1A1A1A] border border-[#81D607]/60 shadow-2xl flex flex-col max-h-[90vh] rounded-none animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 bg-[#111111] border-b border-[#E1E6EB]/15 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#1A1A1A] border border-[#81D607] flex items-center justify-center text-[#81D607]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-mono font-bold text-[#E1E6EB]">
                    Contact Message Details
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#9DA4B0]">
                    <span>ID: {selectedMessage.id.slice(0, 8)}...</span>
                    <span>•</span>
                    <span className="text-[#81D607] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Automatically Marked as Read
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 text-[#9DA4B0] hover:text-[#E1E6EB] hover:bg-[#1A1A1A] transition-colors"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-left font-mono">
              {/* Sender Details Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#111111] border border-[#E1E6EB]/10">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#9DA4B0] uppercase block">Sender Name</span>
                  <div className="text-sm font-bold text-[#E1E6EB] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#81D607]" />
                    <span>{selectedMessage.name}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#9DA4B0] uppercase block">Email Address</span>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-sm font-bold text-[#81D607] hover:underline flex items-center gap-1.5 break-all"
                  >
                    <span>{selectedMessage.email}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#9DA4B0] uppercase block">Service Requested</span>
                  <span className="inline-block px-2.5 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-xs text-[#E1E6EB] font-bold">
                    {selectedMessage.service}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#9DA4B0] uppercase block">Submission Time</span>
                  <div className="text-xs text-[#E1E6EB] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#81D607]" />
                    <span>
                      {new Date(selectedMessage.created_at).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Scope / Body */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-[#9DA4B0] uppercase tracking-wider block">
                  Full Message Content:
                </span>
                <div className="p-5 bg-[#111111] border border-[#E1E6EB]/15 text-sm text-[#E1E6EB] whitespace-pre-wrap font-sans leading-relaxed min-h-[120px]">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 bg-[#111111] border-t border-[#E1E6EB]/15 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re:%20Inquiry%20regarding%20${encodeURIComponent(
                    selectedMessage.service
                  )}`}
                  className="px-4 py-2.5 bg-[#81D607] hover:bg-[#72BE06] text-[#111111] font-mono font-bold text-xs transition-colors rounded-none flex items-center justify-center gap-2 flex-1 sm:flex-initial"
                >
                  <Mail className="w-4 h-4" />
                  <span>Reply via Email</span>
                </a>

                <button
                  onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.is_read)}
                  className="px-4 py-2.5 bg-[#1A1A1A] border border-[#E1E6EB]/20 text-[#E1E6EB] hover:text-[#81D607] font-mono text-xs transition-colors rounded-none flex items-center justify-center gap-2"
                >
                  {selectedMessage.is_read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  <span>{selectedMessage.is_read ? "Mark as Unread" : "Mark as Read"}</span>
                </button>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="px-4 py-2.5 bg-red-950/80 border border-red-500/50 text-red-400 hover:bg-red-900 font-mono text-xs transition-colors rounded-none flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>

                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-5 py-2.5 bg-[#1A1A1A] border border-[#81D607] text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] font-mono font-bold text-xs transition-colors rounded-none flex items-center justify-center gap-1.5"
                >
                  <span>Close Modal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
