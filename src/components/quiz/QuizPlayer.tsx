"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flag,
  HelpCircle,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  X,
  XCircle,
  ZoomIn,
} from "lucide-react";
import { ClientQuestion, QuizSubmissionResult, ReportReason } from "@/lib/types";

interface QuizPlayerProps {
  sectionId: string;
  sectionTitle: string;
  lessonId: string;
  userId: string;
  initialQuestions: ClientQuestion[];
  passThreshold: number;
}

export function QuizPlayer({
  sectionId,
  sectionTitle,
  lessonId,
  userId,
  initialQuestions,
  passThreshold,
}: QuizPlayerProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<ClientQuestion[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Lưu câu trả lời của học viên: questionId -> array of selected option IDs
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());

  // Trạng thái nộp bài và kết quả chấm
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizSubmissionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Báo lỗi câu hỏi & Xem ảnh y khoa
  const [reportingQuestion, setReportingQuestion] = useState<{ id: string; body: string } | null>(null);
  const [reportReason, setReportReason] = useState<ReportReason>("wrong_answer");
  const [reportNote, setReportNote] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSentSuccess, setReportSentSuccess] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const handleSendReport = async () => {
    if (!reportingQuestion) return;
    setReportSubmitting(true);
    try {
      const res = await fetch("/api/questions/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: reportingQuestion.id,
          reporter_id: userId,
          reason: reportReason,
          note: reportNote,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReportSentSuccess(true);
        setTimeout(() => {
          setReportingQuestion(null);
          setReportSentSuccess(false);
          setReportNote("");
        }, 1500);
      }
    } catch {
      alert("Lỗi khi gửi báo cáo lỗi câu hỏi");
    } finally {
      setReportSubmitting(false);
    }
  };


  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;

  // Lắng nghe phím tắt: 1, 2, 3, 4 chọn phương án; Enter chuyển câu tiếp theo
  useEffect(() => {
    if (result) return; // Đã có kết quả thì tắt phím tắt làm bài

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentQ) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= currentQ.options.length) {
        const optionId = currentQ.options[num - 1].id;
        handleOptionSelect(currentQ.id, optionId, currentQ.type === "multiple_choice");
      }

      if (e.key === "Enter") {
        if (currentIndex < totalQuestions - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, currentQ, result, totalQuestions, selectedAnswers]);

  // Xử lý chọn phương án
  const handleOptionSelect = (questionId: string, optionId: string, isMultiple: boolean) => {
    setSelectedAnswers((prev) => {
      const current = prev[questionId] || [];
      if (isMultiple) {
        if (current.includes(optionId)) {
          return { ...prev, [questionId]: current.filter((id) => id !== optionId) };
        } else {
          return { ...prev, [questionId]: [...current, optionId] };
        }
      } else {
        return { ...prev, [questionId]: [optionId] };
      }
    });
  };

  // Bật/tắt cờ đánh dấu câu hỏi
  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  // Nộp bài lên server để chấm điểm
  const handleSubmit = async () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < totalQuestions) {
      const unanswered = totalQuestions - answeredCount;
      if (
        !confirm(
          `Bạn vẫn còn ${unanswered} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài ngay bây giờ?`
        )
      ) {
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const formattedAnswers = questions.map((q) => ({
        question_id: q.id,
        selected_option_ids: selectedAnswers[q.id] || [],
      }));

      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          section_id: sectionId,
          answers: formattedAnswers,
          mode: "gate",
        }),
      });

      const data: QuizSubmissionResult = await res.json();
      setResult(data);

      if (data.passed) {
        // Kích hoạt pháo hoa ăn mừng khi qua cổng
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      setErrorMsg("Đã xảy ra lỗi khi chấm điểm: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Làm lại bộ đề random mới
  const handleRetakeRandom = async () => {
    setIsSubmitting(true);
    setResult(null);
    setSelectedAnswers({});
    setFlaggedQuestions(new Set());
    setCurrentIndex(0);

    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section_id: sectionId,
          user_id: userId,
        }),
      });
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
      }
    } catch (err) {
      alert("Lỗi khi tạo bộ câu hỏi mới");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderModals = () => (
    <>
      {/* Report Modal */}
      {reportingQuestion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-4">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Báo lỗi câu hỏi</span>
              </div>
              <button
                onClick={() => setReportingQuestion(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSentSuccess ? (
              <div className="py-8 text-center text-emerald-600 space-y-2">
                <Check className="w-12 h-12 mx-auto bg-emerald-100 dark:bg-emerald-950 p-2 rounded-full" />
                <p className="font-bold">Đã gửi báo cáo thành công!</p>
                <p className="text-xs text-slate-500">Giảng viên sẽ kiểm tra và điều chỉnh câu hỏi.</p>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 mb-4 line-clamp-3 italic">
                  "{reportingQuestion.body}"
                </div>

                <div className="space-y-3 mb-4">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Lý do báo lỗi:
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value as ReportReason)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="wrong_answer">Sai đáp án đúng</option>
                    <option value="typo">Lỗi chính tả / Ngữ pháp / Thuật ngữ</option>
                    <option value="broken_image">Hình ảnh minh họa bị lỗi / Không rõ</option>
                    <option value="unclear_explanation">Giải thích chưa rõ ràng hoặc mâu thuẫn</option>
                    <option value="other">Lý do khác</option>
                  </select>

                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Ghi chú chi tiết (nếu có):
                  </label>
                  <textarea
                    value={reportNote}
                    onChange={(e) => setReportNote(e.target.value)}
                    placeholder="Mô tả cụ thể sai sót để giảng viên dễ sửa..."
                    rows={3}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportingQuestion(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleSendReport}
                    disabled={reportSubmitting}
                    className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md transition disabled:opacity-50"
                  >
                    {reportSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {previewImageUrl && (
        <div
          onClick={() => setPreviewImageUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={previewImageUrl}
              alt="Hình ảnh y khoa phóng to"
              className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl object-contain border border-slate-700"
            />
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );

  if (!currentQ && !result) {
    return (
      <div className="p-8 text-center text-slate-500">
        Đang tải câu hỏi kiểm tra...
      </div>
    );
  }

  // =========================================================================
  // MÀN HÌNH KẾT QUẢ SAU KHI NỘP BÀI
  // =========================================================================
  if (result) {
    const isPassed = result.passed;
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Banner Kết quả */}
        <div
          className={`p-6 sm:p-8 rounded-2xl shadow-md border mb-8 text-center ${
            isPassed
              ? "bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-900 border-emerald-200 dark:border-emerald-800"
              : "bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/30 dark:to-slate-900 border-amber-200 dark:border-amber-800"
          }`}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 shadow-inner">
            {isPassed ? (
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-12 h-12" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-12 h-12" />
              </div>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
            {isPassed ? "Chúc mừng! Bạn đã vượt cổng thành công!" : "Chưa đạt ngưỡng vượt cổng"}
          </h2>

          <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto text-sm sm:text-base mb-6">
            {isPassed
              ? `Bạn đã đạt ${result.score_pct}% (vượt ngưỡng yêu cầu ${result.pass_threshold}%). Mục tiếp theo đã được mở khóa!`
              : `Bạn đạt ${result.score_pct}% (ngưỡng yêu cầu là ${result.pass_threshold}%). Hãy xem lại các câu sai và đọc lại tài liệu liên quan bên dưới, sau đó làm lại bộ câu hỏi random khác.`}
          </p>

          {/* Score pill */}
          <div className="inline-flex items-center gap-6 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
            <div>
              <div className="text-xs text-slate-400 font-medium">ĐIỂM SỐ</div>
              <div className="text-2xl sm:text-3xl font-black text-teal-700 dark:text-teal-400">
                {result.score_pct}%
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <div className="text-xs text-slate-400 font-medium">SỐ CÂU ĐÚNG</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-200">
                {result.correct_count} / {result.total_questions}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRetakeRandom}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold rounded-xl transition flex items-center gap-2 border border-slate-300 dark:border-slate-600"
            >
              <RotateCcw className="w-4 h-4 text-teal-600" />
              Làm bộ câu hỏi random khác
            </button>

            <Link
              href={`/classes/view/subjects/sub/lessons/${lessonId}/sections/${sectionId}/read`}
              className="px-5 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 text-sm font-semibold rounded-xl border border-teal-200 dark:border-teal-800 transition flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Đọc lại tài liệu mục này
            </Link>

            {isPassed && (
              <Link
                href="/classes"
                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md transition flex items-center gap-2"
              >
                Học tiếp mục tiếp theo
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Danh sách câu hỏi chi tiết & Giải thích & Nút nhảy về đoạn tài liệu */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              Chi tiết câu trả lời & Giải thích chuyên sâu
            </h3>
            <span className="text-xs text-slate-500">
              {result.answers_feedback.filter((a) => !a.is_correct).length} câu sai
            </span>
          </div>

          {result.answers_feedback.map((item, index) => {
            const isCorrect = item.is_correct;
            return (
              <div
                key={item.question_id}
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                  isCorrect
                    ? "bg-white dark:bg-slate-800/90 border-emerald-200 dark:border-emerald-800/60 shadow-sm"
                    : "bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/60 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCorrect
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isCorrect
                          ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200"
                          : "text-red-700 bg-red-50 dark:bg-red-950 border border-red-200"
                      }`}
                    >
                      {isCorrect ? "Đúng" : "Chưa chính xác"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Nút Xem lại đoạn liên quan (Chỉ hiện khi câu sai hoặc có source_ref) */}
                    {item.source_ref && (
                      <Link
                        href={`/classes/view/subjects/sub/lessons/${lessonId}/sections/${sectionId}/read#${item.source_ref}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition"
                        title="Nhảy thẳng tới vị trí lý thuyết liên quan trong tài liệu"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Xem lại đoạn này</span>
                      </Link>
                    )}

                    {/* Nút Báo lỗi câu này */}
                    <button
                      type="button"
                      onClick={() => setReportingQuestion({ id: item.question_id, body: item.body })}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition"
                      title="Báo cáo câu hỏi có sai sót"
                    >
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>Báo lỗi</span>
                    </button>
                  </div>
                </div>

                {/* Nội dung câu hỏi */}
                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4 leading-relaxed">
                  {item.body}
                </h4>

                {/* Các phương án */}
                <div className="space-y-2 mb-4">
                  {item.options.map((opt, optIndex) => {
                    const isSelected = item.selected_option_ids.includes(opt.id);
                    const isOptCorrect = opt.is_correct;
                    const letter = String.fromCharCode(65 + optIndex);

                    let optStyle =
                      "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300";

                    if (isOptCorrect) {
                      optStyle =
                        "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium";
                    } else if (isSelected && !isOptCorrect) {
                      optStyle =
                        "border-red-400 bg-red-50/70 dark:bg-red-950/40 text-red-900 dark:text-red-300";
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl border text-sm flex items-start gap-3 ${optStyle}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {letter}
                        </span>
                        <div className="flex-1">
                          <div>{opt.text}</div>
                          {opt.explanation && (
                            <div className="text-xs text-slate-500 mt-1 italic">
                              {opt.explanation}
                            </div>
                          )}
                        </div>
                        {isOptCorrect && (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                            Đáp án đúng
                          </span>
                        )}
                        {isSelected && !isOptCorrect && (
                          <span className="text-xs font-bold text-red-500 shrink-0">
                            Bạn đã chọn
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Giải thích chung của câu hỏi */}
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-teal-800 dark:text-teal-300">
                    💡 Giải thích giải phẫu:{" "}
                  </span>
                  {item.explanation}
                </div>
              </div>
            );
          })}
        </div>
        {renderModals()}
      </div>
    );
  }

  // =========================================================================
  // MÀN HÌNH ĐANG LÀM BÀI TRẮC NGHIỆM
  // =========================================================================
  const isMultiple = currentQ.type === "multiple_choice";
  const userSelected = selectedAnswers[currentQ.id] || [];
  const isFlagged = flaggedQuestions.has(currentQ.id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <Link
          href={`/classes/view/subjects/sub/lessons/${lessonId}/sections/${sectionId}/read`}
          className="text-xs text-slate-500 hover:text-teal-600 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang đọc</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Ngưỡng đạt: <strong>{passThreshold}%</strong>
          </span>
          <button
            onClick={() => toggleFlag(currentQ.id)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition ${
              isFlagged
                ? "bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                : "border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-600"
            }`}
            title="Đánh dấu câu này để kiểm tra lại trước khi nộp"
          >
            <Flag className={`w-3.5 h-3.5 ${isFlagged ? "fill-amber-500 text-amber-500" : ""}`} />
            <span className="hidden sm:inline">Xem lại sau</span>
          </button>

          <button
            type="button"
            onClick={() => setReportingQuestion(currentQ)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-1.5 transition text-slate-500 hover:text-amber-600"
            title="Báo cáo câu hỏi có sai sót nội dung hoặc lỗi hiển thị"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Báo lỗi</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-6">
        <div
          className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Pagination Grid: Câu 1, 2, 3... */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {questions.map((q, idx) => {
          const isDone = (selectedAnswers[q.id] || []).length > 0;
          const isCurrent = idx === currentIndex;
          const hasFlag = flaggedQuestions.has(q.id);

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-9 h-9 rounded-xl text-xs font-bold relative shrink-0 transition ${
                isCurrent
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/30 scale-105"
                  : isDone
                  ? "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {idx + 1}
              {hasFlag && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-700">
          <span className="text-xs font-bold text-teal-700 dark:text-teal-400 tracking-wider uppercase">
            Câu {currentIndex + 1} / {totalQuestions}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            {isMultiple
              ? "Nhiều đáp án đúng"
              : currentQ.type === "true_false"
              ? "Đúng / Sai"
              : "Chọn 1 đáp án đúng"}
          </span>
        </div>

        {/* Nội dung câu hỏi */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug mb-4">
          {currentQ.body}
        </h3>

        {/* Ảnh y khoa minh họa nếu có */}
        {currentQ.image_url && (
          <div className="mb-6 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-2 text-center">
            <img
              src={currentQ.image_url}
              alt="Hình ảnh y khoa minh họa"
              className="max-h-64 mx-auto rounded-lg object-contain cursor-zoom-in hover:opacity-95 transition"
              onClick={() => setPreviewImageUrl(currentQ.image_url!)}
            />
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-center gap-1">
              <ZoomIn className="w-3 h-3" />
              <span>Bấm vào hình để phóng to xem chi tiết</span>
            </div>
          </div>
        )}

        {/* Các phương án lựa chọn */}
        <div className="space-y-3">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = userSelected.includes(option.id);
            const letter = String.fromCharCode(65 + optIdx);

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionSelect(currentQ.id, option.id, isMultiple)}
                className={`w-full text-left p-4 rounded-xl border text-sm sm:text-base font-normal transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? "border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100 ring-1 ring-teal-500"
                    : "border-slate-200 dark:border-slate-700 hover:border-teal-300 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition ${
                    isSelected
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {letter}
                </span>
                <span className="flex-1 pt-0.5 leading-relaxed">{option.text}</span>
              </button>
            );
          })}
        </div>

        {/* Keyboard shortcut hint */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
          <span className="hidden sm:inline">
            Phím tắt: Bấm phím <strong>1-4</strong> để chọn, <strong>Enter</strong> để qua câu
          </span>
          <span className="text-teal-600 font-medium">
            Đã trả lời: {Object.keys(selectedAnswers).length} / {totalQuestions}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 mb-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Navigation & Submit footer */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          Câu trước
        </button>

        <div className="flex items-center gap-2">
          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-sm font-semibold transition"
            >
              Câu kế tiếp
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-sm font-semibold shadow-md shadow-teal-600/30 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? "Đang chấm bài..." : "Nộp bài kiểm tra"}
            </button>
          )}
        </div>
      </div>
      {renderModals()}
    </div>
  );
}
