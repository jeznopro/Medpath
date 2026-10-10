"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MedPathShell } from "@/components/medpath/MedPathShell";
import { KnowledgeGateScreen } from "@/components/medpath/KnowledgeGateScreen";

export default function KnowledgeGateRoutePage() {
  const router = useRouter();

  const handleNavigate = (screen: string) => {
    if (screen === "dashboard") router.push("/");
    else router.push(`/${screen}`);
  };

  return (
    <MedPathShell activeScreen="gate" onSelectScreen={handleNavigate as any}>
      <KnowledgeGateScreen onNavigate={handleNavigate as any} />
    </MedPathShell>
  );
}
