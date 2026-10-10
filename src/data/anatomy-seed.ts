import { ClassItem, Lesson, Profile, Question, Section, Subject } from "../lib/types";

export const SEED_PROFILES: Profile[] = [
  {
    id: "admin-1",
    full_name: "Quản Trị Viên (Admin)",
    email: "admin@medread.vn",
    role: "admin",
    created_at: new Date().toISOString(),
  },
  {
    id: "student-1",
    full_name: "Người Dùng (Học Viên)",
    email: "user@medread.vn",
    role: "student",
    created_at: new Date().toISOString(),
  },
];

export const SEED_CLASSES: ClassItem[] = [
  {
    id: "class-medpath-1",
    name: "MEDPATH - 4 Module Chuyên Khoa",
    description: "Không gian học tập 4 Module: Tim mạch, Tiêu hoá, Tiết niệu - Sinh dục, Thần kinh.",
    join_code: "MEDPATH",
    owner_id: "admin-1",
    owner_name: "Quản Trị Viên (Admin)",
    created_at: new Date().toISOString(),
  },
];

export const SEED_SUBJECTS: Subject[] = [
  {
    id: "subj-mod-8",
    class_id: "class-medpath-1",
    title: "Module 8 - Tim mạch (25.DY.K56.08)",
    order: 1,
  },
  {
    id: "subj-mod-9",
    class_id: "class-medpath-1",
    title: "Module 9 - Tiêu hoá (25.DY.K57.09)",
    order: 2,
  },
  {
    id: "subj-mod-10",
    class_id: "class-medpath-1",
    title: "Module 10 - Tiết niệu,sinh dục (25.DY.CM6.10)",
    order: 3,
  },
  {
    id: "subj-mod-11",
    class_id: "class-medpath-1",
    title: "Module 11 - Thần kinh (25.DY.K55.11)",
    order: 4,
  },
];

export const SEED_LESSONS: Lesson[] = [];
export const SEED_SECTIONS: Section[] = [];
export const SEED_QUESTIONS: Question[] = [];
