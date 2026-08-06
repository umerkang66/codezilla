import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/utils/admin-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing team member ID" }, { status: 400 });
    }

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

    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) payload.name = name.trim();
    if (role !== undefined) payload.role = role.trim();
    if (specialty !== undefined) payload.specialty = specialty.trim();
    if (bio !== undefined) payload.bio = bio.trim();
    
    const finalAvatar = avatar_url !== undefined ? avatar_url : avatarUrl;
    if (finalAvatar !== undefined) payload.avatar_url = finalAvatar.trim();

    if (initials !== undefined) {
      payload.initials = initials.trim();
    } else if (name) {
      payload.initials = name
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((part: string) => part[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
    }

    const founderVal = is_founder !== undefined ? is_founder : isFounder;
    if (founderVal !== undefined) payload.is_founder = Boolean(founderVal);

    const linkedinVal = linkedin_url !== undefined ? linkedin_url : linkedinUrl;
    if (linkedinVal !== undefined) payload.linkedin_url = linkedinVal.trim();

    const githubVal = github_url !== undefined ? github_url : githubUrl;
    if (githubVal !== undefined) payload.github_url = githubVal.trim();

    const xVal = x_url !== undefined ? x_url : xUrl;
    if (xVal !== undefined) payload.x_url = xVal.trim();

    const orderVal = display_order !== undefined ? display_order : displayOrder;
    if (orderVal !== undefined) payload.display_order = Number(orderVal);

    if (status !== undefined) payload.status = status.trim();

    const { data: updatedMember, error } = await auth.dbClient!
      .from("team_members")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating team member:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, team: updatedMember });
  } catch (err: any) {
    console.error("Exception updating team member:", err);
    return NextResponse.json({ error: err.message || "Failed to update team member" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing team member ID" }, { status: 400 });
    }

    const { error } = await auth.dbClient!
      .from("team_members")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting team member:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id, message: "Team member deleted successfully." });
  } catch (err: any) {
    console.error("Exception deleting team member:", err);
    return NextResponse.json({ error: err.message || "Failed to delete team member" }, { status: 500 });
  }
}
