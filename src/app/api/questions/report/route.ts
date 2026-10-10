import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { ReportReason, ReportStatus } from "@/lib/types";

export async function GET() {
  try {
    const reports = db.getQuestionReports();
    return NextResponse.json({ reports });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi khi lấy danh sách báo lỗi câu hỏi" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question_id, reporter_id, reason, note } = body;

    if (!question_id || !reporter_id || !reason) {
      return NextResponse.json(
        { error: "Thiếu thông tin báo lỗi (cần question_id, reporter_id, reason)" },
        { status: 400 }
      );
    }

    const report = db.addQuestionReport({
      question_id,
      reporter_id,
      reason: reason as ReportReason,
      note: note || "",
    });

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi khi gửi báo lỗi câu hỏi" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Thiếu id hoặc status cập nhật" },
        { status: 400 }
      );
    }

    const success = db.updateQuestionReport(id, status as ReportStatus);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi khi cập nhật trạng thái báo lỗi" },
      { status: 500 }
    );
  }
}
