"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { MEDPATH_DISCIPLINES } from "@/lib/medpath-data";
import { useMedPathCurriculum } from "@/lib/use-curriculum";
import {
  Compass,
  BookOpen,
  CheckCircle2,
  BarChart3,
  LayoutDashboard,
  Menu,
  X,
  Calendar,
  Search,
  ChevronDown,
  Crown,
  LogIn,
  LogOut,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  activeScreen?: "dashboard" | "study-map" | "reader" | "gate" | "analytics";
  onSelectScreen?: (screen: "dashboard" | "study-map" | "reader" | "gate" | "analytics") => void;
}

export function MedPathShell({ children, activeScreen = "dashboard", onSelectScreen }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, switchUser, availableUsers, isAdmin, logout } = useAuth();
  const { modulesMap } = useMedPathCurriculum();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const allLessonsWithModule = MEDPATH_DISCIPLINES.flatMap((disc) =>
    (modulesMap[disc.id] || []).flatMap((chap) =>
      chap.lessons.map((les) => ({
        lesson: les,
        moduleName: disc.name,
        chapterTitle: chap.title,
      }))
    )
  );

  const filteredSearchLessons = searchQuery.trim()
    ? allLessonsWithModule
        .filter(
          (item) =>
            item.lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.lesson.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.moduleName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 8)
    : allLessonsWithModule.slice(0, 6);

  const getInitials = (name?: string) => {
    if (!name) return "MP";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const navItems = [
    {
      id: "dashboard",
      href: "/",
      label: "Hôm nay học gì?",
      subLabel: "Dashboard",
      icon: LayoutDashboard,
      badge: "Hôm nay",
    },
    {
      id: "study-map",
      href: "/study-map",
      label: "Bản đồ học thuật",
      subLabel: "Study Map",
      icon: Compass,
      count: "4 mod.",
    },
    {
      id: "reader",
      href: "/reader",
      label: "Đọc tập trung",
      subLabel: "Focus Reader",
      icon: BookOpen,
      indicator: true,
    },
    {
      id: "gate",
      href: "/gate",
      label: "Bộ câu hỏi Module",
      subLabel: "Module Bank",
      icon: CheckCircle2,
      badge: "4 Module",
    },
    {
      id: "analytics",
      href: "/analytics",
      label: "Tiến độ & Báo cáo",
      subLabel: "Analytics",
      icon: BarChart3,
    },
  ];

  const handleNavClick = (id: any, href: string) => {
    if (onSelectScreen) {
      onSelectScreen(id);
    } else {
      router.push(href);
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F3EFE6] text-[#30312F] flex flex-col font-sans selection:bg-[#782F3B] selection:text-white">
      {/* Top Academic Utility Bar */}
      <header className="sticky top-0 z-40 bg-[#F3EFE6]/95 backdrop-blur-md border-b border-[#DDD7CC] transition-colors">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Left: Mobile hamburger & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-[#30312F] hover:bg-[#E9E3D5] transition"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* MEDPATH Crest */}
            <Link
              href="/"
              onClick={(e) => {
                if (onSelectScreen) {
                  e.preventDefault();
                  onSelectScreen("dashboard");
                }
              }}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#782F3B] text-[#F3EFE6] flex items-center justify-center font-serif text-lg font-bold tracking-tight shadow-sm border border-[#5C232D]">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-semibold tracking-wide text-[#30312F] group-hover:text-[#782F3B] transition-colors leading-tight">
                  MEDPATH
                </span>
                <span className="text-[9px] tracking-widest text-[#77756F] uppercase font-medium">
                  Academic Workspace
                </span>
              </div>
            </Link>

            <span className="hidden xl:inline-block w-px h-5 bg-[#DDD7CC] mx-1" />

            {/* Academic Module Pill */}
            <div className="hidden xl:flex items-center gap-2 h-9 px-3 rounded-lg bg-[#FAF7F0] border border-[#DDD7CC] text-xs text-[#5A5852] shadow-sm whitespace-nowrap">
              <Calendar className="w-3.5 h-3.5 text-[#782F3B] flex-shrink-0" />
              <span className="text-[#782F3B] font-semibold">4 Module Chuyên Khoa</span>
            </div>
          </div>

          {/* Center: Cohesive Segmented Navigation Bar */}
          <nav aria-label="Điều hướng chính" className="hidden lg:flex items-center bg-[#E8E1D3] p-1 rounded-lg border border-[#DDD7CC] shadow-inner h-9 gap-1">
            {navItems.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.href)}
                  className={`h-7 px-3 rounded-md text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all duration-150 select-none ${
                    isActive
                      ? "bg-[#782F3B] text-[#FAF7F0] shadow-sm font-semibold"
                      : "text-[#5A5852] hover:text-[#30312F] hover:bg-[#DDD7CC]/60"
                  }`}
                  title={`${item.label} (${item.subLabel})`}
                >
                  <item.icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-[#FAF7F0]" : "text-[#782F3B]"}`} />
                  <span className="whitespace-nowrap tracking-tight">{item.subLabel}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Quick Search & Auth / Profile Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Pill */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="h-9 px-3 rounded-lg text-xs text-[#77756F] hover:text-[#30312F] bg-[#FAF7F0] hover:bg-white border border-[#DDD7CC] flex items-center gap-2 transition-all shadow-sm group"
              title="Tìm kiếm bài học trong 4 Module (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-[#782F3B] group-hover:scale-110 transition-transform flex-shrink-0" />
              <span className="hidden sm:inline font-normal">Tra cứu...</span>
              <kbd className="hidden md:inline-flex items-center text-[10px] font-mono bg-[#E8E1D3] border border-[#DDD7CC] px-1.5 py-0.5 rounded text-[#5A5852]">
                ⌘K
              </kbd>
            </button>

            {/* Quick Admin Shortcut Badge if logged in as Admin */}
            {isAdmin && (
              <Link
                href="/admin"
                className="h-9 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-900 flex items-center gap-1.5 transition-all shadow-sm"
                title="Bảng điều khiển Quản trị hệ thống (Admin Portal)"
              >
                <Crown className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            {/* Direct Login Page Button */}
            <Link
              href="/login"
              className="h-9 px-2.5 rounded-lg bg-[#FAF7F0] hover:bg-white border border-[#DDD7CC] hover:border-[#782F3B]/50 text-xs font-semibold text-[#5A5852] hover:text-[#782F3B] flex items-center gap-1.5 transition-all shadow-sm"
              title="Trang đăng nhập chi tiết / Đổi tài khoản"
            >
              <LogIn className="w-3.5 h-3.5 text-[#782F3B] flex-shrink-0" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </Link>

            {/* Dynamic User Profile Pill with Interactive Dropdown (2 Roles: Admin & Người Dùng) */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 h-9 pl-1.5 pr-2.5 rounded-lg bg-[#FAF7F0] hover:bg-white border border-[#DDD7CC] hover:border-[#782F3B]/40 transition shadow-sm text-left group"
                title="Tài khoản & Đổi vai trò (Admin / Người dùng)"
              >
                <div
                  className={`w-6 h-6 rounded-md text-white flex items-center justify-center font-serif text-[11px] font-bold shadow-xs flex-shrink-0 ${
                    isAdmin ? "bg-purple-700" : "bg-[#782F3B]"
                  }`}
                >
                  {getInitials(currentUser?.full_name)}
                </div>
                <div className="text-left hidden xl:block leading-none">
                  <div className="text-xs font-semibold text-[#30312F] flex items-center gap-1">
                    <span className="max-w-[120px] truncate">{currentUser?.full_name || "Chưa đăng nhập"}</span>
                    {isAdmin && (
                      <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#77756F] mt-0.5">
                    {isAdmin ? "Quản trị viên" : "Người dùng"}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-[#77756F] group-hover:text-[#30312F] transition-transform" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-11 z-50 w-72 bg-[#FAF7F0] border border-[#DDD7CC] rounded-xl shadow-editorial-lg p-2 animate-fadeIn text-xs">
                    {/* Header: User Info */}
                    <div className="p-2.5 border-b border-[#DDD7CC] bg-[#F3EFE6]/60 rounded-lg mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg text-white flex items-center justify-center font-serif text-xs font-bold ${
                            isAdmin ? "bg-purple-700" : "bg-[#782F3B]"
                          }`}
                        >
                          {getInitials(currentUser?.full_name)}
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-bold text-[#30312F] truncate">
                            {currentUser?.full_name || "Chưa đăng nhập"}
                          </div>
                          <div className="text-[11px] text-[#77756F] font-mono truncate">
                            {currentUser?.email || "Chưa có email"}
                          </div>
                          <div className="mt-1">
                            <span
                              className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                isAdmin
                                  ? "bg-purple-100 text-purple-900 border border-purple-200"
                                  : "bg-[#E9E3D5] text-[#782F3B] border border-[#DDD7CC]"
                              }`}
                            >
                              {isAdmin ? "👑 Quản Trị Viên (Admin)" : "👤 Người Dùng (Học Viên)"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Switch 2 Accounts */}
                    <div className="mb-2">
                      <div className="px-2 py-1 text-[10px] font-bold text-[#77756F] uppercase tracking-wider">
                        Chuyển đổi 2 tài khoản (1-chạm):
                      </div>
                      <div className="space-y-1">
                        {availableUsers.map((u) => {
                          const isSelected = u.id === currentUser?.id;
                          return (
                            <button
                              key={u.id}
                              onClick={() => {
                                switchUser(u.id);
                                setUserDropdownOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-2 rounded-md flex items-center justify-between transition ${
                                isSelected
                                  ? "bg-[#782F3B] text-white font-semibold"
                                  : "hover:bg-[#E9E3D5] text-[#30312F]"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span>{u.role === "admin" ? "👑" : "👤"}</span>
                                <span className="truncate">{u.full_name}</span>
                              </div>
                              <span
                                className={`text-[10px] uppercase font-mono px-1 rounded ${
                                  isSelected ? "bg-[#5C232D] text-white" : "text-[#77756F]"
                                }`}
                              >
                                {u.role === "admin" ? "Admin" : "User"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Role Links */}
                    <div className="pt-2 border-t border-[#DDD7CC] space-y-1">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-purple-900 font-bold bg-purple-50 hover:bg-purple-100 transition"
                        >
                          <Crown className="w-3.5 h-3.5 text-purple-700" />
                          <span>Vào Bảng Quản trị Admin</span>
                        </Link>
                      )}
                      <Link
                        href="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[#30312F] hover:bg-[#E9E3D5] transition"
                      >
                        <LogIn className="w-3.5 h-3.5 text-[#782F3B]" />
                        <span>Trang Đăng nhập chi tiết</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-red-700 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-600" />
                        <span>Đăng xuất (Về mặc định)</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Body - Expanded Full Width */}
      <div className="flex-1 flex w-full mx-auto">
        {/* Mobile slide-over drawer only (closed by default, opened on mobile menu button) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="relative z-10 w-72 max-w-[80vw] bg-[#FAF7F0] border-r border-[#DDD7CC] flex flex-col h-full shadow-2xl animate-fadeIn">
              <div className="p-4 border-b border-[#DDD7CC] flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-[#782F3B] tracking-widest uppercase">
                    MEDPATH
                  </div>
                  <div className="font-serif text-sm font-bold text-[#30312F]">
                    Academic Workspace
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-[#77756F] hover:text-[#30312F]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                {navItems.map((item) => {
                  const isActive = activeScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id, item.href)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left transition font-medium ${
                        isActive
                          ? "bg-[#782F3B] text-white font-bold"
                          : "text-[#30312F] hover:bg-[#E9E3D5]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#E9E3D5] text-[#782F3B]">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Mobile Drawer User & Auth Area */}
              <div className="p-3 border-t border-[#DDD7CC] bg-[#F3EFE6]/70 space-y-2 text-xs">
                <div className="flex items-center gap-2 p-2 bg-[#FAF7F0] border border-[#DDD7CC] rounded-lg">
                  <div
                    className={`w-7 h-7 rounded-md text-white flex items-center justify-center font-serif text-xs font-bold ${
                      isAdmin ? "bg-purple-700" : "bg-[#782F3B]"
                    }`}
                  >
                    {getInitials(currentUser?.full_name)}
                  </div>
                  <div className="overflow-hidden leading-tight">
                    <div className="font-bold text-[#30312F] truncate">{currentUser?.full_name || "Chưa đăng nhập"}</div>
                    <div className="text-[10px] text-[#77756F]">
                      {isAdmin
                        ? "👑 Quản trị viên"
                        : "👤 Người dùng (Học viên)"}
                    </div>
                  </div>
                </div>

                {/* 1-Touch Quick Switcher (2 Accounts) */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-[#77756F] uppercase tracking-wider px-1">
                    Đổi tài khoản nhanh (2 vai trò):
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {availableUsers.slice(0, 2).map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`p-2 rounded text-[11px] font-semibold text-center truncate border transition ${
                          u.id === currentUser?.id
                            ? "bg-[#782F3B] text-white border-[#5C232D]"
                            : "bg-[#FAF7F0] text-[#30312F] border-[#DDD7CC] hover:bg-white"
                        }`}
                      >
                        {u.role === "admin" ? "👑 Admin" : "👤 Người dùng"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1 flex flex-col gap-1">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-2.5 py-1.5 rounded-md font-bold text-purple-900 bg-purple-100/70 border border-purple-200 flex items-center gap-2"
                    >
                      <Crown className="w-3.5 h-3.5 text-purple-700" />
                      <span>Vào Bảng Quản trị Admin</span>
                    </Link>
                  )}
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2.5 py-1.5 rounded-md font-medium text-[#782F3B] bg-white border border-[#DDD7CC] flex items-center gap-2"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#782F3B]" />
                    <span>Trang Đăng nhập chi tiết</span>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Content Area - Expanded Full Width */}
        <main className="flex-1 min-w-0 flex flex-col bg-[#F3EFE6]">{children}</main>
      </div>


      {/* Quick Search Dialog Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-[#FAF7F0] border border-[#DDD7CC] rounded-lg shadow-editorial-lg overflow-hidden">
            <div className="p-3 border-b border-[#DDD7CC] flex items-center gap-2">
              <Search className="w-4 h-4 text-[#782F3B]" />
              <input
                type="text"
                autoFocus
                placeholder="Nhập mã bài hoặc tên bài học trong 4 Module (VD: K56.LT1, Tim mạch)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm text-[#30312F] placeholder-[#77756F]"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded text-[#77756F] hover:text-[#30312F] text-xs font-mono"
              >
                ESC
              </button>
            </div>
            <div className="p-3 max-h-80 overflow-y-auto space-y-2 text-xs">
              <div className="text-[10px] font-bold text-[#77756F] uppercase tracking-wider px-2">
                Danh sách bài học trong 4 Module
              </div>
              {filteredSearchLessons.length === 0 ? (
                <div className="p-4 text-center text-[#77756F] italic">
                  Không tìm thấy bài học nào khớp với từ khóa.
                </div>
              ) : (
                filteredSearchLessons.map((item) => (
                  <button
                    key={item.lesson.id}
                    onClick={() => {
                      router.push(`/reader?lessonId=${item.lesson.id}`);
                      if (onSelectScreen) onSelectScreen("reader");
                      setSearchModalOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded hover:bg-[#E9E3D5] transition flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-serif font-bold text-[#30312F] truncate">
                        [{item.lesson.code}] {item.lesson.title}
                      </div>
                      <div className="text-[#77756F] text-[11px] truncate">
                        {item.moduleName} • {item.chapterTitle}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#FAF7F0] border border-[#DDD7CC] rounded text-[#782F3B] shrink-0">
                      Mở bài
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar for Small Screens */}
      <div className="lg:hidden sticky bottom-0 z-40 bg-[#FAF7F0]/95 backdrop-blur-md border-t border-[#DDD7CC] px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, item.href)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded transition-colors ${
                isActive ? "text-[#782F3B] font-bold" : "text-[#77756F] hover:text-[#30312F]"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-[9px] mt-0.5">{item.subLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
