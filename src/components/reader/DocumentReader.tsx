"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  HelpCircle,
  Highlighter,
  List,
  Lock,
  MessageSquare,
  Moon,
  Search,
  SkipForward,
  Sparkles,
  Sun,
  Trash2,
  Type,
  X,
} from "lucide-react";
import { Highlight, HighlightColor, Section, SectionProgress } from "@/lib/types";

interface DocumentReaderProps {
  section: Section;
  progress: SectionProgress;
  lessonTitle: string;
  subjectTitle: string;
  siblingSections: {
    id: string;
    title: string;
    order: number;
    status: string;
    best_score: number;
  }[];
  userId: string;
}

export function DocumentReader({
  section,
  progress,
  lessonTitle,
  subjectTitle,
  siblingSections,
  userId,
}: DocumentReaderProps) {
  const router = useRouter();
  const [fontSize, setFontSize] = useState<number>(17); // px
  const [themeMode, setThemeMode] = useState<"light" | "sepia" | "dark">("light");
  const [tocOpen, setTocOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<"toc" | "highlights">("toc");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [skipping, setSkipping] = useState(false);

  // In-document Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMatches, setSearchMatches] = useState<number>(0);
  const [searchOpen, setSearchOpen] = useState(false);

  // Highlighting & Note State
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectedText, setSelectedText] = useState("");
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [chosenColor, setChosenColor] = useState<HighlightColor>("yellow");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const readerContainerRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Tải danh sách highlight của học viên trong mục này
  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await fetch(`/api/highlights?userId=${userId}&sectionId=${section.id}`);
        const data = await res.json();
        if (data.highlights) {
          setHighlights(data.highlights);
        }
      } catch (err) {
        console.error("Lỗi khi tải highlights:", err);
      }
    };
    fetchHighlights();
  }, [section.id, userId]);

  // Lắng nghe thao tác bôi đen (Text selection) để hiện popup highlight
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setPopoverPos(null);
        return;
      }

      const text = selection.toString().trim();
      if (text.length < 2) {
        setPopoverPos(null);
        return;
      }

      // Đảm bảo selection nằm trong vùng tài liệu
      if (!contentRef.current || !contentRef.current.contains(selection.anchorNode)) {
        setPopoverPos(null);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = readerContainerRef.current?.getBoundingClientRect() || { top: 0, left: 0 };

      setSelectedText(text);
      setPopoverPos({
        top: rect.top - containerRect.top - 48,
        left: Math.max(10, rect.left - containerRect.left + rect.width / 2 - 130),
      });
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  // Lưu Highlight mới
  const handleSaveHighlight = async (color: HighlightColor, note?: string) => {
    if (!selectedText) return;
    try {
      const res = await fetch("/api/highlights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          section_id: section.id,
          color,
          text: selectedText,
          note: note || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.highlight) {
        setHighlights((prev) => [data.highlight, ...prev]);
        showToast("Đã lưu highlight thành công!");
      }
    } catch {
      showToast("Lỗi khi lưu highlight");
    } finally {
      setPopoverPos(null);
      setNoteModalOpen(false);
      setNoteContent("");
      window.getSelection()?.removeAllRanges();
    }
  };

  // Biến đoạn đã chọn thành Flashcard Spaced Repetition
  const handleCreateFlashcard = async () => {
    if (!selectedText) return;
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_from_highlight",
          userId,
          sectionId: section.id,
          highlightText: selectedText,
          note: noteContent || "Trích đoạn ghi nhớ từ tài liệu",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Đã tạo Flashcard và đưa vào hàng đợi Ôn hôm nay!");
      }
    } catch {
      showToast("Lỗi khi tạo flashcard");
    } finally {
      setPopoverPos(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  // Xóa highlight
  const handleDeleteHighlight = async (id: string) => {
    try {
      const res = await fetch(`/api/highlights?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setHighlights((prev) => prev.filter((h) => h.id !== id));
        showToast("Đã xóa highlight");
      }
    } catch {
      showToast("Lỗi khi xóa highlight");
    }
  };

  // Theo dõi vị trí cuộn trang để lưu tiến độ
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const el = contentRef.current;
      const totalHeight = el.scrollHeight - el.clientHeight;
      if (totalHeight <= 0) {
        setScrollProgress(100);
        return;
      }
      const currentScroll = el.scrollTop;
      const pct = Math.min(100, Math.round((currentScroll / totalHeight) * 100));
      setScrollProgress(pct);

      localStorage.setItem(`medread_pos_${userId}_${section.id}`, currentScroll.toString());
    };

    const el = contentRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      const savedPos = localStorage.getItem(`medread_pos_${userId}_${section.id}`);
      if (savedPos) {
        el.scrollTop = parseInt(savedPos, 10);
      }
    }

    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [section.id, userId]);

  // Cuộn đến anchor nếu URL có hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && contentRef.current) {
      const anchorId = hash.replace("#", "");
      setTimeout(() => {
        const target = document.getElementById(anchorId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          target.classList.add("bg-yellow-200/60", "dark:bg-yellow-900/40", "p-2", "rounded", "transition");
        }
      }, 300);
    }
  }, []);

  // Xử lý tìm kiếm trong tài liệu
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim() || !contentRef.current) {
      setSearchMatches(0);
      return;
    }

    const textContent = contentRef.current.innerText.toLowerCase();
    const qLower = query.toLowerCase();
    let count = 0;
    let pos = textContent.indexOf(qLower);
    while (pos !== -1) {
      count++;
      pos = textContent.indexOf(qLower, pos + 1);
    }
    setSearchMatches(count);
  };

  const handleSkipWeak = async () => {
    if (
      !confirm(
        "Bạn có chắc muốn Bỏ qua tạm thời mục này? Mục sẽ được đánh dấu 'Chưa vững' và mở khóa mục tiếp theo."
      )
    ) {
      return;
    }
    setSkipping(true);
    try {
      const res = await fetch("/api/curriculum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "skip_weak",
          userId,
          sectionId: section.id,
        }),
      });
      const data = await res.json();
      if (data.success && data.nextSectionId) {
        router.push(
          `/classes/${section.lesson_id}/subjects/sub/lessons/${section.lesson_id}/sections/${data.nextSectionId}/read`
        );
      } else {
        router.refresh();
      }
    } catch {
      alert("Lỗi khi bỏ qua tạm");
    } finally {
      setSkipping(false);
    }
  };

  const isPassed = progress.status === "passed";
  const isWeak = progress.status === "skipped_weak";
  const tocItems = extractHeadings(section.content_url_or_text, section.content_type);

  return (
    <div
      ref={readerContainerRef}
      className={`flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden relative ${
        themeMode === "sepia"
          ? "reading-sepia"
          : themeMode === "dark"
          ? "dark bg-slate-900 text-slate-100"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Toast Alert */}
      {toastMsg && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-teal-800 text-white text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Floating Highlight & Flashcard Toolbar */}
      {popoverPos && (
        <div
          style={{ top: `${popoverPos.top}px`, left: `${popoverPos.left}px` }}
          className="absolute z-50 bg-slate-900 text-white rounded-xl shadow-2xl p-1.5 flex items-center gap-1.5 border border-slate-700 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Color buttons */}
          <div className="flex items-center gap-1 pr-1.5 border-r border-slate-700">
            <button
              onClick={() => handleSaveHighlight("yellow")}
              className="w-6 h-6 rounded-full bg-yellow-300 hover:scale-110 transition shadow"
              title="Highlight Vàng"
            />
            <button
              onClick={() => handleSaveHighlight("green")}
              className="w-6 h-6 rounded-full bg-emerald-300 hover:scale-110 transition shadow"
              title="Highlight Xanh lá"
            />
            <button
              onClick={() => handleSaveHighlight("pink")}
              className="w-6 h-6 rounded-full bg-pink-300 hover:scale-110 transition shadow"
              title="Highlight Hồng"
            />
            <button
              onClick={() => handleSaveHighlight("orange")}
              className="w-6 h-6 rounded-full bg-amber-400 hover:scale-110 transition shadow"
              title="Highlight Cam"
            />
          </div>

          {/* Note button */}
          <button
            onClick={() => {
              setChosenColor("yellow");
              setNoteModalOpen(true);
            }}
            className="px-2 py-1 text-xs text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-1 transition"
            title="Thêm ghi chú vào đoạn này"
          >
            <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Ghi chú</span>
          </button>

          {/* Flashcard button */}
          <button
            onClick={handleCreateFlashcard}
            className="px-2 py-1 text-xs text-amber-300 hover:text-amber-200 hover:bg-slate-800 rounded-lg flex items-center gap-1 transition"
            title="Biến thành Flashcard ôn tập theo khoảng cách"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Tạo Flashcard</span>
          </button>

          <button
            onClick={() => setPopoverPos(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Note Modal */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Highlighter className="w-4 h-4 text-teal-600" />
              Thêm ghi chú cho đoạn đã chọn
            </h3>
            <p className="text-xs text-slate-500 mb-3 italic line-clamp-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
              "{selectedText}"
            </p>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-slate-500">Màu highlight:</span>
              <button
                type="button"
                onClick={() => setChosenColor("yellow")}
                className={`w-6 h-6 rounded-full bg-yellow-300 ${chosenColor === "yellow" ? "ring-2 ring-teal-600 ring-offset-2" : ""}`}
              />
              <button
                type="button"
                onClick={() => setChosenColor("green")}
                className={`w-6 h-6 rounded-full bg-emerald-300 ${chosenColor === "green" ? "ring-2 ring-teal-600 ring-offset-2" : ""}`}
              />
              <button
                type="button"
                onClick={() => setChosenColor("pink")}
                className={`w-6 h-6 rounded-full bg-pink-300 ${chosenColor === "pink" ? "ring-2 ring-teal-600 ring-offset-2" : ""}`}
              />
              <button
                type="button"
                onClick={() => setChosenColor("orange")}
                className={`w-6 h-6 rounded-full bg-amber-400 ${chosenColor === "orange" ? "ring-2 ring-teal-600 ring-offset-2" : ""}`}
              />
            </div>

            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Nhập ghi chú cá nhân, câu hỏi thắc mắc hoặc gợi ý lâm sàng..."
              rows={4}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 outline-none mb-4"
              autoFocus
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setNoteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleSaveHighlight(chosenColor, noteContent)}
                className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition"
              >
                Lưu ghi chú
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Breadcrumb & Reading Toolbar */}
      <div className="bg-white/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 px-4 py-2 flex items-center justify-between text-sm shrink-0">
        <div className="flex items-center gap-2 truncate">
          <Link
            href="/classes"
            className="text-slate-500 hover:text-teal-600 flex items-center gap-1 shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Môn học</span>
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-500 truncate hidden md:inline">{lessonTitle}</span>
          <span className="text-slate-400 hidden md:inline">/</span>
          <span className="font-semibold text-teal-800 dark:text-teal-300 truncate">
            {section.title}
          </span>
          {isPassed && (
            <span className="shrink-0 flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Đã qua cổng ({progress.best_score}%)
            </span>
          )}
          {isWeak && (
            <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              Chưa vững (Bỏ qua tạm)
            </span>
          )}
        </div>

        {/* Reader Customization Controls */}
        <div className="flex items-center gap-2">
          {/* In-Document Search Toggle */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg px-2 py-1 border border-teal-300">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Tìm trong bài..."
                  className="bg-transparent text-xs outline-none w-28 sm:w-36 text-slate-800 dark:text-slate-200"
                  autoFocus
                />
                {searchQuery && (
                  <span className="text-[10px] text-teal-700 font-bold px-1">
                    {searchMatches}
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchMatches(0);
                    setSearchOpen(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-teal-600 text-xs flex items-center gap-1"
                title="Tìm kiếm văn bản trong bài đọc"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Tìm</span>
              </button>
            )}
          </div>

          {/* Font Size */}
          <div className="hidden sm:flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-900 text-xs">
            <button
              onClick={() => setFontSize(Math.max(14, fontSize - 1))}
              className="px-2 py-1 text-slate-600 dark:text-slate-300 hover:text-teal-600"
              title="Giảm kích thước chữ"
            >
              A-
            </button>
            <span className="px-1 text-slate-400 font-mono">{fontSize}</span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 1))}
              className="px-2 py-1 text-slate-600 dark:text-slate-300 hover:text-teal-600"
              title="Tăng kích thước chữ"
            >
              A+
            </button>
          </div>

          {/* Theme Switcher */}
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-900 text-xs">
            <button
              onClick={() => setThemeMode("light")}
              className={`p-1.5 rounded ${
                themeMode === "light"
                  ? "bg-white text-teal-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Chế độ sáng"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setThemeMode("sepia")}
              className={`p-1.5 rounded ${
                themeMode === "sepia"
                  ? "bg-amber-100 text-amber-900 shadow-sm"
                  : "text-slate-500 hover:text-amber-800"
              }`}
              title="Chế độ đọc dịu mắt (Sepia)"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setThemeMode("dark")}
              className={`p-1.5 rounded ${
                themeMode === "dark"
                  ? "bg-slate-700 text-teal-300 shadow-sm"
                  : "text-slate-500 hover:text-slate-200"
              }`}
              title="Chế độ tối"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle TOC / Sidebar button */}
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 ${
              tocOpen
                ? "bg-teal-50 dark:bg-slate-700 border-teal-300 text-teal-800 dark:text-teal-200"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            }`}
            title="Bật/tắt thanh công cụ bên cạnh"
          >
            <List className="w-4 h-4" />
            <span className="hidden md:inline">Mục lục & Ghi chú</span>
          </button>
        </div>
      </div>

      {/* Main Body: Sidebar + Document Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar (TOC & Highlights) */}
        {tocOpen && (
          <aside className="w-64 sm:w-72 bg-white/95 dark:bg-slate-800/95 border-r border-slate-200 dark:border-slate-700 overflow-y-auto shrink-0 p-4 transition-all flex flex-col">
            {/* Sidebar Tab Switcher */}
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-900 p-1 mb-4 text-xs font-semibold">
              <button
                onClick={() => setSidebarTab("toc")}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  sidebarTab === "toc"
                    ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Mục lục bài
              </button>
              <button
                onClick={() => setSidebarTab("highlights")}
                className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1 ${
                  sidebarTab === "highlights"
                    ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <span>Ghi chú</span>
                {highlights.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-teal-600 text-white text-[10px]">
                    {highlights.length}
                  </span>
                )}
              </button>
            </div>

            {/* TAB 1: MỤC LỤC */}
            {sidebarTab === "toc" && (
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Các mục trong bài
                  </span>
                  <span className="text-xs text-teal-600 font-semibold">
                    Đã đọc: {scrollProgress}%
                  </span>
                </div>

                <div className="space-y-1.5 mb-6">
                  {siblingSections.map((sec) => {
                    const isActive = sec.id === section.id;
                    const isSecPassed = sec.status === "passed";
                    const isSecLocked = sec.status === "locked";
                    return (
                      <Link
                        key={sec.id}
                        href={
                          isSecLocked
                            ? "#"
                            : `/classes/view/subjects/sub/lessons/${section.lesson_id}/sections/${sec.id}/read`
                        }
                        className={`block px-3 py-2 rounded-lg text-xs font-medium transition ${
                          isActive
                            ? "bg-teal-600 text-white shadow-sm"
                            : isSecLocked
                            ? "text-slate-400 dark:text-slate-600 cursor-not-allowed bg-slate-50/50 dark:bg-slate-900/30"
                            : "text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{sec.title}</span>
                          {isSecPassed ? (
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isActive ? "text-white" : "text-emerald-500"
                              }`}
                            />
                          ) : isSecLocked ? (
                            <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          ) : null}
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Quick in-page anchors */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Các phần trong mục ({tocItems.length})
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    {tocItems.map((item, idx) => (
                      <li key={idx}>
                        <a
                          href={`#${item.anchor}`}
                          className="hover:text-teal-600 block py-1 truncate transition"
                        >
                          • {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 2: HIGHLIGHTS & GHI CHÚ */}
            {sidebarTab === "highlights" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Highlight ({highlights.length})
                  </span>
                  <Link
                    href="/highlights"
                    className="text-[11px] text-teal-600 hover:underline"
                  >
                    Xem tất cả &rarr;
                  </Link>
                </div>

                {highlights.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    <Highlighter className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    Chưa có highlight nào. Hãy bôi đen bất kỳ đoạn văn nào trong bài để highlight hoặc ghi chú!
                  </div>
                ) : (
                  highlights.map((hl) => (
                    <div
                      key={hl.id}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            hl.color === "green"
                              ? "bg-emerald-400"
                              : hl.color === "pink"
                              ? "bg-pink-400"
                              : hl.color === "orange"
                              ? "bg-amber-400"
                              : "bg-yellow-300"
                          }`}
                        />
                        <button
                          onClick={() => handleDeleteHighlight(hl.id)}
                          className="text-slate-400 hover:text-red-600 p-1"
                          title="Xóa highlight"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-medium text-slate-800 dark:text-slate-200 italic line-clamp-3">
                        "{hl.text}"
                      </p>
                      {hl.note && (
                        <div className="bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 p-2 rounded-lg text-[11px]">
                          <strong>Ghi chú:</strong> {hl.note}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </aside>
        )}

        {/* Center: Document Text Reader Container */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-16 py-8 pb-32 doc-container select-text"
          style={{ fontSize: `${fontSize}px` }}
        >
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700">
            {/* Header info badge */}
            <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Mục {section.is_core ? "Cốt lõi (Ngưỡng đạt 80%)" : "Phụ (Ngưỡng 60%)"}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 uppercase font-bold text-[10px]">
                {section.content_type === "html"
                  ? "Sách / Tài liệu HTML"
                  : section.content_type === "pdf"
                  ? "Tài liệu PDF"
                  : "Tài liệu Markdown"}
              </span>
              <span className="text-xs text-slate-500">
                {section.questions_per_attempt} câu/lần làm
              </span>
            </div>

            {/* Document Content Rendered */}
            <div
              className={section.content_type === "html" ? "html-book-body" : "markdown-body"}
              dangerouslySetInnerHTML={{
                __html:
                  section.content_type === "html"
                    ? section.content_url_or_text
                    : renderMarkdownToHtml(section.content_url_or_text),
              }}
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar: Mastery Gate Action */}
      <div className="sticky bottom-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-teal-100 dark:border-slate-800 py-3 px-4 sm:px-8 shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Progress hint */}
          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
              <span>
                Tiến độ đọc: <strong>{scrollProgress}%</strong>
              </span>
            </div>
            {isPassed ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Đã mở khóa mục kế
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400">
                Cần đạt ≥ {section.pass_threshold}% để qua môn
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!isPassed && (
              <button
                onClick={handleSkipWeak}
                disabled={skipping}
                className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700"
                title="Cho phép xem mục kế tiếp mà chưa qua cổng, nhưng mục bị bỏ qua được đánh dấu 'chưa vững'"
              >
                <SkipForward className="w-3.5 h-3.5 text-amber-500" />
                Bỏ qua tạm
              </button>
            )}

            <Link
              href={`/classes/view/subjects/sub/lessons/${section.lesson_id}/sections/${section.id}/quiz`}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-teal-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>{isPassed ? "Làm lại bài kiểm tra" : "Làm bài kiểm tra mục này"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hàm chuyển đổi Markdown cơ bản sang HTML an toàn
function renderMarkdownToHtml(markdown: string): string {
  if (!markdown) return "";

  let html = markdown
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/\$(.*?)\$/gim, "<span class='font-mono text-teal-800 dark:text-teal-300 font-semibold'>$1</span>")
    .replace(/^\s*-\s+(.*$)/gim, "<li>$1</li>")
    .replace(/^\s*\d+\.\s+(.*$)/gim, "<li>$1</li>")
    .replace(/\n\n+/g, "</p><p>")
    .replace(/<p><\/p>/g, "");

  html = html.replace(/(<li>[\s\S]*?<\/li>)/gm, "<ul>$1</ul>");

  return `<p>${html}</p>`;
}

function extractHeadings(
  content: string,
  type: string
): { title: string; anchor: string }[] {
  const headings: { title: string; anchor: string }[] = [];
  if (type === "html") {
    const regex = /<h([1-3])[^>]*?(?:id=["'](.*?)["'])?[^>]*>(.*?)<\/h\1>/gi;
    let match;
    let autoIndex = 1;
    while ((match = regex.exec(content)) !== null) {
      const anchor = match[2] || `heading-${autoIndex++}`;
      const title = match[3].replace(/<[^>]+>/g, "").trim();
      if (title) headings.push({ title, anchor });
    }
  } else {
    const regex = /^(#{1,3})\s+(.*$)/gm;
    let match;
    let autoIndex = 1;
    while ((match = regex.exec(content)) !== null) {
      const title = match[2].trim();
      const anchor = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      headings.push({ title, anchor });
    }
  }

  return headings.length > 0
    ? headings
    : [
        { title: "1. Đại cương nội dung", anchor: "phan-1" },
        { title: "2. Chi tiết bài học", anchor: "phan-2" },
      ];
}
