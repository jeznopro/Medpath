"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MedPathShell } from "@/components/medpath/MedPathShell";
import { FocusReaderScreen } from "@/components/medpath/FocusReaderScreen";

export default function FocusReaderRoutePage() {
  const router = useRouter();
  const [selectedLessonId, setSelectedLessonId] = useState<string>("les-11-2-2");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const qId = params.get("lessonId");
      if (qId) {
        setSelectedLessonId(qId);
      }
    }
  }, []);

  const handleNavigate = (screen: string) => {
    if (screen === "dashboard") router.push("/");
    else router.push(`/${screen}`);
  };

  return (
    <MedPathShell activeScreen="reader" onSelectScreen={handleNavigate as any}>
      <FocusReaderScreen
        onNavigate={handleNavigate as any}
        lessonId={selectedLessonId}
        onSelectLesson={setSelectedLessonId}
      />
    </MedPathShell>
  );
}
