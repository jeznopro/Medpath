"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useAuth } from "@/lib/auth-context";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  Layers,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
  XCircle,
  ZoomIn,
} from "lucide-react";
import { Question, ReviewQueueItem } from "@/lib/types";

export default function ReviewPage() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dueItems, setDueItems] = useState<(ReviewQueueItem & { question?: Question })[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [boxesCount, setBoxesCount] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [streak, setStreak] = useState(0);

  // Review session state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [reviewMode, setReviewMode] = useState<"flashcard" | "quiz">("flashcard");
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const fetchReviewData = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/review?userId=${currentUser.id}`);
      const data = await res.json();
      if (data.dueItems) {
        setDueItems(data.dueItems);
        setTotalCount(data.totalCount || 0);
        setBoxesCount(data.boxesCount || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
        setStreak(data.streak || 0);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu ôn tập:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewData();
  }, [currentUser?.id]);

  const currentItem = dueItems[currentIndex];
  const currentQ = currentItem?.question;

  // Xử lý đánh giá câu ôn tập (đúng hoặc sai)
  const handleRateAnswer = async (isCorrect: boolean) => {
    if (!currentItem || !currentQ || !currentUser) return;

    try {
      await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          questionId: currentQ.id,
          isCorrect,
        }),
      });

      setReviewedCount((prev) => prev + 1);

      if (currentIndex < dueItems.length - 1) {
        setIsFlipped(false);
        setSelectedQuizOption(null);
        setQuizAnswered(false);
        setCurrentIndex((prev) => prev + 1);
      } else {
        setSessionCompleted(true);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      alert("Lỗi khi ghi nhận kết quả ôn tập");
    }
  };

  const handleSelectQuizOption = (optId: string) => {
    if (quizAnswered) return;
    setSelectedQuizOption(optId);
    setQuizAnswered(true);

    const isOptCorrect = currentQ?.options.find((o) => o.id === optId)?.is_correct ?? false;
    setTimeout(() => {
      handleRateAnswer(isOptCorrect);
    }, 1800);
  };

  const boxColors: Record<number, string> = {
    1: "bg-red-500",
    2: "bg-orange-500",
    3: "bg-amber-500",
    4: "bg-teal-500",
    5: "bg-emerald-500",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/classes"
              className="text-slate-500 hover:text-teal-600 text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại Môn học</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-amber-500" />
            <span>Ôn tập hôm nay (Spaced Repetition)</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Thuật toán Leitner 5 hộp: câu sai sẽ ôn lại sau 1, 3, 7, 14, 30 ngày để ghi nhớ vĩnh viễn
          </p>
        </div>

        {/* Streak Counter Badge */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800 px-4 py-2.5 rounded-2xl shadow-sm">
          <Flame className="w-7 h-7 text-orange-500 fill-orange-500 animate-pulse" />
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">
              Chuỗi học tập
            </div>
            <div className="text-lg font-black text-amber-900 dark:text-amber-200">
              {streak} ngày liên tục
            </div>
          </div>
        </div>
      </div>

      {/* Leitner Box Progress Visualizer */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-teal-600" />
            Phân bố 5 Hộp Ghi nhớ Leitner ({totalCount} câu trong ngân hàng ôn)
          </span>
          <span className="text-amber-600 dark:text-amber-400 font-semibold">
            Đến hạn hôm nay: <strong>{dueItems.length} câu</strong>
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-3 text-center">
          {[
            { box: 1, label: "Hộp 1", days: "1 ngày", count: boxesCount[1] || 0, color: "border-red-300 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300" },
            { box: 2, label: "Hộp 2", days: "3 ngày", count: boxesCount[2] || 0, color: "border-orange-300 bg-orange-50 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300" },
            { box: 3, label: "Hộp 3", days: "7 ngày", count: boxesCount[3] || 0, color: "border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300" },
            { box: 4, label: "Hộp 4", days: "14 ngày", count: boxesCount[4] || 0, color: "border-teal-300 bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300" },
            { box: 5, label: "Hộp 5", days: "30 ngày", count: boxesCount[5] || 0, color: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" },
          ].map((b) => (
            <div
              key={b.box}
              className={`p-2 sm:p-3 rounded-xl border ${b.color} transition hover:scale-105`}
            >
              <div className="text-[11px] font-bold">{b.label}</div>
              <div className="text-lg sm:text-xl font-black">{b.count}</div>
              <div className="text-[10px] opacity-75">{b.days}</div>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Đang chuẩn bị thẻ ôn tập...</div>
      ) : sessionCompleted || dueItems.length === 0 ? (
        /* Completed Screen */
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-lg mx-auto animate-in fade-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Xuất sắc! Bạn đã hoàn thành lượt ôn!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {reviewedCount > 0
              ? `Bạn vừa ôn tập thành công ${reviewedCount} câu hỏi đến hạn hôm nay. Các câu nhớ tốt đã được kéo giãn thời gian ôn.`
              : "Hôm nay không còn câu hỏi nào đến hạn ôn tập. Hãy tiếp tục học bài mới hoặc làm đề thi thử nhé!"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/classes"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl shadow-md transition"
            >
              Học bài tiếp theo
            </Link>
            <Link
              href="/mock-exam"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition"
            >
              Làm bài thi thử
            </Link>
          </div>
        </div>
      ) : (
        /* Active Review Section */
        <div>
          {/* Controls: Mode Switcher & Progress */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                Thẻ {currentIndex + 1} / {dueItems.length}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold border border-amber-300">
                Đang ở Hộp {currentItem.box}
              </span>
            </div>

            {/* Mode switch */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setReviewMode("flashcard")}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  reviewMode === "flashcard"
                    ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Lật thẻ Flashcard
              </button>
              <button
                onClick={() => setReviewMode("quiz")}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  reviewMode === "quiz"
                    ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Trắc nghiệm
              </button>
            </div>
          </div>

          {/* Flashcard Mode */}
          {reviewMode === "flashcard" && (
            <div>
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-10 shadow-lg border-2 border-teal-200/80 dark:border-slate-700 min-h-[320px] flex flex-col justify-between transition-all duration-300 hover:shadow-xl relative select-none"
              >
                {/* Header tag */}
                <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-700">
                  <span className="font-semibold text-teal-600 dark:text-teal-400">
                    {isFlipped ? "MẶT SAU: ĐÁP ÁN & GIẢI THÍCH" : "MẶT TRƯỚC: CÂU HỎI / TRIỆU CHỨNG"}
                  </span>
                  <span className="italic">Bấm thẻ để lật mặt sau ↻</span>
                </div>

                {/* Content */}
                <div className="py-6">
                  {!isFlipped ? (
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                        {currentQ?.body}
                      </h3>
                      {currentQ?.image_url && (
                        <div className="mt-4 text-center">
                          <img
                            src={currentQ.image_url}
                            alt="Minh họa"
                            className="max-h-48 mx-auto rounded-xl object-contain border border-slate-200"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div>
                        <div className="text-xs font-bold text-emerald-600 uppercase mb-2">
                          Đáp án đúng:
                        </div>
                        {currentQ?.options
                          .filter((o) => o.is_correct)
                          .map((opt) => (
                            <div
                              key={opt.id}
                              className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-900 dark:text-emerald-200 rounded-xl font-bold text-base"
                            >
                              ✓ {opt.text}
                            </div>
                          ))}
                      </div>

                      {currentQ?.explanation && (
                        <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
                          <span className="font-bold text-teal-800 dark:text-teal-300">
                            💡 Giải thích y khoa:{" "}
                          </span>
                          {currentQ.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom hint */}
                <div className="text-[11px] text-slate-400 text-center pt-3 border-t border-slate-100 dark:border-slate-700">
                  {isFlipped
                    ? "Hãy tự đánh giá mức độ nhớ của bạn bên dưới:"
                    : "Thử nhớ lại đáp án và giải thích trong đầu trước khi lật thẻ nhé"}
                </div>
              </div>

              {/* Rating Actions */}
              {isFlipped && (
                <div className="grid grid-cols-2 gap-4 mt-6 animate-in slide-in-from-bottom-3 duration-200">
                  <button
                    onClick={() => handleRateAnswer(false)}
                    className="p-4 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/50 text-red-800 dark:text-red-300 border-2 border-red-300 dark:border-red-800 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition active:scale-95"
                  >
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span>Quên / Sai (Về Hộp 1)</span>
                  </button>

                  <button
                    onClick={() => handleRateAnswer(true)}
                    className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-400 dark:border-emerald-800 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition active:scale-95"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Nhớ tốt (Lên Hộp {Math.min(5, currentItem.box + 1)})</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quiz Mode */}
          {reviewMode === "quiz" && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                {currentQ?.body}
              </h3>

              <div className="space-y-3 mb-6">
                {currentQ?.options.map((opt, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isSelected = selectedQuizOption === opt.id;
                  const isCorrect = opt.is_correct;

                  let style =
                    "border-slate-200 dark:border-slate-700 hover:border-teal-400 text-slate-800 dark:text-slate-200";
                  if (quizAnswered) {
                    if (isCorrect) {
                      style =
                        "border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-bold";
                    } else if (isSelected && !isCorrect) {
                      style =
                        "border-red-500 bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-200";
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={quizAnswered}
                      onClick={() => handleSelectQuizOption(opt.id)}
                      className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition flex items-start gap-3.5 ${style}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {letter}
                      </span>
                      <span className="flex-1">{opt.text}</span>
                      {quizAnswered && isCorrect && (
                        <span className="text-xs text-emerald-600 font-bold">Chính xác</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {quizAnswered && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 text-xs text-slate-700 dark:text-slate-300 animate-in fade-in">
                  <strong>Giải thích:</strong> {currentQ?.explanation}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
