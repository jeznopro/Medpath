import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { ClientQuestion, Question } from "@/lib/types";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { section_ids, question_count = 20, duration_minutes = 30 } = body;

    const sectionsToPick =
      Array.isArray(section_ids) && section_ids.length > 0
        ? section_ids
        : ["sec-1-1", "sec-1-2", "sec-2-1", "sec-2-2"];

    let candidateQuestions: Question[] = [];
    sectionsToPick.forEach((secId: string) => {
      const qs = db.getQuestions(secId);
      candidateQuestions.push(...qs);
    });

    // Shuffle and pick target count
    const shuffled = shuffleArray(candidateQuestions);
    const selected = shuffled.slice(0, Math.min(question_count, shuffled.length));

    // Convert to client-safe question (strip is_correct and explanation!)
    const clientQuestions: ClientQuestion[] = selected.map((q) => ({
      id: q.id,
      section_id: q.section_id,
      type: q.type,
      body: q.body,
      image_url: q.image_url,
      difficulty: q.difficulty,
      source_ref: q.source_ref,
      options: shuffleArray(q.options).map((opt) => ({
        id: opt.id,
        text: opt.text,
      })),
    }));

    return NextResponse.json({
      exam_id: `exam-${Date.now()}`,
      questions: clientQuestions,
      totalQuestions: clientQuestions.length,
      durationMinutes: duration_minutes,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi khi tạo đề thi thử" },
      { status: 500 }
    );
  }
}
