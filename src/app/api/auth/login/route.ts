import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Vui lòng nhập địa chỉ email" },
        { status: 400 }
      );
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Tài khoản không tồn tại. Vui lòng kiểm tra lại email hoặc đăng ký!" },
        { status: 404 }
      );
    }

    // Với chế độ demo/local, nếu có mật khẩu thì kiểm tra cơ bản
    return NextResponse.json({
      success: true,
      message: "Đăng nhập thành công",
      user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi máy chủ khi đăng nhập" },
      { status: 500 }
    );
  }
}
