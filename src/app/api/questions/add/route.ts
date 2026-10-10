import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { Question } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body: Question = await request.json();

    if (!body.body || !body.section_id || !Array.isArray(body.options)) {
      return NextResponse.json(
        { error: "Dữ liệu câu hỏi thiếu các trường bắt buộc" },
        { status: 400 }
      );
    }

    const saved = db.addQuestion(body);
    return NextResponse.json({ success: true, question: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
