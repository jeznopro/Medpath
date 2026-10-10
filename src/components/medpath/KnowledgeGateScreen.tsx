"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { MEDPATH_DISCIPLINES, GateQuestion, Lesson } from "@/lib/medpath-data";
import { useMedPathCurriculum } from "@/lib/use-curriculum";
import { useQuestionBankStore } from "@/lib/module-questions";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  FileQuestion,
  Flag,
  HelpCircle,
  Layers,
  LayoutGrid,
  ListChecks,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  Trash2,
  XCircle,
  Crown,
} from "lucide-react";

interface KnowledgeGateScreenProps {
  onNavigate: (
    screen: "dashboard" | "study-map" | "reader" | "gate" | "analytics"
  ) => void;
  onSelectLessonForReader?: (lessonId: string, openQuiz?: boolean) => void;
}

export function KnowledgeGateScreen({
  onNavigate,
  onSelectLessonForReader,
}: KnowledgeGateScreenProps) {
  const { isAdmin } = useAuth();
  const { modulesMap } = useMedPathCurriculum();
  const {
    moduleQuestionsMap,
    addModuleQuestion,
    deleteModuleQuestion,
    getQuestionsForSingleLesson,
    addLessonQuestion,
    deleteLessonQuestion,
  } = useQuestionBankStore();

  // Selected Module: "mod-8" | "mod-9" | "mod-10" | "mod-11"
  const [selectedModuleId, setSelectedModuleId] = useState<
    "mod-8" | "mod-9" | "mod-10" | "mod-11"
  >("mod-8");

  // Selected Target inside Module:
  // "module-all" = Đề tổng hợp toàn Module
  // or a specific lesson.id = Đề riêng của Bài học đó
  const [selectedLessonId, setSelectedLessonId] =
    useState<string>("module-all");

  // Main View Mode:
  // "lessons" = Danh sách các Bài trong Module (chọn bài để làm đề)
  // "exam"    = Luyện đề trắc nghiệm (của Bài đang chọn hoặc Tổng hợp Module)
  // "bank"    = Xem toàn bộ câu hỏi & đáp án (của Bài đang chọn hoặc Tổng hợp Module)
  // "submitted" = Kết quả chấm điểm
  const [viewMode, setViewMode] = useState<
    "lessons" | "exam" | "bank" | "submitted"
  >("lessons");

  // Search filter for lesson list sidebar / grid
  const [lessonSearchQuery, setLessonSearchQuery] = useState<string>("");
  const [collapsedChapters, setCollapsedChapters] = useState<
    Record<string, boolean>
  >({});

  // Quiz runner states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, "A" | "B" | "C" | "D">
  >({});
  const [instantFeedback, setInstantFeedback] = useState<boolean>(true);
  const [flaggedQuestions, setFlaggedQuestions] = useState<
    Record<number, boolean>
  >({});
  const [timeLeft, setTimeLeft] = useState<number>(20 * 60);

  // Filter states for "bank" mode
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [showAllAnswersInBank, setShowAllAnswersInBank] =
    useState<boolean>(true);

  // Admin Add Question Modal State
  const [showAddQuestionModal, setShowAddQuestionModal] =
    useState<boolean>(false);
  const [newQTargetLessonId, setNewQTargetLessonId] =
    useState<string>("module-all");
  const [newQTopicTag, setNewQTopicTag] = useState<string>("Kiến thức trọng tâm");
  const [newQDifficulty, setNewQDifficulty] = useState<
    "Cơ bản" | "Vận dụng" | "Lâm sàng cao"
  >("Vận dụng");
  const [newQVignette, setNewQVignette] = useState<string>("");
  const [newQQuestion, setNewQQuestion] = useState<string>("");
  const [newQOptA, setNewQOptA] = useState<string>("");
  const [newQOptB, setNewQOptB] = useState<string>("");
  const [newQOptC, setNewQOptC] = useState<string>("");
  const [newQOptD, setNewQOptD] = useState<string>("");
  const [newQCorrect, setNewQCorrect] = useState<"A" | "B" | "C" | "D">("A");
  const [newQExplanation, setNewQExplanation] = useState<string>("");
  const [confirmDeleteQId, setConfirmDeleteQId] = useState<number | null>(null);

  // Chapters & flattened lessons of the currently selected Module
  const currentChapters = useMemo(
    () => modulesMap[selectedModuleId] || [],
    [modulesMap, selectedModuleId]
  );

  const allLessonsInModule = useMemo(() => {
    const list: { lesson: Lesson; chapterTitle: string; chapterRoman: string }[] =
      [];
    for (const ch of currentChapters) {
      for (const les of ch.lessons) {
        list.push({
          lesson: les,
          chapterTitle: ch.title,
          chapterRoman: ch.romanNumeral,
        });
      }
    }
    return list;
  }, [currentChapters]);

  const activeLessonObj = useMemo(() => {
    if (selectedLessonId === "module-all") return null;
    return (
      allLessonsInModule.find((item) => item.lesson.id === selectedLessonId) ||
      null
    );
  }, [allLessonsInModule, selectedLessonId]);

  // Build active question list based on whether "module-all" or a specific Lesson is selected
  const currentQuestions: GateQuestion[] = useMemo(() => {
    if (selectedLessonId === "module-all" || !activeLessonObj) {
      const modGeneral = moduleQuestionsMap[selectedModuleId] || [];
      const fromLessons = allLessonsInModule.flatMap((item) =>
        getQuestionsForSingleLesson(item.lesson)
      );
      return [...modGeneral, ...fromLessons];
    }
    return getQuestionsForSingleLesson(activeLessonObj.lesson);
  }, [
    selectedLessonId,
    activeLessonObj,
    moduleQuestionsMap,
    selectedModuleId,
    allLessonsInModule,
    getQuestionsForSingleLesson,
  ]);

  // Reset question index when switching module or lesson
  useEffect(() => {
    setCurrentQuestionIndex(0);
  }, [selectedModuleId, selectedLessonId]);

  // Countdown timer when in exam mode
  useEffect(() => {
    if (viewMode !== "exam") return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [viewMode]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const activeDiscipline =
    MEDPATH_DISCIPLINES.find((d) => d.id === selectedModuleId) ||
    MEDPATH_DISCIPLINES[0];

  const currentQ: GateQuestion | undefined =
    currentQuestions[currentQuestionIndex] || currentQuestions[0];

  const handleSelectModule = (
    modId: "mod-8" | "mod-9" | "mod-10" | "mod-11"
  ) => {
    setSelectedModuleId(modId);
    setSelectedLessonId("module-all");
    setCurrentQuestionIndex(0);
  };

  const handleSelectLessonTarget = (
    lessonId: string,
    targetMode: "exam" | "bank" = "exam"
  ) => {
    setSelectedLessonId(lessonId);
    setCurrentQuestionIndex(0);
    setViewMode(targetMode);
  };

  const handleSelectOption = (
    questionId: number,
    optionId: "A" | "B" | "C" | "D"
  ) => {
    if (viewMode === "submitted") return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const toggleFlag = (id: number) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleResetExam = () => {
    const nextAnswers = { ...selectedAnswers };
    for (const q of currentQuestions) {
      delete nextAnswers[q.id];
    }
    setSelectedAnswers(nextAnswers);
    setCurrentQuestionIndex(0);
    setTimeLeft(20 * 60);
    setViewMode("exam");
  };

  const openAddQuestionForTarget = (targetLessonId: string) => {
    setNewQTargetLessonId(targetLessonId);
    if (targetLessonId !== "module-all") {
      const found = allLessonsInModule.find(
        (x) => x.lesson.id === targetLessonId
      );
      if (found) {
        setNewQTopicTag(found.lesson.code);
      }
    } else {
      setNewQTopicTag(activeDiscipline.name);
    }
    setShowAddQuestionModal(true);
  };

  const handleAdminCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQQuestion.trim() || !newQOptA.trim() || !newQOptB.trim()) return;

    const targetLes =
      newQTargetLessonId !== "module-all"
        ? allLessonsInModule.find((x) => x.lesson.id === newQTargetLessonId)
            ?.lesson
        : null;

    const questionPayload = {
      type: (newQVignette.trim() ? "clinical_case" : "single") as
        | "single"
        | "clinical_case",
      vignette: newQVignette.trim() || undefined,
      question: newQQuestion.trim(),
      latinContext: targetLes ? targetLes.latinTitle : activeDiscipline.latinName,
      difficulty: newQDifficulty,
      topicTag:
        newQTopicTag.trim() ||
        (targetLes ? targetLes.code : "Kiến thức trọng tâm"),
      reference: targetLes
        ? `${targetLes.code} — ${targetLes.title}`
        : `${activeDiscipline.name} (Đề tổng hợp)`,
      options: [
        {
          id: "A" as const,
          text: newQOptA.trim(),
          isCorrect: newQCorrect === "A",
          explanation:
            newQCorrect === "A"
              ? newQExplanation.trim() || "Đáp án chính xác theo giáo trình."
              : "Phương án chưa chính xác.",
        },
        {
          id: "B" as const,
          text: newQOptB.trim(),
          isCorrect: newQCorrect === "B",
          explanation:
            newQCorrect === "B"
              ? newQExplanation.trim() || "Đáp án chính xác theo giáo trình."
              : "Phương án chưa chính xác.",
        },
        {
          id: "C" as const,
          text: newQOptC.trim() || "Cả hai phương án A và B đều sai",
          isCorrect: newQCorrect === "C",
          explanation:
            newQCorrect === "C"
              ? newQExplanation.trim() || "Đáp án chính xác theo giáo trình."
              : "Phương án chưa chính xác.",
        },
        {
          id: "D" as const,
          text: newQOptD.trim() || "Tất cả các phương án trên đều đúng",
          isCorrect: newQCorrect === "D",
          explanation:
            newQCorrect === "D"
              ? newQExplanation.trim() || "Đáp án chính xác theo giáo trình."
              : "Phương án chưa chính xác.",
        },
      ],
    };

    if (targetLes) {
      addLessonQuestion(targetLes, questionPayload);
      setSelectedLessonId(targetLes.id);
    } else {
      addModuleQuestion(selectedModuleId, {
        ...questionPayload,
        lessonCode: "TỔNG HỢP",
      });
      setSelectedLessonId("module-all");
    }

    setNewQVignette("");
    setNewQQuestion("");
    setNewQOptA("");
    setNewQOptB("");
    setNewQOptC("");
    setNewQOptD("");
    setNewQExplanation("");
    setShowAddQuestionModal(false);
    if (viewMode === "lessons") {
      setViewMode("exam");
    }
  };

  const handleDeleteCurrentQuestion = (qId: number) => {
    if (selectedLessonId !== "module-all" && activeLessonObj) {
      deleteLessonQuestion(activeLessonObj.lesson, qId);
    } else {
      deleteModuleQuestion(selectedModuleId, qId);
    }
    setConfirmDeleteQId(null);
    if (currentQuestionIndex >= currentQuestions.length - 1) {
      setCurrentQuestionIndex(Math.max(0, currentQuestions.length - 2));
    }
  };

  // Calculate score for current target's questions
  const totalQuestions = currentQuestions.length;
  const answeredCount = currentQuestions.filter(
    (q) => selectedAnswers[q.id] !== undefined
  ).length;
  const correctCount = currentQuestions.filter((q) => {
    const userAns = selectedAnswers[q.id];
    const correctOpt = q.options.find((o) => o.isCorrect);
    return userAns === correctOpt?.id;
  }).length;
  const scorePercentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Filtered questions for "bank" mode
  const filteredBankQuestions = currentQuestions.filter((q) => {
    if (difficultyFilter !== "all" && q.difficulty !== difficultyFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const kw = searchQuery.toLowerCase();
      return (
        q.question.toLowerCase().includes(kw) ||
        (q.vignette && q.vignette.toLowerCase().includes(kw)) ||
        q.topicTag.toLowerCase().includes(kw) ||
        q.reference.toLowerCase().includes(kw)
      );
    }
    return true;
  });

  const toggleChapterCollapse = (chapterId: string) => {
    setCollapsedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. HEADER & 4 MODULE TABS */}
      <section className="bg-[#FAF7F0] border border-[#DDD7CC] rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-[#E5DFD3]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#782F3B] font-semibold mb-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>NGÂN HÀNG ĐỀ & CÂU HỎI THEO MODULE — CHIA THEO TỪNG BÀI HỌC</span>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#782F3B] text-white text-[10px]">
                  <Crown className="w-3 h-3" /> QUẢN TRỊ VIÊN
                </span>
              )}
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#30312F]">
              Bộ câu hỏi của các Module & Từng Bài học
            </h1>
            <p className="text-sm text-[#605F5B] mt-1">
              Chọn <strong>Module học phần</strong> bên dưới, sau đó chọn{" "}
              <strong>từng Bài học cụ thể</strong> (hoặc Đề tổng hợp Module) để luyện đề trắc nghiệm và quản lý câu hỏi.
            </p>
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Switch between 3 Modes: Danh sách Bài / Luyện đề / Ngân hàng câu hỏi */}
            <div className="inline-flex rounded-lg bg-[#E9E3D5] p-1 border border-[#DDD7CC]">
              <button
                onClick={() => setViewMode("lessons")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  viewMode === "lessons"
                    ? "bg-[#30312F] text-[#F3EFE6] shadow-sm"
                    : "text-[#605F5B] hover:text-[#30312F]"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Chia theo Bài ({allLessonsInModule.length} bài)
              </button>
              <button
                onClick={() => setViewMode("exam")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  viewMode === "exam" || viewMode === "submitted"
                    ? "bg-[#782F3B] text-white shadow-sm"
                    : "text-[#605F5B] hover:text-[#30312F]"
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                Luyện đề ({totalQuestions} câu)
              </button>
              <button
                onClick={() => setViewMode("bank")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  viewMode === "bank"
                    ? "bg-[#2C5282] text-white shadow-sm"
                    : "text-[#605F5B] hover:text-[#30312F]"
                }`}
              >
                <ListChecks className="w-3.5 h-3.5" />
                Xem câu hỏi & Đáp án
              </button>
            </div>

            {isAdmin && (
              <button
                onClick={() => openAddQuestionForTarget(selectedLessonId)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2E6F40] hover:bg-[#235832] text-white text-xs font-semibold shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                + Thêm câu hỏi
              </button>
            )}
          </div>
        </div>

        {/* 4 MODULE SELECTOR CARDS */}
        <div className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {MEDPATH_DISCIPLINES.map((mod) => {
              const isSelected = selectedModuleId === mod.id;
              const modChapters = modulesMap[mod.id] || [];
              const modLessonCount = modChapters.reduce(
                (acc, ch) => acc + ch.lessons.length,
                0
              );
              const modGeneralQCount = (moduleQuestionsMap[mod.id] || []).length;

              return (
                <button
                  key={mod.id}
                  onClick={() =>
                    handleSelectModule(
                      mod.id as "mod-8" | "mod-9" | "mod-10" | "mod-11"
                    )
                  }
                  className={`text-left p-3.5 rounded-lg border transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#782F3B] text-white border-[#782F3B] shadow-sm"
                      : "bg-[#F3EFE6] hover:bg-[#EAE3D5] text-[#30312F] border-[#DDD7CC]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-semibold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-[#E5DFD3] text-[#782F3B]"
                      }`}
                    >
                      {mod.code}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        isSelected ? "text-[#FCD34D]" : "text-[#2E6F40]"
                      }`}
                    >
                      {modLessonCount} bài • {modGeneralQCount} câu tổng hợp
                    </span>
                  </div>
                  <div className="font-serif font-bold text-sm leading-snug">
                    {mod.name}
                  </div>
                  <div
                    className={`text-[11px] italic mt-0.5 truncate ${
                      isSelected ? "text-white/80" : "text-[#605F5B]"
                    }`}
                  >
                    {mod.latinName}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. ADMIN MODAL: THÊM CÂU HỎI MỚI (CHO BÀI HỌC CỤ THỂ HOẶC ĐỀ TỔNG HỢP MODULE) */}
      {isAdmin && showAddQuestionModal && (
        <section className="bg-white border-2 border-[#2E6F40] rounded-xl p-5 sm:p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5DFD3] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2E6F40]" />
              <h2 className="font-serif text-lg font-bold text-[#30312F]">
                Thêm câu hỏi trắc nghiệm mới vào {activeDiscipline.name}
              </h2>
            </div>
            <button
              onClick={() => setShowAddQuestionModal(false)}
              className="text-xs font-semibold text-[#605F5B] hover:text-[#30312F] px-2.5 py-1 rounded bg-[#F3EFE6]"
            >
              Đóng
            </button>
          </div>

          <form onSubmit={handleAdminCreateQuestion} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Chọn Bài học trong Module */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#30312F] mb-1">
                  Thuộc Bài học nào trong {activeDiscipline.name}? *
                </label>
                <select
                  value={newQTargetLessonId}
                  onChange={(e) => setNewQTargetLessonId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD7CC] bg-[#FAF7F0] text-xs font-semibold text-[#30312F]"
                >
                  <option value="module-all">
                    ★ Đề tổng hợp chung của toàn {activeDiscipline.name}
                  </option>
                  {currentChapters.map((ch) => (
                    <optgroup
                      key={ch.id}
                      label={`Chương ${ch.romanNumeral}: ${ch.title}`}
                    >
                      {ch.lessons.map((les) => (
                        <option key={les.id} value={les.id}>
                          [{les.code}] {les.title}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#30312F] mb-1">
                  Độ khó câu hỏi
                </label>
                <select
                  value={newQDifficulty}
                  onChange={(e) =>
                    setNewQDifficulty(
                      e.target.value as "Cơ bản" | "Vận dụng" | "Lâm sàng cao"
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD7CC] bg-[#FAF7F0] text-xs font-semibold text-[#30312F]"
                >
                  <option value="Cơ bản">Cơ bản</option>
                  <option value="Vận dụng">Vận dụng</option>
                  <option value="Lâm sàng cao">Lâm sàng cao</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#30312F] mb-1">
                  Chủ đề / Phân môn (Tag)
                </label>
                <input
                  type="text"
                  value={newQTopicTag}
                  onChange={(e) => setNewQTopicTag(e.target.value)}
                  placeholder="VD: Giải phẫu mạch vành / Sinh lý tim"
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD7CC] bg-white text-xs text-[#30312F]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#30312F] mb-1">
                  Tình huống lâm sàng (Vignette - Không bắt buộc)
                </label>
                <input
                  type="text"
                  value={newQVignette}
                  onChange={(e) => setNewQVignette(e.target.value)}
                  placeholder="Nhập tóm tắt ca bệnh nếu là câu hỏi tình huống lâm sàng..."
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD7CC] bg-white text-xs text-[#30312F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#30312F] mb-1">
                Nội dung câu hỏi chính *
              </label>
              <textarea
                rows={2}
                required
                value={newQQuestion}
                onChange={(e) => setNewQQuestion(e.target.value)}
                placeholder="Nhập câu hỏi trắc nghiệm..."
                className="w-full px-3 py-2 rounded-lg border border-[#DDD7CC] bg-white text-xs text-[#30312F]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#30312F] mb-1">
                  Phương án A *
                </label>
                <input
                  type="text"
                  required
                  value={newQOptA}
                  onChange={(e) => setNewQOptA(e.target.value)}
                  placeholder="Nội dung đáp án A"
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD7CC] bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#30312F] mb-1">
                  Phương án B *
                </label>
                <input
                  type="text"
                  required
                  value={newQOptB}
                  onChange={(e) => setNewQOptB(e.target.value)}
                  placeholder="Nội dung đáp án B"
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD7CC] bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#30312F] mb-1">
                  Phương án C
                </label>
                <input
                  type="text"
                  value={newQOptC}
                  onChange={(e) => setNewQOptC(e.target.value)}
                  placeholder="Nội dung đáp án C"
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD7CC] bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#30312F] mb-1">
                  Phương án D
                </label>
                <input
                  type="text"
                  value={newQOptD}
                  onChange={(e) => setNewQOptD(e.target.value)}
                  placeholder="Nội dung đáp án D"
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD7CC] bg-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#30312F] mb-1">
                  Đáp án ĐÚNG *
                </label>
                <select
                  value={newQCorrect}
                  onChange={(e) =>
                    setNewQCorrect(e.target.value as "A" | "B" | "C" | "D")
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#2E6F40] bg-[#E8F5E9] text-xs font-bold text-[#2E6F40]"
                >
                  <option value="A">Đáp án A</option>
                  <option value="B">Đáp án B</option>
                  <option value="C">Đáp án C</option>
                  <option value="D">Đáp án D</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#30312F] mb-1">
                  Giải thích đáp án đúng
                </label>
                <input
                  type="text"
                  value={newQExplanation}
                  onChange={(e) => setNewQExplanation(e.target.value)}
                  placeholder="Giải thích cơ chế giải phẫu / sinh lý / lâm sàng vì sao chọn đáp án này..."
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD7CC] bg-white text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddQuestionModal(false)}
                className="px-4 py-2 rounded-lg border border-[#DDD7CC] text-xs font-semibold text-[#605F5B]"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#2E6F40] hover:bg-[#235832] text-white text-xs font-semibold shadow-sm"
              >
                Lưu câu hỏi
              </button>
            </div>
          </form>
        </section>
      )}

      {/* 3. CHẾ ĐỘ 1: DANH SÁCH ĐỀ CHIA THEO CÁC BÀI TRONG MODULE ("lessons" mode) */}
      {viewMode === "lessons" && (
        <div className="space-y-5">
          {/* Card Đề tổng hợp toàn Module */}
          <div className="bg-gradient-to-r from-[#782F3B] to-[#5B212B] text-white rounded-xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/15 text-[#FCD34D] text-[11px] font-mono uppercase tracking-wider font-semibold">
                <Award className="w-3.5 h-3.5" /> ĐỀ TỔNG HỢP TOÀN MODULE
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                Đề thi Tổng hợp {activeDiscipline.name}
              </h2>
              <p className="text-xs sm:text-sm text-white/85 max-w-2xl">
                Bộ câu hỏi tích hợp toàn bộ các phân môn (Giải phẫu, Mô phôi, Sinh lý, Hóa sinh, Giải phẫu bệnh, Dược lý & Lâm sàng) trong{" "}
                <strong>{activeDiscipline.name}</strong>.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => handleSelectLessonTarget("module-all", "exam")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-[#782F3B] hover:bg-[#FAF7F0] text-xs font-bold shadow-sm transition"
              >
                <Target className="w-4 h-4" />
                Làm đề tổng hợp ({(moduleQuestionsMap[selectedModuleId] || []).length} câu)
              </button>
              <button
                onClick={() => handleSelectLessonTarget("module-all", "bank")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition"
              >
                <ListChecks className="w-4 h-4" />
                Xem câu hỏi
              </button>
              {isAdmin && (
                <button
                  onClick={() => openAddQuestionForTarget("module-all")}
                  className="inline-flex items-center gap-1 px-3 py-2.5 rounded-lg bg-[#2E6F40] hover:bg-[#235832] text-white text-xs font-semibold transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm câu hỏi
                </button>
              )}
            </div>
          </div>

          {/* Thanh tìm kiếm Bài học trong Module */}
          <div className="bg-[#FAF7F0] border border-[#DDD7CC] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-base font-bold text-[#30312F]">
                Danh sách Đề kiểm tra theo từng Bài học — {activeDiscipline.name}
              </h3>
              <p className="text-xs text-[#605F5B]">
                Tổng cộng <strong>{currentChapters.length} chương</strong> •{" "}
                <strong>{allLessonsInModule.length} bài học</strong> có bộ đề riêng
              </p>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#8C8881] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={lessonSearchQuery}
                onChange={(e) => setLessonSearchQuery(e.target.value)}
                placeholder="Tìm tên bài học hoặc mã bài (VD: K56.LT1)..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#DDD7CC] bg-white text-xs text-[#30312F]"
              />
            </div>
          </div>

          {/* Danh sách Chương & Các Bài học trong Module */}
          <div className="space-y-4">
            {currentChapters.map((chapter) => {
              const filteredLessons = chapter.lessons.filter((les) => {
                if (!lessonSearchQuery.trim()) return true;
                const kw = lessonSearchQuery.toLowerCase();
                return (
                  les.title.toLowerCase().includes(kw) ||
                  les.code.toLowerCase().includes(kw) ||
                  (les.latinTitle && les.latinTitle.toLowerCase().includes(kw))
                );
              });

              if (lessonSearchQuery.trim() && filteredLessons.length === 0) {
                return null;
              }

              const isCollapsed = !!collapsedChapters[chapter.id];

              return (
                <div
                  key={chapter.id}
                  className="bg-[#FAF7F0] border border-[#DDD7CC] rounded-xl overflow-hidden shadow-sm"
                >
                  {/* Chapter Header */}
                  <button
                    onClick={() => toggleChapterCollapse(chapter.id)}
                    className="w-full px-5 py-3.5 bg-[#EFECE4] hover:bg-[#E7E2D8] transition flex items-center justify-between text-left border-b border-[#DDD7CC]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[#782F3B] text-white font-serif font-bold text-xs flex items-center justify-center shrink-0">
                        {chapter.romanNumeral}
                      </span>
                      <div>
                        <div className="font-serif font-bold text-base text-[#30312F]">
                          Chương {chapter.romanNumeral}: {chapter.title}
                        </div>
                        <div className="text-[11px] text-[#605F5B] italic">
                          {chapter.latinTitle} • {filteredLessons.length} bài kiểm tra
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#605F5B]">
                      <span>{filteredLessons.length} bài</span>
                      {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* Lessons Table / Cards inside Chapter */}
                  {!isCollapsed && (
                    <div className="divide-y divide-[#E5DFD3]">
                      {filteredLessons.map((lesson, idx) => {
                        const lessonQs = getQuestionsForSingleLesson(lesson);
                        const answeredInLesson = lessonQs.filter(
                          (q) => selectedAnswers[q.id] !== undefined
                        ).length;

                        return (
                          <div
                            key={lesson.id}
                            className="p-4 sm:px-5 hover:bg-white/80 transition flex flex-col lg:flex-row lg:items-center justify-between gap-3.5"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <span className="px-2.5 py-1 rounded bg-[#E9E3D5] text-[#782F3B] font-mono text-xs font-bold shrink-0 mt-0.5">
                                {lesson.code}
                              </span>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#30312F]">
                                    Bài {idx + 1}: {lesson.title}
                                  </h4>
                                  <span className="px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E6F40] font-mono text-[11px] font-semibold">
                                    {lessonQs.length} câu hỏi
                                  </span>
                                  {answeredInLesson > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] font-mono text-[10px] font-semibold">
                                      Đã làm {answeredInLesson}/{lessonQs.length}
                                    </span>
                                  )}
                                </div>
                                {lesson.latinTitle && (
                                  <p className="text-xs italic text-[#605F5B] mt-0.5">
                                    {lesson.latinTitle}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Actions for this specific Lesson */}
                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                              <button
                                onClick={() =>
                                  handleSelectLessonTarget(lesson.id, "exam")
                                }
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#782F3B] hover:bg-[#61232E] text-white text-xs font-semibold shadow-sm transition"
                              >
                                <Target className="w-3.5 h-3.5" />
                                Làm đề bài này ({lessonQs.length} câu)
                              </button>

                              <button
                                onClick={() =>
                                  handleSelectLessonTarget(lesson.id, "bank")
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#DDD7CC] bg-white hover:bg-[#F3EFE6] text-[#30312F] text-xs font-semibold transition"
                              >
                                <ListChecks className="w-3.5 h-3.5 text-[#2C5282]" />
                                Xem câu hỏi
                              </button>

                              {onSelectLessonForReader && (
                                <button
                                  onClick={() =>
                                    onSelectLessonForReader(lesson.id, false)
                                  }
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#DDD7CC] bg-[#FAF7F0] hover:bg-[#E9E3D5] text-[#605F5B] hover:text-[#30312F] text-xs font-medium transition"
                                  title="Mở trang đọc lý thuyết của bài học này"
                                >
                                  <BookOpen className="w-3.5 h-3.5" />
                                  Đọc bài
                                </button>
                              )}

                              {isAdmin && (
                                <button
                                  onClick={() =>
                                    openAddQuestionForTarget(lesson.id)
                                  }
                                  className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E6F40] border border-[#2E6F40]/30 text-xs font-semibold transition"
                                  title="Thêm câu hỏi mới vào bài học này"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  Thêm câu
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. CHẾ ĐỘ 2 & 3: LUYỆN ĐỀ HOẶC XEM NGÂN HÀNG CÂU HỎI (KÈM CỘT CHỌN BÀI BÊN TRÁI) */}
      {(viewMode === "exam" ||
        viewMode === "bank" ||
        viewMode === "submitted") && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CỘT TRÁI (3/12): DANH SÁCH CÁC BÀI HỌC TRONG MODULE ĐỂ CHUYỂN NHANH */}
          <aside className="lg:col-span-4 xl:col-span-3 bg-[#FAF7F0] border border-[#DDD7CC] rounded-xl overflow-hidden shadow-sm lg:sticky lg:top-20">
            <div className="p-3.5 bg-[#EFECE4] border-b border-[#DDD7CC] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#782F3B] font-bold">
                  CHỌN ĐỀ THEO BÀI HỌC
                </div>
                <div className="font-serif font-bold text-sm text-[#30312F]">
                  {activeDiscipline.name}
                </div>
              </div>
              <button
                onClick={() => setViewMode("lessons")}
                className="text-[11px] font-semibold text-[#2C5282] hover:underline flex items-center gap-1"
              >
                <LayoutGrid className="w-3 h-3" /> Tất cả bài
              </button>
            </div>

            {/* Search inside sidebar */}
            <div className="p-2.5 border-b border-[#E5DFD3] bg-white">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#8C8881] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={lessonSearchQuery}
                  onChange={(e) => setLessonSearchQuery(e.target.value)}
                  placeholder="Tìm nhanh bài học..."
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-md border border-[#DDD7CC] bg-[#FAF7F0] text-xs text-[#30312F]"
                />
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto divide-y divide-[#E5DFD3]">
              {/* Option 0: Đề tổng hợp toàn Module */}
              <button
                onClick={() => {
                  setSelectedLessonId("module-all");
                  if (viewMode === "submitted") setViewMode("exam");
                }}
                className={`w-full text-left p-3 transition flex items-center justify-between gap-2 ${
                  selectedLessonId === "module-all"
                    ? "bg-[#782F3B] text-white font-semibold"
                    : "hover:bg-[#EAE3D5] text-[#30312F]"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Award className="w-4 h-4 shrink-0 text-[#FCD34D]" />
                  <div className="truncate text-xs font-bold">
                    Đề tổng hợp toàn Module
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                    selectedLessonId === "module-all"
                      ? "bg-white/20 text-white"
                      : "bg-[#E5DFD3] text-[#782F3B]"
                  }`}
                >
                  {(moduleQuestionsMap[selectedModuleId] || []).length} câu
                </span>
              </button>

              {/* Danh sách từng Chương & Bài học */}
              {currentChapters.map((ch) => {
                const visibleLessons = ch.lessons.filter((les) => {
                  if (!lessonSearchQuery.trim()) return true;
                  const kw = lessonSearchQuery.toLowerCase();
                  return (
                    les.title.toLowerCase().includes(kw) ||
                    les.code.toLowerCase().includes(kw)
                  );
                });
                if (visibleLessons.length === 0) return null;

                return (
                  <div key={ch.id}>
                    <div className="px-3 py-1.5 bg-[#F3EFE6] text-[10px] font-mono uppercase tracking-wider font-bold text-[#605F5B]">
                      Chương {ch.romanNumeral}: {ch.title}
                    </div>
                    <div className="divide-y divide-[#EFECE4]">
                      {visibleLessons.map((les) => {
                        const isActiveLesson = selectedLessonId === les.id;
                        const qList = getQuestionsForSingleLesson(les);
                        return (
                          <button
                            key={les.id}
                            onClick={() => {
                              setSelectedLessonId(les.id);
                              if (viewMode === "submitted") setViewMode("exam");
                            }}
                            className={`w-full text-left px-3 py-2.5 transition flex items-start justify-between gap-2 ${
                              isActiveLesson
                                ? "bg-[#2C5282] text-white"
                                : "hover:bg-white text-[#30312F]"
                            }`}
                          >
                            <div className="min-w-0">
                              <div
                                className={`text-[10px] font-mono font-bold ${
                                  isActiveLesson
                                    ? "text-[#90CDF4]"
                                    : "text-[#782F3B]"
                                }`}
                              >
                                {les.code}
                              </div>
                              <div className="text-xs font-medium leading-snug line-clamp-2">
                                {les.title}
                              </div>
                            </div>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                                isActiveLesson
                                  ? "bg-white/20 text-white"
                                  : "bg-[#EFECE4] text-[#605F5B]"
                              }`}
                            >
                              {qList.length}c
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* CỘT PHẢI (8/12 hoặc 9/12): NỘI DUNG ĐỀ THI / NGÂN HÀNG CÂU HỎI CỦA BÀI ĐANG CHỌN */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-5">
            {/* Banner thông tin Bài học đang chọn */}
            <div className="bg-white border border-[#DDD7CC] rounded-xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#782F3B] font-bold">
                  <span>{activeDiscipline.name}</span>
                  <span>•</span>
                  {activeLessonObj ? (
                    <>
                      <span>Chương {activeLessonObj.chapterRoman}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded bg-[#782F3B] text-white">
                        {activeLessonObj.lesson.code}
                      </span>
                    </>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-[#782F3B] text-white">
                      ĐỀ TỔNG HỢP MODULE
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#30312F] mt-1">
                  {activeLessonObj
                    ? activeLessonObj.lesson.title
                    : `Đề tổng hợp toàn ${activeDiscipline.name}`}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {activeLessonObj && onSelectLessonForReader && (
                  <button
                    onClick={() =>
                      onSelectLessonForReader(activeLessonObj.lesson.id, false)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD7CC] bg-[#FAF7F0] hover:bg-[#E9E3D5] text-xs font-semibold text-[#30312F] transition"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#782F3B]" />
                    Đọc lý thuyết bài này
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={() => openAddQuestionForTarget(selectedLessonId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2E6F40] hover:bg-[#235832] text-white text-xs font-semibold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + Thêm câu hỏi vào bài này
                  </button>
                )}
              </div>
            </div>

            {/* A. CHẾ ĐỘ XEM TOÀN BỘ CÂU HỎI ("bank" mode) */}
            {viewMode === "bank" && (
              <section className="space-y-4">
                <div className="bg-[#FAF7F0] border border-[#DDD7CC] rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#8C8881] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm câu hỏi theo từ khóa, triệu chứng, cơ chế..."
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#DDD7CC] bg-white text-xs text-[#30312F]"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#DDD7CC] bg-white text-xs font-semibold text-[#30312F]"
                    >
                      <option value="all">Tất cả độ khó</option>
                      <option value="Cơ bản">Cơ bản</option>
                      <option value="Vận dụng">Vận dụng</option>
                      <option value="Lâm sàng cao">Lâm sàng cao</option>
                    </select>

                    <button
                      onClick={() =>
                        setShowAllAnswersInBank(!showAllAnswersInBank)
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#DDD7CC] bg-white hover:bg-[#F3EFE6] text-xs font-semibold text-[#30312F]"
                    >
                      {showAllAnswersInBank ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-[#782F3B]" /> Ẩn đáp án
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-[#2E6F40]" /> Hiện đáp án & giải thích
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredBankQuestions.length === 0 ? (
                    <div className="bg-[#FAF7F0] border-2 border-dashed border-[#DDD7CC] rounded-xl p-10 text-center space-y-3">
                      <HelpCircle className="w-8 h-8 text-[#782F3B] mx-auto" />
                      <h3 className="font-serif text-lg font-bold text-[#30312F]">
                        Chưa có câu hỏi nào được nhập cho mục này
                      </h3>
                      <p className="text-xs text-[#605F5B] max-w-md mx-auto">
                        {isAdmin
                          ? "Bấm nút bên dưới để thêm câu hỏi trắc nghiệm đầu tiên vào bài học / Module này."
                          : "Quản trị viên hiện chưa nhập câu hỏi cho bài học này."}
                      </p>
                      {isAdmin && (
                        <button
                          onClick={() =>
                            openAddQuestionForTarget(selectedLessonId)
                          }
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2E6F40] hover:bg-[#235832] text-white text-xs font-semibold transition"
                        >
                          <Plus className="w-4 h-4" /> + Thêm câu hỏi mới
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredBankQuestions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="bg-[#FAF7F0] border border-[#DDD7CC] rounded-xl p-5 space-y-3.5 shadow-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5DFD3] pb-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded bg-[#782F3B] text-white font-mono text-xs font-bold">
                              Câu {idx + 1}
                            </span>
                            <span className="px-2.5 py-0.5 rounded bg-[#E9E3D5] text-[#30312F] font-mono text-xs font-semibold">
                              {q.topicTag}
                            </span>
                            <span className="px-2 py-0.5 rounded border border-[#DDD7CC] bg-white text-[#605F5B] text-[11px] font-mono">
                              {q.difficulty}
                            </span>
                          </div>

                          {isAdmin && (
                            <div className="flex items-center gap-2">
                              {confirmDeleteQId === q.id ? (
                                <div className="flex items-center gap-1.5 bg-[#FEE2E2] px-2.5 py-1 rounded border border-[#DC2626]">
                                  <span className="text-[11px] font-bold text-[#991B1B]">
                                    Xóa câu này?
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleDeleteCurrentQuestion(q.id)
                                    }
                                    className="px-2 py-0.5 rounded bg-[#DC2626] text-white text-[10px] font-bold"
                                  >
                                    Xác nhận
                                  </button>
                                  <button
                                    onClick={() => setConfirmDeleteQId(null)}
                                    className="px-2 py-0.5 rounded bg-white text-[#30312F] text-[10px]"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmDeleteQId(q.id)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold text-[#991B1B] hover:bg-[#FEE2E2] transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {q.vignette && (
                          <div className="p-3.5 rounded-lg bg-[#F3EFE6] border-l-4 border-[#782F3B] text-xs sm:text-sm text-[#30312F] leading-relaxed">
                            {q.vignette}
                          </div>
                        )}

                        <h3 className="font-serif text-base sm:text-lg font-bold text-[#30312F]">
                          {q.question}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {q.options.map((opt) => {
                            const highlightCorrect =
                              showAllAnswersInBank && opt.isCorrect;
                            return (
                              <div
                                key={opt.id}
                                className={`p-3 rounded-lg border text-xs sm:text-sm flex items-start gap-2.5 ${
                                  highlightCorrect
                                    ? "bg-[#E8F5E9] border-[#2E6F40] text-[#1E4620] font-semibold"
                                    : "bg-white border-[#DDD7CC] text-[#30312F]"
                                }`}
                              >
                                <span
                                  className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                                    highlightCorrect
                                      ? "bg-[#2E6F40] text-white"
                                      : "bg-[#F3EFE6] text-[#605F5B]"
                                  }`}
                                >
                                  {opt.id}
                                </span>
                                <div className="flex-1">
                                  <div>{opt.text}</div>
                                  {showAllAnswersInBank && opt.isCorrect && (
                                    <div className="mt-1.5 text-xs text-[#2E6F40] font-normal border-t border-[#2E6F40]/20 pt-1.5">
                                      <strong>Giải thích:</strong>{" "}
                                      {opt.explanation}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {/* B. CHẾ ĐỘ KẾT QUẢ SAU KHI NỘP BÀI ("submitted" mode) */}
            {viewMode === "submitted" && (
              <section className="bg-[#FAF7F0] border border-[#DDD7CC] rounded-xl p-6 sm:p-8 text-center space-y-5 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#782F3B]/10 text-[#782F3B] flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-[#782F3B] font-semibold">
                    KẾT QUẢ KIỂM TRA —{" "}
                    {activeLessonObj
                      ? `${activeLessonObj.lesson.code}: ${activeLessonObj.lesson.title}`
                      : activeDiscipline.name}
                  </div>
                  <h2 className="font-serif text-3xl font-bold text-[#30312F] mt-1">
                    Đạt {correctCount}/{totalQuestions} câu ({scorePercentage}%)
                  </h2>
                  <p className="text-sm text-[#605F5B] mt-1">
                    {scorePercentage >= 80
                      ? "Xuất sắc! Bạn đã nắm vững kiến thức trọng tâm của bài học này."
                      : "Hãy xem lại lời giải thích chi tiết từng câu hoặc đọc lại lý thuyết để củng cố kiến thức."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleResetExam}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#782F3B] text-white text-xs font-semibold hover:bg-[#5E242E] transition"
                  >
                    <RotateCcw className="w-4 h-4" /> Làm lại đề bài này
                  </button>
                  <button
                    onClick={() => setViewMode("bank")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#DDD7CC] bg-white text-[#30312F] text-xs font-semibold hover:bg-[#F3EFE6] transition"
                  >
                    <ListChecks className="w-4 h-4" /> Xem toàn bộ đáp án & giải thích
                  </button>
                  <button
                    onClick={() => setViewMode("lessons")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#DDD7CC] bg-[#EFECE4] text-[#30312F] text-xs font-semibold hover:bg-[#E2DDD2] transition"
                  >
                    <LayoutGrid className="w-4 h-4" /> Chọn bài học khác
                  </button>
                </div>
              </section>
            )}

            {/* C0. CHẾ ĐỘ LUYỆN ĐỀ NHƯNG CHƯA CÓ CÂU HỎI */}
            {viewMode === "exam" && !currentQ && (
              <section className="bg-[#FAF7F0] border-2 border-dashed border-[#DDD7CC] rounded-xl p-10 text-center space-y-3">
                <Target className="w-8 h-8 text-[#782F3B] mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#30312F]">
                  Chưa có câu hỏi nào trong bài này
                </h3>
                <p className="text-xs text-[#605F5B] max-w-md mx-auto">
                  {isAdmin
                    ? "Bấm nút bên dưới để thêm câu hỏi trắc nghiệm đầu tiên cho bài học / Module này."
                    : "Quản trị viên hiện chưa nhập câu hỏi cho bài học này."}
                </p>
                {isAdmin && (
                  <button
                    onClick={() => openAddQuestionForTarget(selectedLessonId)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2E6F40] hover:bg-[#235832] text-white text-xs font-semibold transition"
                  >
                    <Plus className="w-4 h-4" /> + Thêm câu hỏi cho bài này
                  </button>
                )}
              </section>
            )}

            {/* C. CHẾ ĐỘ LUYỆN ĐỀ TRẮC NGHIỆM TƯƠNG TÁC ("exam" mode) */}
            {viewMode === "exam" && currentQ && (
              <div className="space-y-5">
                {/* Thanh điều khiển đề thi & Bảng câu hỏi nhanh */}
                <div className="bg-[#FAF7F0] border border-[#DDD7CC] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {currentQuestions.map((q, idx) => {
                      const isCurrent = idx === currentQuestionIndex;
                      const userAns = selectedAnswers[q.id];
                      const isCorrect =
                        userAns &&
                        q.options.find((o) => o.id === userAns)?.isCorrect;

                      let btnStyle =
                        "bg-white border-[#DDD7CC] text-[#605F5B] hover:border-[#782F3B]";
                      if (isCurrent) {
                        btnStyle =
                          "bg-[#782F3B] border-[#782F3B] text-white font-bold ring-2 ring-[#782F3B]/30";
                      } else if (userAns && instantFeedback) {
                        btnStyle = isCorrect
                          ? "bg-[#E8F5E9] border-[#2E6F40] text-[#2E6F40] font-bold"
                          : "bg-[#FEE2E2] border-[#DC2626] text-[#DC2626] font-bold";
                      } else if (userAns) {
                        btnStyle =
                          "bg-[#2C5282] border-[#2C5282] text-white font-bold";
                      }

                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQuestionIndex(idx)}
                          className={`w-8 h-8 rounded-lg border text-xs font-mono transition flex items-center justify-center ${btnStyle}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-1.5 text-xs text-[#605F5B] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={instantFeedback}
                        onChange={(e) => setInstantFeedback(e.target.checked)}
                        className="rounded border-[#DDD7CC] text-[#782F3B] focus:ring-[#782F3B]"
                      />
                      <span>Giải thích ngay khi chọn</span>
                    </label>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#EFECE4] text-xs font-mono font-bold text-[#30312F]">
                      <Clock className="w-3.5 h-3.5 text-[#782F3B]" />
                      {formatTimer(timeLeft)}
                    </div>

                    <button
                      onClick={() => setViewMode("submitted")}
                      className="px-3.5 py-1.5 rounded-lg bg-[#782F3B] hover:bg-[#5E242E] text-white text-xs font-semibold shadow-sm transition"
                    >
                      Chấm điểm ({answeredCount}/{totalQuestions})
                    </button>
                  </div>
                </div>

                {/* Thẻ Câu hỏi chính */}
                <div className="bg-[#FAF7F0] border border-[#DDD7CC] rounded-xl p-5 sm:p-7 shadow-sm space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5DFD3] pb-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded bg-[#782F3B] text-white font-mono text-xs font-bold">
                        CÂU {currentQuestionIndex + 1} / {totalQuestions}
                      </span>
                      <span className="px-2.5 py-1 rounded bg-[#E9E3D5] text-[#30312F] font-mono text-xs font-semibold">
                        {currentQ.topicTag}
                      </span>
                      <span className="px-2.5 py-1 rounded border border-[#DDD7CC] bg-white text-[#605F5B] font-mono text-xs">
                        {currentQ.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFlag(currentQ.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition ${
                          flaggedQuestions[currentQ.id]
                            ? "bg-[#FEF3C7] border-[#D97706] text-[#B45309]"
                            : "bg-white border-[#DDD7CC] text-[#605F5B]"
                        }`}
                      >
                        <Flag className="w-3.5 h-3.5" />
                        {flaggedQuestions[currentQ.id]
                          ? "Đã đánh dấu"
                          : "Đánh dấu"}
                      </button>

                      {isAdmin && (
                        <>
                          {confirmDeleteQId === currentQ.id ? (
                            <div className="flex items-center gap-1.5 bg-[#FEE2E2] px-2.5 py-1 rounded border border-[#DC2626]">
                              <span className="text-[11px] font-bold text-[#991B1B]">
                                Xóa câu này?
                              </span>
                              <button
                                onClick={() =>
                                  handleDeleteCurrentQuestion(currentQ.id)
                                }
                                className="px-2 py-0.5 rounded bg-[#DC2626] text-white text-[10px] font-bold"
                              >
                                Xóa
                              </button>
                              <button
                                onClick={() => setConfirmDeleteQId(null)}
                                className="px-2 py-0.5 rounded bg-white text-[#30312F] text-[10px]"
                              >
                                Hủy
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteQId(currentQ.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#FECACA] bg-[#FEF2F2] text-[#991B1B] text-xs font-semibold hover:bg-[#FEE2E2]"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Xóa câu
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Clinical Vignette if present */}
                  {currentQ.vignette && (
                    <div className="p-4 rounded-xl bg-[#F3EFE6] border-l-4 border-[#782F3B] space-y-1">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-[#782F3B] font-bold">
                        TÌNH HUỐNG LÂM SÀNG (CLINICAL VIGNETTE)
                      </div>
                      <p className="text-sm text-[#30312F] leading-relaxed">
                        {currentQ.vignette}
                      </p>
                    </div>
                  )}

                  {/* Question Stem */}
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#30312F] leading-snug">
                      {currentQ.question}
                    </h3>
                    {currentQ.latinContext && (
                      <p className="text-xs italic text-[#605F5B] font-serif">
                        Thuật ngữ đối chiếu: {currentQ.latinContext}
                      </p>
                    )}
                  </div>

                  {/* Options List */}
                  <div className="space-y-3 pt-1">
                    {currentQ.options.map((opt) => {
                      const userSelected =
                        selectedAnswers[currentQ.id] === opt.id;
                      const hasAnswered =
                        selectedAnswers[currentQ.id] !== undefined;
                      const showResult = hasAnswered && instantFeedback;

                      let cardClass =
                        "bg-white border-[#DDD7CC] hover:border-[#782F3B] text-[#30312F]";
                      let badgeClass = "bg-[#F3EFE6] text-[#30312F]";

                      if (showResult) {
                        if (opt.isCorrect) {
                          cardClass =
                            "bg-[#E8F5E9] border-[#2E6F40] text-[#1E4620] ring-1 ring-[#2E6F40]";
                          badgeClass = "bg-[#2E6F40] text-white";
                        } else if (userSelected && !opt.isCorrect) {
                          cardClass =
                            "bg-[#FEE2E2] border-[#DC2626] text-[#991B1B]";
                          badgeClass = "bg-[#DC2626] text-white";
                        }
                      } else if (userSelected) {
                        cardClass =
                          "bg-[#782F3B]/10 border-[#782F3B] text-[#30312F] ring-1 ring-[#782F3B]";
                        badgeClass = "bg-[#782F3B] text-white";
                      }

                      return (
                        <button
                          key={opt.id}
                          onClick={() =>
                            handleSelectOption(currentQ.id, opt.id)
                          }
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${cardClass}`}
                        >
                          <span
                            className={`w-7 h-7 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${badgeClass}`}
                          >
                            {opt.id}
                          </span>
                          <div className="flex-1 space-y-2">
                            <div className="text-sm sm:text-base font-medium leading-relaxed">
                              {opt.text}
                            </div>

                            {showResult &&
                              (opt.isCorrect || userSelected) && (
                                <div
                                  className={`p-3 rounded-lg text-xs leading-relaxed border ${
                                    opt.isCorrect
                                      ? "bg-white/90 border-[#2E6F40]/30 text-[#1E4620]"
                                      : "bg-white/90 border-[#DC2626]/30 text-[#991B1B]"
                                  }`}
                                >
                                  <div className="font-bold flex items-center gap-1.5 mb-0.5">
                                    {opt.isCorrect ? (
                                      <>
                                        <CheckCircle2 className="w-4 h-4 text-[#2E6F40]" />
                                        <span>Giải thích đáp án đúng:</span>
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="w-4 h-4 text-[#DC2626]" />
                                        <span>Lý do chưa chính xác:</span>
                                      </>
                                    )}
                                  </div>
                                  <p>{opt.explanation}</p>
                                </div>
                              )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer Navigation inside Question Card */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E5DFD3]">
                    <div className="text-xs text-[#605F5B] font-mono">
                      Nguồn đối chiếu: <strong>{currentQ.reference}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        disabled={currentQuestionIndex === 0}
                        onClick={() =>
                          setCurrentQuestionIndex((i) => Math.max(0, i - 1))
                        }
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#DDD7CC] bg-white hover:bg-[#F3EFE6] disabled:opacity-40 text-xs font-semibold text-[#30312F]"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Câu trước
                      </button>

                      {currentQuestionIndex < totalQuestions - 1 ? (
                        <button
                          onClick={() =>
                            setCurrentQuestionIndex((i) =>
                              Math.min(totalQuestions - 1, i + 1)
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#782F3B] hover:bg-[#5E242E] text-white text-xs font-semibold"
                        >
                          Câu tiếp theo <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setViewMode("submitted")}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2E6F40] hover:bg-[#235832] text-white text-xs font-semibold"
                        >
                          Hoàn thành & Chấm điểm{" "}
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
