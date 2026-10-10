import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { parseExcelFile } from "@/lib/excel-parser";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const sectionId = formData.get("section_id") as string | null;

    if (!file || !sectionId) {
      return NextResponse.json(
        { error: "Vui lòng đính kèm file Excel (.xlsx, .csv) và chọn mục (section_id)" },
        { status: 400 }
      );
    }

    const section = db.getSectionById(sectionId);
    if (!section) {
      return NextResponse.json(
        { error: "Mục được chọn không tồn tại" },
        { status: 404 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const existingQuestions = db.getQuestions(sectionId);
    const result = parseExcelFile(buffer, sectionId, existingQuestions);

    if (result.validQuestions.length > 0) {
      db.addQuestionsBatch(result.validQuestions);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Lỗi import câu hỏi:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi xử lý file Excel" },
      { status: 500 }
    );
  }
}
