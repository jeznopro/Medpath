"use client";

import React, { useState, useEffect } from "react";
import { Lesson, GateQuestion } from "@/lib/medpath-data";
import { useQuestionBankStore } from "@/lib/module-questions";
import { useAuth } from "@/lib/auth-context";
import {
  X,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Target,
  Sparkles,
  Minimize2,
  Maximize2,
  Plus,
  Trash2,
  Award,
  BookOpen,
} from "lucide-react";

interface PostLessonQuizModalProps {
  isOpen: boolean;
  lesson: Lesson | null;
  disciplineName: string;
  onClose: () => void;
  onOpenModuleQuestionBank?: () => void;
}

export function PostLessonQuizModal({
  isOpen,
  lesson,
  disciplineName,
  onClose,
}: PostLessonQuizModalProps) {
  const { isAdmin } = useAuth();
  const {
    getQuestionsForSingleLesson,
    addLessonQuestion,
    deleteLessonQuestion,
  } = useQuestionBankStore();

  const questions = lesson ? getQuestionsForSingleLesson(lesson) : [];

  // Floating window mode: "centered" (modal giữa màn hình) vs "docked" (cửa sổ nổi góc phải để vừa đọc bài vừa làm quiz)
  const [windowMode, setWindowMode] = useState<"centered" | "docked">(
    "centered"
  );
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, "A" | "B" | "C" | "D">
  >({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Admin quick add question form state
  const [newQText, setNewQText] = useState("");
  const [newOptA, setNewOptA] = useState("");
  const [newOptB, setNewOptB] = useState("");
  const [newOptC, setNewOptC] = useState("");
  const [newOptD, setNewOptD] = useState("");
  const [newCorrectId, setNewCorrectId] = useState<"A" | "B" | "C" | "D">("A");
  const [newExplanation, setNewExplanation] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCurrentIdx(0);
      setSelectedAnswers({});
      setIsSubmitted(false);
      setShowAddForm(false);
    }
  }, [isOpen, lesson?.id]);

  if (!isOpen || !lesson) return null;

  const currentQ: GateQuestion | undefined =
    questions[currentIdx] || questions[0];
  const totalQ = questions.length;

  const handleSelectOption = (optId: "A" | "B" | "C" | "D") => {
    if (isSubmitted || !currentQ) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optId,
    }));
  };

  const correctCount = questions.filter((q) => {
    const ans = selectedAnswers[q.id];
    const correctOpt = q.options.find((o) => o.isCorrect);
    return ans === correctOpt?.id;
  }).length;

  const scorePercent =
    totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
  const isPassed = scorePercent >= (lesson.threshold || 80);

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentIdx(0);
  };

  const handleAdminAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim() || !newOptA.trim() || !newOptB.trim()) return;

    const opts: GateQuestion["options"] = [
      {
        id: "A",
        text: newOptA.trim(),
        isCorrect: newCorrectId === "A",
        explanation:
          newCorrectId === "A"
            ? newExplanation.trim() || "Đáp án đúng theo nội dung bài học."
            : "Phương án chưa chính xác.",
      },
      {
        id: "B",
        text: newOptB.trim(),
        isCorrect: newCorrectId === "B",
        explanation:
          newCorrectId === "B"
            ? newExplanation.trim() || "Đáp án đúng theo nội dung bài học."
            : "Phương án chưa chính xác.",
      },
      {
        id: "C",
        text: newOptC.trim() || "Cả hai nhận định trên đều sai",
        isCorrect: newCorrectId === "C",
        explanation:
          newCorrectId === "C"
            ? newExplanation.trim() || "Đáp án đúng theo nội dung bài học."
            : "Phương án chưa chính xác.",
      },
      {
        id: "D",
        text: newOptD.trim() || "Tất cả các phương án trên đều đúng",
        isCorrect: newCorrectId === "D",
        explanation:
          newCorrectId === "D"
            ? newExplanation.trim() || "Đáp án đúng theo nội dung bài học."
            : "Phương án chưa chính xác.",
      },
    ];

    addLessonQuestion(lesson, {
      type: "single",
      question: newQText.trim(),
      difficulty: "Vận dụng",
      topicTag: lesson.code,
      reference: `${lesson.code} — ${lesson.title}`,
      options: opts,
    });

    setNewQText("");
    setNewOptA("");
    setNewOptB("");
    setNewOptC("");
    setNewOptD("");
    setNewExplanation("");
    setShowAddForm(false);
    setCurrentIdx(questions.length);
  };

  const wrapperClass =
    windowMode === "centered"
      ? "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
      : "fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[480px] max-h-[85vh] flex flex-col pointer-events-auto";

  const panelClass =
    windowMode === "centered"
      ? "bg-[#FAF7F0] border-2 border-[#782F3B] rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-fadeIn"
      : "bg-[#FAF7F0] border-2 border-[#782F3B] rounded-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ring-4 ring-black/10 animate-fadeIn";

  return (
    <div className={wrapperClass}>
      <div className={panelClass}>
        {/* Floating Window Title Bar */}
        <div className="bg-[#782F3B] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 text-amber-200" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-200 font-bold truncate">
                KIỂM TRA SAU BÀI HỌC • {lesson.code} ({disciplineName})
              </div>
              <h3 className="font-serif text-sm sm:text-base font-bold truncate">
                {lesson.title}
              </h3>
            </div>
          </div>

          {/* Window Controls: Dock/Expand, Admin Add Question, Close */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                title="Thêm câu hỏi mới cho bài học này"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Thêm câu hỏi</span>
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                setWindowMode(
                  windowMode === "centered" ? "docked" : "centered"
                )
              }
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
              title={
                windowMode === "centered"
                  ? "Thu gọn sang góc phải để vừa đọc bài vừa làm kiểm tra"
                  : "Phóng to cửa sổ ra giữa màn hình"
              }
            >
              {windowMode === "centered" ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Vừa đọc vừa làm</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Phóng to</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-white transition cursor-pointer"
              title="Đóng cửa sổ kiểm tra"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Pills Navigation Bar */}
        <div className="bg-[#F3EFE6] border-b border-[#DDD7CC] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIdx;
              const userAns = selectedAnswers[q.id];
              const correctOpt = q.options.find((o) => o.isCorrect);
              const isCorrect = userAns === correctOpt?.id;

              let btnStyle =
                "bg-white text-[#565551] border border-[#DDD7CC] hover:border-[#782F3B]";
              if (isSubmitted) {
                btnStyle = isCorrect
                  ? "bg-[#34745B] text-white border-[#34745B]"
                  : "bg-red-600 text-white border-red-600";
              } else if (isCurrent) {
                btnStyle =
                  "bg-[#782F3B] text-white border-[#782F3B] ring-2 ring-[#782F3B]/30";
              } else if (userAns) {
                btnStyle =
                  "bg-[#E9E3D5] text-[#30312F] border-[#782F3B]/50 font-bold";
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-7 h-7 rounded-md font-mono text-xs font-bold transition flex items-center justify-center cursor-pointer ${btnStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-mono text-[#565551] flex items-center gap-2">
            <span>
              Đã chọn:{" "}
              <strong className="text-[#782F3B]">
                {Object.keys(selectedAnswers).length}/{totalQ}
              </strong>
            </span>
            <span>•</span>
            <span className="text-[#34745B] font-bold">
              Đạt: ≥{lesson.threshold || 80}%
            </span>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Admin Form to Add Question for this Lesson */}
          {isAdmin && showAddForm && (
            <form
              onSubmit={handleAdminAddQuestion}
              className="p-4 rounded-xl bg-purple-50/90 border-2 border-purple-300 space-y-3 text-xs animate-fadeIn"
            >
              <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                <span className="font-bold text-purple-950 uppercase tracking-wider">
                  + Thêm câu hỏi kiểm tra cho bài {lesson.code}
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-purple-700 hover:underline font-semibold"
                >
                  Đóng
                </button>
              </div>

              <div>
                <label className="block font-bold text-[#30312F] mb-1">
                  Nội dung câu hỏi *:
                </label>
                <textarea
                  rows={2}
                  required
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  placeholder="Nhập câu hỏi kiểm tra sau bài học..."
                  className="w-full p-2 rounded bg-white border border-purple-200 text-[#30312F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(["A", "B", "C", "D"] as const).map((optKey) => {
                  const val =
                    optKey === "A"
                      ? newOptA
                      : optKey === "B"
                        ? newOptB
                        : optKey === "C"
                          ? newOptC
                          : newOptD;
                  const setVal =
                    optKey === "A"
                      ? setNewOptA
                      : optKey === "B"
                        ? setNewOptB
                        : optKey === "C"
                          ? setNewOptC
                          : setNewOptD;
                  return (
                    <div
                      key={optKey}
                      className="flex items-center gap-1.5 bg-white p-1.5 rounded border border-purple-200"
                    >
                      <input
                        type="radio"
                        name="lessonQCorrect"
                        checked={newCorrectId === optKey}
                        onChange={() => setNewCorrectId(optKey)}
                        className="accent-purple-700 cursor-pointer"
                        title={`Chọn ${optKey} là đáp án đúng`}
                      />
                      <span className="font-mono font-bold text-purple-900">
                        {optKey}.
                      </span>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        placeholder={`Đáp án ${optKey}...`}
                        className="flex-1 text-xs outline-none text-[#30312F]"
                      />
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block font-bold text-[#30312F] mb-1">
                  Giải thích đáp án đúng:
                </label>
                <input
                  type="text"
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="Giải thích ngắn gọn cơ chế..."
                  className="w-full p-2 rounded bg-white border border-purple-200 text-[#30312F]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-purple-700 hover:bg-purple-800 text-white font-bold cursor-pointer"
                >
                  Lưu câu hỏi vào bài này
                </button>
              </div>
            </form>
          )}

          {/* Score Summary Banner when Submitted */}
          {isSubmitted && (
            <div
              className={`p-4 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isPassed
                  ? "bg-[#EDF6F2] border-[#34745B] text-[#1E4435]"
                  : "bg-[#F9ECEE] border-[#782F3B] text-[#5C232D]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0 ${
                    isPassed ? "bg-[#34745B]" : "bg-[#782F3B]"
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider">
                    {isPassed
                      ? "HOÀN THÀNH BÀI HỌC • ĐẠT CHUẨN"
                      : "CHƯA ĐẠT NGƯỠNG • CẦN ÔN LẠI"}
                  </div>
                  <div className="font-serif text-lg font-bold">
                    Kết quả: {correctCount}/{totalQ} câu đúng ({scorePercent}%)
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetQuiz}
                className="px-3.5 py-2 rounded-lg bg-white hover:bg-[#FAF7F0] text-[#30312F] border border-[#DDD7CC] text-xs font-bold flex items-center gap-1.5 self-start sm:self-center cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#782F3B]" />
                <span>Làm lại</span>
              </button>
            </div>
          )}

          {/* Empty State when 0 questions entered */}
          {!currentQ && !showAddForm && (
            <div className="py-10 px-4 text-center space-y-3 bg-white rounded-xl border border-dashed border-[#DDD7CC]">
              <p className="text-sm font-serif font-bold text-[#30312F]">
                Bài học này hiện chưa có câu hỏi kiểm tra nào được nhập.
              </p>
              <p className="text-xs text-[#77756F]">
                {isAdmin
                  ? "Bấm nút bên dưới để thêm câu hỏi trắc nghiệm đầu tiên cho bài học này."
                  : "Quản trị viên chưa nhập câu hỏi cho bài học này."}
              </p>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#782F3B] hover:bg-[#642530] text-white text-xs font-bold transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Thêm câu hỏi cho bài này</span>
                </button>
              )}
            </div>
          )}

          {/* Active Question Body */}
          {currentQ && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#F9ECEE] text-[#782F3B] font-mono text-xs font-bold border border-[#E8B4BB]">
                    Câu {currentIdx + 1}/{totalQ}
                  </span>
                  <span className="text-[11px] font-mono text-[#77756F] bg-[#E9E3D5] px-2 py-0.5 rounded">
                    {currentQ.difficulty}
                  </span>
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      deleteLessonQuestion(lesson, currentQ.id);
                      setCurrentIdx(0);
                    }}
                    className="text-xs text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                    title="Xóa câu hỏi này khỏi bài học"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa câu này</span>
                  </button>
                )}
              </div>

              {currentQ.vignette && (
                <div className="p-3.5 bg-[#F3EFE6] border-l-4 border-[#782F3B] rounded-r-lg text-xs text-[#30312F] leading-relaxed space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#782F3B] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Tình huống lâm sàng</span>
                  </div>
                  <p>{currentQ.vignette}</p>
                </div>
              )}

              <h4 className="font-serif text-base sm:text-lg font-bold text-[#30312F] leading-snug">
                {currentQ.question}
              </h4>

              {/* Options List */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt) => {
                  const userAns = selectedAnswers[currentQ.id];
                  const isSelected = userAns === opt.id;

                  let cardStyle =
                    "bg-white border-[#DDD7CC] hover:border-[#782F3B]/60 text-[#30312F]";
                  let badgeStyle = "bg-[#E9E3D5] text-[#30312F]";

                  if (isSubmitted) {
                    if (opt.isCorrect) {
                      cardStyle =
                        "bg-[#EDF6F2] border-[#34745B] ring-1 ring-[#34745B] text-[#1E4435]";
                      badgeStyle = "bg-[#34745B] text-white";
                    } else if (isSelected && !opt.isCorrect) {
                      cardStyle =
                        "bg-red-50 border-red-400 text-red-900";
                      badgeStyle = "bg-red-600 text-white";
                    }
                  } else if (isSelected) {
                    cardStyle =
                      "bg-[#F9ECEE] border-[#782F3B] ring-1 ring-[#782F3B] text-[#30312F]";
                    badgeStyle = "bg-[#782F3B] text-white";
                  }

                  return (
                    <div key={opt.id} className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => handleSelectOption(opt.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer ${cardStyle}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${badgeStyle}`}
                        >
                          {opt.id}
                        </span>
                        <div className="flex-1 text-xs sm:text-sm leading-relaxed font-medium">
                          {opt.text}
                        </div>
                        {isSubmitted && opt.isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-[#34745B] shrink-0 mt-0.5" />
                        )}
                        {isSubmitted && isSelected && !opt.isCorrect && (
                          <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        )}
                      </button>

                      {/* Explanation shown after submit */}
                      {isSubmitted && (opt.isCorrect || isSelected) && (
                        <div
                          className={`ml-9 p-2.5 rounded-lg text-xs leading-relaxed ${
                            opt.isCorrect
                              ? "bg-[#EDF6F2]/80 text-[#1E4435] border border-[#DBEDE4]"
                              : "bg-red-50/80 text-red-800 border border-red-200"
                          }`}
                        >
                          <strong>Giải thích:</strong> {opt.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Floating Window Footer */}
        <div className="bg-[#F3EFE6] border-t border-[#DDD7CC] px-4 sm:px-6 py-3 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            className="px-3 py-2 rounded-lg bg-white hover:bg-[#FAF7F0] text-[#30312F] border border-[#DDD7CC] text-xs font-semibold disabled:opacity-40 flex items-center gap-1 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Câu trước</span>
          </button>

          <div className="flex items-center gap-2">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={() => setIsSubmitted(true)}
                className="px-4 py-2 rounded-lg bg-[#34745B] hover:bg-[#295C48] text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Chấm điểm ({Object.keys(selectedAnswers).length}/{totalQ})</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#782F3B] hover:bg-[#642530] text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Quay lại đọc bài</span>
              </button>
            )}

            <button
              type="button"
              disabled={currentIdx >= totalQ - 1}
              onClick={() => setCurrentIdx((i) => Math.min(totalQ - 1, i + 1))}
              className="px-3 py-2 rounded-lg bg-[#782F3B] hover:bg-[#642530] text-white text-xs font-semibold disabled:opacity-40 flex items-center gap-1 transition cursor-pointer"
            >
              <span>Câu tiếp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
