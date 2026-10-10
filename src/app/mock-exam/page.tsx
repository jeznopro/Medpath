"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useAuth } from "@/lib/auth-context";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Flag,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Timer,
  XCircle,
} from "lucide-react";
import { ClientQuestion, QuestionDifficulty } from "@/lib/types";

interface SectionChoice {
  id: string;
  title: string;
  lesson_title?: string;
}

export default function MockExamPage() {
  const { currentUser } = useAuth();

  // Configuration state
  const [inExam, setInExam] = useState(false);
  const [sections, setSections] = useState<SectionChoice[]>([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [durationMinutes, setDurationMinutes] = useState<number>(20);

  // Exam runtime state
  const [questions, setQuestions] = useState<ClientQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Post-exam analytics state
  const [result, setResult] = useState<any | null>(null);

  // Load available sections for config
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch("/api/curriculum");
        const data = await res.json();
        if (data.classes && data.classes[0]?.subjects[0]?.lessons) {
          const list: SectionChoice[] = [];
          data.classes[0].subjects[0].lessons.forEach((l: any) => {
            if (l.sections) {
              l.sections.forEach((s: any) => {
                list.push({
                  id: s.id,
                  title: s.title,
                  lesson_title: l.title,
                });
              });
            }
          });
          setSections(list);
          setSelectedSectionIds(list.map((s) => s.id)); // Default select all
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách mục:", err);
      }
    };
    fetchSections();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!inExam || result) return;

    if (secondsRemaining <= 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [inExam, secondsRemaining, result]);

  const toggleSectionSelect = (id: string) => {
    setSelectedSectionIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleStartExam = async () => {
    if (selectedSectionIds.length === 0) {
      alert("Vui lòng chọn ít nhất 1 bài/mục để thi thử!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/mock-exam/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section_ids: selectedSectionIds,
          question_count: questionCount,
          duration_minutes: durationMinutes,
        }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setSecondsRemaining(durationMinutes * 60);
        setInExam(true);
        setCurrentIndex(0);
        setAnswers({});
        setFlagged(new Set());
        setResult(null);
      } else {
        alert("Không tìm thấy câu hỏi phù hợp cho các mục đã chọn");
      }
    } catch {
      alert("Lỗi khi tạo đề thi thử");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionSelect = (qId: string, optId: string, isMultiple: boolean) => {
    setAnswers((prev) => {
      const current = prev[qId] || [];
      if (isMultiple) {
        if (current.includes(optId)) {
          return { ...prev, [qId]: current.filter((id) => id !== optId) };
        } else {
          return { ...prev, [qId]: [...current, optId] };
        }
      } else {
        return { ...prev, [qId]: [optId] };
      }
    });
  };

  const toggleFlag = (qId: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleAutoSubmit = () => {
    if (!result && inExam) {
      alert("Đã hết thời gian làm bài thi! Hệ thống tự động thu bài và chấm điểm.");
      submitExam();
    }
  };

  const submitExam = async () => {
    setIsSubmitting(true);
    try {
      const formattedAnswers = questions.map((q) => ({
        question_id: q.id,
        selected_option_ids: answers[q.id] || [],
      }));

      // Chấm qua server API submit
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser ? currentUser.id : "student-1",
          section_id: questions[0]?.section_id || "sec-1-1",
          answers: formattedAnswers,
          mode: "mock",
        }),
      });

      const data = await res.json();

      // Phân tích thống kê mức độ nhận thức
      const difficultyStats: Record<string, { total: number; correct: number }> = {
        remember: { total: 0, correct: 0 },
        understand: { total: 0, correct: 0 },
        apply: { total: 0, correct: 0 },
        clinical: { total: 0, correct: 0 },
      };

      data.answers_feedback?.forEach((item: any) => {
        const qOriginal = questions.find((q) => q.id === item.question_id);
        const diff = qOriginal?.difficulty || "understand";
        if (difficultyStats[diff]) {
          difficultyStats[diff].total += 1;
          if (item.is_correct) difficultyStats[diff].correct += 1;
        }
      });

      setResult({
        ...data,
        difficultyStats,
      });

      if (data.score_pct >= 70) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch {
      alert("Lỗi khi chấm điểm bài thi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQ = questions[currentIndex];

  // =========================================================================
  // MÀN HÌNH 1: CẤU HÌNH THI THỬ
  // =========================================================================
  if (!inExam && !result) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/classes"
            className="text-slate-500 hover:text-teal-600 text-xs flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại Môn học</span>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Timer className="w-8 h-8 text-teal-600" />
            <span>Phòng Thi thử Trắc nghiệm Y khoa</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Mô phỏng kỳ thi lý thuyết thực tế: chọn bài thi, giới hạn thời gian đếm ngược, tự động
            nộp bài và phân tích năng lực chi tiết.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cột trái: Chọn bài/mục */}
          <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                1. Chọn phạm vi kiến thức thi ({selectedSectionIds.length}/{sections.length} mục)
              </h2>
              <button
                type="button"
                onClick={() =>
                  setSelectedSectionIds(
                    selectedSectionIds.length === sections.length ? [] : sections.map((s) => s.id)
                  )
                }
                className="text-xs text-teal-600 font-semibold hover:underline"
              >
                {selectedSectionIds.length === sections.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
              </button>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-2">
              {sections.map((sec) => {
                const isSelected = selectedSectionIds.includes(sec.id);
                return (
                  <label
                    key={sec.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition ${
                      isSelected
                        ? "border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200"
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSectionSelect(sec.id)}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{sec.title}</div>
                      {sec.lesson_title && (
                        <div className="text-[11px] text-slate-400 mt-0.5">{sec.lesson_title}</div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Cột phải: Cấu hình số câu & thời gian */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-700">
                2. Cấu hình đề thi
              </h2>

              {/* Số lượng câu */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                  Số lượng câu hỏi: <strong>{questionCount} câu</strong>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 20, 30, 40].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCount(num)}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        questionCount === num
                          ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {num} câu
                    </button>
                  ))}
                </div>
              </div>

              {/* Thời gian */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                  Thời gian làm bài: <strong>{durationMinutes} phút</strong>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 20, 30, 45].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDurationMinutes(m)}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        durationMinutes === m
                          ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {m}p
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary note */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 rounded-xl text-[11px] text-amber-900 dark:text-amber-300 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Quy chế phòng thi:
                </div>
                <div>• Đồng hồ sẽ chạy liên tục, tự động thu bài khi hết giờ.</div>
                <div>• Đáp án đúng và giải thích chỉ hiện sau khi nộp bài.</div>
              </div>

              {/* Start Button */}
              <button
                type="button"
                onClick={handleStartExam}
                disabled={isSubmitting || selectedSectionIds.length === 0}
                className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Bắt đầu thi thử ngay</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MÀN HÌNH 2: PHÒNG THI ĐANG DIỄN RA
  // =========================================================================
  if (inExam && !result && currentQ) {
    const isMultiple = currentQ.type === "multiple_choice";
    const userSelected = answers[currentQ.id] || [];
    const isFlagged = flagged.has(currentQ.id);
    const isUrgent = secondsRemaining < 120; // < 2 phút

    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Sticky Exam Bar */}
        <div className="sticky top-16 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Bài thi thử Y khoa
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold">
              Đã làm: {Object.keys(answers).length} / {questions.length}
            </span>
          </div>

          {/* Countdown Clock */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm transition ${
              isUrgent
                ? "bg-red-500 text-white border-red-600 animate-pulse shadow-md shadow-red-500/30"
                : "bg-slate-100 dark:bg-slate-800 text-teal-800 dark:text-teal-300 border-slate-300"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (confirm("Bạn có chắc chắn muốn nộp bài thi ngay bây giờ?")) {
                submitExam();
              }
            }}
            disabled={isSubmitting}
            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition"
          >
            {isSubmitting ? "Đang nộp..." : "Nộp bài"}
          </button>
        </div>

        {/* Question Palette Grid */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Danh sách câu hỏi
          </div>
          <div className="flex flex-wrap gap-1.5">
            {questions.map((q, idx) => {
              const isDone = (answers[q.id] || []).length > 0;
              const isCurrent = idx === currentIndex;
              const hasFlag = flagged.has(q.id);

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold relative transition ${
                    isCurrent
                      ? "bg-teal-600 text-white scale-105 shadow-sm"
                      : isDone
                      ? "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 border border-slate-200"
                  }`}
                >
                  {idx + 1}
                  {hasFlag && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold text-teal-700 uppercase">
              Câu {currentIndex + 1} / {questions.length}
            </span>
            <button
              onClick={() => toggleFlag(currentQ.id)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
                isFlagged
                  ? "bg-amber-50 border-amber-300 text-amber-700"
                  : "border-slate-200 text-slate-400 hover:text-amber-600"
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${isFlagged ? "fill-amber-500 text-amber-500" : ""}`} />
              <span>{isFlagged ? "Đang phân vân" : "Đánh dấu cờ"}</span>
            </button>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug mb-6">
            {currentQ.body}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = userSelected.includes(opt.id);
              const letter = String.fromCharCode(65 + optIdx);

              return (
                <button
                  key={opt.id}
                  onClick={() => handleOptionSelect(currentQ.id, opt.id, isMultiple)}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition flex items-start gap-3.5 ${
                    isSelected
                      ? "border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100 ring-1 ring-teal-500 font-semibold"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="flex-1">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-40"
          >
            Câu trước
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            disabled={currentIndex === questions.length - 1}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Câu tiếp theo
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MÀN HÌNH 3: PHÂN TÍCH KẾT QUẢ SAU THI
  // =========================================================================
  if (result) {
    const isPassed = result.score_pct >= 70;
    const diffStats = result.difficultyStats || {};

    const diffLabels: Record<string, string> = {
      remember: "Nhớ giải phẫu",
      understand: "Hiểu cấu trúc",
      apply: "Vận dụng",
      clinical: "Lâm sàng",
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Banner kết quả */}
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center bg-teal-50 dark:bg-teal-950 text-teal-600">
            <Award className="w-12 h-12" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">
            Kết quả thi thử Y khoa
          </h2>
          <div className="text-4xl sm:text-5xl font-black text-teal-600 dark:text-teal-400 mb-4">
            {result.score_pct}%
          </div>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
            Bạn đã trả lời đúng {result.correct_count} / {result.total_questions} câu hỏi.
          </p>

          <button
            onClick={() => {
              setResult(null);
              setInExam(false);
            }}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow transition"
          >
            Làm bài thi thử khác
          </button>
        </div>

        {/* Phân tích theo mức độ nhận thức */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">
            Phân tích năng lực theo mức độ nhận thức
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(diffStats).map(([key, stat]: [string, any]) => {
              const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
              return (
                <div key={key} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-900/60">
                  <div className="text-xs font-semibold text-slate-500">{diffLabels[key] || key}</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {pct}%
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {stat.correct}/{stat.total} câu đúng
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Xem lại câu sai & giải thích */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Xem lại chi tiết từng câu hỏi & Đáp án
          </h3>
          {result.answers_feedback?.map((item: any, idx: number) => {
            const isCorrect = item.is_correct;
            return (
              <div
                key={item.question_id}
                className={`p-5 rounded-2xl border ${
                  isCorrect
                    ? "bg-white dark:bg-slate-800 border-emerald-200"
                    : "bg-red-50/40 dark:bg-red-950/20 border-red-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2 text-xs font-bold">
                  <span className={isCorrect ? "text-emerald-600" : "text-red-600"}>
                    Câu {idx + 1}: {isCorrect ? "Đúng" : "Chưa chính xác"}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-3">
                  {item.body}
                </h4>
                <div className="space-y-1.5 text-xs">
                  {item.options?.map((opt: any) => (
                    <div
                      key={opt.id}
                      className={`p-2.5 rounded-lg border ${
                        opt.is_correct
                          ? "bg-emerald-50 border-emerald-300 font-bold text-emerald-900"
                          : item.selected_option_ids?.includes(opt.id)
                          ? "bg-red-50 border-red-300 text-red-900"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      {opt.text} {opt.is_correct && "✓ (Đáp án đúng)"}
                    </div>
                  ))}
                </div>
                {item.explanation && (
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs text-slate-600 dark:text-slate-400">
                    <strong>Giải thích:</strong> {item.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
