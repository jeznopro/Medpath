"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ALL_DISCIPLINE_MODULES,
  MEDPATH_DISCIPLINES,
  Chapter,
  Lesson,
} from "@/lib/medpath-data";

const CURRICULUM_STORAGE_KEY = "medpath_curriculum_store_v3";
const CUSTOM_HTML_STORAGE_KEY = "medpath_custom_lesson_contents";
const SYNC_EVENT_NAME = "medpath-curriculum-sync";

export interface LessonFormInput {
  chapterId: string;
  code: string;
  title: string;
  latinTitle?: string;
  estimatedMinutes?: number;
  questionCount?: number;
  threshold?: number;
  objectives?: string[];
  clinicalHighlights?: string[];
  keyTerms?: string[];
  htmlContent?: string;
}

export interface ChapterFormInput {
  romanNumeral: string;
  title: string;
  latinTitle?: string;
}

function cloneDefaultModules(): Record<string, Chapter[]> {
  const raw: Record<string, Chapter[]> = JSON.parse(
    JSON.stringify(ALL_DISCIPLINE_MODULES)
  );
  const cleaned: Record<string, Chapter[]> = {};
  for (const modId of Object.keys(raw)) {
    cleaned[modId] = (raw[modId] || []).map((chap) => ({
      ...chap,
      completedLessons: 0,
      progress: 0,
      status: "not_started",
      lessons: (chap.lessons || []).map((les) => ({
        ...les,
        questionCount: 0,
        status: "not_started",
        score: undefined,
        objectives: [],
        clinicalHighlights: [],
        keyTerms: [],
      })),
    }));
  }
  return cleaned;
}

function recalculateChapterStats(chapter: Chapter): Chapter {
  const totalLessons = chapter.lessons.length;
  const completedLessons = chapter.lessons.filter(
    (l) => l.status === "completed"
  ).length;
  const progress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  return {
    ...chapter,
    totalLessons,
    completedLessons,
    progress,
  };
}

export function useMedPathCurriculum() {
  const [modulesMap, setModulesMap] = useState<Record<string, Chapter[]>>(() =>
    cloneDefaultModules()
  );
  const [customContents, setCustomContents] = useState<Record<string, string>>(
    {}
  );
  const [isHydrated, setIsHydrated] = useState(false);

  const loadFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const savedCurriculum = localStorage.getItem(CURRICULUM_STORAGE_KEY);
      if (savedCurriculum) {
        const parsed = JSON.parse(savedCurriculum);
        if (parsed && typeof parsed === "object") {
          // Ensure all 4 modules exist
          const merged: Record<string, Chapter[]> = cloneDefaultModules();
          for (const key of Object.keys(parsed)) {
            if (Array.isArray(parsed[key])) {
              merged[key] = parsed[key];
            }
          }
          setModulesMap(merged);
        }
      } else {
        setModulesMap(cloneDefaultModules());
      }
    } catch (e) {
      console.error("Failed to load curriculum from localStorage:", e);
    }

    try {
      const savedHtml = localStorage.getItem(CUSTOM_HTML_STORAGE_KEY);
      if (savedHtml) {
        const parsedHtml = JSON.parse(savedHtml);
        if (parsedHtml && typeof parsedHtml === "object") {
          setCustomContents(parsedHtml);
        }
      }
    } catch (e) {
      console.error("Failed to load custom HTML from localStorage:", e);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();
    setIsHydrated(true);

    const handleSync = () => {
      loadFromStorage();
    };

    window.addEventListener(SYNC_EVENT_NAME, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(SYNC_EVENT_NAME, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [loadFromStorage]);

  const persistModules = useCallback((nextMap: Record<string, Chapter[]>) => {
    setModulesMap(nextMap);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CURRICULUM_STORAGE_KEY, JSON.stringify(nextMap));
        window.dispatchEvent(new Event(SYNC_EVENT_NAME));
      } catch (e) {
        console.error("Failed to save curriculum to localStorage:", e);
      }
    }
  }, []);

  const persistCustomHtml = useCallback(
    (nextHtmlMap: Record<string, string>) => {
      setCustomContents(nextHtmlMap);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            CUSTOM_HTML_STORAGE_KEY,
            JSON.stringify(nextHtmlMap)
          );
          window.dispatchEvent(new Event(SYNC_EVENT_NAME));
        } catch (e) {
          console.error("Failed to save custom HTML to localStorage:", e);
        }
      }
    },
    []
  );

  const addLesson = useCallback(
    (disciplineId: string, input: LessonFormInput): Lesson => {
      const chapters = modulesMap[disciplineId] || [];
      const targetChapterId =
        input.chapterId || chapters[0]?.id || `${disciplineId}-chap-1`;

      const newLessonId = `les-${disciplineId.replace("mod-", "")}-custom-${Date.now()}`;
      const newLesson: Lesson = {
        id: newLessonId,
        chapterId: targetChapterId,
        code: input.code.trim() || `BAI.${Date.now().toString().slice(-3)}`,
        title: input.title.trim() || "Bài giảng mới",
        latinTitle: input.latinTitle?.trim() || "",
        estimatedMinutes: Number(input.estimatedMinutes) || 45,
        questionCount: Number(input.questionCount) || 0,
        status: "not_started",
        threshold: Number(input.threshold) || 80,
        objectives:
          input.objectives && input.objectives.length > 0
            ? input.objectives
            : [],
        clinicalHighlights:
          input.clinicalHighlights && input.clinicalHighlights.length > 0
            ? input.clinicalHighlights
            : [],
        keyTerms:
          input.keyTerms && input.keyTerms.length > 0
            ? input.keyTerms
            : [],
      };

      let chapterFound = false;
      const updatedChapters = chapters.map((chap) => {
        if (chap.id === targetChapterId) {
          chapterFound = true;
          return recalculateChapterStats({
            ...chap,
            lessons: [...chap.lessons, newLesson],
          });
        }
        return chap;
      });

      if (!chapterFound) {
        if (updatedChapters.length > 0) {
          updatedChapters[0] = recalculateChapterStats({
            ...updatedChapters[0],
            lessons: [...updatedChapters[0].lessons, newLesson],
          });
        } else {
          updatedChapters.push(
            recalculateChapterStats({
              id: targetChapterId,
              disciplineId,
              romanNumeral: "PHẦN I",
              title: "Chương trình đào tạo chính khóa",
              latinTitle: "Sectio I",
              totalLessons: 1,
              completedLessons: 0,
              progress: 0,
              status: "not_started",
              lessons: [newLesson],
            })
          );
        }
      }

      const nextMap = {
        ...modulesMap,
        [disciplineId]: updatedChapters,
      };
      persistModules(nextMap);

      if (input.htmlContent !== undefined && input.htmlContent.trim() !== "") {
        const nextHtml = {
          ...customContents,
          [newLessonId]: input.htmlContent,
        };
        persistCustomHtml(nextHtml);
      }

      return newLesson;
    },
    [modulesMap, customContents, persistModules, persistCustomHtml]
  );

  const updateLesson = useCallback(
    (
      disciplineId: string,
      lessonId: string,
      input: LessonFormInput
    ): Lesson | null => {
      const chapters = modulesMap[disciplineId] || [];
      let existingLesson: Lesson | null = null;
      let oldChapterId = "";

      for (const chap of chapters) {
        const found = chap.lessons.find((l) => l.id === lessonId);
        if (found) {
          existingLesson = found;
          oldChapterId = chap.id;
          break;
        }
      }

      if (!existingLesson) return null;

      const targetChapterId = input.chapterId || oldChapterId;
      const updatedLesson: Lesson = {
        ...existingLesson,
        chapterId: targetChapterId,
        code: input.code.trim() || existingLesson.code,
        title: input.title.trim() || existingLesson.title,
        latinTitle:
          input.latinTitle !== undefined && input.latinTitle.trim() !== ""
            ? input.latinTitle.trim()
            : existingLesson.latinTitle,
        estimatedMinutes:
          Number(input.estimatedMinutes) || existingLesson.estimatedMinutes,
        questionCount:
          Number(input.questionCount) || existingLesson.questionCount,
        threshold: Number(input.threshold) || existingLesson.threshold,
        objectives:
          input.objectives && input.objectives.length > 0
            ? input.objectives
            : existingLesson.objectives,
        clinicalHighlights:
          input.clinicalHighlights && input.clinicalHighlights.length > 0
            ? input.clinicalHighlights
            : existingLesson.clinicalHighlights,
        keyTerms:
          input.keyTerms && input.keyTerms.length > 0
            ? input.keyTerms
            : existingLesson.keyTerms,
      };

      const updatedChapters = chapters.map((chap) => {
        // Same chapter: update in place
        if (chap.id === oldChapterId && chap.id === targetChapterId) {
          return recalculateChapterStats({
            ...chap,
            lessons: chap.lessons.map((l) =>
              l.id === lessonId ? updatedLesson : l
            ),
          });
        }
        // Moved out of old chapter
        if (chap.id === oldChapterId && chap.id !== targetChapterId) {
          return recalculateChapterStats({
            ...chap,
            lessons: chap.lessons.filter((l) => l.id !== lessonId),
          });
        }
        // Moved into new chapter
        if (chap.id === targetChapterId && chap.id !== oldChapterId) {
          return recalculateChapterStats({
            ...chap,
            lessons: [...chap.lessons, updatedLesson],
          });
        }
        return chap;
      });

      persistModules({
        ...modulesMap,
        [disciplineId]: updatedChapters,
      });

      if (input.htmlContent !== undefined) {
        persistCustomHtml({
          ...customContents,
          [lessonId]: input.htmlContent,
        });
      }

      return updatedLesson;
    },
    [modulesMap, customContents, persistModules, persistCustomHtml]
  );

  const deleteLesson = useCallback(
    (disciplineId: string, lessonId: string) => {
      const chapters = modulesMap[disciplineId] || [];
      const updatedChapters = chapters.map((chap) =>
        recalculateChapterStats({
          ...chap,
          lessons: chap.lessons.filter((l) => l.id !== lessonId),
        })
      );

      persistModules({
        ...modulesMap,
        [disciplineId]: updatedChapters,
      });
    },
    [modulesMap, persistModules]
  );

  const addChapter = useCallback(
    (disciplineId: string, input: ChapterFormInput): Chapter => {
      const chapters = modulesMap[disciplineId] || [];
      const newChapId = `${disciplineId}-chap-${Date.now()}`;
      const newChapter: Chapter = {
        id: newChapId,
        disciplineId,
        romanNumeral:
          input.romanNumeral.trim() || `PHẦN ${chapters.length + 1}`,
        title: input.title.trim() || "Chuyên đề mới",
        latinTitle:
          input.latinTitle?.trim() ||
          `Sectio ${chapters.length + 1} • Chương trình tích hợp`,
        totalLessons: 0,
        completedLessons: 0,
        progress: 0,
        status: "not_started",
        lessons: [],
      };

      persistModules({
        ...modulesMap,
        [disciplineId]: [...chapters, newChapter],
      });

      return newChapter;
    },
    [modulesMap, persistModules]
  );

  const deleteChapter = useCallback(
    (disciplineId: string, chapterId: string) => {
      const chapters = modulesMap[disciplineId] || [];
      persistModules({
        ...modulesMap,
        [disciplineId]: chapters.filter((c) => c.id !== chapterId),
      });
    },
    [modulesMap, persistModules]
  );

  const saveLessonHtml = useCallback(
    (lessonId: string, htmlContent: string) => {
      persistCustomHtml({
        ...customContents,
        [lessonId]: htmlContent,
      });
    },
    [customContents, persistCustomHtml]
  );

  const resetToDefaultCurriculum = useCallback(() => {
    const defaults = cloneDefaultModules();
    setModulesMap(defaults);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(CURRICULUM_STORAGE_KEY);
        window.dispatchEvent(new Event(SYNC_EVENT_NAME));
      } catch (e) {
        console.error("Failed to reset curriculum:", e);
      }
    }
  }, []);

  return {
    modulesMap,
    customContents,
    isHydrated,
    addLesson,
    updateLesson,
    deleteLesson,
    addChapter,
    deleteChapter,
    saveLessonHtml,
    resetToDefaultCurriculum,
  };
}
