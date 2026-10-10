import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sectionId = searchParams.get("sectionId");
  const userId = searchParams.get("userId") || "student-1";

  if (!sectionId) {
    return NextResponse.json({ error: "Thiếu sectionId" }, { status: 400 });
  }

  const section = db.getSectionById(sectionId);
  if (!section) {
    return NextResponse.json({ error: "Mục không tồn tại" }, { status: 404 });
  }

  const progress = db.getSectionProgress(userId, sectionId);
  const lesson = db.getLessonById(section.lesson_id);
  const subject = lesson ? db.getSubjectById(lesson.subject_id) : null;
  const allSectionsInLesson = lesson ? db.getSections(lesson.id) : [];

  return NextResponse.json({
    section,
    progress,
    lesson,
    subject,
    siblingSections: allSectionsInLesson.map((s) => {
      const p = db.getSectionProgress(userId, s.id);
      return {
        id: s.id,
        title: s.title,
        order: s.order,
        status: p.status,
        best_score: p.best_score,
      };
    }),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userId, sectionId } = body;

    if (action === "skip_weak") {
      // Đánh dấu mục hiện tại là skipped_weak và mở khóa mục kế tiếp
      db.updateSectionProgress(userId, sectionId, {
        status: "skipped_weak",
      });

      const nextSec = db.getNextSection(sectionId);
      if (nextSec) {
        db.updateSectionProgress(userId, nextSec.id, {
          status: "unlocked",
        });
      }

      return NextResponse.json({
        success: true,
        message: "Đã chuyển mục sang trạng thái 'chưa vững' và mở khóa mục tiếp theo.",
        nextSectionId: nextSec?.id,
      });
    }

    return NextResponse.json({ error: "Hành động không hợp lệ" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
