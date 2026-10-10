import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { HighlightColor } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "student-1";
    const sectionId = searchParams.get("sectionId") || undefined;

    const highlights = db.getHighlights(userId, sectionId);
    return NextResponse.json({ highlights });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi khi lấy danh sách highlight" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, section_id, color, text, note, range_data } = body;

    if (!user_id || !section_id || !text) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc (user_id, section_id, text)" },
        { status: 400 }
      );
    }

    const highlight = db.addHighlight({
      user_id,
      section_id,
      color: (color as HighlightColor) || "yellow",
      text,
      note,
      range_data,
    });

    return NextResponse.json({ success: true, highlight });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi khi tạo highlight" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Thiếu id của highlight" }, { status: 400 });
    }

    const success = db.deleteHighlight(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi khi xóa highlight" },
      { status: 500 }
    );
  }
}
