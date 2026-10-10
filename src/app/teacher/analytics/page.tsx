"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronRight,
  Download,
  FileSpreadsheet,
  GraduationCap,
  HelpCircle,
  Lock,
  RotateCcw,
  Sparkles,
  Users,
} from "lucide-react";

export default function TeacherAnalyticsPage() {
  const { currentUser, isTeacher } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"matrix" | "difficult" | "bank">("matrix");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teacher/analytics?classId=class-anat-1");
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu thống kê lớp:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleExportCsv = () => {
    window.open("/api/teacher/analytics?classId=class-anat-1&export=csv", "_blank");
  };

  if (!isTeacher) {
    return (
      <div className="max-w-md mx-auto p-12 text-center text-slate-500">
        <Lock className="w-10 h-10 mx-auto text-amber-500 mb-3" />
        <h2 className="font-bold text-slate-800 dark:text-slate-200">Khu vực dành cho Giảng viên</h2>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          Bạn cần đăng nhập bằng tài khoản Giảng viên hoặc Admin để xem bảng điều khiển này.
        </p>
        <Link
          href="/login"
          className="inline-block px-5 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold"
        >
          Đăng nhập Giảng viên
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/classes"
              className="text-slate-500 hover:text-teal-600 text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại Môn học</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <GraduationCap className="w-8 h-8 text-teal-600" />
            <span>Bảng Điều Khiển Tiến Độ Lớp Học</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Lớp Giải Phẫu Y1 - K2026 (Mã lớp: <strong className="text-teal-700 dark:text-teal-300 font-mono">YK2026</strong>)
          </p>
        </div>

        {/* Action: Export CSV */}
        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Xuất báo cáo Excel / CSV</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Tổng số sinh viên</div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {analytics?.totalStudents || 0} học viên
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Ngân hàng câu hỏi</div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {analytics?.totalQuestions || 0} câu hỏi
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Tổng lượt thi vượt cổng</div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {analytics?.totalAttempts || 0} lượt làm bài
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab("matrix")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === "matrix"
              ? "bg-teal-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Ma trận tiến độ học viên
        </button>
        <button
          onClick={() => setActiveTab("difficult")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === "difficult"
              ? "bg-teal-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Câu hỏi sai nhiều nhất (Gợi ý giảng lại)
        </button>
        <button
          onClick={() => setActiveTab("bank")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === "bank"
              ? "bg-teal-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Tình trạng ngân hàng câu hỏi
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Đang tải báo cáo lớp...</div>
      ) : (
        <>
          {/* TAB 1: MA TRẬN TIẾN ĐỘ HỌC VIÊN */}
          {activeTab === "matrix" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Chi tiết tiến độ từng học viên theo từng mục giáo trình
                </span>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Đã qua cổng
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Bỏ qua tạm
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Chưa học / Khóa
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase text-[10px]">
                      <th className="py-3 px-4">Học viên</th>
                      <th className="py-3 px-3 text-center">Hoàn thành</th>
                      <th className="py-3 px-3 text-center">Điểm TB</th>
                      {analytics?.studentMatrix?.[0]?.sectionStatuses?.map((s: any) => (
                        <th key={s.section_id} className="py-3 px-3 text-center max-w-[120px] truncate" title={s.section_title}>
                          {s.section_title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {analytics?.studentMatrix?.map((stu: any) => (
                      <tr key={stu.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800 dark:text-slate-200">{stu.name}</div>
                          <div className="text-[11px] text-slate-400">{stu.email}</div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-bold text-teal-700 dark:text-teal-400">
                            {stu.progressPct}%
                          </span>
                          <div className="text-[10px] text-slate-400">
                            {stu.passedCount}/{stu.totalSections} mục
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-bold">
                          {stu.avgScore}%
                        </td>
                        {stu.sectionStatuses?.map((sec: any) => (
                          <td key={sec.section_id} className="py-3 px-3 text-center">
                            {sec.status === "passed" ? (
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                ✓ {sec.best_score}%
                              </span>
                            ) : sec.status === "skipped_weak" ? (
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                                Tạm qua
                              </span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-600 font-mono">-</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: CÂU HỎI SAI NHIỀU NHẤT */}
          {activeTab === "difficult" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Top câu hỏi có tỉ lệ sai cao nhất trong toàn bộ lớp
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Gợi ý cho giảng viên các chủ đề và khái niệm giải phẫu cần giải thích lại trong buổi học tiếp theo
                  </p>
                </div>
              </div>

              {analytics?.mostDifficultQuestions && analytics.mostDifficultQuestions.length > 0 ? (
                <div className="space-y-3">
                  {analytics.mostDifficultQuestions.map((q: any, idx: number) => (
                    <div
                      key={q.question_id}
                      className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 text-xs sm:text-sm space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4" />
                          #{idx + 1} - Tỉ lệ sai: {q.wrongRate}% ({q.wrongCount}/{q.totalAttempts} lượt làm sai)
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border uppercase font-bold text-slate-600 dark:text-slate-300">
                          {q.difficulty}
                        </span>
                      </div>
                      <div className="font-medium text-slate-800 dark:text-slate-200 italic">
                        "{q.body}"
                      </div>
                      <div className="text-[11px] text-teal-800 dark:text-teal-300 bg-white/70 dark:bg-slate-900/60 p-2 rounded-lg">
                        <strong>💡 Khuyến nghị sư phạm:</strong> Sinh viên đang nhầm lẫn hoặc chưa nắm chắc vị trí giải phẫu này. Giảng viên nên chiếu lại mô hình 3D hoặc hình chụp thực tế.
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  Chưa ghi nhận câu hỏi nào có tỉ lệ làm sai bất thường.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TÌNH TRẠNG NGÂN HÀNG CÂU HỎI */}
          {activeTab === "bank" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Độ bao phủ câu hỏi theo từng mục trong chương trình
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analytics?.sectionQuestionCounts?.map((s: any) => (
                  <div
                    key={s.section_id}
                    className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                      s.isLacking
                        ? "border-amber-300 bg-amber-50/50 dark:bg-amber-950/20"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-800 dark:text-slate-200">{s.title}</span>
                      <span className={s.isLacking ? "text-amber-700" : "text-emerald-600"}>
                        {s.questionCount} / {s.targetCount} câu
                      </span>
                    </div>
                    {s.isLacking ? (
                      <div className="text-[11px] text-amber-700 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Cần bổ sung thêm câu hỏi để đảm bảo tính ngẫu nhiên khi sinh viên làm bài.</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đủ câu hỏi theo tiêu chuẩn (≥ {s.targetCount} câu).</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
