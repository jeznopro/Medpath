import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, password, role } = body;

    if (!full_name || !email) {
      return NextResponse.json(
        { error: "Họ và tên cùng email là bắt buộc" },
        { status: 400 }
      );
    }

    const assignedRole = role === "teacher" ? "teacher" : "student";
    const user = db.createUser(full_name, email, assignedRole);

    return NextResponse.json({
      success: true,
      message: "Đăng ký tài khoản thành công",
      user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi máy chủ khi đăng ký tài khoản" },
      { status: 400 }
    );
  }
}
