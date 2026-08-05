import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/utils/admin-auth";

export async function GET() {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const { data: teams, error } = await auth.dbClient!
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message, teams: [] }, { status: 500 });
  }

  return NextResponse.json({ teams: teams || [] });
}

export async function POST(request: Request) {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      role,
      specialty,
      bio,
      avatar_url,
      avatarUrl,
      initials,
      is_founder,
      isFounder,
      linkedin_url,
      linkedinUrl,
      github_url,
      githubUrl,
      x_url,
      xUrl,
      display_order,
      displayOrder,
      status,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is a required field." }, { status: 400 });
    }
    if (!role || !role.trim()) {
      return NextResponse.json({ error: "Role is a required field." }, { status: 400 });
    }

    const trimmedName = name.trim();
    const computedInitials = (initials || "")
      .trim()
      || trimmedName
          .split(" ")
          .filter(Boolean)
          .map((part: string) => part[0])
          .join("")
          .substring(0, 2)
          .toUpperCase();

    const payload = {
      name: trimmedName,
      role: role.trim(),
      specialty: (specialty || "").trim(),
      bio: (bio || "").trim(),
      avatar_url: (avatar_url || avatarUrl || "").trim(),
      initials: computedInitials,
      is_founder: Boolean(is_founder !== undefined ? is_founder : isFounder),
      linkedin_url: (linkedin_url || linkedinUrl || "").trim(),
      github_url: (github_url || githubUrl || "").trim(),
      x_url: (x_url || xUrl || "").trim(),
      display_order: Number(display_order !== undefined ? display_order : (displayOrder || 0)),
      status: (status || "active").trim(),
      updated_at: new Date().toISOString(),
    };

    const { data: newMember, error } = await auth.dbClient!
      .from("team_members")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Error inserting team member:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, team: newMember });
  } catch (err: any) {
    console.error("Exception creating team member:", err);
    return NextResponse.json({ error: err.message || "Failed to create team member" }, { status: 500 });
  }
}
