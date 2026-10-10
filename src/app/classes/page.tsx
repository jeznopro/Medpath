"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileCode,
  FileText,
  GraduationCap,
  Layers,
  Lock,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { ClassItem, Lesson, Section, SectionContentType, SectionProgress, Subject } from "@/lib/types";

interface CurriculumData {
  class: ClassItem;
  curriculum: (Subject & {
    lessons: (Lesson & {
      sections: Section[];
    })[];
  })[];
}

export default function ClassesPage() {
  const { currentUser, isTeacher, isAdmin } = useAuth();
  const [data, setData] = useState<CurriculumData | null>(null);
  const [progressList, setProgressList] = useState<Record<string, SectionProgress>>({});
  const [loading, setLoading] = useState(true);

  // Modal State: Tạo Bài học mới
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [isSubmittingLesson, setIsSubmittingLesson] = useState(false);

  // Modal State: Thêm Mục / Nhập sách HTML
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newContentType, setNewContentType] = useState<SectionContentType>("html");
  const [newContentText, setNewContentText] = useState("");
  const [newPassThreshold, setNewPassThreshold] = useState(80);
  const [newQuestionsCount, setNewQuestionsCount] = useState(10);
  const [newIsCore, setNewIsCore] = useState(true);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isSubmittingSection, setIsSubmittingSection] = useState(false);

  const [notification, setNotification] = useState<string | null>(null);

  const fetchCurriculum = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/classes?classId=class-anat-1&userId=${currentUser.id}`);
      const json = await res.json();
      setData(json);

      if (json.curriculum && json.curriculum.length > 0) {
        setSelectedSubjectId(json.curriculum[0].id);
        const progMap: Record<string, SectionProgress> = {};
        for (const sub of json.curriculum) {
          for (const les of sub.lessons) {
            for (const sec of les.sections) {
              const secRes = await fetch(
                `/api/curriculum?sectionId=${sec.id}&userId=${currentUser.id}`
              );
              const secJson = await secRes.json();
              if (secJson.progress) {
                progMap[sec.id] = secJson.progress;
              }
            }
          }
        }
        setProgressList(progMap);
      }
    } catch (err) {
      console.error("Lỗi tải giáo trình:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculum();
  }, [currentUser?.id]);

  // Xử lý Tạo Bài học mới
  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim() || !selectedSubjectId) return;

    setIsSubmittingLesson(true);
    try {
      const res = await fetch("/api/curriculum/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_lesson",
          subject_id: selectedSubjectId,
          title: newLessonTitle.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotification(`Đã tạo thành công bài học mới: "${newLessonTitle}"!`);
        setTimeout(() => setNotification(null), 3000);
        setShowAddLessonModal(false);
        setNewLessonTitle("");
        fetchCurriculum();
      } else {
        alert(data.error || "Không thể tạo bài học");
      }
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setIsSubmittingLesson(false);
    }
  };

  // Xử lý Xóa Bài học
  const handleDeleteLesson = async (lessonId: string, title: string) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa bài học "${title}"? Tất cả các mục và câu hỏi bên trong sẽ bị xóa.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch("/api/curriculum/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_lesson",
          lesson_id: lessonId,
        }),
      });
      if (res.ok) {
        setNotification(`Đã xóa bài học "${title}"`);
        setTimeout(() => setNotification(null), 3000);
        fetchCurriculum();
      }
    } catch (err: any) {
      alert("Lỗi khi xóa bài học: " + err.message);
    }
  };

  // Xử lý Đọc file HTML / Markdown từ máy
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    if (!newSectionTitle) {
      // Tự động lấy tên file làm tiêu đề
      setNewSectionTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
    }

    const isHtml = file.name.endsWith(".html") || file.name.endsWith(".htm");
    const isMd = file.name.endsWith(".md") || file.name.endsWith(".markdown");

    if (isHtml) setNewContentType("html");
    if (isMd) setNewContentType("markdown");

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setNewContentText(content);
    };
    reader.readAsText(file);
  };

  // Xử lý Thêm Mục mới (Hỗ trợ sách HTML)
  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim() || !selectedLessonId) return;

    setIsSubmittingSection(true);
    try {
      const res = await fetch("/api/curriculum/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_section",
          lesson_id: selectedLessonId,
          title: newSectionTitle.trim(),
          content_type: newContentType,
          content_url_or_text: newContentText.trim() || "<p>Nội dung bài giảng đang cập nhật...</p>",
          pass_threshold: newPassThreshold,
          questions_per_attempt: newQuestionsCount,
          is_core: newIsCore,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setNotification(`Đã thêm thành công mục/sách HTML: "${newSectionTitle}"!`);
        setTimeout(() => setNotification(null), 3000);
        setShowAddSectionModal(false);
        setNewSectionTitle("");
        setNewContentText("");
        setUploadedFileName(null);
        fetchCurriculum();
      } else {
        alert(data.error || "Không thể thêm mục");
      }
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setIsSubmittingSection(false);
    }
  };

  // Xử lý Xóa Mục
  const handleDeleteSection = async (sectionId: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa mục "${title}"?`)) return;

    try {
      const res = await fetch("/api/curriculum/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_section",
          section_id: sectionId,
        }),
      });
      if (res.ok) {
        setNotification(`Đã xóa mục "${title}"`);
        setTimeout(() => setNotification(null), 3000);
        fetchCurriculum();
      }
    } catch (err: any) {
      alert("Lỗi khi xóa mục: " + err.message);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center text-slate-500 flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <span className="font-medium text-sm">Đang tải giáo trình y khoa...</span>
        </div>
      </div>
    );
  }

  const { class: cls, curriculum } = data;
  const canManage = isTeacher || isAdmin;

  // Tính tổng tiến độ hoàn thành của học viên
  const allSections = curriculum.flatMap((s) => s.lessons.flatMap((l) => l.sections));
  const passedCount = allSections.filter((sec) => progressList[sec.id]?.status === "passed").length;
  const overallProgressPct = allSections.length > 0 ? Math.round((passedCount / allSections.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Thông báo thao tác */}
      {notification && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm flex items-center gap-2 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Modern Medical Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl mb-10 border border-teal-700/50">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30 text-xs font-bold uppercase tracking-wider">
                Khóa học Giải Phẫu Y1
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-mono font-bold">
                MÃ VÀO LỚP: {cls.join_code}
              </span>
              {canManage && (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Chế độ Quản lý bài
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
              {cls.name}
            </h1>
            <p className="text-teal-100/90 text-sm sm:text-base leading-relaxed mb-6">
              {cls.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-teal-200/80">
              <span>Giảng viên: <strong className="text-white">{cls.owner_name}</strong></span>
              <span>•</span>
              <span>Học viên: <strong className="text-white">{currentUser?.full_name || "Chưa đăng nhập"}</strong></span>
            </div>
          </div>

          {/* Radial Progress Metric Box */}
          <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-white/15 shrink-0 flex items-center gap-5">
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${overallProgressPct}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl sm:text-2xl font-black text-white">{overallProgressPct}%</span>
              </div>
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-teal-200 tracking-wider">Tiến độ vượt cổng</div>
              <div className="text-sm font-semibold text-white mt-0.5">
                Đã đạt {passedCount} / {allSections.length} mục
              </div>
              <div className="text-[11px] text-teal-200/70 mt-1">Chuẩn Mastery Learning</div>
            </div>
          </div>
        </div>

        {/* Decorative blur */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Curriculum Toolbar: Thêm Bài & Quản Lý */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-teal-600" />
            <span>Lộ Trình Bài Học & Sách Điện Tử</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Học viên cần đạt điểm chuẩn của từng mục để mở khóa mục tiếp theo.
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (curriculum.length > 0) setSelectedSubjectId(curriculum[0].id);
                setShowAddLessonModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-teal-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Bài học mới</span>
            </button>
          </div>
        )}
      </div>

      {/* Curriculum Tree */}
      <div className="space-y-8">
        {curriculum.map((subject) => (
          <div key={subject.id} className="space-y-6">
            {/* Subject Title */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-3 py-1 rounded-lg border border-teal-200 dark:border-teal-800">
                {subject.title}
              </span>
            </div>

            {/* Lessons List */}
            <div className="space-y-6">
              {subject.lessons.map((lesson, lessonIndex) => (
                <div
                  key={lesson.id}
                  className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
                >
                  {/* Lesson Header */}
                  <div className="p-5 sm:p-6 bg-slate-50/80 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {lessonIndex + 1}
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                          {lesson.title}
                        </h3>
                        <div className="text-xs text-slate-400 font-medium">
                          {lesson.sections.length} mục / chương
                        </div>
                      </div>
                    </div>

                    {/* Lesson Actions for Teacher/Admin */}
                    {canManage && (
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => {
                            setSelectedLessonId(lesson.id);
                            setShowAddSectionModal(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 text-xs font-bold transition flex items-center gap-1"
                          title="Thêm mục hoặc chèn sách dạng HTML"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm mục / Sách HTML</span>
                        </button>

                        <button
                          onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                          title="Xóa bài học này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Sections Cards Grid */}
                  <div className="p-5 sm:p-6">
                    {lesson.sections.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs sm:text-sm">
                        Bài học này chưa có mục nào. Hãy bấm "Thêm mục / Sách HTML" ở trên để bổ sung tài liệu!
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {lesson.sections.map((section) => {
                          const prog = progressList[section.id] || {
                            status: "locked",
                            best_score: 0,
                          };
                          const isPassed = prog.status === "passed";
                          const isUnlocked = prog.status === "unlocked";
                          const isWeak = prog.status === "skipped_weak";
                          const isLocked = prog.status === "locked";

                          return (
                            <div
                              key={section.id}
                              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between group ${
                                isPassed
                                  ? "bg-gradient-to-br from-emerald-50/60 to-white dark:from-emerald-950/30 dark:to-slate-800 border-emerald-300 dark:border-emerald-800/80 shadow-sm"
                                  : isUnlocked
                                  ? "bg-white dark:bg-slate-800 border-teal-300 dark:border-teal-700 shadow-sm hover:shadow-md hover:border-teal-500"
                                  : isWeak
                                  ? "bg-gradient-to-br from-amber-50/60 to-white dark:from-amber-950/30 dark:to-slate-800 border-amber-300 dark:border-amber-800"
                                  : "bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60"
                              }`}
                            >
                              <div>
                                {/* Status & Format Badges */}
                                <div className="flex items-center justify-between gap-2 mb-3">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                      Ngưỡng {section.pass_threshold}%
                                    </span>
                                    {section.content_type === "html" && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                                        <FileCode className="w-3 h-3" /> Sách HTML
                                      </span>
                                    )}
                                  </div>

                                  {isPassed && (
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      Đã đạt ({prog.best_score}%)
                                    </span>
                                  )}
                                  {isUnlocked && (
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300">
                                      Đang học
                                    </span>
                                  )}
                                  {isWeak && (
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                                      Chưa vững
                                    </span>
                                  )}
                                  {isLocked && (
                                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center gap-1">
                                      <Lock className="w-3 h-3" /> Đang khóa
                                    </span>
                                  )}
                                </div>

                                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-2 leading-snug">
                                  {section.title}
                                </h4>
                              </div>

                              {/* Action Footer */}
                              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                                {isLocked ? (
                                  <div className="text-xs text-slate-400 italic flex items-center gap-1">
                                    <Lock className="w-3.5 h-3.5" />
                                    Đạt mục trước để mở
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Link
                                      href={`/sections/${section.id}/read`}
                                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-teal-600 hover:border-teal-300 transition flex items-center gap-1"
                                    >
                                      <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                                      <span>Đọc tài liệu</span>
                                    </Link>

                                    <Link
                                      href={`/sections/${section.id}/quiz`}
                                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm ${
                                        isPassed
                                          ? "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                                          : "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20"
                                      }`}
                                    >
                                      <span>{isPassed ? "Làm lại quiz" : "Vượt cổng"}</span>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                  </div>
                                )}

                                {/* Delete Section for Teacher */}
                                {canManage && (
                                  <button
                                    onClick={() => handleDeleteSection(section.id, section.title)}
                                    className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg transition"
                                    title="Xóa mục này"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* =================================================================== */}
      {/* MODAL: TẠO BÀI HỌC MỚI (Create Lesson) */}
      {/* =================================================================== */}
      {showAddLessonModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Tạo Bài Học Mới
              </h3>
              <button
                onClick={() => setShowAddLessonModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Tiêu đề Bài học:
                </label>
                <input
                  type="text"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  placeholder="VD: Bài 3: Giải phẫu Hệ Tim Mạch và Lồng Ngực"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddLessonModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLesson}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {isSubmittingLesson ? "Đang tạo..." : "Tạo bài học"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: THÊM MỤC / NHẬP SÁCH DẠNG HTML (Create Section / HTML Book) */}
      {/* =================================================================== */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                  Thêm Mục / Nhập Sách Dạng HTML
                </h3>
                <p className="text-xs text-slate-500">
                  Hỗ trợ tải lên file HTML sách/bài giảng hoặc dán mã HTML trực tiếp để chèn vào trình đọc.
                </p>
              </div>
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSection} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Tiêu đề Mục / Tên chương sách:
                </label>
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="VD: Mục 3.1: Cấu trúc cơ tim và Hệ thống van tim (Bản HTML)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {/* Format selection */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNewContentType("html")}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    newContentType === "html"
                      ? "border-purple-600 bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-200 ring-2 ring-purple-500"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <FileCode className="w-4 h-4 text-purple-600" />
                  <span>Sách / Tài liệu HTML</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNewContentType("markdown")}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    newContentType === "markdown"
                      ? "border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200 ring-2 ring-teal-500"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span>Tài liệu Markdown</span>
                </button>
              </div>

              {/* Upload file box */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-teal-200 dark:border-teal-800/80 bg-teal-50/40 dark:bg-teal-950/20 text-center">
                <Upload className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                <label className="cursor-pointer">
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-300 hover:underline">
                    Bấm để chọn file HTML (.html, .htm) hoặc Markdown (.md)
                  </span>
                  <input
                    type="file"
                    accept=".html, .htm, .md, .markdown"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {uploadedFileName && (
                  <div className="mt-2 text-xs font-mono font-semibold text-emerald-600 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Đã nạp file: {uploadedFileName}</span>
                  </div>
                )}
              </div>

              {/* Textarea for content preview / manual editing */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Nội dung {newContentType === "html" ? "Mã HTML" : "Markdown"} (hoặc chỉnh sửa nội dung sau khi tải file):
                </label>
                <textarea
                  value={newContentText}
                  onChange={(e) => setNewContentText(e.target.value)}
                  placeholder={
                    newContentType === "html"
                      ? "<h2>1. Cấu trúc Tim</h2><p>Tim là cơ quan cơ rỗng nằm trong trung thất giữa...</p>"
                      : "# 1. Cấu trúc Tim\n\nTim là cơ quan cơ rỗng..."
                  }
                  rows={6}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono text-xs outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Quiz Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Ngưỡng đạt (%):
                  </label>
                  <input
                    type="number"
                    value={newPassThreshold}
                    onChange={(e) => setNewPassThreshold(parseInt(e.target.value, 10))}
                    min={40}
                    max={100}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Số câu mỗi lần làm:
                  </label>
                  <input
                    type="number"
                    value={newQuestionsCount}
                    onChange={(e) => setNewQuestionsCount(parseInt(e.target.value, 10))}
                    min={3}
                    max={50}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Loại mục:
                  </label>
                  <select
                    value={newIsCore ? "core" : "optional"}
                    onChange={(e) => setNewIsCore(e.target.value === "core")}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-bold outline-none"
                  >
                    <option value="core">Mục cốt lõi (Cần đạt cao)</option>
                    <option value="optional">Mục phụ (Tham khảo)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddSectionModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSection}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {isSubmittingSection ? "Đang lưu mục..." : "Lưu & Chèn vào giáo trình"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
