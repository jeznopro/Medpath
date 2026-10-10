import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "student-1";

    const allItems = db.getReviewQueue(userId);
    const dueItems = db.getDueReviewItems(userId);

    // Thống kê phân bố 5 hộp Leitner
    const boxesCount: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allItems.forEach((item) => {
      boxesCount[item.box] = (boxesCount[item.box] || 0) + 1;
    });

    const activity = db.getUserActivity(userId);

    return NextResponse.json({
      dueItems,
      totalCount: allItems.length,
      dueCount: dueItems.length,
      boxesCount,
      streak: activity.streak,
      todayQuestions: activity.todayQuestions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi khi lấy dữ liệu ôn tập" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userId, questionId, isCorrect, highlightText, note } = body;

    // Trường hợp 1: Chấm kết quả 1 câu trong buổi ôn Leitner
    if (questionId && typeof isCorrect === "boolean") {
      const updated = db.answerReviewItem(userId, questionId, isCorrect);
      db.recordDailyActivity(userId, 1, 1);
      return NextResponse.json({ success: true, item: updated });
    }

    // Trường hợp 2: Biến đoạn Highlight thành Flashcard câu hỏi ôn tập
    if (action === "create_from_highlight" && highlightText) {
      // Tạo một câu hỏi flashcard tùy chỉnh trong mục hiện tại
      const sectionId = body.sectionId || "sec-1-1";
      const qId = `q-hl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newQuestion = db.addQuestion({
        id: qId,
        section_id: sectionId,
        type: "single_choice",
        body: `[Flashcard Ghi nhớ]: "${highlightText}"`,
        explanation: note || "Khái niệm y khoa trích từ tài liệu đọc.",
        difficulty: "remember",
        source_ref: "highlight",
        is_active: true,
        options: [
          {
            id: `${qId}-opt-1`,
            question_id: qId,
            text: "Đã nắm vững nội dung này",
            is_correct: true,
          },
          {
            id: `${qId}-opt-2`,
            question_id: qId,
            text: "Chưa nhớ rõ, cần xem lại tài liệu",
            is_correct: false,
          },
        ],
      });

      // Đưa ngay vào Hàng đợi ôn tập Hộp 1
      const queueItem = db.queueQuestionForReview(userId, newQuestion.id, false);
      return NextResponse.json({ success: true, question: newQuestion, queueItem });
    }

    return NextResponse.json(
      { error: "Tham số không hợp lệ" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi khi xử lý ôn tập" },
      { status: 500 }
    );
  }
}
