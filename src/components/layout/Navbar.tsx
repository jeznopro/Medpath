"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  BookOpen,
  Crown,
  GraduationCap,
  LogIn,
  LogOut,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const { currentUser, switchUser, availableUsers, isAdmin, isTeacher, logout } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState<string | null>(null);

  const handleResetSeed = async () => {
    if (
      !confirm(
        "Bạn có chắc chắn muốn nạp lại dữ liệu mẫu (60 câu hỏi Giải phẫu và tiến độ ban đầu)?"
      )
    ) {
      return;
    }
    setResetting(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setResetMsg("Đã khôi phục dữ liệu mẫu thành công!");
        setTimeout(() => {
          setResetMsg(null);
          window.location.reload();
        }, 1200);
      }
    } catch {
      alert("Lỗi khi khôi phục dữ liệu mẫu");
    } finally {
      setResetting(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-teal-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-700 dark:from-teal-300 dark:to-emerald-400 bg-clip-text text-transparent">
                  MedRead
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  Mastery Learning
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center ml-6 space-x-1">
              <Link
                href="/classes"
                className="px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-slate-800 transition"
              >
                Môn học
              </Link>
              <Link
                href="/review"
                className="px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 transition flex items-center gap-1"
              >
                <span>Ôn hôm nay</span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              </Link>
              <Link
                href="/highlights"
                className="px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-slate-800 transition"
              >
                Highlight & Ghi chú
              </Link>
              <Link
                href="/mock-exam"
                className="px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-slate-800 transition"
              >
                Thi thử
              </Link>
              <Link
                href="/analytics"
                className="px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-slate-800 transition"
              >
                Thống kê
              </Link>

              {isTeacher && (
                <>
                  <Link
                    href="/teacher/question-bank"
                    className="px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    Ngân hàng câu hỏi
                  </Link>
                  <Link
                    href="/teacher/analytics"
                    className="px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition"
                  >
                    Bảng điểm lớp
                  </Link>
                </>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition flex items-center gap-1"
                >
                  <Crown className="w-3.5 h-3.5 text-purple-600" />
                  Admin
                </Link>
              )}
            </nav>
          </div>

          {/* Right Action: User Switcher & Auth Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {resetMsg && (
              <span className="hidden lg:inline text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-pulse">
                {resetMsg}
              </span>
            )}

            {/* Login Link */}
            <Link
              href="/login"
              className="p-2 rounded-xl text-slate-600 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition"
              title="Đến trang Đăng nhập"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </Link>

            {/* Role Switcher Pill */}
            {currentUser && (
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {currentUser.role === "admin" ? (
                    <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  )}
                  <span className="max-w-[100px] sm:max-w-[140px] truncate font-semibold">
                    {currentUser.full_name}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      currentUser.role === "admin"
                        ? "bg-purple-100 text-purple-800 border border-purple-200"
                        : "bg-teal-100 text-teal-800 border border-teal-200"
                    }`}
                  >
                    {currentUser.role === "admin" ? "Admin" : "Học viên"}
                  </span>
                </div>

                <select
                  value={currentUser.id}
                  onChange={(e) => switchUser(e.target.value)}
                  className="text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-teal-500 outline-none cursor-pointer"
                  title="Chuyển đổi 2 tài khoản (Admin / Người dùng)"
                >
                  {availableUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.role === "admin"
                        ? "👑 " + u.full_name
                        : "👤 " + u.full_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
