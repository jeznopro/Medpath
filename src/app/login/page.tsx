"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Crown,
  GraduationCap,
  Lock,
  Mail,
  Sparkles,
  Users,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Vui lòng nhập địa chỉ email");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const success = await login(email.trim());
    setLoading(false);

    if (success) {
      if (email.includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      setErrorMsg("Tài khoản không tồn tại. Hãy chọn 1 trong 2 tài khoản có sẵn bên dưới!");
    }
  };

  // Đăng nhập nhanh 1-chạm
  const handleQuickLogin = (role: "admin" | "student") => {
    if (role === "admin") {
      switchUser("admin-1");
      router.push("/admin");
    } else {
      switchUser("student-1");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F3EFE6] text-[#30312F] font-sans selection:bg-[#782F3B] selection:text-white">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Academic Portal Header Badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-xs text-[#782F3B] font-semibold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[#782F3B] inline-block animate-pulse" />
            <span>Hệ Thống Xác Thực Học Thuật</span>
          </div>
          <span className="text-[11px] text-[#77756F] font-mono">2 Tài Khoản Duy Nhất</span>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[#782F3B] text-white flex items-center justify-center font-serif text-xl font-bold mx-auto shadow-sm border border-[#5C232D] mb-3">
            M
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#30312F] tracking-tight">
            Đăng nhập vào MEDPATH
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[#77756F]">
            Không gian tự học lâm sàng & Đánh giá năng lực Y khoa
          </p>
        </div>

        {/* 1-Click Fast Demo Accounts Box */}
        <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#DDD7CC] shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#782F3B] uppercase tracking-wider pb-2 border-b border-[#DDD7CC]">
            <Sparkles className="w-3.5 h-3.5 text-[#782F3B]" />
            <span>Chọn 1 trong 2 tài khoản hệ thống:</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {/* 1. Admin Quick Button */}
            <button
              onClick={() => handleQuickLogin("admin")}
              type="button"
              className="w-full text-left p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-700 text-white flex items-center justify-center shadow-xs">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                    <span>1. Quản Trị Viên (Admin)</span>
                    <span className="text-[9px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded font-bold">Quản trị toàn diện</span>
                  </div>
                  <div className="text-[11px] text-purple-700 font-mono mt-0.5">
                    admin@medread.vn
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-700 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* 2. User / Student Quick Button */}
            <button
              onClick={() => handleQuickLogin("student")}
              type="button"
              className="w-full text-left p-3.5 rounded-xl border border-[#DDD7CC] bg-white hover:bg-[#EAE4D7]/50 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#782F3B] text-white flex items-center justify-center shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#30312F] flex items-center gap-1.5">
                    <span>2. Người Dùng (Học Viên)</span>
                    <span className="text-[9px] bg-[#E9E3D5] text-[#782F3B] px-1.5 py-0.5 rounded font-bold">Học & Làm quiz</span>
                  </div>
                  <div className="text-[11px] text-[#77756F] font-mono mt-0.5">
                    user@medread.vn
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#782F3B] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Traditional Email Form */}
        <div className="bg-[#FAF7F0] p-6 sm:p-7 rounded-2xl border border-[#DDD7CC] shadow-sm">
          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#5A5852] uppercase tracking-wider mb-1.5">
                Địa chỉ Email:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#77756F]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nhập email của bạn (ví dụ: admin@medread.vn)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DDD7CC] bg-white text-sm text-[#30312F] outline-none focus:border-[#782F3B] focus:ring-1 focus:ring-[#782F3B] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5A5852] uppercase tracking-wider mb-1.5">
                Mật khẩu:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#77756F]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DDD7CC] bg-white text-sm text-[#30312F] outline-none focus:border-[#782F3B] focus:ring-1 focus:ring-[#782F3B] transition"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 text-red-800 text-xs font-medium border border-red-200">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#782F3B] hover:bg-[#5C232D] text-[#FAF7F0] font-semibold rounded-xl shadow-sm transition disabled:opacity-50 text-sm"
            >
              {loading ? "Đang xác thực..." : "Đăng nhập tài khoản"}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#DDD7CC] text-center text-xs text-[#77756F]">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-[#782F3B] hover:underline font-bold">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
