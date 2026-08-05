"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowLeft, AlertTriangle, Lock } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

function AdminSignInForm() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "AuthCallbackFailed") {
      setErrorMessage("Authentication failed during Google login. Please try again.");
    } else if (error === "AccessDenied") {
      setErrorMessage("Access Denied: Your account does not have the required 'admin' role.");
    }

    // Check if user is already signed in
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setCurrentUserEmail(user.email);
      }
    };
    checkUser();
  }, [searchParams]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 text-center">
      {/* Back Link */}
      <div className="text-left">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#81D607] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>
      </div>

      {/* Header Card */}
      <div className="bg-[#1A1A1A] border border-[#81D607]/40 p-8 space-y-6 rounded-none text-center">
        <div className="w-14 h-14 bg-[#111111] border border-[#81D607] flex items-center justify-center text-[#81D607] mx-auto rounded-none">
          <Lock className="w-7 h-7 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <div className="inline-block px-3 py-1 bg-[#111111] border border-[#81D607]/30 text-[#81D607] text-[10px] font-mono font-bold uppercase tracking-wider rounded-none">
            Restricted Area
          </div>
          <h1 className="text-2xl font-extrabold text-[#E1E6EB]">
            Admin Authentication
          </h1>
          <p className="text-xs text-[#9DA4B0] font-sans leading-relaxed">
            Sign in with your verified Google email to access the Codzilla Technologies Administrative Dashboard.
          </p>
        </div>

        {/* Error Message Alert */}
        {errorMessage && (
          <div className="p-4 bg-[#111111] border border-red-500/60 text-red-400 text-xs font-sans text-left flex items-start gap-3 rounded-none">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Current Signed In User Banner */}
        {currentUserEmail && (
          <div className="p-3 bg-[#111111] border border-[#81D607]/30 text-xs font-mono text-[#9DA4B0] space-y-2 rounded-none">
            <p>Signed in as: <span className="text-[#81D607]">{currentUserEmail}</span></p>
            <button
              onClick={() => router.push("/admin")}
              className="w-full py-2 bg-[#1A1A1A] border border-[#81D607] text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] font-bold transition-colors rounded-none"
            >
              Go to Admin Dashboard
            </button>
          </div>
        )}

        {/* Single Google Sign-In Mechanism */}
        <div className="pt-2">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 font-mono font-bold text-sm text-[#111111] bg-[#81D607] hover:bg-[#72BE06] transition-colors rounded-none disabled:opacity-50"
            id="google-signin-btn"
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{loading ? "Connecting to Google..." : "Sign in with Google"}</span>
          </button>
        </div>

        <div className="pt-4 border-t border-[#E1E6EB]/10 text-[11px] text-[#9DA4B0] font-sans">
          <p className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#81D607]" />
            Protected by Supabase OAuth & RBAC Policies
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminSignInPage() {
  return (
    <main className="min-h-screen py-16 bg-[#111111] text-[#E1E6EB] flex flex-col justify-center items-center px-4">
      <Suspense fallback={<div className="text-xs font-mono text-[#81D607]">Loading Authentication...</div>}>
        <AdminSignInForm />
      </Suspense>
    </main>
  );
}
