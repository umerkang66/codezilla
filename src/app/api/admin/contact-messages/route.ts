import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/utils/admin-auth";

export async function GET() {
  try {
    const auth = await verifyAdminAuth();
    if (!auth.authorized || !auth.dbClient) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
    }

    const { data: messages, error } = await auth.dbClient
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching contact messages:", error);
      return NextResponse.json(
        { error: `Failed to fetch contact messages: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, messages: messages || [] });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await verifyAdminAuth();
    if (!auth.authorized || !auth.dbClient) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, is_read } = body || {};

    if (!id || typeof is_read !== "boolean") {
      return NextResponse.json(
        { error: "Invalid parameters. 'id' (string) and 'is_read' (boolean) are required." },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, any> = {
      is_read,
      read_at: is_read ? new Date().toISOString() : null,
    };

    const { data, error } = await auth.dbClient
      .from("contact_messages")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating contact message:", error);
      return NextResponse.json(
        { error: `Failed to update message: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Contact message marked as ${is_read ? "read" : "unread"}.`,
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await verifyAdminAuth();
    if (!auth.authorized || !auth.dbClient) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const idFromQuery = searchParams.get("id");
    let idToDelete = idFromQuery;

    if (!idToDelete) {
      try {
        const body = await request.json();
        idToDelete = body.id;
      } catch (e) {
        // No body
      }
    }

    if (!idToDelete) {
      return NextResponse.json(
        { error: "Parameter 'id' is required for deletion." },
        { status: 400 }
      );
    }

    const { error } = await auth.dbClient
      .from("contact_messages")
      .delete()
      .eq("id", idToDelete);

    if (error) {
      console.error("Error deleting contact message:", error);
      return NextResponse.json(
        { error: `Failed to delete message: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Contact message deleted successfully.",
      id: idToDelete,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
