"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  ExternalLink,
  Highlighter,
  MessageSquare,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Highlight } from "@/lib/types";

export default function HighlightsPage() {
  const { currentUser } = useAuth();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterColor, setFilterColor] = useState<string>("all");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchHighlights = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/highlights?userId=${currentUser.id}`);
      const data = await res.json();
      if (data.highlights) {
        setHighlights(data.highlights);
      }
    } catch {
      showToast("Lỗi khi tải danh sách highlight");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, [currentUser?.id]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa highlight này?")) return;
    try {
      const res = await fetch(`/api/highlights?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setHighlights((prev) => prev.filter((h) => h.id !== id));
        showToast("Đã xóa highlight thành công");
      }
    } catch {
      showToast("Lỗi khi xóa highlight");
    }
  };

  const handleMakeFlashcard = async (hl: Highlight) => {
    if (!currentUser) return;
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_from_highlight",
          userId: currentUser.id,
          sectionId: hl.section_id,
          highlightText: hl.text,
          note: hl.note || "Khái niệm ghi nhớ từ tài liệu",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Đã chuyển thành Flashcard và đưa vào lịch ôn hôm nay!");
      }
    } catch {
      showToast("Lỗi khi tạo flashcard");
    }
  };

  const filtered = highlights.filter(
    (h) => filterColor === "all" || h.color === filterColor
  );

  // Group highlights by Section
  const grouped: Record<string, Highlight[]> = {};
  filtered.forEach((h) => {
    const key = h.section_title || "Mục khác";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(h);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-teal-800 text-white text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Highlighter className="w-8 h-8 text-teal-600" />
            <span>Highlight & Ghi chú của tôi</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Tổng hợp tất cả các đoạn tài liệu quan trọng và ghi chú cá nhân của bạn theo từng bài
          </p>
        </div>

        {/* Color filter */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => setFilterColor("all")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filterColor === "all"
                ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Tất cả ({highlights.length})
          </button>
          <button
            onClick={() => setFilterColor("yellow")}
            className={`w-6 h-6 rounded-full bg-yellow-300 ${
              filterColor === "yellow" ? "ring-2 ring-teal-600 ring-offset-2" : ""
            }`}
            title="Màu vàng"
          />
          <button
            onClick={() => setFilterColor("green")}
            className={`w-6 h-6 rounded-full bg-emerald-300 ${
              filterColor === "green" ? "ring-2 ring-teal-600 ring-offset-2" : ""
            }`}
            title="Màu xanh lá"
          />
          <button
            onClick={() => setFilterColor("pink")}
            className={`w-6 h-6 rounded-full bg-pink-300 ${
              filterColor === "pink" ? "ring-2 ring-teal-600 ring-offset-2" : ""
            }`}
            title="Màu hồng"
          />
          <button
            onClick={() => setFilterColor("orange")}
            className={`w-6 h-6 rounded-full bg-amber-400 ${
              filterColor === "orange" ? "ring-2 ring-teal-600 ring-offset-2" : ""
            }`}
            title="Màu cam"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Đang tải danh sách highlight...</div>
      ) : highlights.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center mx-auto mb-4">
            <Highlighter className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
            Chưa có đoạn highlight nào
          </h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Trong khi đọc tài liệu giải phẫu, hãy dùng chuột hoặc ngón tay bôi đen bất kỳ đoạn văn
            nào để highlight nhiều màu và ghi chú lại nhé!
          </p>
          <Link
            href="/classes"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl shadow-md transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>Đến trang đọc tài liệu</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([sectionTitle, items]) => (
            <div key={sectionTitle} className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  {sectionTitle}
                </h2>
                <span className="text-xs text-slate-400 ml-1">({items.length} đoạn)</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {items.map((hl) => {
                  const colorBadgeClass =
                    hl.color === "green"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
                      : hl.color === "pink"
                      ? "bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-950 dark:text-pink-300"
                      : hl.color === "orange"
                      ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300";

                  return (
                    <div
                      key={hl.id}
                      className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-teal-300 dark:hover:border-teal-700 transition"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${colorBadgeClass}`}
                          >
                            Highlight {hl.color === "green" ? "Xanh lá" : hl.color === "pink" ? "Hồng" : hl.color === "orange" ? "Cam" : "Vàng"}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(hl.created_at).toLocaleDateString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                            })}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleMakeFlashcard(hl)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 transition"
                            title="Tạo Flashcard Spaced Repetition từ đoạn này"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span className="hidden sm:inline">Tạo Flashcard</span>
                          </button>

                          <Link
                            href={`/classes/view/subjects/sub/lessons/les/sections/${hl.section_id}/read`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 rounded-lg hover:bg-teal-100 transition"
                            title="Mở tài liệu đọc chứa đoạn này"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Đến bài đọc</span>
                          </Link>

                          <button
                            onClick={() => handleDelete(hl.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                            title="Xóa highlight"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Trích đoạn text */}
                      <blockquote className="text-sm sm:text-base font-normal text-slate-800 dark:text-slate-200 italic pl-3 border-l-4 border-teal-500 my-2 leading-relaxed">
                        "{hl.text}"
                      </blockquote>

                      {/* Ghi chú cá nhân */}
                      {hl.note && (
                        <div className="mt-3 p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900 text-xs sm:text-sm text-teal-950 dark:text-teal-200 flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Ghi chú của bạn: </span>
                            <span>{hl.note}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
