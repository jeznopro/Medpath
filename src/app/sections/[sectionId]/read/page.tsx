"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { DocumentReader } from "@/components/reader/DocumentReader";
import { Section, SectionProgress } from "@/lib/types";

export default function SectionReadPage() {
  const params = useParams();
  const sectionId = params.sectionId as string;
  const { currentUser } = useAuth();

  const [data, setData] = useState<{
    section: Section;
    progress: SectionProgress;
    lesson: { title: string };
    subject: { title: string };
    siblingSections: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/curriculum?sectionId=${sectionId}&userId=${currentUser.id}`
        );
        const json = await res.json();
        if (!res.ok || json.error) {
          setError(json.error || "Không thể tải tài liệu mục");
        } else {
          setData(json);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (sectionId && currentUser) {
      loadData();
    }
  }, [sectionId, currentUser?.id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center text-slate-500 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <span>Đang mở tài liệu y khoa...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-center">
        <h3 className="font-bold mb-2">Lỗi tải tài liệu</h3>
        <p className="text-sm">{error || "Không tìm thấy nội dung mục này."}</p>
      </div>
    );
  }

  return (
    <DocumentReader
      section={data.section}
      progress={data.progress}
      lessonTitle={data.lesson?.title || "Bài học"}
      subjectTitle={data.subject?.title || "Môn học"}
      siblingSections={data.siblingSections}
      userId={currentUser?.id || "student-1"}
    />
  );
}
