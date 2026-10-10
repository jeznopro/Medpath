import { NextResponse } from "next/server";
import { gradeAttempt } from "@/lib/quiz-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, section_id, answers, mode } = body;

    if (!user_id || !section_id || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Dữ liệu nộp bài không hợp lệ. Cần có user_id, section_id và danh sách answers." },
        { status: 400 }
      );
    }

    const result = gradeAttempt(user_id, section_id, answers, mode || "gate");
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Lỗi chấm điểm quiz:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi máy chủ khi chấm bài" },
      { status: 500 }
    );
  }
}
