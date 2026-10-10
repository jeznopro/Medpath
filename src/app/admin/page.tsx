"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { MEDPATH_DISCIPLINES, Lesson } from "@/lib/medpath-data";
import {
  useMedPathCurriculum,
  LessonFormInput,
  ChapterFormInput,
} from "@/lib/use-curriculum";
import { useQuestionBankStore } from "@/lib/module-questions";
import {
  LessonFormModal,
  ChapterFormModal,
} from "@/components/medpath/LessonFormModal";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Crown,
  Edit3,
  Eye,
  FileCode,
  FolderPlus,
  HelpCircle,
  Layers,
  Plus,
  RotateCcw,
  ShieldAlert,
  Trash2,
  Upload,
  Users,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { currentUser, isAdmin, switchUser, isLoaded } = useAuth();
  const {
    modulesMap,
    customContents,
    addLesson,
    updateLesson,
    deleteLesson,
    addChapter,
    deleteChapter,
    resetToDefaultCurriculum,
  } = useMedPathCurriculum();
  const {
    getQuestionsForModule,
    getQuestionsForSingleLesson,
    addModuleQuestion,
    deleteModuleQuestion,
    addLessonQuestion,
    deleteLessonQuestion,
  } = useQuestionBankStore();

  const [activeTab, setActiveTab] = useState<
    "curriculum" | "questions" | "users"
  >("curriculum");
  const [selectedDisciplineId, setSelectedDisciplineId] =
    useState<string>("mod-8");

  // Quick Create Lesson Form State on Left Column
  const [quickChapterId, setQuickChapterId] = useState<string>("");
  const [quickCode, setQuickCode] = useState<string>("K56.LT12");
  const [quickTitle, setQuickTitle] = useState<string>("");
  const [quickLatinTitle, setQuickLatinTitle] = useState<string>(
    "Bộ môn chuyên khoa • Lý thuyết (LT)"
  );
  const [quickMinutes, setQuickMinutes] = useState<number>(45);
  const [quickHtmlContent, setQuickHtmlContent] = useState<string>("");

  // Modal state for editing/creating lessons & chapters
  const [lessonModalState, setLessonModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    defaultChapterId?: string;
    lesson?: Lesson | null;
  }>({
    isOpen: false,
    mode: "create",
  });
  const [chapterModalOpen, setChapterModalOpen] = useState<boolean>(false);
  const [confirmDeleteLessonId, setConfirmDeleteLessonId] = useState<
    string | null
  >(null);
  const [confirmDeleteChapterId, setConfirmDeleteChapterId] = useState<
    string | null
  >(null);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  const [actionMsg, setActionMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Question Bank state synchronized with the 4 Modules & their Lessons
  const [qModuleId, setQModuleId] = useState<string>("mod-8");
  const [qLessonId, setQLessonId] = useState<string>("les-8-1-1");
  const [newQContent, setNewQContent] = useState("");
  const [newQOptA, setNewQOptA] = useState("");
  const [newQOptB, setNewQOptB] = useState("");
  const [newQOptC, setNewQOptC] = useState("");
  const [newQOptD, setNewQOptD] = useState("");
  const [newQCorrectOpt, setNewQCorrectOpt] = useState("A");
  const [newQExplanation, setNewQExplanation] = useState("");

  const currentChapters =
    modulesMap[selectedDisciplineId] || modulesMap["mod-8"] || [];
  const activeDiscipline =
    MEDPATH_DISCIPLINES.find((d) => d.id === selectedDisciplineId) ||
    MEDPATH_DISCIPLINES[0];

  const qModuleChapters = modulesMap[qModuleId] || [];
  const qModuleLessons = qModuleChapters.flatMap((c) => c.lessons);

  useEffect(() => {
    if (
      qLessonId !== "__MODULE__" &&
      !qModuleLessons.some((l) => l.id === qLessonId)
    ) {
      setQLessonId(qModuleLessons[0]?.id || "__MODULE__");
    }
  }, [qModuleId, modulesMap]);

  useEffect(() => {
    if (currentChapters.length > 0) {
      setQuickChapterId(currentChapters[0].id);
    }
    const prefix =
      selectedDisciplineId === "mod-8"
        ? "K56"
        : selectedDisciplineId === "mod-9"
          ? "K57"
          : selectedDisciplineId === "mod-10"
            ? "CM6"
            : "K55";
    const count = currentChapters.reduce((s, c) => s + c.lessons.length, 0);
    setQuickCode(`${prefix}.BAI${count + 1}`);
  }, [selectedDisciplineId, modulesMap]);

  const showNotification = (
    text: string,
    type: "success" | "error" = "success"
  ) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg(null), 3500);
  };

  const handleQuickCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) {
      showNotification("Vui lòng nhập tên bài giảng mới", "error");
      return;
    }

    const created = addLesson(selectedDisciplineId, {
      chapterId: quickChapterId || currentChapters[0]?.id || "",
      code: quickCode.trim() || "BAI.MOI",
      title: quickTitle.trim(),
      latinTitle: quickLatinTitle.trim(),
      estimatedMinutes: Number(quickMinutes) || 45,
      questionCount: 10,
      threshold: 80,
      htmlContent: quickHtmlContent,
    });

    setQuickTitle("");
    setQuickHtmlContent("");
    showNotification(
      `Đã thêm bài mới: [${created.code}] ${created.title} vào ${activeDiscipline.name}!`
    );
  };

  const handleQuickFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      setQuickHtmlContent(text);
      if (!quickTitle.trim()) {
        setQuickTitle(file.name.replace(/\.(html|htm|md|txt)$/i, ""));
      }
      showNotification(`Đã nạp nội dung từ file: ${file.name}`);
    } catch {
      showNotification("Không thể đọc file vừa chọn", "error");
    }
  };

  const handleLessonModalSubmit = (
    discId: string,
    input: LessonFormInput,
    lessonId?: string
  ) => {
    if (lessonModalState.mode === "create") {
      const created = addLesson(discId, input);
      showNotification(`Đã thêm bài mới: [${created.code}] ${created.title}`);
    } else if (lessonId) {
      const updated = updateLesson(discId, lessonId, input);
      if (updated) {
        showNotification(`Đã cập nhật bài: [${updated.code}] ${updated.title}`);
      }
    }
  };

  const handleChapterModalSubmit = (
    discId: string,
    input: ChapterFormInput
  ) => {
    const created = addChapter(discId, input);
    showNotification(
      `Đã tạo phần mới: ${created.romanNumeral} - ${created.title}`
    );
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQContent.trim() || !newQOptA.trim() || !newQOptB.trim()) {
      showNotification(
        "Vui lòng nhập nội dung câu hỏi và ít nhất 2 phương án A, B",
        "error"
      );
      return;
    }

    const qMod =
      MEDPATH_DISCIPLINES.find((d) => d.id === qModuleId) ||
      MEDPATH_DISCIPLINES[0];
    const targetLesson = qModuleLessons.find((l) => l.id === qLessonId);

    const ts = Date.now();
    const options = [
      { id: `${ts}-a`, label: "A", text: newQOptA.trim() },
      { id: `${ts}-b`, label: "B", text: newQOptB.trim() },
      { id: `${ts}-c`, label: "C", text: newQOptC.trim() || "Phương án C" },
      { id: `${ts}-d`, label: "D", text: newQOptD.trim() || "Phương án D" },
    ];
    const correctOption =
      options.find((o) => o.label === newQCorrectOpt) || options[0];

    const payload = {
      type: "single_choice" as const,
      difficulty: "Lý thuyết chuẩn",
      content: newQContent.trim(),
      options,
      correctOptionId: correctOption.id,
      explanation:
        newQExplanation.trim() ||
        "Giải thích đối chiếu theo tài liệu bài giảng.",
      sourceSection: targetLesson
        ? `${qMod.name} • [${targetLesson.code}] ${targetLesson.title}`
        : `${qMod.name} • Đề tổng hợp Module`,
      lessonCode: targetLesson?.code,
    };

    if (qLessonId === "__MODULE__" || !targetLesson) {
      addModuleQuestion(
        qModuleId as "mod-8" | "mod-9" | "mod-10" | "mod-11",
        payload
      );
      showNotification(`Đã thêm câu hỏi mới vào ${qMod.name}!`);
    } else {
      addLessonQuestion(targetLesson.id, payload);
      showNotification(
        `Đã thêm câu hỏi mới vào bài [${targetLesson.code}] ${targetLesson.title}!`
      );
    }

    setNewQContent("");
    setNewQOptA("");
    setNewQOptB("");
    setNewQOptC("");
    setNewQOptD("");
    setNewQExplanation("");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F3EFE6] flex items-center justify-center font-serif text-[#782F3B]">
        Đang xác thực quyền Quản trị viên...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F3EFE6] text-[#30312F] flex flex-col items-center justify-center px-4 font-sans">
        <div className="max-w-md w-full p-8 bg-[#FAF7F0] border border-[#DDD7CC] rounded-2xl shadow-editorial text-center space-y-4">
          <div className="w-16 h-16 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-700 mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-serif font-bold text-[#30312F]">
            Truy Cập Bị Từ Chối (Admin Only)
          </h2>
          <p className="text-xs sm:text-sm text-[#77756F] leading-relaxed">
            Bạn đang đăng nhập với vai trò:{" "}
            <strong className="text-[#30312F]">
              {currentUser ? currentUser.full_name : "Khách chưa đăng nhập"}
            </strong>{" "}
            (Học viên).
            <br />
            <strong>Học viên chỉ có quyền học tập</strong> và không được phép can thiệp, chỉnh sửa hoặc tạo nội dung bài học.
          </p>

          <div className="pt-2 space-y-2">
            <Link
              href="/"
              className="w-full py-2.5 px-4 bg-[#782F3B] hover:bg-[#5C232D] text-white text-xs font-semibold rounded-lg shadow-sm transition block"
            >
              Quay lại Không gian học tập (Học viên)
            </Link>

            <button
              onClick={() => {
                switchUser("admin-1");
              }}
              className="w-full py-2.5 px-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Crown className="w-4 h-4 text-purple-700" />
              <span>Chuyển sang tài khoản Admin (Kiểm thử)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalLessonsAllModules = MEDPATH_DISCIPLINES.reduce(
    (sum, d) =>
      sum +
      (modulesMap[d.id] || []).reduce((s, c) => s + c.lessons.length, 0),
    0
  );

  const totalQuestionsAllModules = MEDPATH_DISCIPLINES.reduce((sum, d) => {
    const chaps = modulesMap[d.id] || [];
    const lessons = chaps.flatMap((c) => c.lessons);
    const modCount = getQuestionsForModule(d.id).length;
    const lesCount = lessons.reduce(
      (s, l) => s + getQuestionsForSingleLesson(l).length,
      0
    );
    return sum + modCount + lesCount;
  }, 0);

  const selectedQTargetLesson = qModuleLessons.find((l) => l.id === qLessonId);
  const currentTargetQuestions =
    qLessonId === "__MODULE__" || !selectedQTargetLesson
      ? getQuestionsForModule(qModuleId)
      : getQuestionsForSingleLesson(selectedQTargetLesson);

  return (
    <div className="min-h-screen bg-[#F3EFE6] text-[#30312F] font-sans selection:bg-[#782F3B] selection:text-white">
      {/* Top Academic Header */}
      <header className="sticky top-0 z-40 bg-[#F3EFE6]/95 backdrop-blur-md border-b border-[#DDD7CC]">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="h-9 px-3 rounded-lg bg-[#FAF7F0] hover:bg-white border border-[#DDD7CC] text-xs font-medium text-[#77756F] hover:text-[#30312F] flex items-center gap-1.5 transition shadow-sm"
              title="Quay lại Workspace học viên"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại Trang Chủ</span>
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-[#DDD7CC]">
              <div className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center font-serif text-xs font-bold shadow-xs">
                M
              </div>
              <div className="leading-tight">
                <div className="font-serif font-bold text-sm text-[#30312F] flex items-center gap-1.5">
                  <span>MEDPATH Content Studio</span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 border border-purple-200 px-1.5 py-0.2 rounded font-bold uppercase">
                    Admin
                  </span>
                </div>
                <div className="text-[10px] text-[#77756F]">
                  Quản trị 4 Module ({totalLessonsAllModules} bài giảng) &amp; Soạn thảo HTML
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="h-9 px-3 rounded-lg bg-[#FAF7F0] hover:bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                title="Khôi phục toàn bộ 79 bài giảng gốc"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Khôi phục 79 bài gốc</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-300 px-2.5 py-1 rounded-lg">
                <span className="text-xs font-bold text-red-800">
                  Khôi phục 79 bài mặc định?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    resetToDefaultCurriculum();
                    setConfirmReset(false);
                    showNotification(
                      "Đã khôi phục 79 bài giảng gốc của 4 Module!"
                    );
                  }}
                  className="px-2 py-0.5 bg-red-600 text-white rounded text-xs font-bold cursor-pointer"
                >
                  Đồng ý
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-0.5 bg-white border border-red-200 text-[#30312F] rounded text-xs cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            )}

            <div className="h-9 px-3 rounded-lg bg-[#FAF7F0] border border-[#DDD7CC] flex items-center gap-2 text-xs">
              <Crown className="w-3.5 h-3.5 text-purple-700" />
              <span className="font-semibold text-[#30312F]">
                {currentUser?.full_name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Toast Action Notification */}
        {actionMsg && (
          <div
            className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs font-semibold animate-fadeIn shadow-md ${
              actionMsg.type === "success"
                ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                : "bg-red-50 text-red-900 border-red-300"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>{actionMsg.text}</span>
          </div>
        )}

        {/* Studio Navigation Tabs */}
        <div className="flex flex-wrap items-center bg-[#E8E1D3] p-1 rounded-lg border border-[#DDD7CC] w-fit shadow-inner gap-1">
          <button
            onClick={() => setActiveTab("curriculum")}
            className={`px-4 py-2 rounded-md text-xs font-medium flex items-center gap-2 transition select-none cursor-pointer ${
              activeTab === "curriculum"
                ? "bg-[#782F3B] text-white font-bold shadow-sm"
                : "text-[#5A5852] hover:text-[#30312F] hover:bg-[#DDD7CC]/60"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Quản lý 4 Module (Thêm / Sửa HTML / Xóa Bài)</span>
          </button>

          <button
            onClick={() => setActiveTab("questions")}
            className={`px-4 py-2 rounded-md text-xs font-medium flex items-center gap-2 transition select-none cursor-pointer ${
              activeTab === "questions"
                ? "bg-[#782F3B] text-white font-bold shadow-sm"
                : "text-[#5A5852] hover:text-[#30312F] hover:bg-[#DDD7CC]/60"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>2. Ngân hàng câu hỏi trắc nghiệm</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-md text-xs font-medium flex items-center gap-2 transition select-none cursor-pointer ${
              activeTab === "users"
                ? "bg-[#782F3B] text-white font-bold shadow-sm"
                : "text-[#5A5852] hover:text-[#30312F] hover:bg-[#DDD7CC]/60"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3. Quản lý 2 tài khoản &amp; Thống kê</span>
          </button>
        </div>

        {/* TAB 1: CURRICULUM & HTML LESSON STUDIO (DIRECTLY SYNCHRONIZED WITH 4 MODULES) */}
        {activeTab === "curriculum" && (
          <div className="space-y-6">
            {/* Module Selector Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MEDPATH_DISCIPLINES.map((disc) => {
                const isSelected = selectedDisciplineId === disc.id;
                const chaps = modulesMap[disc.id] || [];
                const count = chaps.reduce(
                  (sum, c) => sum + c.lessons.length,
                  0
                );
                return (
                  <button
                    key={disc.id}
                    type="button"
                    onClick={() => setSelectedDisciplineId(disc.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#782F3B] text-white border-[#5C232D] shadow-editorial"
                        : "bg-[#FAF7F0] hover:bg-white text-[#30312F] border-[#DDD7CC]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-[#E9E3D5] text-[#565551]"
                        }`}
                      >
                        {disc.code}
                      </span>
                      <span className="text-xs font-mono font-bold">
                        {count} bài
                      </span>
                    </div>
                    <div className="font-serif text-sm font-bold">
                      {disc.name}
                    </div>
                    <div
                      className={`text-[10px] italic font-serif truncate ${
                        isSelected ? "text-white/80" : "text-[#77756F]"
                      }`}
                    >
                      {disc.latinName}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 5 Cols: Quick Form to Create Lesson & Input HTML */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#DDD7CC] shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#DDD7CC]">
                    <div className="flex items-center gap-2">
                      <FolderPlus className="w-4 h-4 text-[#782F3B]" />
                      <h3 className="font-serif font-bold text-base text-[#30312F]">
                        Thêm Bài Học Mới vào {activeDiscipline.name}
                      </h3>
                    </div>
                  </div>

                  <form
                    onSubmit={handleQuickCreateLesson}
                    className="space-y-3.5 text-xs"
                  >
                    <div>
                      <label className="block font-semibold text-[#5A5852] mb-1">
                        Thuộc Phần / Chương trong {activeDiscipline.name}:
                      </label>
                      <select
                        value={quickChapterId}
                        onChange={(e) => setQuickChapterId(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#DDD7CC] bg-white text-[#30312F] font-semibold outline-none focus:border-[#782F3B]"
                      >
                        {currentChapters.map((chap) => (
                          <option key={chap.id} value={chap.id}>
                            {chap.romanNumeral}: {chap.title} (
                            {chap.lessons.length} bài)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1">
                        <label className="block font-semibold text-[#5A5852] mb-1">
                          Mã bài học:
                        </label>
                        <input
                          type="text"
                          required
                          value={quickCode}
                          onChange={(e) => setQuickCode(e.target.value)}
                          placeholder="VD: K56.LT12"
                          className="w-full p-2.5 rounded-lg border border-[#DDD7CC] bg-white font-mono font-bold text-[#782F3B] outline-none focus:border-[#782F3B]"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block font-semibold text-[#5A5852] mb-1">
                          Tên bài giảng mới *:
                        </label>
                        <input
                          type="text"
                          required
                          value={quickTitle}
                          onChange={(e) => setQuickTitle(e.target.value)}
                          placeholder="VD: LT12. Chẩn đoán suy tim cấp"
                          className="w-full p-2.5 rounded-lg border border-[#DDD7CC] bg-white font-bold text-[#30312F] outline-none focus:border-[#782F3B]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="block font-semibold text-[#5A5852] mb-1">
                          Bộ môn / Phân loại:
                        </label>
                        <input
                          type="text"
                          value={quickLatinTitle}
                          onChange={(e) => setQuickLatinTitle(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-[#DDD7CC] bg-white italic font-serif text-[#565551] outline-none focus:border-[#782F3B]"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block font-semibold text-[#5A5852] mb-1">
                          Thời lượng (phút):
                        </label>
                        <input
                          type="number"
                          min={5}
                          max={300}
                          value={quickMinutes}
                          onChange={(e) =>
                            setQuickMinutes(Number(e.target.value))
                          }
                          className="w-full p-2.5 rounded-lg border border-[#DDD7CC] bg-white font-mono font-bold text-[#30312F] outline-none focus:border-[#782F3B]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-[#782F3B] flex items-center gap-1">
                          <FileCode className="w-3.5 h-3.5" />
                          <span>Nội dung HTML / Giáo trình (Tùy chọn):</span>
                        </label>
                        <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-semibold cursor-pointer">
                          <Upload className="w-3 h-3" />
                          <span>Tải file .HTML/.MD</span>
                          <input
                            type="file"
                            accept=".html,.htm,.md,.txt"
                            onChange={handleQuickFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <textarea
                        rows={6}
                        value={quickHtmlContent}
                        onChange={(e) => setQuickHtmlContent(e.target.value)}
                        placeholder="Dán mã HTML hoặc văn bản bài giảng vào đây (hoặc để trống và nhập sau)..."
                        className="w-full p-2.5 rounded-lg border border-[#DDD7CC] bg-white font-mono text-[11px] text-[#30312F] outline-none focus:border-[#782F3B]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#782F3B] hover:bg-[#5C232D] text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm Bài Học vào {activeDiscipline.name}</span>
                    </button>
                  </form>
                </div>

                {/* Add Chapter Card */}
                <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#DDD7CC] shadow-sm flex items-center justify-between">
                  <div>
                    <div className="font-serif font-bold text-sm text-[#30312F]">
                      Thêm Phần / Chuyên đề mới
                    </div>
                    <div className="text-xs text-[#77756F]">
                      Tạo thêm Phần mới trong {activeDiscipline.name}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setChapterModalOpen(true)}
                    className="px-3.5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>+ Thêm Phần</span>
                  </button>
                </div>
              </div>

              {/* Right 7 Cols: Live List of Chapters & Lessons in Selected Module */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#DDD7CC] shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DDD7CC]">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#782F3B]" />
                      <h3 className="font-serif font-bold text-base text-[#30312F]">
                        Danh sách Bài học trong {activeDiscipline.name}
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#782F3B] bg-[#F3EFE6] px-2.5 py-1 rounded border border-[#DDD7CC]">
                      {currentChapters.reduce(
                        (s, c) => s + c.lessons.length,
                        0
                      )}{" "}
                      bài giảng hiện có
                    </span>
                  </div>

                  <div className="space-y-4">
                    {currentChapters.map((chap) => (
                      <div
                        key={chap.id}
                        className="border border-[#DDD7CC] rounded-xl bg-white overflow-hidden shadow-xs"
                      >
                        {/* Chapter Header */}
                        <div className="p-3.5 bg-[#F3EFE6] border-b border-[#DDD7CC] flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#782F3B] bg-[#F9ECEE] border border-[#E8B4BB] px-2 py-0.5 rounded mr-2">
                              {chap.romanNumeral}
                            </span>
                            <span className="font-serif font-bold text-sm text-[#30312F]">
                              {chap.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setLessonModalState({
                                  isOpen: true,
                                  mode: "create",
                                  defaultChapterId: chap.id,
                                  lesson: null,
                                })
                              }
                              className="px-2.5 py-1 rounded bg-[#782F3B] hover:bg-[#642530] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Thêm bài</span>
                            </button>

                            {confirmDeleteChapterId === chap.id ? (
                              <div className="flex items-center gap-1 bg-red-50 border border-red-300 px-2 py-0.5 rounded">
                                <span className="text-[10px] font-bold text-red-800">
                                  Xóa phần?
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteChapter(
                                      selectedDisciplineId,
                                      chap.id
                                    );
                                    setConfirmDeleteChapterId(null);
                                    showNotification(
                                      `Đã xóa ${chap.romanNumeral}: ${chap.title}`
                                    );
                                  }}
                                  className="px-1.5 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold cursor-pointer"
                                >
                                  Xóa
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmDeleteChapterId(null)
                                  }
                                  className="px-1.5 py-0.5 bg-white border border-red-200 text-[#30312F] rounded text-[10px] cursor-pointer"
                                >
                                  Hủy
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmDeleteChapterId(chap.id)
                                }
                                className="p-1.5 rounded bg-white hover:bg-red-50 text-[#77756F] hover:text-red-600 border border-[#DDD7CC] transition cursor-pointer"
                                title="Xóa phần này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Lessons in Chapter */}
                        <div className="p-3 space-y-2">
                          {chap.lessons.length === 0 ? (
                            <div className="text-xs text-[#77756F] italic p-3 text-center">
                              Chưa có bài học nào trong phần này.
                            </div>
                          ) : (
                            chap.lessons.map((lesson) => {
                              const hasHtml = Boolean(
                                customContents[lesson.id] &&
                                  customContents[lesson.id].trim().length > 0
                              );
                              const isConfirming =
                                confirmDeleteLessonId === lesson.id;

                              return (
                                <div
                                  key={lesson.id}
                                  className="p-3 rounded-lg bg-[#FAF7F0] border border-[#E8E1D3] hover:border-[#782F3B]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition"
                                >
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="font-mono text-xs font-bold text-[#782F3B]">
                                        {lesson.code}
                                      </span>
                                      <span className="font-bold text-xs sm:text-sm text-[#30312F]">
                                        {lesson.title}
                                      </span>
                                      {hasHtml && (
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                                          Đã có HTML
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] italic font-serif text-[#77756F] mt-0.5">
                                      {lesson.latinTitle} •{" "}
                                      {lesson.estimatedMinutes} phút đọc
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                                    <Link
                                      href={`/reader?lessonId=${lesson.id}`}
                                      className="px-2.5 py-1 rounded bg-white hover:bg-[#F3EFE6] text-[#782F3B] border border-[#DDD7CC] text-xs font-semibold flex items-center gap-1 transition"
                                    >
                                      <Eye className="w-3 h-3" />
                                      <span>Xem</span>
                                    </Link>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        setLessonModalState({
                                          isOpen: true,
                                          mode: "edit",
                                          defaultChapterId: chap.id,
                                          lesson,
                                        })
                                      }
                                      className="px-2.5 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                      <span>Sửa / HTML</span>
                                    </button>

                                    {isConfirming ? (
                                      <div className="flex items-center gap-1 bg-red-50 border border-red-300 px-2 py-0.5 rounded">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            deleteLesson(
                                              selectedDisciplineId,
                                              lesson.id
                                            );
                                            setConfirmDeleteLessonId(null);
                                            showNotification(
                                              `Đã xóa bài: [${lesson.code}] ${lesson.title}`
                                            );
                                          }}
                                          className="px-2 py-0.5 bg-red-600 text-white rounded text-[11px] font-bold cursor-pointer"
                                        >
                                          Xác nhận xóa
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setConfirmDeleteLessonId(null)
                                          }
                                          className="px-1.5 py-0.5 bg-white border border-red-200 text-[#30312F] rounded text-[11px] cursor-pointer"
                                        >
                                          Hủy
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setConfirmDeleteLessonId(lesson.id)
                                        }
                                        className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                        <span>Xóa</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUESTION BANK STUDIO */}
        {activeTab === "questions" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#DDD7CC] shadow-sm">
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#DDD7CC]">
                  <HelpCircle className="w-4 h-4 text-[#782F3B]" />
                  <h3 className="font-serif font-bold text-base text-[#30312F]">
                    Tạo Câu Hỏi Trắc Nghiệm Mới
                  </h3>
                </div>

                <form onSubmit={handleAddQuestion} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#5A5852] mb-1">
                        Chọn Module:
                      </label>
                      <select
                        value={qModuleId}
                        onChange={(e) => setQModuleId(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#DDD7CC] bg-white text-[#30312F] font-semibold outline-none focus:border-[#782F3B]"
                      >
                        {MEDPATH_DISCIPLINES.map((mod) => (
                          <option key={mod.id} value={mod.id}>
                            {mod.name} ({mod.latinName})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#5A5852] mb-1">
                        Gắn vào Bài học trong Module:
                      </label>
                      <select
                        value={qLessonId}
                        onChange={(e) => setQLessonId(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#DDD7CC] bg-white text-[#30312F] font-semibold outline-none focus:border-[#782F3B]"
                      >
                        <option value="__MODULE__">
                          📚 Đề tổng hợp chung cả Module
                        </option>
                        {qModuleChapters.map((chap) => (
                          <optgroup
                            key={chap.id}
                            label={`${chap.romanNumeral}: ${chap.title}`}
                          >
                            {chap.lessons.map((les) => (
                              <option key={les.id} value={les.id}>
                                [{les.code}] {les.title}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#5A5852] mb-1">
                      Nội dung câu hỏi *:
                    </label>
                    <textarea
                      rows={3}
                      value={newQContent}
                      onChange={(e) => setNewQContent(e.target.value)}
                      placeholder="Nhập nội dung câu hỏi trắc nghiệm..."
                      className="w-full p-2.5 rounded-lg border border-[#DDD7CC] bg-white text-[#30312F] outline-none focus:border-[#782F3B]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-semibold text-[#5A5852]">
                      Các phương án trả lời &amp; Chọn đáp án đúng:
                    </label>

                    {["A", "B", "C", "D"].map((opt) => {
                      const val =
                        opt === "A"
                          ? newQOptA
                          : opt === "B"
                            ? newQOptB
                            : opt === "C"
                              ? newQOptC
                              : newQOptD;
                      const setVal =
                        opt === "A"
                          ? setNewQOptA
                          : opt === "B"
                            ? setNewQOptB
                            : opt === "C"
                              ? setNewQOptC
                              : setNewQOptD;
                      return (
                        <div key={opt} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="correctOpt"
                            checked={newQCorrectOpt === opt}
                            onChange={() => setNewQCorrectOpt(opt)}
                            className="w-4 h-4 text-[#782F3B] cursor-pointer"
                          />
                          <span className="font-bold w-4 text-[#782F3B]">
                            {opt}.
                          </span>
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => setVal(e.target.value)}
                            placeholder={`Nội dung đáp án ${opt}...`}
                            className="flex-1 p-2 rounded-lg border border-[#DDD7CC] bg-white text-[#30312F] outline-none focus:border-[#782F3B]"
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <label className="block font-semibold text-[#5A5852] mb-1">
                      Lời giải thích đáp án (Tùy chọn):
                    </label>
                    <textarea
                      rows={2}
                      value={newQExplanation}
                      onChange={(e) => setNewQExplanation(e.target.value)}
                      placeholder="Nhập giải thích chi tiết cho đáp án đúng..."
                      className="w-full p-2.5 rounded-lg border border-[#DDD7CC] bg-white text-[#30312F] outline-none focus:border-[#782F3B]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#782F3B] hover:bg-[#5C232D] text-white font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm câu hỏi vào bài / module đã chọn</span>
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-[#DDD7CC] shadow-sm space-y-3">
                <h4 className="font-bold text-xs text-[#30312F] uppercase tracking-wider">
                  Trạng thái hệ thống học liệu (4 Module)
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8E1D3]">
                    <div className="text-[#77756F]">Tổng số bài giảng</div>
                    <div className="font-serif font-bold text-2xl text-[#782F3B] mt-0.5">
                      {totalLessonsAllModules}
                    </div>
                  </div>
                  <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8E1D3]">
                    <div className="text-[#77756F]">Tổng số câu hỏi đã nhập</div>
                    <div className="font-serif font-bold text-2xl text-emerald-700 mt-0.5">
                      {totalQuestionsAllModules}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#DDD7CC] shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#DDD7CC]">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#30312F]">
                      Danh sách câu hỏi của mục đang chọn
                    </h4>
                    <div className="text-[11px] text-[#77756F]">
                      {selectedQTargetLesson
                        ? `[${selectedQTargetLesson.code}] ${selectedQTargetLesson.title}`
                        : "Đề tổng hợp chung cả Module"}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-white border border-[#DDD7CC] text-xs font-mono font-bold text-[#782F3B]">
                    {currentTargetQuestions.length} câu hỏi
                  </span>
                </div>

                {currentTargetQuestions.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#77756F] bg-white rounded-xl border border-dashed border-[#DDD7CC]">
                    Chưa có câu hỏi nào được nhập cho mục này. Hãy dùng biểu mẫu bên trái để thêm câu hỏi.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                    {currentTargetQuestions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="p-3.5 rounded-xl bg-white border border-[#DDD7CC] space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-bold text-[#30312F]">
                            Câu {idx + 1}: {q.content}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                qLessonId === "__MODULE__" ||
                                !selectedQTargetLesson
                              ) {
                                deleteModuleQuestion(qModuleId, q.id);
                              } else {
                                deleteLessonQuestion(
                                  selectedQTargetLesson.id,
                                  q.id
                                );
                              }
                              showNotification("Đã xóa câu hỏi!");
                            }}
                            className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 shrink-0 cursor-pointer"
                            title="Xóa câu hỏi này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                          {q.options.map((opt) => (
                            <div
                              key={opt.id}
                              className={`px-2 py-1 rounded border ${
                                opt.id === q.correctOptionId
                                  ? "bg-[#EDF6F2] border-[#34745B] text-[#1E4435] font-bold"
                                  : "bg-[#FAF7F0] border-[#E8E1D3] text-[#565551]"
                              }`}
                            >
                              {opt.label}. {opt.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SYSTEM & 2 ACCOUNTS */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#DDD7CC] shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#DDD7CC]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#782F3B]" />
                  <h3 className="font-serif font-bold text-base text-[#30312F]">
                    Hệ Thống 2 Tài Khoản
                  </h3>
                </div>
                <span className="text-xs text-[#77756F]">
                  Phân quyền chặt chẽ giữa Quản trị và Học tập
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-purple-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold">
                        👑
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#30312F]">
                          Quản Trị Viên (Admin)
                        </div>
                        <div className="text-[11px] text-purple-700 font-mono">
                          admin@medread.vn
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded font-bold uppercase">
                      Admin
                    </span>
                  </div>
                  <p className="text-xs text-[#77756F] pt-1">
                    Toàn quyền: Tạo môn học, bài học mới, nhập sách dạng HTML/Markdown, xóa bài học và quản lý câu hỏi.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#DDD7CC] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#782F3B] text-white flex items-center justify-center font-bold">
                        👤
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#30312F]">
                          Người Dùng (Học Viên)
                        </div>
                        <div className="text-[11px] text-[#77756F] font-mono">
                          user@medread.vn
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-[#E8E1D3] text-[#782F3B] border border-[#DDD7CC] px-2 py-0.5 rounded font-bold uppercase">
                      User
                    </span>
                  </div>
                  <p className="text-xs text-[#77756F] pt-1">
                    Chỉ học tập: Đọc sách (Focus Reader), làm quiz (Knowledge Gate), xem tiến độ cá nhân. Không được tạo/sửa/xóa nội dung.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals for Editing / Creating Lessons & Chapters */}
      <LessonFormModal
        isOpen={lessonModalState.isOpen}
        mode={lessonModalState.mode}
        disciplineId={selectedDisciplineId}
        chapters={currentChapters}
        defaultChapterId={lessonModalState.defaultChapterId}
        initialLesson={lessonModalState.lesson}
        initialHtmlContent={
          lessonModalState.lesson
            ? customContents[lessonModalState.lesson.id] || ""
            : ""
        }
        onClose={() =>
          setLessonModalState((prev) => ({ ...prev, isOpen: false }))
        }
        onSubmit={handleLessonModalSubmit}
      />

      <ChapterFormModal
        isOpen={chapterModalOpen}
        disciplineId={selectedDisciplineId}
        nextIndex={currentChapters.length + 1}
        onClose={() => setChapterModalOpen(false)}
        onSubmit={handleChapterModalSubmit}
      />
    </div>
  );
}
