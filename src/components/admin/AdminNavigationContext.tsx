"use client";

import React, { createContext, useContext, useState, useEffect, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link, { LinkProps } from "next/link";
import { Loader2 } from "lucide-react";

interface AdminNavigationContextType {
  isNavigating: boolean;
  navigatingTo: string | null;
  startNavigation: (href: string) => void;
}

const AdminNavigationContext = createContext<AdminNavigationContextType>({
  isNavigating: false,
  navigatingTo: null,
  startNavigation: () => {},
});

export function AdminNavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  // Reset navigation state whenever pathname changes
  useEffect(() => {
    setNavigatingTo(null);
  }, [pathname]);

  // Safety fallback timeout to clear navigation state after 6s in case navigation is aborted
  useEffect(() => {
    if (navigatingTo) {
      const timer = setTimeout(() => {
        setNavigatingTo(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [navigatingTo]);

  const startNavigation = (href: string) => {
    // If external link or anchor or same page, skip transition handling
    if (!href || href === pathname || href.startsWith("http") || href.startsWith("mailto:")) {
      return;
    }
    setNavigatingTo(href);
    startTransition(() => {
      router.push(href);
    });
  };

  const isNavigating = isPending || navigatingTo !== null;

  return (
    <AdminNavigationContext.Provider value={{ isNavigating, navigatingTo, startNavigation }}>
      {children}
    </AdminNavigationContext.Provider>
  );
}

export function useAdminNavigation() {
  return useContext(AdminNavigationContext);
}

interface AdminNavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  showSpinner?: boolean;
}

export function AdminLink({ href, children, className = "", showSpinner = true, onClick, ...props }: AdminNavLinkProps) {
  const { isNavigating, navigatingTo, startNavigation } = useAdminNavigation();
  const pathname = usePathname();
  const isThisLoading = isNavigating && navigatingTo === href && href !== pathname;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && href && href !== pathname && !href.startsWith("http") && !href.startsWith("mailto:")) {
      startNavigation(href);
    }
  };

  return (
    <Link href={href} onClick={handleClick} className={className} {...props}>
      {children}
      {showSpinner && isThisLoading && (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#81D607] shrink-0" />
      )}
    </Link>
  );
}
