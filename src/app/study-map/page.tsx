"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MedPathShell } from "@/components/medpath/MedPathShell";
import { StudyMapScreen } from "@/components/medpath/StudyMapScreen";

export default function StudyMapRoutePage() {
  const router = useRouter();

  const handleNavigate = (screen: string) => {
    if (screen === "dashboard") router.push("/");
    else router.push(`/${screen}`);
  };

  return (
    <MedPathShell activeScreen="study-map" onSelectScreen={handleNavigate as any}>
      <StudyMapScreen onNavigate={handleNavigate as any} />
    </MedPathShell>
  );
}
