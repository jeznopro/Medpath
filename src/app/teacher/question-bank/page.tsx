"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownToLine,
  CheckCircle2,
  ChevronLeft,
  FileSpreadsheet,
  GraduationCap,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { Question, QuestionDifficulty, QuestionReport, QuestionType, ReportStatus, Section } from "@/lib/types";

export default function QuestionBankPage() {
  const { currentUser, isTeacher } = useAuth();
  const [pageTab, setPageTab] = useState<"bank" | "reports">("bank");
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("sec-1-1");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [reports, setReports] = useState<QuestionReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Import State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    importedCount: number;

    duplicateCount: number;
    totalRows: number;
    errors: { row: number; message: string }[];
  } | null>(null);

  // Manual Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBody, setNewBody] = useState("");
  const [newType, setNewType] = useState<QuestionType>("single_choice");
  const [newDifficulty, setNewDifficulty] = useState<QuestionDifficulty>("understand");
  const [newSourceRef, setNewSourceRef] = useState("");
  const [newExplanation, setNewExplanation] = useState("");
  const [newOptions, setNewOptions] = useState([
    { text: "", is_correct: true, explanation: "" },
    { text: "", is_correct: false, explanation: "" },
    { text: "", is_correct: false, explanation: "" },
    { text: "", is_correct: false, explanation: "" },
  ]);
  const [addingError, setAddingError] = useState<string | null>(null);

  const fetchSectionsAndQuestions = async () => {
    setLoading(true);
    try {
      // Lấy tất cả sections của lớp giải phẫu
      const clsRes = await fetch("/api/classes?classId=class-anat-1");
      const clsData = await clsRes.json();
      if (clsData.curriculum) {
        const allSecs: Section[] = [];
        clsData.curriculum.forEach((sub: any) => {
          sub.lessons.forEach((les: any) => {
            allSecs.push(...les.sections);
          });
        });
        setSections(allSecs);
      }

      // Lấy câu hỏi của section được chọn
      await fetchQuestions(selectedSectionId);
    } catch (err) {
      console.error("Lỗi tải dữ liệu ngân hàng câu hỏi:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (secId: string) => {
    try {
      const res = await fetch(`/api/seed`);
      const data = await res.json();
      // Hoặc fetch từ route
      const secQuestionsRes = await fetch(`/api/curriculum?sectionId=${secId}`);
      const secQuestionsData = await secQuestionsRes.json();
      // Lấy tất cả câu hỏi của section này từ seed data
      const allQRes = await fetch(`/api/seed`);
      // We can create a quick route or use the client questions
      const qRes = await fetch(`/api/questions/list?sectionId=${secId}`);
      if (qRes.ok) {
        const qJson = await qRes.json();
        setQuestions(qJson.questions || []);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách câu hỏi:", err);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/questions/report");
      const data = await res.json();
      if (data.reports) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách báo lỗi câu hỏi:", err);
    }
  };

  useEffect(() => {
    fetchSectionsAndQuestions();
    fetchReports();
  }, [selectedSectionId]);

  const handleUpdateReportStatus = async (id: string, status: ReportStatus) => {
    try {
      const res = await fetch("/api/questions/report", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status, resolved_at: new Date().toISOString() } : r))
        );
      }
    } catch {
      alert("Lỗi khi cập nhật trạng thái báo lỗi");
    }
  };


  // Xử lý Upload file Excel/CSV
  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Vui lòng chọn một file Excel (.xlsx) hoặc CSV để tải lên.");
      return;
    }

    setImporting(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("section_id", selectedSectionId);

      const res = await fetch("/api/questions/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setImportResult(data);

      if (data.importedCount > 0) {
        // Tải lại danh sách câu hỏi
        fetchQuestions(selectedSectionId);
      }
    } catch (err: any) {
      alert("Lỗi khi import file: " + err.message);
    } finally {
      setImporting(false);
    }
  };

  // Thêm thủ công câu hỏi
  const handleAddManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBody.trim()) {
      setAddingError("Vui lòng nhập nội dung câu hỏi");
      return;
    }

    const validOptions = newOptions.filter((o) => o.text.trim().length > 0);
    if (validOptions.length < 2) {
      setAddingError("Cần ít nhất 2 phương án trả lời");
      return;
    }

    if (!validOptions.some((o) => o.is_correct)) {
      setAddingError("Cần chọn ít nhất 1 phương án đúng");
      return;
    }

    try {
      const questionId = `q-manual-${Date.now()}`;
      const payload: Question = {
        id: questionId,
        section_id: selectedSectionId,
        type: newType,
        body: newBody.trim(),
        explanation: newExplanation.trim() || "Chưa có giải thích",
        difficulty: newDifficulty,
        source_ref: newSourceRef.trim() || undefined,
        is_active: true,
        options: validOptions.map((opt, idx) => ({
          id: `opt-${questionId}-${idx}`,
          question_id: questionId,
          text: opt.text.trim(),
          is_correct: opt.is_correct,
          explanation: opt.explanation.trim() || undefined,
        })),
      };

      const res = await fetch("/api/questions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewBody("");
        setNewExplanation("");
        setNewSourceRef("");
        fetchQuestions(selectedSectionId);
      } else {
        const errJson = await res.json();
        setAddingError(errJson.error || "Không thể thêm câu hỏi");
      }
    } catch (err: any) {
      setAddingError("Lỗi máy chủ: " + err.message);
    }
  };

  const selectedSection = sections.find((s) => s.id === selectedSectionId);
  const isBankSmallerThanN =
    selectedSection && questions.length < selectedSection.questions_per_attempt;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/classes"
              className="text-xs text-slate-500 hover:text-teal-600 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Về lớp học</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
              Bảng điều khiển Giảng viên
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Ngân Hàng Câu Hỏi & Import Excel
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Download Sample Excel */}
          <a
            href="/api/questions/template"
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-700 transition flex items-center gap-1.5 shadow-sm"
            download
            title="Tải file Excel mẫu chuẩn cấu trúc để soạn câu hỏi"
          >
            <ArrowDownToLine className="w-4 h-4 text-teal-600" />
            <span>Tải file Excel mẫu</span>
          </a>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-teal-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm câu hỏi mới</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3 mb-6">
        <button
          type="button"
          onClick={() => setPageTab("bank")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            pageTab === "bank"
              ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Ngân hàng câu hỏi & Import Excel</span>
        </button>

        <button
          type="button"
          onClick={() => setPageTab("reports")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            pageTab === "reports"
              ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Hàng đợi Báo lỗi câu hỏi</span>
          {reports.filter((r) => r.status === "pending").length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
              {reports.filter((r) => r.status === "pending").length}
            </span>
          )}
        </button>
      </div>

      {pageTab === "bank" && (
        <>
          {/* Section Picker & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="md:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Chọn Mục trong giáo trình để quản lý câu hỏi:
            </label>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
            >
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.title} (Ngưỡng {sec.pass_threshold}%)
                </option>
              ))}
            </select>
          </div>

          {selectedSection && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
              <span>
                Ngưỡng đạt: <strong>{selectedSection.pass_threshold}%</strong>
              </span>
              <span>•</span>
              <span>
                Số câu mỗi lần làm: <strong>{selectedSection.questions_per_attempt} câu</strong>
              </span>
              <span>•</span>
              <span>
                Loại mục: <strong>{selectedSection.is_core ? "Cốt lõi" : "Phụ"}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Bank Capacity Alert */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Quy mô ngân hàng câu hỏi
            </div>
            <div className="text-3xl font-black text-teal-700 dark:text-teal-400">
              {questions.length}{" "}
              <span className="text-sm font-medium text-slate-500">câu hỏi</span>
            </div>
          </div>

          {isBankSmallerThanN && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                Cảnh báo: Ngân hàng có ít hơn {selectedSection.questions_per_attempt} câu. Hệ thống sẽ
                lấy toàn bộ câu có sẵn khi học viên làm bài.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Excel / CSV Uploader Box */}
      <div className="bg-gradient-to-r from-teal-50/70 to-emerald-50/70 dark:from-slate-800/80 dark:to-slate-800/60 p-6 rounded-2xl border border-teal-200 dark:border-slate-700 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/30">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Import câu hỏi hàng loạt từ Excel (.xlsx) hoặc CSV
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Tự động kiểm tra định dạng, xác thực bằng Zod và chống trùng lặp câu hỏi.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleImportSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full sm:flex-1 text-xs text-slate-700 dark:text-slate-300 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700 cursor-pointer bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-300 dark:border-slate-600"
            />

            <button
              type="submit"
              disabled={importing || !selectedFile}
              className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {importing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý dữ liệu...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Tải lên và Nhập câu hỏi</span>
                </>
              )}
            </button>
          </div>

          {/* Import Result Feedback */}
          {importResult && (
            <div
              className={`p-4 rounded-xl border text-xs ${
                importResult.success
                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                  : "bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200"
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-2 text-sm">
                {importResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span>
                  {importResult.success
                    ? `Đã nhập thành công ${importResult.importedCount} / ${importResult.totalRows} câu hỏi!`
                    : "Không thể nhập câu hỏi từ file."}
                </span>
              </div>

              {importResult.duplicateCount > 0 && (
                <div className="text-amber-700 dark:text-amber-300 font-semibold mb-2">
                  ⚠️ Phát hiện và bỏ qua {importResult.duplicateCount} câu hỏi bị trùng lặp.
                </div>
              )}

              {/* Line by line error logs */}
              {importResult.errors.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1 max-h-40 overflow-y-auto font-mono text-[11px]">
                  <div className="font-bold text-slate-700 dark:text-slate-300">
                    Chi tiết lỗi theo từng dòng:
                  </div>
                  {importResult.errors.map((err, idx) => (
                    <div key={idx} className="text-red-600 dark:text-red-400">
                      • [Dòng {err.row}]: {err.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Questions List Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
            Danh sách câu hỏi trong mục ({questions.length})
          </h3>
          <span className="text-xs text-slate-400">
            Hiển thị đầy đủ phương án & đáp án đúng
          </span>
        </div>

        {questions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Mục này chưa có câu hỏi nào. Hãy tải file mẫu Excel và nhập câu hỏi ngay!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-750">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-750/50 transition">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase">
                      {q.difficulty}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                      {q.type === "single_choice"
                        ? "1 đáp án"
                        : q.type === "multiple_choice"
                        ? "Nhiều đáp án"
                        : "Đúng/Sai"}
                    </span>
                    {q.source_ref && (
                      <span className="text-[11px] font-mono text-slate-400">
                        ref: #{q.source_ref}
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-3">
                  {q.body}
                </h4>

                {/* Options display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {q.options.map((opt, optIdx) => (
                    <div
                      key={opt.id}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                        opt.is_correct
                          ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-semibold"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <span className="truncate">
                        {String.fromCharCode(65 + optIdx)}. {opt.text}
                      </span>
                      {opt.is_correct && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase shrink-0">
                          (ĐÚNG)
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                    💡 <strong>Giải thích:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      </>
      )}

      {/* TAB 2: HÀNG ĐỢI BÁO LỖI CÂU HỎI */}
      {pageTab === "reports" && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Hàng đợi Báo lỗi câu hỏi từ Học viên ({reports.length})</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Các câu hỏi học viên báo sai sót nội dung, chính tả hoặc hình ảnh cần giảng viên xác minh và hiệu đính
              </p>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              Không có báo lỗi nào đang chờ xử lý. Ngân hàng câu hỏi hoạt động ổn định!
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((r) => {
                const reasonLabels: Record<string, string> = {
                  wrong_answer: "Sai đáp án",
                  typo: "Lỗi chính tả / Thuật ngữ",
                  broken_image: "Lỗi hình ảnh",
                  unclear_explanation: "Giải thích mâu thuẫn",
                  other: "Khác",
                };

                return (
                  <div
                    key={r.id}
                    className={`p-5 rounded-2xl border text-xs sm:text-sm space-y-3 transition ${
                      r.status === "fixed"
                        ? "bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/20"
                        : r.status === "rejected"
                        ? "bg-slate-50 border-slate-200 dark:bg-slate-900/40 opacity-70"
                        : "bg-amber-50/40 border-amber-200 dark:bg-amber-950/20"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {r.reporter_name || "Học viên"}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(r.created_at).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          {reasonLabels[r.reason] || r.reason}
                        </span>
                      </div>

                      {/* Status badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          r.status === "fixed"
                            ? "bg-emerald-100 text-emerald-800"
                            : r.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : r.status === "reviewed"
                            ? "bg-teal-100 text-teal-800"
                            : "bg-amber-200 text-amber-900 animate-pulse"
                        }`}
                      >
                        {r.status === "fixed"
                          ? "✓ Đã sửa"
                          : r.status === "rejected"
                          ? "✕ Đã từ chối"
                          : r.status === "reviewed"
                          ? "Đang xem xét"
                          : "Chờ xử lý"}
                      </span>
                    </div>

                    {/* Question body */}
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 italic text-slate-800 dark:text-slate-200">
                      "{r.question_body || `Mã câu hỏi: ${r.question_id}`}"
                    </div>

                    {/* Student Note */}
                    {r.note && (
                      <div className="text-xs text-amber-900 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-950/60 p-2.5 rounded-xl">
                        <strong>Ghi chú từ học viên: </strong> {r.note}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateReportStatus(r.id, "reviewed")}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                      >
                        Đang xem xét
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateReportStatus(r.id, "rejected")}
                        className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold"
                      >
                        Từ chối / Câu đúng
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateReportStatus(r.id, "fixed")}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold shadow-sm"
                      >
                        ✓ Xác nhận đã sửa
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}


      {/* Manual Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 my-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
              Thêm câu hỏi mới vào: {selectedSection?.title}
            </h3>

            {addingError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                {addingError}
              </div>
            )}

            <form onSubmit={handleAddManual} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Nội dung câu hỏi:
                </label>
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="VD: Cấu trúc nào sau đây đi qua rãnh xoắn xương cánh tay?"
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Loại câu:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as QuestionType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs outline-none"
                  >
                    <option value="single_choice">1 đáp án đúng</option>
                    <option value="multiple_choice">Nhiều đáp án đúng</option>
                    <option value="true_false">Đúng / Sai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Mức độ:</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as QuestionDifficulty)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs outline-none"
                  >
                    <option value="remember">Nhớ</option>
                    <option value="understand">Hiểu</option>
                    <option value="apply">Vận dụng</option>
                    <option value="clinical">Lâm sàng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Đoạn tham chiếu (source_ref):
                  </label>
                  <input
                    type="text"
                    value={newSourceRef}
                    onChange={(e) => setNewSourceRef(e.target.value)}
                    placeholder="VD: sec-1-1-humerus"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Options */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">
                  Các phương án (Tích chọn đáp án đúng):
                </label>
                <div className="space-y-2">
                  {newOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={opt.is_correct}
                        onChange={(e) => {
                          const updated = [...newOptions];
                          if (newType === "single_choice") {
                            updated.forEach((o, i) => (o.is_correct = i === idx));
                          } else {
                            updated[idx].is_correct = e.target.checked;
                          }
                          setNewOptions(updated);
                        }}
                        className="w-4 h-4 rounded text-teal-600 accent-teal-600 cursor-pointer"
                        title="Đánh dấu là đáp án đúng"
                      />
                      <span className="w-5 text-xs font-bold text-slate-500">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...newOptions];
                          updated[idx].text = e.target.value;
                          setNewOptions(updated);
                        }}
                        placeholder={`Phương án ${String.fromCharCode(65 + idx)}`}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Giải thích đáp án:
                </label>
                <textarea
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="Giải thích tại sao đáp án đúng..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  Lưu câu hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
