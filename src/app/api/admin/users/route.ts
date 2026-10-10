import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";

export async function GET() {
  const users = db.getProfiles();
  return NextResponse.json({ users });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: "Thiếu userId hoặc role" }, { status: 400 });
    }

    const updated = db.updateUserRole(userId, role);
    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Thiếu userId" }, { status: 400 });
    }

    db.deleteUser(userId);
    return NextResponse.json({ success: true, message: "Đã xóa người dùng thành công" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
