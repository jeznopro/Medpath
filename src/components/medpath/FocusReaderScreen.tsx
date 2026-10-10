"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  ALL_DISCIPLINE_MODULES,
  MEDPATH_DISCIPLINES,
  Lesson,
} from "@/lib/medpath-data";
import { useMedPathCurriculum } from "@/lib/use-curriculum";
import { useQuestionBankStore } from "@/lib/module-questions";
import { PostLessonQuizModal } from "@/components/medpath/PostLessonQuizModal";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Minus,
  Plus,
  Target,
  Type,
  Maximize2,
  Minimize2,
  List,
  Edit3,
  Save,
  X,
  Code,
  FileText,
  Crown,
  Upload,
} from "lucide-react";

interface FocusReaderScreenProps {
  onNavigate: (
    screen: "dashboard" | "study-map" | "reader" | "gate" | "analytics"
  ) => void;
  lessonId?: string;
  onSelectLesson?: (lessonId: string) => void;
  autoOpenQuiz?: boolean;
  onQuizOpened?: () => void;
}

export function FocusReaderScreen({
  onNavigate,
  lessonId,
  onSelectLesson,
  autoOpenQuiz,
  onQuizOpened,
}: FocusReaderScreenProps) {
  const { isAdmin } = useAuth();
  const { modulesMap, customContents, saveLessonHtml } = useMedPathCurriculum();
  const { getQuestionsForSingleLesson } = useQuestionBankStore();

  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">(
    "normal"
  );
  const [fontFamily, setFontFamily] = useState<"serif" | "sans">("serif");
  const [tocMode, setTocMode] = useState<"compact" | "expanded">("compact");
  const [isQuizModalOpen, setIsQuizModalOpen] = useState<boolean>(
    Boolean(autoOpenQuiz)
  );

  useEffect(() => {
    if (autoOpenQuiz) {
      setIsQuizModalOpen(true);
      if (onQuizOpened) onQuizOpened();
    }
  }, [autoOpenQuiz, onQuizOpened]);

  // Ghi chú cá nhân (trống mặc định, chỉ lưu những gì người dùng tự gõ)
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState<string>("");

  // Trình soạn thảo nội dung bài học dành cho Quản trị viên
  const [isEditingContent, setIsEditingContent] = useState<boolean>(false);
  const [draftContent, setDraftContent] = useState<string>("");

  // Tìm bài học hiện tại trong 4 Module
  let currentLesson: Lesson | undefined;
  let currentDisciplineName = "Module 8 - Tim mạch";
  let currentChapterTitle = "";
  const allLessonsFlat: Lesson[] = [];

  const targetId = lessonId || "les-8-1-1";
  for (const disc of MEDPATH_DISCIPLINES) {
    const chaps = modulesMap[disc.id] || ALL_DISCIPLINE_MODULES[disc.id] || [];
    for (const chap of chaps) {
      for (const les of chap.lessons) {
        allLessonsFlat.push(les);
        if (!currentLesson && (les.id === targetId || les.code === targetId)) {
          currentLesson = les;
          currentDisciplineName = disc.name;
          currentChapterTitle = `${chap.romanNumeral}: ${chap.title}`;
        }
      }
    }
  }

  if (!currentLesson && allLessonsFlat.length > 0) {
    currentLesson = allLessonsFlat[0];
  }

  const activeLessonId = currentLesson?.id || "les-8-1-1";
  const savedCustomContent = customContents[activeLessonId] || "";
  const hasEnteredContent = Boolean(savedCustomContent.trim().length > 0);

  const currentLessonQuestions = currentLesson
    ? getQuestionsForSingleLesson(currentLesson)
    : [];

  // Tìm bài trước / bài tiếp theo để điều hướng
  const currentFlatIndex = allLessonsFlat.findIndex(
    (l) => l.id === activeLessonId
  );
  const prevLesson =
    currentFlatIndex > 0 ? allLessonsFlat[currentFlatIndex - 1] : null;
  const nextLesson =
    currentFlatIndex >= 0 && currentFlatIndex < allLessonsFlat.length - 1
      ? allLessonsFlat[currentFlatIndex + 1]
      : null;

  const handleOpenEditor = () => {
    setDraftContent(savedCustomContent || "");
    setIsEditingContent(true);
  };

  const handleSaveCustomContent = () => {
    saveLessonHtml(activeLessonId, draftContent);
    setIsEditingContent(false);
  };

  const handleUploadHtmlFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      setDraftContent(text);
    } catch (err) {
      console.error("Failed to read file:", err);
    }
  };

  // Trích xuất mục lục tự động từ các thẻ tiêu đề h1/h2/h3 nếu người dùng đã nhập nội dung
  const dynamicTocItems = useMemo(() => {
    if (!hasEnteredContent) return [];
    const regex = /<h([1-3])[^>]*>(.*?)<\/h\1>/gi;
    const items: { id: string; roman: string; title: string }[] = [];
    let match: RegExpExecArray | null;
    let idx = 1;
    while ((match = regex.exec(savedCustomContent)) !== null) {
      const rawText = match[2].replace(/<[^>]+>/g, "").trim();
      if (rawText) {
        items.push({
          id: `custom-sec-${idx}`,
          roman: `${idx}`,
          title: rawText,
        });
        idx++;
      }
    }
    return items;
  }, [hasEnteredContent, savedCustomContent]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([...notes, newNote.trim()]);
    setNewNote("");
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case "large":
        return "text-base sm:text-lg leading-relaxed";
      case "xlarge":
        return "text-lg sm:text-xl leading-loose";
      default:
        return "text-sm sm:text-base leading-relaxed";
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F3EFE6]">
      {/* Top Academic Reader Header Bar */}
      <div className="sticky top-14 z-30 bg-[#F3EFE6]/95 backdrop-blur-md border-b border-[#DDD7CC] px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => onNavigate("study-map")}
            className="p-1.5 rounded text-[#77756F] hover:text-[#30312F] hover:bg-[#E9E3D5] transition flex items-center gap-1 text-xs shrink-0"
            title="Quay lại Bản đồ học thuật"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Bản đồ</span>
          </button>

          <span className="w-px h-4 bg-[#DDD7CC] shrink-0" />

          <div className="min-w-0">
            <div className="text-[10px] font-mono font-bold text-[#782F3B] uppercase tracking-wider truncate">
              {currentLesson?.code} • {currentDisciplineName}{" "}
              {currentChapterTitle ? `— ${currentChapterTitle}` : ""}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={activeLessonId}
                onChange={(e) => {
                  if (onSelectLesson) {
                    onSelectLesson(e.target.value);
                  }
                }}
                className="font-serif text-xs sm:text-sm font-bold text-[#30312F] bg-transparent border-b border-dashed border-[#782F3B]/50 focus:outline-none focus:border-[#782F3B] py-0.5 max-w-[220px] sm:max-w-md truncate cursor-pointer"
                title="Chuyển nhanh giữa các bài giảng trong 4 Module"
              >
                {MEDPATH_DISCIPLINES.map((disc) => (
                  <optgroup key={disc.id} label={`=== ${disc.name} ===`}>
                    {(
                      modulesMap[disc.id] ||
                      ALL_DISCIPLINE_MODULES[disc.id] ||
                      []
                    ).map((chap) =>
                      chap.lessons.map((les) => (
                        <option key={les.id} value={les.id}>
                          [{les.code}] {les.title}
                        </option>
                      ))
                    )}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reader Controls Toolbar */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Nút Nhập/Sửa dữ liệu bài học (Chỉ hiện cho Quản trị viên) */}
          {isAdmin && (
            <button
              onClick={handleOpenEditor}
              className={`px-3 py-1.5 rounded text-xs font-bold border transition flex items-center gap-1.5 ${
                hasEnteredContent
                  ? "bg-[#EDF6F2] text-[#34745B] border-[#34745B]"
                  : "bg-[#FAF7F0] hover:bg-white text-[#782F3B] border-[#782F3B]/40"
              }`}
              title="Nhập hoặc chỉnh sửa nội dung HTML/Văn bản cho bài giảng này"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>
                {hasEnteredContent ? "Sửa nội dung bài" : "+ Nhập nội dung bài"}
              </span>
            </button>
          )}

          {/* Font family toggle */}
          <div className="hidden md:flex items-center bg-[#FAF7F0] border border-[#DDD7CC] rounded p-0.5 text-xs">
            <button
              onClick={() => setFontFamily("serif")}
              className={`px-2 py-1 rounded font-serif transition ${
                fontFamily === "serif"
                  ? "bg-[#782F3B] text-white font-semibold"
                  : "text-[#77756F] hover:text-[#30312F]"
              }`}
            >
              Serif
            </button>
            <button
              onClick={() => setFontFamily("sans")}
              className={`px-2 py-1 rounded font-sans transition ${
                fontFamily === "sans"
                  ? "bg-[#782F3B] text-white font-semibold"
                  : "text-[#77756F] hover:text-[#30312F]"
              }`}
            >
              Sans
            </button>
          </div>

          {/* Font size controls */}
          <div className="flex items-center bg-[#FAF7F0] border border-[#DDD7CC] rounded p-0.5">
            <button
              onClick={() =>
                setFontSize(
                  fontSize === "xlarge"
                    ? "large"
                    : fontSize === "large"
                      ? "normal"
                      : "normal"
                )
              }
              className="p-1 text-[#77756F] hover:text-[#30312F] transition"
              title="Giảm cỡ chữ"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[11px] font-mono text-[#30312F] flex items-center gap-0.5">
              <Type className="w-3 h-3 text-[#782F3B]" />
            </span>
            <button
              onClick={() =>
                setFontSize(
                  fontSize === "normal"
                    ? "large"
                    : fontSize === "large"
                      ? "xlarge"
                      : "xlarge"
                )
              }
              className="p-1 text-[#77756F] hover:text-[#30312F] transition"
              title="Tăng cỡ chữ"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Nút mở Cửa sổ nổi Kiểm tra sau bài học */}
          <button
            onClick={() => setIsQuizModalOpen(true)}
            className="px-3 py-1.5 rounded bg-[#782F3B] hover:bg-[#642530] text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
          >
            <Target className="w-3.5 h-3.5" />
            <span>
              Kiểm tra sau bài học ({currentLessonQuestions.length} câu)
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1600px] mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 sm:px-6 lg:px-8 py-8 items-start relative">
        {/* Floating Collapsible / Expandable Table of Contents (Khi bài học có tiêu đề mục lục) */}
        {dynamicTocItems.length > 0 && (
          <div className="hidden lg:block fixed left-5 top-28 z-30">
            {tocMode === "compact" ? (
              <div className="bg-[#FAF7F0]/95 backdrop-blur-md border border-[#DDD7CC] rounded-2xl p-2 shadow-editorial flex flex-col items-center gap-1.5 w-12 transition-all duration-200 hover:border-[#782F3B]/50">
                <button
                  onClick={() => setTocMode("expanded")}
                  className="w-8 h-8 rounded-xl bg-[#782F3B] text-white flex items-center justify-center hover:bg-[#642530] transition shadow-xs"
                  title="Phóng to Mục lục"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <div className="w-6 h-px bg-[#DDD7CC] my-0.5" />
                {dynamicTocItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTocMode("expanded")}
                    title={`${item.roman}. ${item.title}`}
                    className="w-8 h-8 rounded-xl font-mono text-[11px] font-bold flex items-center justify-center transition-all text-[#77756F] hover:bg-[#E9E3D5] hover:text-[#30312F]"
                  >
                    {item.roman}
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-[#FAF7F0] border-2 border-[#782F3B]/30 rounded-2xl p-4 shadow-2xl w-80 max-h-[calc(100vh-8rem)] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#DDD7CC]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#782F3B] text-white flex items-center justify-center">
                      <List className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#30312F]">
                      Mục lục bài đọc
                    </div>
                  </div>
                  <button
                    onClick={() => setTocMode("compact")}
                    className="px-2 py-1 rounded-md bg-[#F3EFE6] hover:bg-[#E9E3D5] text-[#782F3B] text-[11px] font-semibold flex items-center gap-1 transition"
                  >
                    <Minimize2 className="w-3 h-3" />
                    <span>Thu nhỏ</span>
                  </button>
                </div>
                <nav className="space-y-1">
                  {dynamicTocItems.map((item) => (
                    <div
                      key={item.id}
                      className="px-3 py-2 rounded-lg text-xs text-[#565551] flex items-start gap-2.5"
                    >
                      <span className="font-mono font-bold text-[#782F3B]">
                        {item.roman}.
                      </span>
                      <span className="line-clamp-2">{item.title}</span>
                    </div>
                  ))}
                </nav>
              </div>
            )}
          </div>
        )}

        {/* Center Main Reading Paper (9 cols) */}
        <article
          className={`lg:col-span-9 bg-[#FAF7F0] border border-[#DDD7CC] rounded-lg p-6 sm:p-10 lg:p-14 shadow-editorial space-y-8 ${
            fontFamily === "serif" ? "font-serif" : "font-sans"
          } ${getFontSizeClass()}`}
        >
          {/* Title Banner */}
          <header className="border-b border-[#DDD7CC] pb-6 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-sans font-semibold uppercase tracking-widest text-[#782F3B]">
              <span>
                {currentDisciplineName}{" "}
                {currentChapterTitle ? `• ${currentChapterTitle}` : ""}
              </span>
              <span className="font-mono px-2 py-0.5 rounded bg-[#E9E3D5] text-[#30312F]">
                Mã bài: {currentLesson?.code}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#30312F] leading-tight">
              {currentLesson?.title || "Chưa chọn bài học"}
            </h1>

            {currentLesson?.latinTitle && (
              <div className="font-serif text-base sm:text-lg italic text-[#782F3B]">
                {currentLesson.latinTitle}
              </div>
            )}
          </header>

          {/* INLINE DATA / HTML EDITOR MODAL PANEL (Chỉ dành cho Admin) */}
          {isAdmin && isEditingContent && (
            <div className="font-sans bg-[#F3EFE6] border-2 border-[#782F3B] rounded-xl p-5 space-y-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DDD7CC] pb-3">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#782F3B]" />
                  <h3 className="font-serif font-bold text-base text-[#30312F]">
                    Nhập dữ liệu bài giảng: [{currentLesson?.code}]{" "}
                    {currentLesson?.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <label className="px-3 py-1 rounded bg-white hover:bg-[#FAF7F0] border border-[#DDD7CC] text-xs font-semibold text-[#782F3B] cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Chọn file .html / .md / .txt</span>
                    <input
                      type="file"
                      accept=".html,.htm,.md,.txt"
                      onChange={handleUploadHtmlFile}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => setIsEditingContent(false)}
                    className="p-1 rounded hover:bg-[#DDD7CC]/50 text-[#77756F]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                rows={14}
                className="w-full p-3.5 rounded-lg bg-white border border-[#DDD7CC] font-mono text-xs text-[#30312F] focus:outline-none focus:border-[#782F3B] leading-relaxed"
                placeholder="Dán mã HTML hoặc văn bản nội dung bài học vào đây..."
              />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => {
                    saveLessonHtml(activeLessonId, "");
                    setDraftContent("");
                    setIsEditingContent(false);
                  }}
                  className="px-3 py-1.5 rounded text-xs font-semibold text-[#782F3B] hover:bg-[#F9ECEE] transition"
                >
                  Xóa nội dung đã nhập
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingContent(false)}
                    className="px-4 py-2 rounded border border-[#DDD7CC] bg-white text-xs font-semibold text-[#30312F]"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveCustomContent}
                    className="px-5 py-2 rounded bg-[#782F3B] hover:bg-[#642530] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu nội dung bài học</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* HIỂN THỊ NỘI DUNG: Chỉ hiện nội dung đã nhập, nếu chưa nhập sẽ báo trống */}
          {hasEnteredContent ? (
            <section className="space-y-4">
              <div
                className="prose max-w-none text-[#30312F] space-y-4 leading-relaxed [&_h1]:font-serif [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#30312F] [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#782F3B] [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3"
                dangerouslySetInnerHTML={{
                  __html: savedCustomContent.includes("<")
                    ? savedCustomContent
                    : savedCustomContent
                        .split("\n")
                        .map((line) => `<p>${line}</p>`)
                        .join(""),
                }}
              />
            </section>
          ) : (
            <section className="py-12 px-6 text-center bg-[#F3EFE6]/70 border-2 border-dashed border-[#DDD7CC] rounded-xl space-y-4 font-sans">
              <div className="w-12 h-12 rounded-full bg-[#E9E3D5] text-[#782F3B] flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-serif text-lg font-bold text-[#30312F]">
                  Bài học này chưa có dữ liệu nội dung
                </h3>
                <p className="text-xs text-[#77756F] leading-relaxed">
                  {isAdmin
                    ? "Bạn chưa nhập nội dung cho bài học này. Bấm nút bên dưới để dán văn bản, mã HTML hoặc tải file bài giảng lên."
                    : "Quản trị viên hiện chưa nhập nội dung lý thuyết cho bài học này."}
                </p>
              </div>
              {isAdmin && !isEditingContent && (
                <div>
                  <button
                    onClick={handleOpenEditor}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#782F3B] hover:bg-[#642530] text-white text-xs font-bold shadow-sm transition"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>+ Nhập / Tải lên nội dung bài học</span>
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Bottom Action Bar: Bài trước / Kiểm tra sau bài học (Cửa sổ nổi) / Bài tiếp */}
          <footer className="pt-6 border-t border-[#DDD7CC] flex flex-wrap items-center justify-between gap-3 font-sans">
            <div>
              {prevLesson && (
                <button
                  onClick={() =>
                    onSelectLesson && onSelectLesson(prevLesson.id)
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#DDD7CC] bg-white hover:bg-[#F3EFE6] text-xs font-semibold text-[#30312F] transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Bài trước ({prevLesson.code})</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsQuizModalOpen(true)}
                className="px-5 py-2.5 rounded-lg bg-[#782F3B] hover:bg-[#642530] text-white text-xs font-bold shadow-sm transition flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                <span>
                  Kiểm tra sau bài học ({currentLessonQuestions.length} câu)
                </span>
              </button>

              {nextLesson && (
                <button
                  onClick={() =>
                    onSelectLesson && onSelectLesson(nextLesson.id)
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#DDD7CC] bg-white hover:bg-[#F3EFE6] text-xs font-semibold text-[#30312F] transition"
                >
                  <span>Bài tiếp ({nextLesson.code})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </footer>
        </article>

        {/* Right Marginalia Sidebar (3 cols): Ghi chú cá nhân */}
        <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
          <div className="bg-[#FAF7F0] border border-[#DDD7CC] rounded-lg p-4 shadow-editorial space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD7CC]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#30312F] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#782F3B]" />
                Ghi chú cá nhân
              </div>
              <span className="text-[10px] font-mono bg-[#E9E3D5] px-1.5 py-0.5 rounded text-[#565551]">
                {notes.length}
              </span>
            </div>

            {notes.length === 0 ? (
              <p className="text-xs text-[#77756F] italic">
                Chưa có ghi chú nào cho bài học này.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {notes.map((note, index) => (
                  <div
                    key={index}
                    className="p-2.5 bg-[#F3EFE6] border-l-2 border-[#782F3B] rounded-r text-xs text-[#30312F] leading-relaxed"
                  >
                    {note}
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddNote} className="space-y-2 pt-1">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Thêm ghi chú cho bài học..."
                rows={2}
                className="w-full p-2 text-xs bg-white border border-[#DDD7CC] rounded focus:outline-none focus:border-[#782F3B] text-[#30312F] placeholder-[#A3A09A]"
              />
              <button
                type="submit"
                className="w-full py-1.5 bg-[#E9E3D5] hover:bg-[#DDD7CC] text-[#30312F] rounded text-xs font-semibold transition"
              >
                + Lưu ghi chú
              </button>
            </form>
          </div>
        </aside>
      </div>

      {/* CỬA SỔ NỔI: KIỂM TRA SAU BÀI HỌC (POST-LESSON QUIZ MODAL) */}
      <PostLessonQuizModal
        isOpen={isQuizModalOpen}
        lesson={currentLesson || null}
        disciplineName={currentDisciplineName}
        onClose={() => setIsQuizModalOpen(false)}
        onOpenModuleQuestionBank={() => {
          setIsQuizModalOpen(false);
          onNavigate("gate");
        }}
      />
    </div>
  );
}
