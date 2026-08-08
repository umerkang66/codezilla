"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowLeft, AlertTriangle, User, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface InitialUser {
  email: string;
  name: string;
  avatarUrl: string;
}

interface AdminSignInFormProps {
  initialUser?: InitialUser | null;
}

export default function AdminSignInForm({ initialUser }: AdminSignInFormProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<InitialUser | null>(initialUser || null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "AuthCallbackFailed") {
      setErrorMessage("Authentication failed during Google login. Please try again.");
    } else if (error === "AccessDenied") {
      setErrorMessage("Access Denied: Your account does not have the required 'admin' role.");
    }

    const supabase = createClient();

    const handleUserFound = (user: any) => {
      const userMeta = user.user_metadata || {};
      const identityMeta = user.identities?.[0]?.identity_data || {};
      const email = user.email || "";
      const name =
        userMeta.full_name ||
        userMeta.name ||
        identityMeta.full_name ||
        identityMeta.name ||
        email.split("@")[0] ||
        "User";
      const avatarUrl =
        userMeta.avatar_url ||
        userMeta.picture ||
        identityMeta.avatar_url ||
        identityMeta.picture ||
        "";

      setLoggedInUser({ email, name, avatarUrl });
    };

    // If initialUser was not passed by server, check client-side
    if (!initialUser) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          handleUserFound(user);
        }
      });
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleUserFound(session.user);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [searchParams, initialUser]);

  // Handle automatic redirect 2 seconds after user is confirmed logged in
  useEffect(() => {
    if (loggedInUser) {
      const timer = setTimeout(() => {
        router.push("/admin");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loggedInUser, router]);

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
        <div className="w-16 h-16 bg-[#111111] border border-[#81D607] flex items-center justify-center mx-auto rounded-none overflow-hidden relative">
          <Image
            src="/logo.jpg"
            alt="Codzilla Technologies Logo"
            width={64}
            height={64}
            className="w-full h-full object-cover"
            priority
          />
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

        {/* Logged In User Banner */}
        {loggedInUser && (
          <div className="p-4 bg-[#111111] border border-[#81D607] text-left space-y-4 rounded-none shadow-lg">
            <div className="flex items-center gap-3">
              {loggedInUser.avatarUrl ? (
                <img
                  src={loggedInUser.avatarUrl}
                  alt={loggedInUser.name}
                  className="w-12 h-12 border-2 border-[#81D607] object-cover rounded-none shrink-0"
                />
              ) : (
                <div className="w-12 h-12 bg-[#1A1A1A] border-2 border-[#81D607] flex items-center justify-center text-[#81D607] rounded-none shrink-0">
                  <User className="w-6 h-6" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono text-[#81D607] uppercase tracking-wider block font-bold">
                  Logged In As
                </span>
                <h3 className="text-sm font-mono font-bold text-[#E1E6EB] truncate">
                  {loggedInUser.name}
                </h3>
                <p className="text-xs font-mono text-[#9DA4B0] truncate">
                  {loggedInUser.email}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E1E6EB]/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#81D607]">
                <span className="flex items-center gap-2 font-semibold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#81D607]" />
                  Redirecting to Admin Dashboard...
                </span>
                <span className="text-[10px] text-[#9DA4B0]">2s</span>
              </div>

              <button
                onClick={() => router.push("/admin")}
                className="w-full py-2.5 bg-[#81D607] text-[#111111] hover:bg-[#72BE06] font-mono font-bold text-xs transition-colors rounded-none flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Go to Admin Dashboard Now</span>
              </button>
            </div>
          </div>
        )}

        {/* Single Google Sign-In Mechanism */}
        <div className="pt-2">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading || !!loggedInUser}
            className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 font-mono font-bold text-sm text-[#111111] bg-[#81D607] hover:bg-[#72BE06] transition-colors rounded-none disabled:opacity-40 disabled:cursor-not-allowed"
            id="google-signin-btn"
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>
              {loggedInUser
                ? "Already Logged In"
                : loading
                ? "Connecting to Google..."
                : "Sign in with Google"}
            </span>
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
