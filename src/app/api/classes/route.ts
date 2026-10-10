import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { ClassItem } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || undefined;
  const classId = searchParams.get("classId");

  if (classId) {
    const cls = db.getClassById(classId);
    if (!cls) {
      return NextResponse.json({ error: "Không tìm thấy lớp học" }, { status: 404 });
    }
    const subjects = db.getSubjects(classId);
    const curriculum = subjects.map((sub) => {
      const lessons = db.getLessons(sub.id);
      return {
        ...sub,
        lessons: lessons.map((les) => {
          const sections = db.getSections(les.id);
          return {
            ...les,
            sections,
          };
        }),
      };
    });

    return NextResponse.json({ class: cls, curriculum });
  }

  const classes = db.getClasses(userId);
  return NextResponse.json({ classes });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userId, classData, joinCode } = body;

    if (action === "join") {
      if (!joinCode || !userId) {
        return NextResponse.json(
          { error: "Vui lòng nhập mã tham gia và mã người dùng" },
          { status: 400 }
        );
      }

      const cls = db.getClassByJoinCode(joinCode);
      if (!cls) {
        return NextResponse.json(
          { error: "Mã lớp không hợp lệ hoặc không tồn tại. Vui lòng kiểm tra lại!" },
          { status: 404 }
        );
      }

      const member = db.joinClass(cls.id, userId, "student");
      return NextResponse.json({ success: true, class: cls, member });
    }

    if (action === "create") {
      if (!classData?.name || !userId) {
        return NextResponse.json(
          { error: "Tên lớp và thông tin giảng viên là bắt buộc" },
          { status: 400 }
        );
      }

      const userProfile = db.getProfile(userId);
      const generatedCode =
        "MED" + Math.floor(1000 + Math.random() * 9000).toString();

      const newClass: ClassItem = {
        id: `class-${Date.now()}`,
        name: classData.name,
        description: classData.description || "",
        join_code: generatedCode,
        owner_id: userId,
        owner_name: userProfile?.full_name || "Giảng viên",
        created_at: new Date().toISOString(),
      };

      db.createClass(newClass);
      return NextResponse.json({ success: true, class: newClass });
    }

    return NextResponse.json({ error: "Hành động không được hỗ trợ" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi máy chủ khi xử lý lớp học" },
      { status: 500 }
    );
  }
}
