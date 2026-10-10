"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { CheckCircle2, KeyRound, Sparkles, Users } from "lucide-react";

export default function JoinClassPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleJoin = async (e?: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault();
    const code = customCode || joinCode;
    if (!code.trim()) {
      setErrorMsg("Vui lòng nhập mã tham gia lớp học");
      return;
    }

    if (!currentUser) {
      setErrorMsg("Vui lòng đăng nhập để tham gia lớp học");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "join",
          userId: currentUser.id,
          joinCode: code.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Không thể tham gia lớp học");
      } else {
        setSuccessMsg(`Bạn đã tham gia thành công lớp: "${data.class.name}"!`);
        setTimeout(() => {
          router.push("/classes");
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg("Lỗi kết nối máy chủ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 flex-1 flex flex-col justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-md border border-slate-200 dark:border-slate-700 text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto mb-4 border border-teal-200 dark:border-teal-800">
          <KeyRound className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Tham gia lớp học
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Nhập mã lớp do Giảng viên cung cấp để mở khóa lộ trình học và ngân hàng trắc nghiệm.
        </p>

        {/* 1-click test button */}
        <div className="mb-6 p-3 bg-teal-50 dark:bg-teal-950/60 rounded-xl border border-teal-200 dark:border-teal-800 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-800 dark:text-teal-300">
              💡 Mã lớp Giải Phẫu mẫu:
            </span>
            <button
              type="button"
              onClick={() => {
                setJoinCode("YK2026");
                handleJoin(undefined, "YK2026");
              }}
              className="text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition"
            >
              Điền & Vào lớp: YK2026
            </button>
          </div>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="VD: YK2026"
              className="w-full text-center text-xl font-mono tracking-widest uppercase px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none transition"
              maxLength={10}
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading ? "Đang kiểm tra mã..." : "Vào lớp ngay"}
          </button>
        </form>
      </div>
    </div>
  );
}
