"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MedPathShell } from "@/components/medpath/MedPathShell";
import { AnalyticsScreen } from "@/components/medpath/AnalyticsScreen";

export default function AnalyticsRoutePage() {
  const router = useRouter();

  const handleNavigate = (screen: string) => {
    if (screen === "dashboard") router.push("/");
    else router.push(`/${screen}`);
  };

  return (
    <MedPathShell activeScreen="analytics" onSelectScreen={handleNavigate as any}>
      <AnalyticsScreen onNavigate={handleNavigate as any} />
    </MedPathShell>
  );
}
