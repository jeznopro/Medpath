import fs from "fs";
import path from "path";
import {
  Attempt,
  ClassItem,
  ClassMember,
  DailyActivity,
  Highlight,
  Lesson,
  Profile,
  Question,
  QuestionReport,
  ReportStatus,
  ReviewQueueItem,
  Section,
  SectionProgress,
  StudentLeaderboardEntry,
  Subject,
} from "../types";
import {
  SEED_CLASSES,
  SEED_LESSONS,
  SEED_PROFILES,
  SEED_QUESTIONS,
  SEED_SECTIONS,
  SEED_SUBJECTS,
} from "../../data/anatomy-seed";

interface MedReadDatabase {
  profiles: Profile[];
  classes: ClassItem[];
  class_members: ClassMember[];
  subjects: Subject[];
  lessons: Lesson[];
  sections: Section[];
  questions: Question[];
  attempts: Attempt[];
  section_progress: SectionProgress[];
  highlights: Highlight[];
  review_queue: ReviewQueueItem[];
  question_reports: QuestionReport[];
  daily_activity: DailyActivity[];
}

const DB_FILE_PATH = path.join(process.cwd(), "data", "medread-db.json");


function getDefaultData(): MedReadDatabase {
  // Sinh viên mẫu mặc định mở khóa mục 1.1 của bài 1
  const defaultProgress: SectionProgress[] = [
    {
      user_id: "student-1",
      section_id: "sec-1-1",
      status: "unlocked",
      best_score: 0,
      attempts_count: 0,
    },
    {
      user_id: "student-1",
      section_id: "sec-1-2",
      status: "locked",
      best_score: 0,
      attempts_count: 0,
    },
    {
      user_id: "student-1",
      section_id: "sec-2-1",
      status: "locked",
      best_score: 0,
      attempts_count: 0,
    },
    {
      user_id: "student-1",
      section_id: "sec-2-2",
      status: "locked",
      best_score: 0,
      attempts_count: 0,
    },
  ];

  const defaultMembers: ClassMember[] = [
    {
      class_id: "class-anat-1",
      user_id: "student-1",
      role: "student",
      joined_at: new Date().toISOString(),
    },
    {
      class_id: "class-anat-1",
      user_id: "teacher-1",
      role: "teacher",
      joined_at: new Date().toISOString(),
    },
  ];

  return {
    profiles: SEED_PROFILES,
    classes: SEED_CLASSES,
    class_members: defaultMembers,
    subjects: SEED_SUBJECTS,
    lessons: SEED_LESSONS,
    sections: SEED_SECTIONS,
    questions: SEED_QUESTIONS,
    attempts: [],
    section_progress: defaultProgress,
    highlights: [],
    review_queue: [
      {
        id: "rev-seed-1",
        user_id: "student-1",
        question_id: "q-1-1",
        box: 1,
        next_due_at: new Date().toISOString(),
        wrong_count: 1,
        last_result: "wrong",
        updated_at: new Date().toISOString(),
      },
      {
        id: "rev-seed-2",
        user_id: "student-1",
        question_id: "q-1-4",
        box: 2,
        next_due_at: new Date().toISOString(),
        wrong_count: 1,
        last_result: "wrong",
        updated_at: new Date().toISOString(),
      },
    ],
    question_reports: [],
    daily_activity: [
      {
        user_id: "student-1",
        date: new Date().toISOString().split("T")[0],
        questions_done: 10,
        minutes: 15,
      },
    ],
  };
}

class DatabaseStore {
  private data: MedReadDatabase;

  constructor() {
    this.data = this.load();
  }

  private load(): MedReadDatabase {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
        const parsed = JSON.parse(raw);
        parsed.highlights = parsed.highlights || [];
        parsed.review_queue = parsed.review_queue || [];
        parsed.question_reports = parsed.question_reports || [];
        parsed.daily_activity = parsed.daily_activity || [];
        return parsed;
      }
    } catch (err) {
      console.error("Error reading database file, using defaults:", err);
    }
    const def = getDefaultData();
    this.saveData(def);
    return def;
  }

  private saveData(data: MedReadDatabase) {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error saving database file:", err);
    }
  }

  public resetToSeed() {
    this.data = getDefaultData();
    this.saveData(this.data);
    return this.data;
  }

  // --- Profiles & Auth ---
  public getProfiles() {
    return this.data.profiles;
  }

  public getProfile(id: string) {
    return this.data.profiles.find((p) => p.id === id);
  }

  public getProfileById(id: string) {
    return this.getProfile(id);
  }


  public findUserByEmail(email: string) {
    return this.data.profiles.find(
      (p) => p.email.toLowerCase() === email.trim().toLowerCase()
    );
  }

  public createUser(fullName: string, email: string, role: "student" | "teacher" | "admin" = "student") {
    const existing = this.findUserByEmail(email);
    if (existing) {
      throw new Error(`Email "${email}" đã tồn tại trong hệ thống`);
    }

    const newUser: Profile = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      full_name: fullName,
      email: email.trim().toLowerCase(),
      role,
      created_at: new Date().toISOString(),
    };

    this.data.profiles.push(newUser);
    this.saveData(this.data);
    return newUser;
  }

  public updateUserRole(userId: string, newRole: "student" | "teacher" | "admin") {
    const user = this.data.profiles.find((p) => p.id === userId);
    if (!user) throw new Error("Không tìm thấy người dùng");
    user.role = newRole;
    this.saveData(this.data);
    return user;
  }

  public deleteUser(userId: string) {
    this.data.profiles = this.data.profiles.filter((p) => p.id !== userId);
    this.data.class_members = this.data.class_members.filter((m) => m.user_id !== userId);
    this.data.section_progress = this.data.section_progress.filter((p) => p.user_id !== userId);
    this.data.attempts = this.data.attempts.filter((a) => a.user_id !== userId);
    this.saveData(this.data);
    return true;
  }

  public getSystemStats() {
    const totalUsers = this.data.profiles.length;
    const totalClasses = this.data.classes.length;
    const totalQuestions = this.data.questions.length;
    const totalAttempts = this.data.attempts.length;
    const passedAttempts = this.data.attempts.filter((a) => a.passed).length;
    const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;
    const avgScore =
      totalAttempts > 0
        ? Math.round(
            this.data.attempts.reduce((sum, a) => sum + (a.score_pct || 0), 0) / totalAttempts
          )
        : 0;

    return {
      totalUsers,
      totalClasses,
      totalQuestions,
      totalAttempts,
      passedAttempts,
      passRate,
      avgScore,
      roleCounts: {
        admin: this.data.profiles.filter((p) => p.role === "admin").length,
        teacher: this.data.profiles.filter((p) => p.role === "teacher").length,
        student: this.data.profiles.filter((p) => p.role === "student").length,
      },
    };
  }

  // --- Classes ---
  public getClasses(userId?: string) {
    if (!userId) return this.data.classes;
    const memberClassIds = this.data.class_members
      .filter((m) => m.user_id === userId)
      .map((m) => m.class_id);
    return this.data.classes.filter(
      (c) => c.owner_id === userId || memberClassIds.includes(c.id)
    );
  }

  public getClassById(id: string) {
    return this.data.classes.find((c) => c.id === id);
  }

  public getClassByJoinCode(code: string) {
    return this.data.classes.find(
      (c) => c.join_code.toUpperCase() === code.trim().toUpperCase()
    );
  }

  public createClass(cls: ClassItem) {
    this.data.classes.push(cls);
    this.data.class_members.push({
      class_id: cls.id,
      user_id: cls.owner_id,
      role: "teacher",
      joined_at: new Date().toISOString(),
    });
    this.saveData(this.data);
    return cls;
  }

  public joinClass(classId: string, userId: string, role: "student" | "teacher" = "student") {
    const existing = this.data.class_members.find(
      (m) => m.class_id === classId && m.user_id === userId
    );
    if (existing) return existing;

    const newMember: ClassMember = {
      class_id: classId,
      user_id: userId,
      role,
      joined_at: new Date().toISOString(),
    };
    this.data.class_members.push(newMember);

    // Mở khóa mục đầu tiên của môn học trong lớp cho học viên này nếu chưa có
    const classSubjects = this.getSubjects(classId);
    if (classSubjects.length > 0) {
      const firstLessons = this.getLessons(classSubjects[0].id);
      if (firstLessons.length > 0) {
        const firstSections = this.getSections(firstLessons[0].id);
        if (firstSections.length > 0) {
          const firstSecId = firstSections[0].id;
          const prog = this.data.section_progress.find(
            (p) => p.user_id === userId && p.section_id === firstSecId
          );
          if (!prog) {
            this.data.section_progress.push({
              user_id: userId,
              section_id: firstSecId,
              status: "unlocked",
              best_score: 0,
              attempts_count: 0,
            });
          }
        }
      }
    }

    this.saveData(this.data);
    return newMember;
  }

  // --- Curriculum ---
  public getSubjects(classId: string) {
    return this.data.subjects
      .filter((s) => s.class_id === classId)
      .sort((a, b) => a.order - b.order);
  }

  public getLessons(subjectId: string) {
    return this.data.lessons
      .filter((l) => l.subject_id === subjectId)
      .sort((a, b) => a.order - b.order);
  }

  public getSections(lessonId: string) {
    return this.data.sections
      .filter((sec) => sec.lesson_id === lessonId)
      .sort((a, b) => a.order - b.order);
  }

  public getSectionById(sectionId: string) {
    return this.data.sections.find((s) => s.id === sectionId);
  }

  public getLessonById(lessonId: string) {
    return this.data.lessons.find((l) => l.id === lessonId);
  }

  public getSubjectById(subjectId: string) {
    return this.data.subjects.find((s) => s.id === subjectId);
  }

  public createSubject(sub: Subject) {
    this.data.subjects.push(sub);
    this.saveData(this.data);
    return sub;
  }

  public createLesson(lesson: Lesson) {
    this.data.lessons.push(lesson);
    this.saveData(this.data);
    return lesson;
  }

  public updateLesson(lessonId: string, updates: Partial<Lesson>) {
    const idx = this.data.lessons.findIndex((l) => l.id === lessonId);
    if (idx >= 0) {
      this.data.lessons[idx] = { ...this.data.lessons[idx], ...updates };
      this.saveData(this.data);
      return this.data.lessons[idx];
    }
    return null;
  }

  public deleteLesson(lessonId: string) {
    const sectionsToDelete = this.getSections(lessonId);
    sectionsToDelete.forEach((sec) => {
      this.deleteSection(sec.id);
    });
    this.data.lessons = this.data.lessons.filter((l) => l.id !== lessonId);
    this.saveData(this.data);
    return true;
  }

  public createSection(sec: Section) {
    this.data.sections.push(sec);
    this.saveData(this.data);
    return sec;
  }

  public updateSection(sectionId: string, updates: Partial<Section>) {
    const idx = this.data.sections.findIndex((s) => s.id === sectionId);
    if (idx >= 0) {
      this.data.sections[idx] = { ...this.data.sections[idx], ...updates };
      this.saveData(this.data);
      return this.data.sections[idx];
    }
    return null;
  }

  public deleteSection(sectionId: string) {
    this.data.sections = this.data.sections.filter((s) => s.id !== sectionId);
    this.data.questions = this.data.questions.filter((q) => q.section_id !== sectionId);
    this.data.section_progress = this.data.section_progress.filter((p) => p.section_id !== sectionId);
    this.data.attempts = this.data.attempts.filter((a) => a.section_id !== sectionId);
    this.saveData(this.data);
    return true;
  }

  // --- Questions ---
  public getQuestions(sectionId?: string) {
    if (!sectionId) return this.data.questions;
    return this.data.questions.filter((q) => q.section_id === sectionId && q.is_active !== false);
  }

  public getQuestionById(id: string) {
    return this.data.questions.find((q) => q.id === id);
  }

  public addQuestion(question: Question) {
    this.data.questions.push(question);
    this.saveData(this.data);
    return question;
  }

  public addQuestionsBatch(questions: Question[]) {
    this.data.questions.push(...questions);
    this.saveData(this.data);
    return questions;
  }

  public deleteQuestion(id: string) {
    this.data.questions = this.data.questions.filter((q) => q.id !== id);
    this.saveData(this.data);
    return true;
  }

  // --- Progress & Attempts ---
  public getUserProgress(userId: string) {
    return this.data.section_progress.filter((p) => p.user_id === userId);
  }

  public getSectionProgress(userId: string, sectionId: string): SectionProgress {
    const existing = this.data.section_progress.find(
      (p) => p.user_id === userId && p.section_id === sectionId
    );
    if (existing) return existing;

    // Check if it's the very first section of the curriculum; if so, default to unlocked
    const newProgress: SectionProgress = {
      user_id: userId,
      section_id: sectionId,
      status: "locked",
      best_score: 0,
      attempts_count: 0,
    };
    this.data.section_progress.push(newProgress);
    this.saveData(this.data);
    return newProgress;
  }

  public updateSectionProgress(
    userId: string,
    sectionId: string,
    updates: Partial<SectionProgress>
  ) {
    const index = this.data.section_progress.findIndex(
      (p) => p.user_id === userId && p.section_id === sectionId
    );
    if (index >= 0) {
      this.data.section_progress[index] = {
        ...this.data.section_progress[index],
        ...updates,
      };
    } else {
      this.data.section_progress.push({
        user_id: userId,
        section_id: sectionId,
        status: updates.status || "unlocked",
        best_score: updates.best_score || 0,
        attempts_count: updates.attempts_count || 1,
        ...updates,
      });
    }
    this.saveData(this.data);
  }

  public recordAttempt(attempt: Attempt) {
    this.data.attempts.push(attempt);
    this.saveData(this.data);
    return attempt;
  }

  public getUserAttempts(userId: string, sectionId?: string) {
    return this.data.attempts
      .filter((a) => a.user_id === userId && (!sectionId || a.section_id === sectionId))
      .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
  }

  // Find next section in curriculum
  public getNextSection(currentSectionId: string): Section | null {
    const current = this.getSectionById(currentSectionId);
    if (!current) return null;

    const lessonSections = this.getSections(current.lesson_id);
    const nextInLesson = lessonSections.find((s) => s.order > current.order);
    if (nextInLesson) return nextInLesson;

    // Next lesson in subject
    const currentLesson = this.data.lessons.find((l) => l.id === current.lesson_id);
    if (!currentLesson) return null;

    const subjectLessons = this.getLessons(currentLesson.subject_id);
    const nextLesson = subjectLessons.find((l) => l.order > currentLesson.order);
    if (nextLesson) {
      const nextLessonSections = this.getSections(nextLesson.id);
      if (nextLessonSections.length > 0) {
        return nextLessonSections[0];
      }
    }

    return null;
  }

  // ==========================================
  // HIGHLIGHTS & NOTES
  // ==========================================
  public getHighlights(userId: string, sectionId?: string): Highlight[] {
    return this.data.highlights
      .filter((h) => h.user_id === userId && (!sectionId || h.section_id === sectionId))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public addHighlight(item: Omit<Highlight, "id" | "created_at">): Highlight {
    const section = this.getSectionById(item.section_id);
    const lesson = section ? this.data.lessons.find((l) => l.id === section.lesson_id) : undefined;
    const highlight: Highlight = {
      ...item,
      id: `hl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      section_title: section?.title,
      lesson_title: lesson?.title,
      created_at: new Date().toISOString(),
    };
    this.data.highlights.push(highlight);
    this.saveData(this.data);
    return highlight;
  }

  public deleteHighlight(id: string): boolean {
    const initialLen = this.data.highlights.length;
    this.data.highlights = this.data.highlights.filter((h) => h.id !== id);
    if (this.data.highlights.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // ==========================================
  // SPACED REPETITION (LEITNER BOX QUEUE)
  // ==========================================
  public getReviewQueue(userId: string): (ReviewQueueItem & { question?: Question })[] {
    return this.data.review_queue
      .filter((item) => item.user_id === userId)
      .map((item) => ({
        ...item,
        question: this.getQuestionById(item.question_id),
      }))
      .filter((item) => Boolean(item.question));
  }

  public getDueReviewItems(userId: string): (ReviewQueueItem & { question?: Question })[] {
    const now = new Date();
    return this.getReviewQueue(userId).filter(
      (item) => new Date(item.next_due_at) <= now
    );
  }

  public queueQuestionForReview(
    userId: string,
    questionId: string,
    isCorrect: boolean
  ): ReviewQueueItem {
    const existingIndex = this.data.review_queue.findIndex(
      (item) => item.user_id === userId && item.question_id === questionId
    );

    const now = new Date();
    // Leitner intervals in days: Box 1: 1d, Box 2: 3d, Box 3: 7d, Box 4: 14d, Box 5: 30d
    const intervals: Record<number, number> = {
      1: 1,
      2: 3,
      3: 7,
      4: 14,
      5: 30,
    };

    if (existingIndex >= 0) {
      const current = this.data.review_queue[existingIndex];
      let newBox = current.box;
      let wrongCount = current.wrong_count;

      if (isCorrect) {
        newBox = Math.min(5, current.box + 1);
      } else {
        newBox = 1; // Sai thì reset về Hộp 1
        wrongCount += 1;
      }

      const daysToAdd = intervals[newBox] || 1;
      const nextDue = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

      this.data.review_queue[existingIndex] = {
        ...current,
        box: newBox,
        wrong_count: wrongCount,
        last_result: isCorrect ? "correct" : "wrong",
        next_due_at: nextDue.toISOString(),
        updated_at: now.toISOString(),
      };
      this.saveData(this.data);
      return this.data.review_queue[existingIndex];
    } else {
      // Chỉ tự động thêm mới vào hàng đợi nếu làm sai (hoặc người dùng chủ động lưu)
      const newBox = 1;
      // Nếu sai thì đến hạn sau 1 ngày (hoặc để kiểm tra ngay, ta có thể cho đến hạn ngay trong hôm nay)
      const nextDue = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
      const newItem: ReviewQueueItem = {
        id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        user_id: userId,
        question_id: questionId,
        box: newBox,
        next_due_at: nextDue.toISOString(),
        wrong_count: isCorrect ? 0 : 1,
        last_result: isCorrect ? "correct" : "wrong",
        updated_at: now.toISOString(),
      };
      this.data.review_queue.push(newItem);
      this.saveData(this.data);
      return newItem;
    }
  }

  public answerReviewItem(
    userId: string,
    questionId: string,
    isCorrect: boolean
  ): ReviewQueueItem {
    return this.queueQuestionForReview(userId, questionId, isCorrect);
  }

  // ==========================================
  // QUESTION BUG REPORTS
  // ==========================================
  public getQuestionReports(): QuestionReport[] {
    return this.data.question_reports
      .map((r) => {
        const q = this.getQuestionById(r.question_id);
        const reporter = this.getProfileById(r.reporter_id);
        return {
          ...r,
          question_body: q?.body,
          reporter_name: reporter?.full_name || r.reporter_name || "Học viên",
        };
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public addQuestionReport(
    report: Omit<QuestionReport, "id" | "status" | "created_at">
  ): QuestionReport {
    const q = this.getQuestionById(report.question_id);
    const reporter = this.getProfileById(report.reporter_id);
    const item: QuestionReport = {
      ...report,
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: "pending",
      reporter_name: reporter?.full_name || "Học viên",
      question_body: q?.body,
      created_at: new Date().toISOString(),
    };
    this.data.question_reports.push(item);
    this.saveData(this.data);
    return item;
  }

  public updateQuestionReport(
    id: string,
    status: ReportStatus
  ): boolean {
    const rep = this.data.question_reports.find((r) => r.id === id);
    if (rep) {
      rep.status = status;
      rep.resolved_at = new Date().toISOString();
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // ==========================================
  // DAILY ACTIVITY & STREAK
  // ==========================================
  public recordDailyActivity(userId: string, questionsCount: number, minutes: number = 5) {
    const today = new Date().toISOString().split("T")[0];
    const existing = this.data.daily_activity.find(
      (a) => a.user_id === userId && a.date === today
    );

    if (existing) {
      existing.questions_done += questionsCount;
      existing.minutes += minutes;
    } else {
      this.data.daily_activity.push({
        user_id: userId,
        date: today,
        questions_done: questionsCount,
        minutes,
      });
    }
    this.saveData(this.data);
  }

  public getUserActivity(userId: string) {
    const activities = this.data.daily_activity
      .filter((a) => a.user_id === userId)
      .sort((a, b) => b.date.localeCompare(a.date));

    const todayStr = new Date().toISOString().split("T")[0];
    const todayActivity = activities.find((a) => a.date === todayStr);

    let streak = 0;
    const checkDate = new Date();
    const todayDone = activities.some((a) => a.date === todayStr && a.questions_done > 0);
    if (!todayDone) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    for (let i = 0; i < 365; i++) {
      const dStr = checkDate.toISOString().split("T")[0];
      const hasAct = activities.some((a) => a.date === dStr && a.questions_done > 0);
      if (hasAct) {
        streak += 1;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      streak: todayDone ? streak : streak,
      todayQuestions: todayActivity ? todayActivity.questions_done : 0,
      todayMinutes: todayActivity ? todayActivity.minutes : 0,
      history: activities.slice(0, 14),
    };
  }

  // ==========================================
  // LEADERBOARD
  // ==========================================
  public getLeaderboard(): StudentLeaderboardEntry[] {
    const students = this.data.profiles.filter((p) => p.role === "student");
    return students
      .map((stu) => {
        const passedSections = this.data.section_progress.filter(
          (sp) => sp.user_id === stu.id && sp.status === "passed"
        ).length;

        const attempts = this.data.attempts.filter((a) => a.user_id === stu.id);
        const totalQuestionsDone = attempts.reduce(
          (sum, a) => sum + (a.answers ? a.answers.length : 0),
          0
        );
        const avgScore =
          attempts.length > 0
            ? Math.round(
                attempts.reduce((sum, a) => sum + (a.score_pct || 0), 0) / attempts.length
              )
            : 0;

        const act = this.getUserActivity(stu.id);

        return {
          user_id: stu.id,
          full_name: stu.full_name,
          sections_passed: passedSections,
          total_questions_done: totalQuestionsDone,
          average_score: avgScore,
          streak: act.streak,
        };
      })
      .sort((a, b) => b.sections_passed - a.sections_passed || b.average_score - a.average_score);
  }

  // ==========================================
  // TEACHER ANALYTICS & CLASS MATRIX
  // ==========================================
  public getTeacherClassAnalytics(classId: string = "class-anat-1") {
    const members = this.data.class_members.filter(
      (m) => m.class_id === classId && m.role === "student"
    );
    const sections = this.data.sections;
    const questions = this.data.questions;

    const studentMatrix = members.map((m) => {
      const profile = this.getProfileById(m.user_id);
      const progresses = this.data.section_progress.filter((sp) => sp.user_id === m.user_id);
      const passedCount = progresses.filter((sp) => sp.status === "passed").length;
      const skippedWeakCount = progresses.filter((sp) => sp.status === "skipped_weak").length;
      const attempts = this.data.attempts.filter((a) => a.user_id === m.user_id);
      const avgScore =
        attempts.length > 0
          ? Math.round(attempts.reduce((acc, a) => acc + (a.score_pct || 0), 0) / attempts.length)
          : 0;

      return {
        user_id: m.user_id,
        name: profile?.full_name || "Học viên",
        email: profile?.email || "",
        passedCount,
        skippedWeakCount,
        totalSections: sections.length,
        avgScore,
        progressPct: sections.length > 0 ? Math.round((passedCount / sections.length) * 100) : 0,
        sectionStatuses: sections.map((sec) => {
          const prog = progresses.find((p) => p.section_id === sec.id);
          return {
            section_id: sec.id,
            section_title: sec.title,
            status: prog ? prog.status : "locked",
            best_score: prog ? prog.best_score : 0,
          };
        }),
      };
    });

    const questionStats = new Map<string, { totalAttempts: number; wrongCount: number }>();
    this.data.attempts.forEach((att) => {
      if (att.answers) {
        att.answers.forEach((ans) => {
          const stat = questionStats.get(ans.question_id) || { totalAttempts: 0, wrongCount: 0 };
          stat.totalAttempts += 1;
          if (!ans.is_correct) {
            stat.wrongCount += 1;
          }
          questionStats.set(ans.question_id, stat);
        });
      }
    });

    const mostDifficultQuestions = Array.from(questionStats.entries())
      .map(([qId, stat]) => {
        const q = this.getQuestionById(qId);
        const wrongRate =
          stat.totalAttempts > 0 ? Math.round((stat.wrongCount / stat.totalAttempts) * 100) : 0;
        return {
          question_id: qId,
          body: q?.body || "Câu hỏi",
          difficulty: q?.difficulty || "understand",
          totalAttempts: stat.totalAttempts,
          wrongCount: stat.wrongCount,
          wrongRate,
          section_id: q?.section_id,
        };
      })
      .sort((a, b) => b.wrongRate - a.wrongRate || b.wrongCount - a.wrongCount)
      .slice(0, 10);

    const sectionQuestionCounts = sections.map((sec) => {
      const qCount = questions.filter((q) => q.section_id === sec.id && q.is_active).length;
      return {
        section_id: sec.id,
        title: sec.title,
        questionCount: qCount,
        targetCount: sec.questions_per_attempt || 10,
        isLacking: qCount < (sec.questions_per_attempt || 10),
      };
    });

    return {
      studentMatrix,
      mostDifficultQuestions,
      sectionQuestionCounts,
      totalStudents: members.length,
      totalQuestions: questions.length,
      totalAttempts: this.data.attempts.length,
    };
  }
}

// Singleton instance
export const db = new DatabaseStore();
