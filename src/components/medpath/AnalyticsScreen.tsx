"use client";

import React from "react";
import { MEDPATH_DISCIPLINES } from "@/lib/medpath-data";
import { useMedPathCurriculum } from "@/lib/use-curriculum";
import { useQuestionBankStore } from "@/lib/module-questions";
import { useAuth } from "@/lib/auth-context";
import {
  BookOpen,
  CheckCircle2,
  Compass,
  FileCode,
  FileQuestion,
  Layers,
} from "lucide-react";

interface AnalyticsScreenProps {
  onNavigate: (
    screen: "dashboard" | "study-map" | "reader" | "gate" | "analytics"
  ) => void;
}

export function AnalyticsScreen({ onNavigate }: AnalyticsScreenProps) {
  const { currentUser } = useAuth();
  const { modulesMap, customContents } = useMedPathCurriculum();
  const { getQuestionsForModule, getQuestionsForSingleLesson } =
    useQuestionBankStore();

  const allLessons = MEDPATH_DISCIPLINES.flatMap((d) =>
    (modulesMap[d.id] || []).flatMap((c) => c.lessons)
  );
  const totalLessons = allLessons.length;
  const enteredContentCount = allLessons.filter(
    (l) => customContents[l.id] && customContents[l.id].trim().length > 0
  ).length;
  const totalQuestionsEntered =
    MEDPATH_DISCIPLINES.reduce(
      (sum, d) => sum + getQuestionsForModule(d.id).length,
      0
    ) +
    allLessons.reduce(
      (sum, l) => sum + getQuestionsForSingleLesson(l).length,
      0
    );

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full space-y-8">
      {/* 1. Header */}
      <section className="border-b border-[#DDD7CC] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#782F3B] font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#782F3B]" />
              Thống kê dữ liệu thực tế • 4 Module
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#30312F] tracking-tight">
              Tiến độ &amp; Trạng thái Dữ liệu
            </h1>
            <p className="mt-1.5 text-sm text-[#77756F] max-w-2xl">
              Tài khoản đang sử dụng:{" "}
              <strong className="text-[#30312F]">
                {currentUser?.full_name || "Người dùng"}
              </strong>
              . Hiển thị chính xác số bài học và câu hỏi đã được nhập vào hệ thống.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate("study-map")}
              className="px-4 py-2 rounded-md bg-[#FAF7F0] hover:bg-white text-[#30312F] border border-[#DDD7CC] text-xs font-semibold shadow-editorial transition flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#782F3B]" />
              <span>Bản đồ 4 Module</span>
            </button>

            <button
              onClick={() => onNavigate("gate")}
              className="px-4 py-2 rounded-md bg-[#782F3B] hover:bg-[#642530] text-white text-xs font-semibold shadow-editorial transition flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Bộ câu hỏi Module</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Core Real Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#FAF7F0] border border-[#DDD7CC] p-5 rounded-lg shadow-editorial">
          <div className="flex items-center justify-between text-xs text-[#77756F] mb-1">
            <span>Tổng số Module</span>
            <Layers className="w-4 h-4 text-[#782F3B]" />
          </div>
          <div className="font-serif text-3xl font-bold text-[#30312F]">
            {MEDPATH_DISCIPLINES.length}
          </div>
          <div className="text-[11px] text-[#77756F] mt-1">
            Module 8, 9, 10, 11
          </div>
        </div>

        <div className="bg-[#FAF7F0] border border-[#DDD7CC] p-5 rounded-lg shadow-editorial">
          <div className="flex items-center justify-between text-xs text-[#77756F] mb-1">
            <span>Tổng số bài học</span>
            <BookOpen className="w-4 h-4 text-[#782F3B]" />
          </div>
          <div className="font-serif text-3xl font-bold text-[#30312F]">
            {totalLessons}
          </div>
          <div className="text-[11px] text-[#77756F] mt-1">
            Bài giảng trong 4 Module
          </div>
        </div>

        <div className="bg-[#FAF7F0] border border-[#DDD7CC] p-5 rounded-lg shadow-editorial">
          <div className="flex items-center justify-between text-xs text-[#77756F] mb-1">
            <span>Bài đã nhập nội dung</span>
            <FileCode className="w-4 h-4 text-[#34745B]" />
          </div>
          <div className="font-serif text-3xl font-bold text-[#30312F]">
            {enteredContentCount}{" "}
            <span className="text-sm font-sans font-normal text-[#77756F]">
              / {totalLessons}
            </span>
          </div>
          <div className="text-[11px] text-[#77756F] mt-1">
            Nội dung HTML/văn bản đã nhập
          </div>
        </div>

        <div className="bg-[#FAF7F0] border border-[#DDD7CC] p-5 rounded-lg shadow-editorial">
          <div className="flex items-center justify-between text-xs text-[#77756F] mb-1">
            <span>Tổng số câu hỏi đã nhập</span>
            <FileQuestion className="w-4 h-4 text-[#B67A36]" />
          </div>
          <div className="font-serif text-3xl font-bold text-[#30312F]">
            {totalQuestionsEntered}
          </div>
          <div className="text-[11px] text-[#77756F] mt-1">
            Câu hỏi trong 4 Module &amp; các Bài
          </div>
        </div>
      </section>

      {/* 3. Breakdown by Module */}
      <section className="bg-[#FAF7F0] border border-[#DDD7CC] rounded-lg p-6 shadow-editorial space-y-4">
        <div className="pb-3 border-b border-[#DDD7CC]">
          <h3 className="font-serif text-xl font-bold text-[#30312F]">
            Chi tiết dữ liệu theo từng Module
          </h3>
          <p className="text-xs text-[#77756F]">
            Thống kê số bài học, số bài đã nhập nội dung và số câu hỏi của từng Module
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MEDPATH_DISCIPLINES.map((disc) => {
            const chaps = modulesMap[disc.id] || [];
            const lessons = chaps.flatMap((c) => c.lessons);
            const htmlCount = lessons.filter(
              (l) => customContents[l.id] && customContents[l.id].trim().length > 0
            ).length;
            const modQCount =
              getQuestionsForModule(disc.id).length +
              lessons.reduce(
                (s, l) => s + getQuestionsForSingleLesson(l).length,
                0
              );

            return (
              <div
                key={disc.id}
                className="p-4 rounded-lg bg-white border border-[#DDD7CC] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F9ECEE] text-[#782F3B] border border-[#E8B4BB]">
                      {disc.code}
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#30312F] mt-1">
                      {disc.name}
                    </h4>
                    <div className="text-xs italic font-serif text-[#77756F]">
                      {disc.latinName}
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs text-[#565551]">
                    <div>
                      <strong>{lessons.length}</strong> bài học
                    </div>
                    <div>
                      <strong>{chaps.length}</strong> phần
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E8E1D3] text-xs">
                  <div className="p-2.5 rounded bg-[#FAF7F0] border border-[#DDD7CC]">
                    <div className="text-[11px] text-[#77756F]">
                      Đã nhập nội dung
                    </div>
                    <div className="font-mono font-bold text-sm text-[#30312F] mt-0.5">
                      {htmlCount} / {lessons.length} bài
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-[#FAF7F0] border border-[#DDD7CC]">
                    <div className="text-[11px] text-[#77756F]">
                      Đã nhập câu hỏi
                    </div>
                    <div className="font-mono font-bold text-sm text-[#782F3B] mt-0.5">
                      {modQCount} câu hỏi
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
