export interface ApplicationStatusConfig {
  label: string;
  value: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  dotClass: string;
  badgeClass: string;
  buttonClass: string;
}

export function getApplicationStatusConfig(status: string): ApplicationStatusConfig {
  const normalized = (status || "").toLowerCase().trim();
  switch (normalized) {
    case "pending":
      return {
        label: "Pending",
        value: "pending",
        bgClass: "bg-amber-500/15",
        borderClass: "border-amber-500/50",
        textClass: "text-amber-400",
        dotClass: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]",
        badgeClass: "bg-amber-950/80 border border-amber-500/50 text-amber-300 font-bold",
        buttonClass: "bg-amber-950/60 border-amber-500/50 text-amber-300 hover:border-amber-400 font-bold shadow-[0_0_10px_rgba(245,158,11,0.15)]",
      };
    case "reviewing":
      return {
        label: "Reviewing",
        value: "reviewing",
        bgClass: "bg-sky-500/15",
        borderClass: "border-sky-500/50",
        textClass: "text-sky-400",
        dotClass: "bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]",
        badgeClass: "bg-sky-950/80 border border-sky-500/50 text-sky-300 font-bold",
        buttonClass: "bg-sky-950/60 border-sky-500/50 text-sky-300 hover:border-sky-400 font-bold shadow-[0_0_10px_rgba(14,165,233,0.15)]",
      };
    case "shortlisted":
      return {
        label: "Shortlisted",
        value: "shortlisted",
        bgClass: "bg-[#81D607]/15",
        borderClass: "border-[#81D607]/50",
        textClass: "text-[#81D607]",
        dotClass: "bg-[#81D607] shadow-[0_0_6px_rgba(129,214,7,0.8)]",
        badgeClass: "bg-[#81D607]/20 border border-[#81D607]/60 text-[#81D607] font-bold",
        buttonClass: "bg-[#81D607]/15 border-[#81D607]/60 text-[#81D607] hover:border-[#81D607] font-bold shadow-[0_0_10px_rgba(129,214,7,0.15)]",
      };
    case "rejected":
      return {
        label: "Rejected",
        value: "rejected",
        bgClass: "bg-red-500/15",
        borderClass: "border-red-500/50",
        textClass: "text-red-400",
        dotClass: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]",
        badgeClass: "bg-red-950/80 border border-red-500/50 text-red-300 font-bold",
        buttonClass: "bg-red-950/60 border-red-500/50 text-red-300 hover:border-red-400 font-bold shadow-[0_0_10px_rgba(239,68,68,0.15)]",
      };
    default:
      return {
        label: status || "Unknown",
        value: status || "unknown",
        bgClass: "bg-gray-500/15",
        borderClass: "border-gray-500/40",
        textClass: "text-gray-400",
        dotClass: "bg-gray-400",
        badgeClass: "bg-gray-800 border border-gray-600 text-gray-400 font-bold",
        buttonClass: "bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500 font-bold",
      };
  }
}

export const CANDIDATE_STATUS_OPTIONS = [
  {
    label: "Pending",
    value: "pending",
    badgeClass: "bg-amber-950/80 text-amber-300 border-amber-500/50 font-bold",
    dotClass: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]",
  },
  {
    label: "Reviewing",
    value: "reviewing",
    badgeClass: "bg-sky-950/80 text-sky-300 border-sky-500/50 font-bold",
    dotClass: "bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]",
  },
  {
    label: "Shortlisted",
    value: "shortlisted",
    badgeClass: "bg-[#81D607]/20 text-[#81D607] border-[#81D607]/60 font-bold",
    dotClass: "bg-[#81D607] shadow-[0_0_6px_rgba(129,214,7,0.8)]",
  },
  {
    label: "Rejected",
    value: "rejected",
    badgeClass: "bg-red-950/80 text-red-300 border-red-500/50 font-bold",
    dotClass: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]",
  },
];
