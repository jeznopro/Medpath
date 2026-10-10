import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";

export async function POST() {
  try {
    const data = db.resetToSeed();
    return NextResponse.json({
      success: true,
      message: "Đã nạp lại dữ liệu mẫu thành công",
      classesCount: data.classes.length,
      questionsCount: data.questions.length,
      sectionsCount: data.sections.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const questions = db.getQuestions();
    const classes = db.getClasses();
    const sections = db.getClasses().flatMap((c) =>
      db.getSubjects(c.id).flatMap((s) =>
        db.getLessons(s.id).flatMap((l) => db.getSections(l.id))
      )
    );

    return NextResponse.json({
      classesCount: classes.length,
      sectionsCount: sections.length,
      questionsCount: questions.length,
      classes,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
