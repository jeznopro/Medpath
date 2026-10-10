"use client";

import React, { useState, useEffect } from "react";
import { Chapter, Lesson, MEDPATH_DISCIPLINES } from "@/lib/medpath-data";
import { LessonFormInput, ChapterFormInput } from "@/lib/use-curriculum";
import {
  X,
  Save,
  Plus,
  FileCode,
  Upload,
  Sparkles,
  BookOpen,
  Clock,
  Target,
  FolderPlus,
} from "lucide-react";

interface LessonFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  disciplineId: string;
  chapters: Chapter[];
  defaultChapterId?: string;
  initialLesson?: Lesson | null;
  initialHtmlContent?: string;
  onClose: () => void;
  onSubmit: (disciplineId: string, input: LessonFormInput, lessonId?: string) => void;
}

export function LessonFormModal({
  isOpen,
  mode,
  disciplineId: initialDisciplineId,
  chapters,
  defaultChapterId,
  initialLesson,
  initialHtmlContent = "",
  onClose,
  onSubmit,
}: LessonFormModalProps) {
  const [chapterId, setChapterId] = useState<string>(
    defaultChapterId || initialLesson?.chapterId || chapters[0]?.id || ""
  );
  const [code, setCode] = useState<string>(initialLesson?.code || "");
  const [title, setTitle] = useState<string>(initialLesson?.title || "");
  const [latinTitle, setLatinTitle] = useState<string>(
    initialLesson?.latinTitle || ""
  );
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(
    initialLesson?.estimatedMinutes || 45
  );
  const [questionCount, setQuestionCount] = useState<number>(
    initialLesson?.questionCount || 10
  );
  const [threshold, setThreshold] = useState<number>(
    initialLesson?.threshold || 80
  );
  const [objectivesText, setObjectivesText] = useState<string>(
    initialLesson?.objectives?.join("\n") || ""
  );
  const [clinicalHighlightsText, setClinicalHighlightsText] = useState<string>(
    initialLesson?.clinicalHighlights?.join("\n") || ""
  );
  const [keyTermsText, setKeyTermsText] = useState<string>(
    initialLesson?.keyTerms?.join(", ") || ""
  );
  const [htmlContent, setHtmlContent] = useState<string>(initialHtmlContent);

  useEffect(() => {
    if (!isOpen) return;
    setChapterId(
      initialLesson?.chapterId || defaultChapterId || chapters[0]?.id || ""
    );
    setCode(
      initialLesson?.code ||
        `${initialDisciplineId === "mod-8" ? "K56" : initialDisciplineId === "mod-9" ? "K57" : initialDisciplineId === "mod-10" ? "CM6" : "K55"}.LT${Math.floor(Math.random() * 20 + 16)}`
    );
    setTitle(initialLesson?.title || "");
    setLatinTitle(
      initialLesson?.latinTitle || "Bộ môn chuyên khoa • Lý thuyết (LT)"
    );
    setEstimatedMinutes(initialLesson?.estimatedMinutes || 45);
    setQuestionCount(initialLesson?.questionCount || 10);
    setThreshold(initialLesson?.threshold || 80);
    setObjectivesText(
      initialLesson?.objectives?.join("\n") ||
        "Trình bày được đặc điểm giải phẫu, sinh lý và cơ chế bệnh sinh trọng tâm.\nVận dụng giải thích triệu chứng lâm sàng và cận lâm sàng."
    );
    setClinicalHighlightsText(
      initialLesson?.clinicalHighlights?.join("\n") ||
        "Liên hệ lâm sàng và ứng dụng chẩn đoán điều trị thực tế tại bệnh viện."
    );
    setKeyTermsText(
      initialLesson?.keyTerms?.join(", ") || "Lâm sàng, Giải phẫu, Sinh lý"
    );
    setHtmlContent(initialHtmlContent || "");
  }, [
    isOpen,
    initialLesson,
    defaultChapterId,
    chapters,
    initialDisciplineId,
    initialHtmlContent,
  ]);

  if (!isOpen) return null;

  const currentDiscipline =
    MEDPATH_DISCIPLINES.find((d) => d.id === initialDisciplineId) ||
    MEDPATH_DISCIPLINES[0];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      setHtmlContent(text);
      if (!title.trim()) {
        const cleanName = file.name.replace(/\.(html|htm|md|txt)$/i, "");
        setTitle(cleanName);
      }
    } catch (err) {
      console.error("Failed to read uploaded file:", err);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const objectives = objectivesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const clinicalHighlights = clinicalHighlightsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const keyTerms = keyTermsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    onSubmit(
      initialDisciplineId,
      {
        chapterId: chapterId || chapters[0]?.id || "",
        code: code.trim() || "BAI.01",
        title: title.trim(),
        latinTitle: latinTitle.trim(),
        estimatedMinutes: Number(estimatedMinutes) || 45,
        questionCount: Number(questionCount) || 10,
        threshold: Number(threshold) || 80,
        objectives,
        clinicalHighlights,
        keyTerms,
        htmlContent,
      },
      initialLesson?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#FAF7F0] border-2 border-[#782F3B] rounded-xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 animate-fadeIn">
        {/* Modal Header */}
        <div className="bg-[#782F3B] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
              {mode === "create" ? (
                <Plus className="w-5 h-5 text-amber-200" />
              ) : (
                <FileCode className="w-5 h-5 text-amber-200" />
              )}
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-200 font-bold">
                QUẢN TRỊ CHƯƠNG TRÌNH • {currentDiscipline.name}
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold">
                {mode === "create"
                  ? "Thêm Bài Giảng Mới vào Module"
                  : `Chỉnh sửa Bài Giảng: ${initialLesson?.code || ""}`}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleFormSubmit}
          className="p-6 space-y-5 max-h-[80vh] overflow-y-auto"
        >
          {/* Row 1: Chapter selection & Lesson Code */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#30312F] mb-1.5">
                Thuộc Phần / Chương trong {currentDiscipline.name} *
              </label>
              <select
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD7CC] text-xs sm:text-sm font-semibold text-[#30312F] focus:outline-none focus:border-[#782F3B]"
              >
                {chapters.map((chap) => (
                  <option key={chap.id} value={chap.id}>
                    {chap.romanNumeral}: {chap.title} ({chap.lessons.length} bài)
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#30312F] mb-1.5">
                Mã Bài học (Code) *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="VD: K56.LT12"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD7CC] text-xs sm:text-sm font-mono font-bold text-[#782F3B] focus:outline-none focus:border-[#782F3B]"
              />
            </div>
          </div>

          {/* Row 2: Title & Subtitle/Department */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-7">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#30312F] mb-1.5">
                Tên Bài Giảng (Tiêu đề chính) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: LT12. Chẩn đoán và điều trị suy tim cấp"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD7CC] text-xs sm:text-sm font-bold text-[#30312F] focus:outline-none focus:border-[#782F3B]"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#30312F] mb-1.5">
                Bộ môn phụ trách / Phân loại
              </label>
              <input
                type="text"
                value={latinTitle}
                onChange={(e) => setLatinTitle(e.target.value)}
                placeholder="VD: Bộ môn Nội Tim mạch • Lý thuyết (LT)"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD7CC] text-xs sm:text-sm italic font-serif text-[#565551] focus:outline-none focus:border-[#782F3B]"
              />
            </div>
          </div>

          {/* Row 3: Duration, Questions, Threshold */}
          <div className="grid grid-cols-3 gap-4 bg-[#F3EFE6] p-3.5 rounded-lg border border-[#DDD7CC]">
            <div>
              <label className="block text-[11px] font-bold text-[#565551] mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#B67A36]" />
                Thời lượng đọc (phút)
              </label>
              <input
                type="number"
                min={5}
                max={300}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded bg-white border border-[#DDD7CC] text-xs font-mono font-bold text-[#30312F]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#565551] mb-1 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-[#782F3B]" />
                Số câu hỏi Quiz
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded bg-white border border-[#DDD7CC] text-xs font-mono font-bold text-[#30312F]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#565551] mb-1 flex items-center gap-1">
                <Target className="w-3 h-3 text-[#34745B]" />
                Ngưỡng qua cổng (%)
              </label>
              <input
                type="number"
                min={50}
                max={100}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded bg-white border border-[#DDD7CC] text-xs font-mono font-bold text-[#34745B]"
              />
            </div>
          </div>

          {/* Row 4: HTML / Text Content Input & File Upload */}
          <div className="space-y-2 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#782F3B] flex items-center gap-1.5">
                <FileCode className="w-4 h-4" />
                Nội dung Bài học (HTML / Văn bản / Giáo trình)
              </label>

              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold cursor-pointer shadow-xs transition self-start">
                <Upload className="w-3.5 h-3.5" />
                <span>Tải file .HTML / .MD / .TXT từ máy</span>
                <input
                  type="file"
                  accept=".html,.htm,.md,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              rows={7}
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              placeholder="Dán mã HTML (<h2>, <p>, <table>, <ul>...) hoặc nội dung văn bản bài giảng vào đây. Bạn cũng có thể để trống và nhập sau trong Focus Reader..."
              className="w-full p-3.5 rounded-lg bg-white border border-[#DDD7CC] font-mono text-xs text-[#30312F] leading-relaxed focus:outline-none focus:border-[#782F3B]"
            />
            <p className="text-[11px] text-[#77756F]">
              Mẹo: Khi học viên hoặc bạn bấm <strong>&ldquo;Đọc bài&rdquo;</strong>, nội dung HTML/văn bản này sẽ được hiển thị trực tiếp trong giao diện <strong>Focus Reader</strong>.
            </p>
          </div>

          {/* Row 5: Objectives & Clinical Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#30312F] mb-1">
                Mục tiêu học tập (Mỗi dòng 1 mục tiêu)
              </label>
              <textarea
                rows={3}
                value={objectivesText}
                onChange={(e) => setObjectivesText(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white border border-[#DDD7CC] text-xs text-[#30312F] focus:outline-none focus:border-[#782F3B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#30312F] mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#B67A36]" />
                Điểm nhấn lâm sàng (Mỗi dòng 1 ý)
              </label>
              <textarea
                rows={3}
                value={clinicalHighlightsText}
                onChange={(e) => setClinicalHighlightsText(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white border border-[#DDD7CC] text-xs text-[#30312F] focus:outline-none focus:border-[#782F3B]"
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-[#DDD7CC] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-[#E9E3D5] hover:bg-[#DDD7CC] text-[#30312F] text-xs font-semibold transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#782F3B] hover:bg-[#642530] text-white text-xs font-bold shadow-editorial transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>
                {mode === "create" ? "Thêm Bài Học vào Module" : "Lưu Thay Đổi Bài Học"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ChapterFormModalProps {
  isOpen: boolean;
  disciplineId: string;
  nextIndex: number;
  onClose: () => void;
  onSubmit: (disciplineId: string, input: ChapterFormInput) => void;
}

export function ChapterFormModal({
  isOpen,
  disciplineId,
  nextIndex,
  onClose,
  onSubmit,
}: ChapterFormModalProps) {
  const [romanNumeral, setRomanNumeral] = useState(`PHẦN ${nextIndex}`);
  const [title, setTitle] = useState("");
  const [latinTitle, setLatinTitle] = useState("Chuyên đề tích hợp lâm sàng");

  useEffect(() => {
    if (isOpen) {
      setRomanNumeral(`PHẦN ${nextIndex}`);
      setTitle("");
      setLatinTitle("Chuyên đề tích hợp lâm sàng");
    }
  }, [isOpen, nextIndex]);

  if (!isOpen) return null;

  const currentDiscipline =
    MEDPATH_DISCIPLINES.find((d) => d.id === disciplineId) ||
    MEDPATH_DISCIPLINES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(disciplineId, {
      romanNumeral: romanNumeral.trim() || `PHẦN ${nextIndex}`,
      title: title.trim(),
      latinTitle: latinTitle.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-[#FAF7F0] border-2 border-[#782F3B] rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-fadeIn">
        <div className="bg-[#782F3B] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FolderPlus className="w-5 h-5 text-amber-200" />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-200 font-bold">
                {currentDiscipline.name}
              </div>
              <h3 className="font-serif text-lg font-bold">
                Thêm Phần / Chương Mới
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#30312F] mb-1">
              Ký hiệu Phần / Chương *
            </label>
            <input
              type="text"
              required
              value={romanNumeral}
              onChange={(e) => setRomanNumeral(e.target.value)}
              placeholder="VD: PHẦN V"
              className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#DDD7CC] text-xs font-mono font-bold text-[#782F3B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#30312F] mb-1">
              Tên Phần / Chuyên đề *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Chuyên đề Ca lâm sàng & Thảo luận nhóm"
              className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#DDD7CC] text-xs sm:text-sm font-bold text-[#30312F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#30312F] mb-1">
              Mô tả phụ / Thuật ngữ
            </label>
            <input
              type="text"
              value={latinTitle}
              onChange={(e) => setLatinTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#DDD7CC] text-xs italic font-serif text-[#565551]"
            />
          </div>

          <div className="pt-3 border-t border-[#DDD7CC] flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#E9E3D5] text-[#30312F] text-xs font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#782F3B] hover:bg-[#642530] text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Phần Mới</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
