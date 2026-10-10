import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { Lesson, Section, SectionContentType, Subject } from "@/lib/types";

// GET: Lấy toàn bộ cây Môn học -> Bài học -> Mục cho Admin quản lý
export async function GET() {
  try {
    const classes = db.getClasses();
    const defaultClassId = classes[0]?.id || "class-anat-1";
    const subjects = db.getSubjects(defaultClassId);

    const fullTree = subjects.map((sub) => {
      const lessons = db.getLessons(sub.id).map((les) => {
        const sections = db.getSections(les.id).map((sec) => {
          const questions = db.getQuestions(sec.id);
          return {
            ...sec,
            question_count: questions.length,
          };
        });
        return {
          ...les,
          sections,
        };
      });
      return {
        ...sub,
        lessons,
      };
    });

    return NextResponse.json({
      success: true,
      subjects: fullTree,
      classes,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // Trường hợp 1: Tải lên file HTML hoặc Markdown trực tiếp qua FormData
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const lessonId = formData.get("lesson_id") as string;
      const title = formData.get("title") as string;
      const passThreshold = parseInt((formData.get("pass_threshold") as string) || "80", 10);
      const questionsPerAttempt = parseInt((formData.get("questions_per_attempt") as string) || "10", 10);
      const isCore = formData.get("is_core") === "true";
      let sectionType: SectionContentType = "html";

      if (!lessonId || !title) {
        return NextResponse.json(
          { error: "Vui lòng nhập tên mục/bài và chọn bài học cha (lesson_id)" },
          { status: 400 }
        );
      }

      let content = "";
      if (file) {
        const text = await file.text();
        content = text;
        if (file.name.endsWith(".md") || file.name.endsWith(".markdown")) {
          sectionType = "markdown";
        } else if (file.name.endsWith(".pdf")) {
          sectionType = "pdf";
        } else {
          sectionType = "html";
        }
      } else {
        content = (formData.get("content") as string) || "<p>Chưa có nội dung</p>";
        sectionType = ((formData.get("content_type") as string) as SectionContentType) || "html";
      }

      const existingSections = db.getSections(lessonId);
      const nextOrder = existingSections.length + 1;
      const newSectionId = `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      const newSection: Section = {
        id: newSectionId,
        lesson_id: lessonId,
        title: title.trim(),
        order: nextOrder,
        content_type: sectionType,
        content_url_or_text: content,
        pass_threshold: passThreshold,
        questions_per_attempt: questionsPerAttempt,
        is_core: isCore,
      };

      db.createSection(newSection);

      return NextResponse.json({
        success: true,
        message: `Đã tạo thành công mục/sách HTML: "${title}"`,
        section: newSection,
      });
    }

    // Trường hợp 2: Gửi JSON thông thường
    const body = await request.json();
    const { action } = body;

    // --- TẠO MÔN HỌC MỚI (Create Subject) ---
    if (action === "create_subject") {
      const { class_id, title } = body;
      const targetClassId = class_id || db.getClasses()[0]?.id || "class-anat-1";
      if (!title?.trim()) {
        return NextResponse.json({ error: "Thiếu tiêu đề môn học" }, { status: 400 });
      }

      const existingSubjects = db.getSubjects(targetClassId);
      const newSubject: Subject = {
        id: `subj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        class_id: targetClassId,
        title: title.trim(),
        order: existingSubjects.length + 1,
      };

      db.createSubject(newSubject);
      return NextResponse.json({ success: true, subject: newSubject });
    }

    // --- XÓA MÔN HỌC (Delete Subject) ---
    if (action === "delete_subject") {
      const { subject_id } = body;
      if (!subject_id) {
        return NextResponse.json({ error: "Thiếu subject_id" }, { status: 400 });
      }

      const lessons = db.getLessons(subject_id);
      lessons.forEach((l) => db.deleteLesson(l.id));
      (db as any).data.subjects = (db as any).data.subjects.filter((s: any) => s.id !== subject_id);
      (db as any).saveData((db as any).data);

      return NextResponse.json({ success: true, message: "Đã xóa môn học thành công" });
    }

    // --- TẠO BÀI HỌC MỚI (Create Lesson) ---
    if (action === "create_lesson") {
      const { subject_id, title } = body;
      if (!subject_id || !title?.trim()) {
        return NextResponse.json(
          { error: "Thiếu subject_id hoặc tiêu đề bài học" },
          { status: 400 }
        );
      }

      const existingLessons = db.getLessons(subject_id);
      const newLesson: Lesson = {
        id: `lesson-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        subject_id,
        title: title.trim(),
        order: existingLessons.length + 1,
      };

      db.createLesson(newLesson);
      return NextResponse.json({ success: true, lesson: newLesson });
    }

    // --- TẠO MỤC MỚI (Create Section via JSON) ---
    if (action === "create_section") {
      const {
        lesson_id,
        title,
        content_type,
        content_url_or_text,
        pass_threshold,
        questions_per_attempt,
        is_core,
      } = body;

      if (!lesson_id || !title?.trim()) {
        return NextResponse.json(
          { error: "Thiếu lesson_id hoặc tiêu đề mục" },
          { status: 400 }
        );
      }

      const existingSections = db.getSections(lesson_id);
      const newSection: Section = {
        id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        lesson_id,
        title: title.trim(),
        order: existingSections.length + 1,
        content_type: content_type || "html",
        content_url_or_text: content_url_or_text || "<p>Nội dung đang cập nhật...</p>",
        pass_threshold: pass_threshold || 80,
        questions_per_attempt: questionsPerAttempt(questions_per_attempt),
        is_core: is_core !== false,
      };

      db.createSection(newSection);
      return NextResponse.json({ success: true, section: newSection });
    }

    // --- XÓA BÀI HỌC (Delete Lesson) ---
    if (action === "delete_lesson") {
      const { lesson_id } = body;
      if (!lesson_id) {
        return NextResponse.json({ error: "Thiếu lesson_id" }, { status: 400 });
      }

      db.deleteLesson(lesson_id);
      return NextResponse.json({ success: true, message: "Đã xóa bài học thành công" });
    }

    // --- XÓA MỤC (Delete Section) ---
    if (action === "delete_section") {
      const { section_id } = body;
      if (!section_id) {
        return NextResponse.json({ error: "Thiếu section_id" }, { status: 400 });
      }

      db.deleteSection(section_id);
      return NextResponse.json({ success: true, message: "Đã xóa mục thành công" });
    }

    return NextResponse.json({ error: "Hành động không hợp lệ" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function questionsPerAttempt(val: any): number {
  const parsed = parseInt(val, 10);
  return isNaN(parsed) || parsed <= 0 ? 10 : parsed;
}
