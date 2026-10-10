"use client";

import { useState, useEffect, useCallback } from "react";
import { GateQuestion, Lesson } from "@/lib/medpath-data";
import { DEFAULT_LESSON_QUESTIONS } from "@/data/lesson-questions";

export interface ModuleQuestion extends GateQuestion {
  moduleId: "mod-8" | "mod-9" | "mod-10" | "mod-11";
  lessonCode?: string;
}

const MODULE_QUESTIONS_STORAGE_KEY = "medpath_module_questions_store_v3";
const LESSON_QUESTIONS_STORAGE_KEY = "medpath_lesson_questions_store_v3";
const QUESTIONS_SYNC_EVENT = "medpath-questions-sync";

// Mặc định trống hoàn toàn (0 câu hỏi) — chỉ hiển thị các câu hỏi do Quản trị viên trực tiếp nhập vào
export const DEFAULT_MODULE_QUESTIONS: Record<string, ModuleQuestion[]> = {
  "mod-8": [],
  "mod-9": [],
  "mod-10": [],
  "mod-11": [],
};

export { DEFAULT_LESSON_QUESTIONS };

// Không tự sinh câu hỏi mẫu khi chưa nhập dữ liệu
export function generateQuestionsForLesson(_lesson: Lesson): GateQuestion[] {
  return [];
}

export function useQuestionBankStore() {
  const [moduleQuestionsMap, setModuleQuestionsMap] = useState<
    Record<string, ModuleQuestion[]>
  >(() => ({
    "mod-8": [],
    "mod-9": [],
    "mod-10": [],
    "mod-11": [],
  }));

  const [lessonQuestionsMap, setLessonQuestionsMap] = useState<
    Record<string, GateQuestion[]>
  >({});

  const loadQuestions = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const savedMod = localStorage.getItem(MODULE_QUESTIONS_STORAGE_KEY);
      if (savedMod) {
        const parsed = JSON.parse(savedMod);
        if (parsed && typeof parsed === "object") {
          setModuleQuestionsMap({
            "mod-8": Array.isArray(parsed["mod-8"]) ? parsed["mod-8"] : [],
            "mod-9": Array.isArray(parsed["mod-9"]) ? parsed["mod-9"] : [],
            "mod-10": Array.isArray(parsed["mod-10"]) ? parsed["mod-10"] : [],
            "mod-11": Array.isArray(parsed["mod-11"]) ? parsed["mod-11"] : [],
          });
        }
      } else {
        setModuleQuestionsMap({
          "mod-8": [],
          "mod-9": [],
          "mod-10": [],
          "mod-11": [],
        });
      }
    } catch (e) {
      console.error("Failed to load module questions:", e);
    }

    try {
      const savedLes = localStorage.getItem(LESSON_QUESTIONS_STORAGE_KEY);
      if (savedLes) {
        const parsed = JSON.parse(savedLes);
        if (parsed && typeof parsed === "object") {
          setLessonQuestionsMap(parsed);
        }
      } else {
        setLessonQuestionsMap({});
      }
    } catch (e) {
      console.error("Failed to load lesson questions:", e);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
    const handleSync = () => loadQuestions();
    window.addEventListener(QUESTIONS_SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(QUESTIONS_SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [loadQuestions]);

  const addModuleQuestion = useCallback(
    (
      moduleId: "mod-8" | "mod-9" | "mod-10" | "mod-11",
      newQ: Omit<ModuleQuestion, "id" | "moduleId">
    ) => {
      const list = moduleQuestionsMap[moduleId] || [];
      const created: ModuleQuestion = {
        ...newQ,
        id: Date.now(),
        moduleId,
      };
      const nextMap = {
        ...moduleQuestionsMap,
        [moduleId]: [created, ...list],
      };
      setModuleQuestionsMap(nextMap);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          MODULE_QUESTIONS_STORAGE_KEY,
          JSON.stringify(nextMap)
        );
        window.dispatchEvent(new Event(QUESTIONS_SYNC_EVENT));
      }
      return created;
    },
    [moduleQuestionsMap]
  );

  const deleteModuleQuestion = useCallback(
    (moduleId: string, questionId: number) => {
      const list = moduleQuestionsMap[moduleId] || [];
      const nextMap = {
        ...moduleQuestionsMap,
        [moduleId]: list.filter((q) => q.id !== questionId),
      };
      setModuleQuestionsMap(nextMap);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          MODULE_QUESTIONS_STORAGE_KEY,
          JSON.stringify(nextMap)
        );
        window.dispatchEvent(new Event(QUESTIONS_SYNC_EVENT));
      }
    },
    [moduleQuestionsMap]
  );

  const getQuestionsForModule = useCallback(
    (moduleId: string): ModuleQuestion[] => {
      return moduleQuestionsMap[moduleId] || [];
    },
    [moduleQuestionsMap]
  );

  const getQuestionsForSingleLesson = useCallback(
    (lesson: Lesson | string): GateQuestion[] => {
      const id = typeof lesson === "string" ? lesson : lesson.id;
      const customList = lessonQuestionsMap[id];
      if (Array.isArray(customList) && customList.length > 0) {
        return customList;
      }
      return DEFAULT_LESSON_QUESTIONS[id] || [];
    },
    [lessonQuestionsMap]
  );

  const addLessonQuestion = useCallback(
    (lesson: Lesson | string, newQ: Omit<GateQuestion, "id">) => {
      const id = typeof lesson === "string" ? lesson : lesson.id;
      const currentList = lessonQuestionsMap[id] || [];
      const created: GateQuestion = {
        ...newQ,
        id: Date.now(),
      };
      const nextMap = {
        ...lessonQuestionsMap,
        [id]: [...currentList, created],
      };
      setLessonQuestionsMap(nextMap);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          LESSON_QUESTIONS_STORAGE_KEY,
          JSON.stringify(nextMap)
        );
        window.dispatchEvent(new Event(QUESTIONS_SYNC_EVENT));
      }
      return created;
    },
    [lessonQuestionsMap]
  );

  const deleteLessonQuestion = useCallback(
    (lesson: Lesson | string, questionId: number) => {
      const id = typeof lesson === "string" ? lesson : lesson.id;
      const currentList = lessonQuestionsMap[id] || [];
      const nextMap = {
        ...lessonQuestionsMap,
        [id]: currentList.filter((q) => q.id !== questionId),
      };
      setLessonQuestionsMap(nextMap);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          LESSON_QUESTIONS_STORAGE_KEY,
          JSON.stringify(nextMap)
        );
        window.dispatchEvent(new Event(QUESTIONS_SYNC_EVENT));
      }
    },
    [lessonQuestionsMap]
  );

  return {
    moduleQuestionsMap,
    lessonQuestionsMap,
    getQuestionsForModule,
    addModuleQuestion,
    deleteModuleQuestion,
    getQuestionsForSingleLesson,
    addLessonQuestion,
    deleteLessonQuestion,
  };
}
