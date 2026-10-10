"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import { ClientQuestion, Section } from "@/lib/types";

export default function SectionQuizPage() {
  const params = useParams();
  const sectionId = params.sectionId as string;
  const { currentUser } = useAuth();

  const [section, setSection] = useState<Section | null>(null);
  const [questions, setQuestions] = useState<ClientQuestion[]>([]);
  const [passThreshold, setPassThreshold] = useState<number>(80);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuiz() {
      if (!currentUser) return;
      setLoading(true);
      setError(null);
      try {
        // Lấy thông tin section
        const secRes = await fetch(
          `/api/curriculum?sectionId=${sectionId}&userId=${currentUser.id}`
        );
        const secData = await secRes.json();
        if (!secRes.ok || secData.error) {
          throw new Error(secData.error || "Không tìm thấy mục");
        }
        setSection(secData.section);

        // Sinh bộ câu hỏi ngẫu nhiên từ ngân hàng
        const quizRes = await fetch("/api/quiz/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section_id: sectionId,
            user_id: currentUser.id,
          }),
        });
        const quizData = await quizRes.json();
        if (!quizRes.ok || quizData.error) {
          throw new Error(quizData.error || "Không thể tạo bộ đề kiểm tra");
        }

        setQuestions(quizData.questions);
        setPassThreshold(quizData.passThreshold || secData.section.pass_threshold || 80);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (sectionId && currentUser) {
      loadQuiz();
    }
  }, [sectionId, currentUser?.id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center text-slate-500 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <span>Đang tạo ngẫu nhiên bộ câu hỏi vượt cổng...</span>
        </div>
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-center">
        <h3 className="font-bold mb-2">Lỗi tải bài kiểm tra</h3>
        <p className="text-sm">{error || "Không thể tải câu hỏi."}</p>
      </div>
    );
  }

  return (
    <QuizPlayer
      sectionId={section.id}
      sectionTitle={section.title}
      lessonId={section.lesson_id}
      userId={currentUser?.id || "student-1"}
      initialQuestions={questions}
      passThreshold={passThreshold}
    />
  );
}
