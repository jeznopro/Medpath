import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "student-1";

    const activity = db.getUserActivity(userId);
    const attempts = db.getUserAttempts(userId);
    const leaderboard = db.getLeaderboard();

    // Tính điểm trung bình và biểu đồ điểm số qua các lần làm bài
    const scoreHistory = attempts
      .slice(0, 10)
      .reverse()
      .map((att, idx) => ({
        index: idx + 1,
        date: new Date(att.started_at).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        }),
        score: att.score_pct,
        passed: att.passed,
      }));

    // Phân tích điểm yếu (những mục thi nhiều lần hoặc điểm thấp < ngưỡng)
    const weakSections: { sectionTitle: string; bestScore: number; attemptsCount: number }[] = [];
    const allSections = db.getSections("les-1-chi-tren"); // Lấy tất cả sections
    // Kiểm tra tất cả các sections
    // Tạm thời lấy qua database store:
    const storeData = (db as any).data;
    if (storeData && storeData.sections) {
      storeData.sections.forEach((sec: any) => {
        const prog = db.getSectionProgress(userId, sec.id);
        if (prog.status === "skipped_weak" || (prog.attempts_count && prog.attempts_count > 1 && prog.best_score < sec.pass_threshold)) {
          weakSections.push({
            sectionTitle: sec.title,
            bestScore: prog.best_score,
            attemptsCount: prog.attempts_count || 1,
          });
        }
      });
    }

    // Top các câu hỏi sinh viên này đã từng làm sai nhiều lần
    const userQuestionWrongs = new Map<string, number>();
    attempts.forEach((att) => {
      if (att.answers) {
        att.answers.forEach((ans) => {
          if (!ans.is_correct) {
            userQuestionWrongs.set(
              ans.question_id,
              (userQuestionWrongs.get(ans.question_id) || 0) + 1
            );
          }
        });
      }
    });

    const frequentWrongQuestions = Array.from(userQuestionWrongs.entries())
      .filter(([_, count]) => count >= 1)
      .map(([qId, count]) => {
        const q = db.getQuestionById(qId);
        return {
          questionId: qId,
          body: q?.body || "Câu hỏi ôn tập",
          wrongCount: count,
          difficulty: q?.difficulty || "remember",
        };
      })
      .sort((a, b) => b.wrongCount - a.wrongCount)
      .slice(0, 5);

    return NextResponse.json({
      streak: activity.streak,
      todayQuestions: activity.todayQuestions,
      todayMinutes: activity.todayMinutes,
      activityHistory: activity.history,
      scoreHistory,
      weakSections,
      frequentWrongQuestions,
      leaderboard,
      totalAttempts: attempts.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi khi lấy dữ liệu thống kê" },
      { status: 500 }
    );
  }
}
