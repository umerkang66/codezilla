import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import AdminSignInForm from "./AdminSignInForm";

export const metadata = {
  title: "Admin Authentication | Codzilla Technologies",
  description: "Sign in to access the Codzilla Technologies Administrative Dashboard.",
};

export default async function AdminSignInPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialUser = null;

  if (user) {
    const userMeta = user.user_metadata || {};
    const identityMeta = user.identities?.[0]?.identity_data || {};

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    const email = user.email || "";
    const name =
      profile?.full_name ||
      userMeta.full_name ||
      userMeta.name ||
      identityMeta.full_name ||
      identityMeta.name ||
      email.split("@")[0] ||
      "Admin User";
    const avatarUrl =
      profile?.avatar_url ||
      userMeta.avatar_url ||
      userMeta.picture ||
      identityMeta.avatar_url ||
      identityMeta.picture ||
      "";

    initialUser = {
      email,
      name,
      avatarUrl,
    };
  }

  return (
    <main className="min-h-screen py-16 bg-[#111111] text-[#E1E6EB] flex flex-col justify-center items-center px-4">
      <Suspense fallback={<div className="text-xs font-mono text-[#81D607]">Loading Authentication...</div>}>
        <AdminSignInForm initialUser={initialUser} />
      </Suspense>
    </main>
  );
}
