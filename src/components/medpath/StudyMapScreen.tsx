"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  MEDPATH_DISCIPLINES,
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
  Compass,
  FileQuestion,
  Filter,
  RotateCcw,
  Sparkles,
  Target,
  Crown,
  FolderPlus,
  Plus,
  Edit3,
  Trash2,
  FileCode,
} from "lucide-react";

interface StudyMapScreenProps {
  onNavigate: (
    screen: "dashboard" | "study-map" | "reader" | "gate" | "analytics"
  ) => void;
  onSelectLessonForReader?: (lessonId: string, openQuiz?: boolean) => void;
}

export function StudyMapScreen({
  onNavigate,
  onSelectLessonForReader,
}: StudyMapScreenProps) {
  const { isAdmin } = useAuth();
  const {
    modulesMap,
    customContents,
    addLesson,
    updateLesson,
    deleteLesson,
    addChapter,
    deleteChapter,
  } = useMedPathCurriculum();
  const { getQuestionsForSingleLesson } = useQuestionBankStore();

  const [selectedDisciplineId, setSelectedDisciplineId] = useState("mod-8");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const chaptersForDiscipline =
    modulesMap[selectedDisciplineId] || modulesMap["mod-8"] || [];

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(
    chaptersForDiscipline[0]?.lessons[0] || null
  );

  // Keep selectedLesson in sync if lessons are edited/deleted or module changes
  useEffect(() => {
    const chaps = modulesMap[selectedDisciplineId] || [];
    if (selectedLesson) {
      for (const c of chaps) {
        const found = c.lessons.find((l) => l.id === selectedLesson.id);
        if (found) {
          setSelectedLesson(found);
          return;
        }
      }
    }
    setSelectedLesson(chaps[0]?.lessons[0] || null);
  }, [selectedDisciplineId, modulesMap]);

  // Admin modal & confirmation states
  const [lessonModalState, setLessonModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    defaultChapterId?: string;
    lesson?: Lesson | null;
  }>({
    isOpen: false,
    mode: "create",
  });
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [confirmDeleteLessonId, setConfirmDeleteLessonId] = useState<
    string | null
  >(null);
  const [confirmDeleteChapterId, setConfirmDeleteChapterId] = useState<
    string | null
  >(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const activeDiscipline =
    MEDPATH_DISCIPLINES.find((d) => d.id === selectedDisciplineId) ||
    MEDPATH_DISCIPLINES[0];

  const filteredChapters = chaptersForDiscipline
    .map((chap) => {
      if (statusFilter === "all") return chap;
      const filteredLessons = chap.lessons.filter(
        (l) => l.status === statusFilter
      );
      return {
        ...chap,
        lessons: filteredLessons,
      };
    })
    .filter((chap) => statusFilter === "all" || chap.lessons.length > 0);

  const handleLessonModalSubmit = (
    discId: string,
    input: LessonFormInput,
    lessonId?: string
  ) => {
    if (lessonModalState.mode === "create") {
      const created = addLesson(discId, input);
      setSelectedLesson(created);
      showToast(`Đã thêm bài mới: [${created.code}] ${created.title}`);
    } else if (lessonId) {
      const updated = updateLesson(discId, lessonId, input);
      if (updated) {
        setSelectedLesson(updated);
        showToast(`Đã cập nhật bài: [${updated.code}] ${updated.title}`);
      }
    }
  };

  const handleChapterModalSubmit = (
    discId: string,
    input: ChapterFormInput
  ) => {
    const created = addChapter(discId, input);
    showToast(`Đã thêm phần mới: ${created.romanNumeral} - ${created.title}`);
  };

  const getStatusBadge = (status: Lesson["status"], score?: number) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EDF6F2] text-[#34745B] border border-[#DBEDE4]">
            <CheckCircle2 className="w-3 h-3" />
            <span>Đã hoàn thành {score ? `(${score}%)` : ""}</span>
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FBF5EB] text-[#B67A36] border border-[#F6EAD5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B67A36] animate-pulse" />
            <span>Đang học (65%)</span>
          </span>
        );
      case "review_needed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F9ECEE] text-[#782F3B] border border-[#E8B4BB]">
            <RotateCcw className="w-3 h-3" />
            <span>Cần ôn tập {score ? `(${score}%)` : ""}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F3EFE6] text-[#77756F] border border-[#DDD7CC]">
            <span>Chưa học</span>
          </span>
        );
    }
  };

  const handleOpenReader = (lesson: Lesson, openQuiz = false) => {
    if (onSelectLessonForReader) {
      onSelectLessonForReader(lesson.id, openQuiz);
    }
    onNavigate("reader");
  };

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full space-y-8">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#30312F] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#782F3B] flex items-center gap-2.5 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Action Bar (Only visible to Admin) */}
      {isAdmin && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F0] border-2 border-purple-300/80 shadow-editorial flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center font-serif text-sm font-bold shadow-xs flex-shrink-0">
              <Crown className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-purple-950 flex items-center gap-2">
                <span>Quản trị Bản đồ &amp; Chương trình học ({activeDiscipline.name})</span>
                <span className="text-[10px] bg-purple-100 border border-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <p className="text-xs text-[#5A5852] mt-0.5 max-w-2xl leading-relaxed">
                Thêm bài học mới, nhập nội dung HTML/Markdown hoặc xóa bài học trực tiếp trong từng Phần của Module.
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
                  defaultChapterId: chaptersForDiscipline[0]?.id || "",
                  lesson: null,
                })
              }
              className="px-3.5 py-2.5 rounded-xl bg-[#782F3B] hover:bg-[#642530] text-white text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm Bài Học Mới</span>
            </button>

            <button
              type="button"
              onClick={() => setChapterModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <FolderPlus className="w-4 h-4 text-purple-200" />
              <span>+ Thêm Phần/Chương</span>
            </button>

            <Link
              href="/admin"
              className="px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] hover:bg-white text-purple-900 border border-purple-300 text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 shadow-xs transition"
            >
              <span>Admin Studio</span>
            </Link>
          </div>
        </div>
      )}

      {/* 1. Header & Discipline Selector */}
      <section className="border-b border-[#DDD7CC] pb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#782F3B] font-semibold mb-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Lộ trình năng lực y khoa
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#30312F]">
              Bản đồ học thuật
            </h1>
            <p className="text-sm text-[#77756F] mt-1">
              Khám phá cấu trúc kiến thức theo từng Phần và Bài học. Hoàn thành mục tiêu để mở khóa các cổng tiếp theo.
            </p>
          </div>

          {/* Quick Filter */}
          <div className="flex items-center gap-2 bg-[#FAF7F0] p-1 rounded-md border border-[#DDD7CC] text-xs">
            <span className="px-2 text-[#77756F] font-semibold flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#782F3B]" />
              Lọc:
            </span>
            {[
              { id: "all", label: "Tất cả" },
              { id: "in_progress", label: "Đang học" },
              { id: "completed", label: "Đã xong" },
              { id: "review_needed", label: "Cần ôn" },
              { id: "not_started", label: "Chưa học" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  statusFilter === f.id
                    ? "bg-[#782F3B] text-white shadow-sm font-semibold"
                    : "text-[#30312F] hover:bg-[#E9E3D5]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Disciplines Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2">
          {MEDPATH_DISCIPLINES.map((d) => {
            const isSelected = selectedDisciplineId === d.id;
            const chaps = modulesMap[d.id] || [];
            const totalLessons = chaps.reduce(
              (sum, c) => sum + c.lessons.length,
              0
            );
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDisciplineId(d.id)}
                className={`px-4 py-2.5 rounded-md text-xs transition-all flex items-center gap-2.5 flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[#782F3B] text-white shadow-editorial font-semibold"
                    : "bg-[#FAF7F0] hover:bg-white text-[#30312F] border border-[#DDD7CC]"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? "bg-white" : "bg-[#782F3B]"
                  }`}
                />
                <div className="text-left">
                  <div className="leading-tight">{d.name}</div>
                  <div
                    className={`text-[10px] italic font-serif ${
                      isSelected ? "text-white/80" : "text-[#77756F]"
                    }`}
                  >
                    {d.latinName}
                  </div>
                </div>
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-[#E9E3D5] text-[#565551]"
                  }`}
                >
                  {totalLessons} bài
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Main Content: Syllabus Tree & Quick Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Chapters & Lessons List */}
        <div className="lg:col-span-7 space-y-6">
          {filteredChapters.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-[#FAF7F0] border border-[#DDD7CC] rounded-lg p-5 shadow-editorial space-y-4"
            >
              {/* Chapter Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DDD7CC]">
                <div>
                  <div className="text-[11px] font-mono font-bold text-[#782F3B] tracking-wider">
                    {chapter.romanNumeral}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#30312F]">
                    {chapter.title}
                  </h3>
                  <div className="font-serif text-xs italic text-[#77756F]">
                    {chapter.latinTitle}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 self-end sm:self-center">
                  {isAdmin && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setLessonModalState({
                            isOpen: true,
                            mode: "create",
                            defaultChapterId: chapter.id,
                            lesson: null,
                          })
                        }
                        className="px-2.5 py-1 rounded bg-[#782F3B] hover:bg-[#642530] text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Thêm bài</span>
                      </button>

                      {confirmDeleteChapterId === chapter.id ? (
                        <div className="flex items-center gap-1 bg-red-50 border border-red-300 px-2 py-0.5 rounded">
                          <span className="text-[10px] font-bold text-red-800">
                            Xóa phần?
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              deleteChapter(selectedDisciplineId, chapter.id);
                              setConfirmDeleteChapterId(null);
                              showToast(
                                `Đã xóa phần: ${chapter.romanNumeral}`
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
                          onClick={() => setConfirmDeleteChapterId(chapter.id)}
                          className="p-1.5 rounded bg-white hover:bg-red-50 text-[#77756F] hover:text-red-600 border border-[#DDD7CC] transition cursor-pointer"
                          title="Xóa Phần này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Chapter Progress Indicator */}
                  <div className="sm:text-right flex-shrink-0">
                    <div className="text-xs font-mono font-semibold text-[#30312F]">
                      {chapter.completedLessons}/{chapter.lessons.length} Bài (
                      {chapter.progress}%)
                    </div>
                    <div className="w-28 bg-[#DDD7CC] h-1.5 rounded-full overflow-hidden mt-1 sm:ml-auto">
                      <div
                        className="bg-[#782F3B] h-full rounded-full transition-all"
                        style={{ width: `${chapter.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lesson Items in Chapter */}
              <div className="space-y-2">
                {chapter.lessons.map((lesson) => {
                  const isSelected = selectedLesson?.id === lesson.id;
                  const hasCustomHtml = Boolean(
                    customContents[lesson.id] &&
                      customContents[lesson.id].trim().length > 0
                  );
                  const isConfirmingDelete =
                    confirmDeleteLessonId === lesson.id;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`p-3.5 rounded-md border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-[#F3EFE6] border-[#782F3B] ring-1 ring-[#782F3B]/30 shadow-editorial"
                          : "bg-white/80 border-[#DDD7CC] hover:border-[#782F3B]/50 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="font-mono text-xs font-bold text-[#782F3B] pt-0.5 flex-shrink-0">
                          {lesson.code}
                        </span>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h4 className="text-xs sm:text-sm font-semibold text-[#30312F] truncate">
                              {lesson.title}
                            </h4>
                            {hasCustomHtml && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                                <FileCode className="w-2.5 h-2.5" />
                                <span>HTML</span>
                              </span>
                            )}
                          </div>
                          <div className="font-serif text-[11px] italic text-[#77756F] truncate">
                            {lesson.latinTitle}
                          </div>
                        </div>
                      </div>

                      <div
                        className="flex flex-wrap items-center gap-1.5 self-end sm:self-center flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {getStatusBadge(lesson.status, lesson.score)}

                        {isAdmin && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setLessonModalState({
                                  isOpen: true,
                                  mode: "edit",
                                  defaultChapterId: chapter.id,
                                  lesson,
                                })
                              }
                              className="p-1.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-[11px] font-semibold transition cursor-pointer"
                              title="Sửa bài hoặc Nhập HTML"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>

                            {isConfirmingDelete ? (
                              <div className="flex items-center gap-1 bg-red-50 border border-red-300 px-1.5 py-0.5 rounded">
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
                                  className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold cursor-pointer"
                                >
                                  Xóa
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteLessonId(null)}
                                  className="px-1.5 py-0.5 rounded bg-white border border-red-200 text-[#30312F] text-[10px] cursor-pointer"
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
                                className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-semibold transition cursor-pointer"
                                title="Xóa bài học này"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenReader(lesson, false)}
                          className="px-2 py-1 rounded bg-[#FAF7F0] hover:bg-white text-[#782F3B] border border-[#DDD7CC] text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer"
                          title="Đọc bài"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>Đọc</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenReader(lesson, true)}
                          className="px-2 py-1 rounded bg-[#782F3B] hover:bg-[#642530] text-white text-[11px] font-bold shadow-sm transition flex items-center gap-1 cursor-pointer"
                          title="Mở cửa sổ nổi kiểm tra sau bài học"
                        >
                          <Target className="w-3 h-3" />
                          <span>Quiz</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Quick Inspector Drawer */}
        <div className="lg:col-span-5 sticky top-20">
          {selectedLesson ? (
            <div className="bg-[#FAF7F0] border border-[#DDD7CC] rounded-lg p-6 shadow-editorial space-y-6">
              {/* Header */}
              <div className="pb-4 border-b border-[#DDD7CC]">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-[#F9ECEE] text-[#782F3B] text-[10px] font-mono font-bold rounded border border-[#E8B4BB]">
                    {selectedLesson.code}
                  </span>
                  {getStatusBadge(selectedLesson.status, selectedLesson.score)}
                </div>

                <h3 className="font-serif text-xl font-bold text-[#30312F] leading-snug">
                  {selectedLesson.title}
                </h3>
                <div className="font-serif text-sm italic text-[#782F3B] mt-0.5">
                  {selectedLesson.latinTitle}
                </div>
              </div>

              {/* Admin Action Buttons Inside Inspector */}
              {isAdmin && (
                <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-lg flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-purple-950">
                    Thao tác Admin với bài này:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setLessonModalState({
                          isOpen: true,
                          mode: "edit",
                          defaultChapterId: selectedLesson.chapterId,
                          lesson: selectedLesson,
                        })
                      }
                      className="px-2.5 py-1 rounded bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Sửa / Nhập HTML</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteLesson(selectedDisciplineId, selectedLesson.id);
                        showToast(
                          `Đã xóa bài: [${selectedLesson.code}] ${selectedLesson.title}`
                        );
                      }}
                      className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Xóa bài</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Lesson Metadata Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#F3EFE6] rounded border border-[#DDD7CC]">
                  <div className="text-[#77756F] text-[11px]">
                    Nội dung bài giảng
                  </div>
                  <div className="font-serif font-bold text-sm text-[#30312F] mt-0.5 flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-[#B67A36]" />
                    <span>
                      {customContents[selectedLesson.id]?.trim()
                        ? "Đã nhập nội dung"
                        : "Chưa nhập dữ liệu"}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#F3EFE6] rounded border border-[#DDD7CC]">
                  <div className="text-[#77756F] text-[11px]">
                    Câu hỏi của bài
                  </div>
                  <div className="font-serif font-bold text-sm text-[#30312F] mt-0.5 flex items-center gap-1.5">
                    <FileQuestion className="w-4 h-4 text-[#782F3B]" />
                    <span>
                      {getQuestionsForSingleLesson(selectedLesson).length} câu hỏi
                    </span>
                  </div>
                </div>
              </div>

              {selectedLesson.objectives.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#782F3B] flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    Mục tiêu năng lực y khoa
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#565551]">
                    {selectedLesson.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#782F3B] mt-1.5 flex-shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedLesson.clinicalHighlights.length > 0 && (
                <div className="space-y-2 p-3.5 bg-[#FAF3E8] border border-[#E8CDA3] rounded-md">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#B67A36] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Trọng tâm lâm sàng (Clinical Pearl)
                  </div>
                  <div className="text-xs text-[#30312F] space-y-1">
                    {selectedLesson.clinicalHighlights.map((ch, i) => (
                      <p key={i} className="leading-relaxed">
                        • {ch}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {selectedLesson.keyTerms.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#77756F]">
                    Thuật ngữ định hướng
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLesson.keyTerms.map((term, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] font-serif italic bg-[#F3EFE6] border border-[#DDD7CC] text-[#30312F]"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#DDD7CC] space-y-2.5">
                <button
                  onClick={() => handleOpenReader(selectedLesson, false)}
                  className="w-full py-2.5 bg-[#782F3B] hover:bg-[#642530] text-white rounded text-xs font-semibold shadow-editorial transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Vào Focus Reader (Đọc bài giảng)</span>
                </button>

                <button
                  onClick={() => handleOpenReader(selectedLesson, true)}
                  className="w-full py-2 bg-[#FAF7F0] hover:bg-white text-[#30312F] border border-[#DDD7CC] rounded text-xs font-semibold shadow-editorial transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Target className="w-4 h-4 text-[#782F3B]" />
                  <span>
                    Kiểm tra sau bài học ({getQuestionsForSingleLesson(selectedLesson).length} câu hỏi)
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#FAF7F0] border border-[#DDD7CC] rounded-lg p-8 text-center text-[#77756F] shadow-editorial">
              <Compass className="w-8 h-8 mx-auto text-[#DDD7CC] mb-2" />
              <p className="text-xs">
                Chọn một bài học từ danh sách bên trái để xem nhanh mục tiêu và bắt đầu học.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals for Admin CRUD */}
      <LessonFormModal
        isOpen={lessonModalState.isOpen}
        mode={lessonModalState.mode}
        disciplineId={selectedDisciplineId}
        chapters={chaptersForDiscipline}
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
        nextIndex={chaptersForDiscipline.length + 1}
        onClose={() => setChapterModalOpen(false)}
        onSubmit={handleChapterModalSubmit}
      />
    </div>
  );
}
