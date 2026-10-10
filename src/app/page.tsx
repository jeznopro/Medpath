"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { MedPathShell } from "@/components/medpath/MedPathShell";
import { DashboardScreen } from "@/components/medpath/DashboardScreen";
import { StudyMapScreen } from "@/components/medpath/StudyMapScreen";
import { FocusReaderScreen } from "@/components/medpath/FocusReaderScreen";
import { KnowledgeGateScreen } from "@/components/medpath/KnowledgeGateScreen";
import { AnalyticsScreen } from "@/components/medpath/AnalyticsScreen";
import LoginPage from "@/app/login/page";

function MedPathAppInner() {
  const searchParams = useSearchParams();
  const { currentUser, isLoaded } = useAuth();
  const screenParam = searchParams.get("screen") as
    | "dashboard"
    | "study-map"
    | "reader"
    | "gate"
    | "analytics"
    | null;

  const [activeScreen, setActiveScreen] = useState<
    "dashboard" | "study-map" | "reader" | "gate" | "analytics"
  >(screenParam || "dashboard");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("les-8-1-1");
  const [autoOpenReaderQuiz, setAutoOpenReaderQuiz] = useState<boolean>(false);

  // Keep state synchronized if URL search param changes
  useEffect(() => {
    if (screenParam) {
      setActiveScreen(screenParam);
    }
  }, [screenParam]);

  const handleNavigate = (
    screen: "dashboard" | "study-map" | "reader" | "gate" | "analytics"
  ) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectLessonForReader = (lessonId: string, openQuiz = false) => {
    setSelectedLessonId(lessonId);
    setAutoOpenReaderQuiz(openQuiz);
    setActiveScreen("reader");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 1. Khi đang nạp trạng thái phiên
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F3EFE6] flex items-center justify-center font-serif text-[#782F3B]">
        Đang khởi tạo MEDPATH Academic Workspace...
      </div>
    );
  }

  // 2. Khi mới vào web chưa đăng nhập: Luôn hiện trang đăng nhập đầu tiên
  if (!currentUser) {
    return <LoginPage />;
  }

  // 3. Khi đã đăng nhập: Vào không gian làm việc MEDPATH
  return (
    <MedPathShell activeScreen={activeScreen} onSelectScreen={handleNavigate}>
      {activeScreen === "dashboard" && (
        <DashboardScreen
          onNavigate={handleNavigate}
          onSelectLessonForReader={handleSelectLessonForReader}
        />
      )}
      {activeScreen === "study-map" && (
        <StudyMapScreen
          onNavigate={handleNavigate}
          onSelectLessonForReader={handleSelectLessonForReader}
        />
      )}
      {activeScreen === "reader" && (
        <FocusReaderScreen
          onNavigate={handleNavigate}
          lessonId={selectedLessonId}
          onSelectLesson={setSelectedLessonId}
          autoOpenQuiz={autoOpenReaderQuiz}
          onQuizOpened={() => setAutoOpenReaderQuiz(false)}
        />
      )}
      {activeScreen === "gate" && (
        <KnowledgeGateScreen
          onNavigate={handleNavigate}
          onSelectLessonForReader={handleSelectLessonForReader}
        />
      )}
      {activeScreen === "analytics" && <AnalyticsScreen onNavigate={handleNavigate} />}
    </MedPathShell>
  );
}

export default function MedPathApp() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F3EFE6] flex items-center justify-center font-serif text-[#782F3B]">
          Đang khởi tạo MEDPATH Academic Workspace...
        </div>
      }
    >
      <MedPathAppInner />
    </Suspense>
  );
}
