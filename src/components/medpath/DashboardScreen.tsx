"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  MEDPATH_DISCIPLINES,
  TODAY_STUDY_TASKS,
  ACADEMIC_ANALYTICS_DATA,
  StudyTask,
  Chapter,
  Lesson,
} from "@/lib/medpath-data";
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
  BookOpen,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Target,
  Compass,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  Crown,
  FolderPlus,
  Plus,
  Trash2,
  Edit3,
  FileCode,
  RefreshCw,
  Layers,
} from "lucide-react";

interface DashboardScreenProps {
  onNavigate: (
    screen: "dashboard" | "study-map" | "reader" | "gate" | "analytics"
  ) => void;
  onSelectLessonForReader?: (lessonId: string, openQuiz?: boolean) => void;
}

export function DashboardScreen({
  onNavigate,
  onSelectLessonForReader,
}: DashboardScreenProps) {
  const { isAdmin } = useAuth();
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
  const { getQuestionsForSingleLesson } = useQuestionBankStore();

  const [selectedDisciplineId, setSelectedDisciplineId] =
    useState<string>("mod-8");
  const [expandedModuleId, setExpandedModuleId] =
    useState<string>("mod-8-chap-1");
  const [tasks, setTasks] = useState<StudyTask[]>(TODAY_STUDY_TASKS);

  // Admin Modals & Inline Confirmation States
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
  const [adminToast, setAdminToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => {
      setAdminToast((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const activeDiscipline =
    MEDPATH_DISCIPLINES.find((d) => d.id === selectedDisciplineId) ||
    MEDPATH_DISCIPLINES[0];

  const currentModules: Chapter[] =
    modulesMap[selectedDisciplineId] || modulesMap["mod-8"] || [];

  const totalLessonsInDiscipline = currentModules.reduce(
    (acc, chap) => acc + chap.lessons.length,
    0
  );

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  const handleLessonModalSubmit = (
    discId: string,
    input: LessonFormInput,
    lessonId?: string
  ) => {
    if (lessonModalState.mode === "create") {
      const created = addLesson(discId, input);
      setExpandedModuleId(created.chapterId);
      showToast(`Đã thêm bài mới: [${created.code}] ${created.title}`);
    } else if (lessonId) {
      const updated = updateLesson(discId, lessonId, input);
      if (updated) {
        showToast(`Đã cập nhật bài: [${updated.code}] ${updated.title}`);
      }
    }
  };

  const handleChapterModalSubmit = (
    discId: string,
    input: ChapterFormInput
  ) => {
    const created = addChapter(discId, input);
    setExpandedModuleId(created.id);
    showToast(`Đã thêm phần mới: ${created.romanNumeral} - ${created.title}`);
  };

  const getStatusBadge = (status: Lesson["status"], score?: number) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EDF6F2] text-[#34745B] border border-[#DBEDE4]">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>Đã xong {score ? `(${score}%)` : ""}</span>
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FBF5EB] text-[#B67A36] border border-[#F6EAD5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B67A36] animate-pulse" />
            <span>Đang học (65%)</span>
          </span>
        );
      case "review_needed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F9ECEE] text-[#782F3B] border border-[#E8B4BB]">
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Cần ôn {score ? `(${score}%)` : ""}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F3EFE6] text-[#77756F] border border-[#DDD7CC]">
            <span>Chưa học</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full space-y-10">
      {/* Toast Notification for Admin CRUD actions */}
      {adminToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#30312F] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#782F3B] flex items-center gap-2.5 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{adminToast}</span>
        </div>
      )}

      {/* Admin Mode Bar: Displayed ONLY for Admin to create/edit/delete lessons */}
      {isAdmin && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F0] border-2 border-purple-300/80 shadow-editorial flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-700 text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs flex-shrink-0">
              <Crown className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-purple-950 flex items-center gap-2">
                <span>Chế độ Quản Trị Viên (Admin Mode)</span>
                <span className="text-[10px] bg-purple-100 border border-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Toàn quyền Thêm / Sửa / Xóa Bài Học
                </span>
              </div>
              <p className="text-xs text-[#5A5852] mt-0.5 max-w-3xl leading-relaxed">
                Bạn có thể bấm trực tiếp <strong>&ldquo;+ Thêm bài học mới&rdquo;</strong>, <strong>&ldquo;Sửa / Nhập HTML&rdquo;</strong> hoặc <strong>&ldquo;Xóa bài&rdquo;</strong> ngay trong từng Module bên dưới. Học viên chỉ thấy nút Đọc bài &amp; Làm Quiz.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                setLessonModalState({
                  isOpen: true,
                  mode: "create",
                  defaultChapterId:
                    expandedModuleId || currentModules[0]?.id || "",
                  lesson: null,
                })
              }
              className="px-3.5 py-2.5 rounded-xl bg-[#782F3B] hover:bg-[#642530] text-white text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Bài vào {activeDiscipline.name}</span>
            </button>

            <Link
              href="/admin"
              className="px-3.5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 shadow-sm transition"
            >
              <FolderPlus className="w-4 h-4 text-purple-200" />
              <span>Admin Studio</span>
            </Link>
          </div>
        </div>
      )}

      {/* 1. Academic Editorial Header */}
      <section className="border-b border-[#DDD7CC] pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#782F3B] font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#782F3B]" />
              Không gian tự học lâm sàng • Y Đa Khoa K2022
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#30312F] tracking-tight">
              Hôm nay học gì?
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#77756F] max-w-2xl font-normal leading-relaxed">
              Chào Bác sĩ nội trú tương lai. Dưới đây là 4 Module hệ cơ quan chính khóa. Chọn Module, xem các phần và nhấp trực tiếp vào{" "}
              <strong className="text-[#782F3B] font-semibold">Đọc bài</strong> hoặc{" "}
              <strong className="text-[#34745B] font-semibold">Làm Quiz</strong> để bắt đầu học ngay.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("study-map")}
              className="px-4 py-2 rounded-md bg-[#FAF7F0] hover:bg-white text-[#30312F] border border-[#DDD7CC] text-xs font-semibold shadow-editorial transition flex items-center gap-2"
            >
              <span>Xem Toàn bộ Lộ trình</span>
              <Compass className="w-3.5 h-3.5 text-[#782F3B]" />
            </button>
            <button
              onClick={() => onNavigate("gate")}
              className="px-4 py-2 rounded-md bg-[#782F3B] hover:bg-[#642530] text-white text-xs font-semibold shadow-editorial transition flex items-center gap-2 cursor-pointer"
            >
              <span>Bộ câu hỏi của các Module</span>
              <Target className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. PHẦN ĐẦU TIÊN: CÁC MÔN HỌC, MODULE & BÀI HỌC CÓ CHỨC NĂNG ĐỌC, QUIZ & QUẢN TRỊ CRUD */}
      <section className="bg-[#FAF7F0] border border-[#DDD7CC] rounded-lg p-6 sm:p-8 shadow-editorial space-y-6">
        {/* Section Title */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#DDD7CC]">
          <div>
            <div className="text-[11px] font-mono font-bold text-[#782F3B] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              CHƯƠNG TRÌNH ĐÀO TẠO • HỌC PHẦN &amp; MODULE CHUYÊN KHOA
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#30312F] mt-0.5">
              Khám phá Module &amp; Bài giảng ({totalLessonsInDiscipline} bài)
            </h2>
            <p className="text-xs text-[#77756F]">
              Chọn Module, mở từng Phần và thao tác trực tiếp với từng bài học:{" "}
              <strong>Đọc tài liệu</strong>, <strong>Làm Quiz</strong>
              {isAdmin && (
                <span className="text-purple-800 font-semibold">
                  {" "}
                  hoặc Thêm mới / Sửa HTML / Xóa bài (Quyền Admin)
                </span>
              )}
              .
            </p>
          </div>

          {/* Right Header Controls (including Admin Quick CRUD bar) */}
          <div className="flex flex-wrap items-center gap-2.5">
            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setLessonModalState({
                      isOpen: true,
                      mode: "create",
                      defaultChapterId:
                        expandedModuleId || currentModules[0]?.id || "",
                      lesson: null,
                    })
                  }
                  className="px-3.5 py-2 rounded-md bg-[#782F3B] hover:bg-[#642530] text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Thêm Bài học mới</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChapterModalOpen(true)}
                  className="px-3 py-2 rounded-md bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>+ Thêm Phần/Chương</span>
                </button>

                {!confirmReset ? (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="px-2.5 py-2 rounded-md bg-[#F3EFE6] hover:bg-[#E9E3D5] text-[#565551] border border-[#DDD7CC] text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer"
                    title="Khôi phục danh sách 79 bài học mặc định của 4 Module"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Khôi phục gốc</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-2.5 py-1.5 rounded-md">
                    <span className="text-[11px] font-bold text-amber-900">
                      Khôi phục 79 bài gốc?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        resetToDefaultCurriculum();
                        setConfirmReset(false);
                        showToast("Đã khôi phục 79 bài giảng mặc định!");
                      }}
                      className="px-2 py-0.5 rounded bg-[#782F3B] text-white text-[11px] font-bold cursor-pointer"
                    >
                      Đồng ý
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="px-2 py-0.5 rounded bg-white border border-amber-300 text-[#30312F] text-[11px] cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </>
            )}

            <div className="text-xs font-mono text-[#77756F] bg-[#F3EFE6] px-3 py-1.5 rounded border border-[#DDD7CC]">
              Đang chọn:{" "}
              <strong className="text-[#782F3B]">{activeDiscipline.name}</strong>
            </div>
          </div>
        </div>

        {/* Hàng 4 Module Học (Subjects Selector Bar) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MEDPATH_DISCIPLINES.map((discipline) => {
            const isSelected = selectedDisciplineId === discipline.id;
            const mods = modulesMap[discipline.id] || [];
            const lessonCount = mods.reduce(
              (sum, c) => sum + c.lessons.length,
              0
            );
            return (
              <button
                key={discipline.id}
                onClick={() => {
                  setSelectedDisciplineId(discipline.id);
                  if (mods.length > 0) setExpandedModuleId(mods[0].id);
                }}
                className={`p-3.5 rounded-md border text-left transition-all flex flex-col justify-between group cursor-pointer ${
                  isSelected
                    ? "bg-[#782F3B] text-white border-[#5C232D] shadow-editorial ring-1 ring-[#782F3B]"
                    : "bg-white/80 border-[#DDD7CC] hover:bg-white hover:border-[#782F3B]/50 text-[#30312F]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-[#E9E3D5] text-[#565551]"
                      }`}
                    >
                      {discipline.code}
                    </span>
                    <span
                      className={`text-[11px] font-mono font-bold ${
                        isSelected ? "text-white" : "text-[#782F3B]"
                      }`}
                    >
                      {lessonCount} bài
                    </span>
                  </div>

                  <h3
                    className={`font-serif text-sm font-bold leading-tight ${
                      isSelected
                        ? "text-white"
                        : "text-[#30312F] group-hover:text-[#782F3B]"
                    }`}
                  >
                    {discipline.name}
                  </h3>
                  <div
                    className={`text-[10px] font-serif italic truncate ${
                      isSelected ? "text-white/80" : "text-[#77756F]"
                    }`}
                  >
                    {discipline.latinName}
                  </div>
                </div>

                <div
                  className={`mt-3 pt-2 border-t text-[10px] flex items-center justify-between ${
                    isSelected
                      ? "border-white/20 text-white/90"
                      : "border-[#DDD7CC] text-[#77756F]"
                  }`}
                >
                  <span>
                    {mods.length} Phần • {lessonCount} Bài
                  </span>
                  <span className="font-semibold">
                    {isSelected ? "Đang chọn ✓" : "Chọn →"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Danh sách các Phần/Chương trong Module đang chọn */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#77756F] pb-1">
            <span className="font-semibold uppercase tracking-wider text-[#30312F]">
              Danh sách các Phần &amp; Bài học thuộc {activeDiscipline.name}
            </span>
            <span>
              Click vào tiêu đề Phần để mở rộng hoặc thu gọn danh sách bài
            </span>
          </div>

          <div className="space-y-3.5">
            {currentModules.map((module) => {
              const isExpanded = expandedModuleId === module.id;
              return (
                <div
                  key={module.id}
                  className="bg-[#F3EFE6] border border-[#DDD7CC] rounded-lg overflow-hidden transition-all shadow-sm"
                >
                  {/* Module Accordion Header */}
                  <div
                    onClick={() =>
                      setExpandedModuleId(isExpanded ? "" : module.id)
                    }
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-[#ECE6D8] transition select-none bg-[#FAF7F0]/80"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#F9ECEE] text-[#782F3B] border border-[#E8B4BB]">
                        {module.romanNumeral}
                      </span>
                      <div>
                        <h4 className="font-serif text-base font-bold text-[#30312F]">
                          {module.title}
                        </h4>
                        <div className="font-serif text-xs italic text-[#77756F]">
                          {module.latinTitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 self-end sm:self-center">
                      {/* Admin Quick Actions inside Chapter Header */}
                      {isAdmin && (
                        <div
                          className="flex items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setLessonModalState({
                                isOpen: true,
                                mode: "create",
                                defaultChapterId: module.id,
                                lesson: null,
                              })
                            }
                            className="px-2.5 py-1 rounded bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
                            title="Thêm bài học mới vào phần này"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Thêm bài</span>
                          </button>

                          {confirmDeleteChapterId === module.id ? (
                            <div className="flex items-center gap-1 bg-red-50 border border-red-300 px-2 py-0.5 rounded">
                              <span className="text-[10px] font-bold text-red-800">
                                Xóa phần này?
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  deleteChapter(
                                    selectedDisciplineId,
                                    module.id
                                  );
                                  setConfirmDeleteChapterId(null);
                                  showToast(
                                    `Đã xóa ${module.romanNumeral}: ${module.title}`
                                  );
                                }}
                                className="px-1.5 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold cursor-pointer"
                              >
                                Xóa
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteChapterId(null)}
                                className="px-1.5 py-0.5 bg-white border border-red-200 text-[#30312F] rounded text-[10px] cursor-pointer"
                              >
                                Hủy
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmDeleteChapterId(module.id)
                              }
                              className="p-1.5 rounded bg-white hover:bg-red-50 text-[#77756F] hover:text-red-600 border border-[#DDD7CC] hover:border-red-300 transition cursor-pointer"
                              title="Xóa Phần/Chương này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}

                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-[#30312F]">
                          {module.completedLessons}/{module.lessons.length} Bài (
                          {module.progress}%)
                        </div>
                        <div className="w-24 bg-[#DDD7CC] h-1.5 rounded-full overflow-hidden mt-1 ml-auto">
                          <div
                            className="bg-[#782F3B] h-full rounded-full transition-all"
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-1 rounded bg-[#E9E3D5] text-[#30312F]">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Danh sách các bài học bên trong Module (Khi mở rộng) */}
                  {isExpanded && (
                    <div className="p-4 pt-3 border-t border-[#DDD7CC] bg-[#F3EFE6] space-y-2.5 animate-fadeIn">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#782F3B]">
                          Các bài học trong {module.romanNumeral} (
                          {module.lessons.length} bài) — Chọn Đọc hoặc Làm Quiz:
                        </div>

                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() =>
                              setLessonModalState({
                                isOpen: true,
                                mode: "create",
                                defaultChapterId: module.id,
                                lesson: null,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#782F3B] hover:bg-[#642530] text-white text-xs font-bold shadow-xs transition self-start sm:self-auto cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Thêm bài học vào {module.romanNumeral}</span>
                          </button>
                        )}
                      </div>

                      {module.lessons.length === 0 ? (
                        <div className="p-6 bg-white/70 border border-dashed border-[#DDD7CC] rounded-md text-center space-y-2">
                          <p className="text-xs text-[#77756F]">
                            Chưa có bài học nào trong phần này.
                          </p>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() =>
                                setLessonModalState({
                                  isOpen: true,
                                  mode: "create",
                                  defaultChapterId: module.id,
                                  lesson: null,
                                })
                              }
                              className="px-3.5 py-1.5 rounded bg-[#782F3B] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Thêm bài học đầu tiên</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-2.5">
                          {module.lessons.map((lesson) => {
                            const hasCustomHtml = Boolean(
                              customContents[lesson.id] &&
                                customContents[lesson.id].trim().length > 0
                            );
                            const isConfirmingDelete =
                              confirmDeleteLessonId === lesson.id;

                            return (
                              <div
                                key={lesson.id}
                                className="p-3.5 bg-white border border-[#DDD7CC] hover:border-[#782F3B]/50 rounded-md shadow-editorial transition flex flex-col lg:flex-row lg:items-center justify-between gap-3"
                              >
                                {/* Lesson Info */}
                                <div className="flex items-start gap-3 min-w-0">
                                  <span className="font-mono text-xs font-bold text-[#782F3B] pt-0.5 flex-shrink-0">
                                    {lesson.code}
                                  </span>

                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <h5 className="text-xs sm:text-sm font-bold text-[#30312F]">
                                        {lesson.title}
                                      </h5>
                                      {getStatusBadge(
                                        lesson.status,
                                        lesson.score
                                      )}
                                      {hasCustomHtml && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                                          <FileCode className="w-2.5 h-2.5" />
                                          <span>Đã nhập HTML</span>
                                        </span>
                                      )}
                                    </div>

                                    <div className="font-serif text-xs italic text-[#77756F]">
                                      {lesson.latinTitle}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#77756F] mt-1 font-mono">
                                      <span className="flex items-center gap-1">
                                        <FileQuestion className="w-3 h-3 text-[#782F3B]" />
                                        {getQuestionsForSingleLesson(lesson).length} câu hỏi quiz
                                      </span>
                                      <span>•</span>
                                      <span>
                                        {hasCustomHtml
                                          ? "Đã nhập nội dung bài học"
                                          : "Chưa nhập nội dung bài học"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* ACTION BUTTONS: ĐỌC TÀI LIỆU, LÀM QUIZ + ADMIN (SỬA / XÓA) */}
                                <div className="flex flex-wrap items-center gap-2 self-end lg:self-center flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#DDD7CC] w-full lg:w-auto justify-end">
                                  {/* Admin Edit & Delete Controls */}
                                  {isAdmin && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setLessonModalState({
                                            isOpen: true,
                                            mode: "edit",
                                            defaultChapterId: module.id,
                                            lesson,
                                          })
                                        }
                                        className="px-2.5 py-1.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                                        title="Sửa thông tin bài học hoặc nhập/tải lên nội dung HTML"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>Sửa / Nhập HTML</span>
                                      </button>

                                      {isConfirmingDelete ? (
                                        <div className="flex items-center gap-1 bg-red-50 border border-red-300 px-2 py-1 rounded">
                                          <span className="text-[11px] font-bold text-red-800">
                                            Xác nhận xóa?
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              deleteLesson(
                                                selectedDisciplineId,
                                                lesson.id
                                              );
                                              setConfirmDeleteLessonId(null);
                                              showToast(
                                                `Đã xóa bài: [${lesson.code}] ${lesson.title}`
                                              );
                                            }}
                                            className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold cursor-pointer"
                                          >
                                            Xóa ngay
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setConfirmDeleteLessonId(null)
                                            }
                                            className="px-2 py-0.5 rounded bg-white border border-red-200 text-[#30312F] text-[11px] cursor-pointer"
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
                                          className="px-2.5 py-1.5 rounded bg-red-50/70 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                                          title={`Xóa bài học ${lesson.title}`}
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                          <span>Xóa</span>
                                        </button>
                                      )}
                                    </>
                                  )}

                                  {/* Chức năng 1: Đọc bài */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (onSelectLessonForReader) {
                                        onSelectLessonForReader(lesson.id);
                                      } else {
                                        onNavigate("reader");
                                      }
                                    }}
                                    className="px-3.5 py-2 rounded bg-[#FAF7F0] hover:bg-white text-[#30312F] hover:text-[#782F3B] border border-[#DDD7CC] hover:border-[#782F3B] text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                                    title={`Đọc lý thuyết chuyên sâu: ${lesson.title}`}
                                  >
                                    <BookOpen className="w-3.5 h-3.5 text-[#782F3B]" />
                                    <span>Đọc bài</span>
                                  </button>

                                  {/* Chức năng 2: Làm Quiz (Mở cửa sổ nổi trong phần đọc) */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (onSelectLessonForReader) {
                                        onSelectLessonForReader(lesson.id, true);
                                      } else {
                                        onNavigate("reader");
                                      }
                                    }}
                                    className="px-3.5 py-2 rounded bg-[#782F3B] hover:bg-[#642530] text-white text-xs font-bold shadow-editorial transition flex items-center gap-1.5 cursor-pointer"
                                    title={`Mở bài đọc kèm cửa sổ nổi kiểm tra cho ${lesson.title}`}
                                  >
                                    <Target className="w-3.5 h-3.5" />
                                    <span>Làm Quiz ({getQuestionsForSingleLesson(lesson).length})</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modals for Admin CRUD */}
      <LessonFormModal
        isOpen={lessonModalState.isOpen}
        mode={lessonModalState.mode}
        disciplineId={selectedDisciplineId}
        chapters={currentModules}
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
        nextIndex={currentModules.length + 1}
        onClose={() => setChapterModalOpen(false)}
        onSubmit={handleChapterModalSubmit}
      />
    </div>
  );
}
