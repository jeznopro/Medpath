import { NextResponse } from "next/server";
import { generateQuizForSection } from "@/lib/quiz-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { section_id, user_id, count } = body;

    if (!section_id || !user_id) {
      return NextResponse.json(
        { error: "Thiếu section_id hoặc user_id" },
        { status: 400 }
      );
    }

    const quizData = generateQuizForSection(section_id, user_id, count);
    return NextResponse.json(quizData);
  } catch (error: any) {
    console.error("Lỗi sinh đề quiz:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}
