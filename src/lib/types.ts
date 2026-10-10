export type UserRole = "student" | "teacher" | "admin";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface ClassItem {
  id: string;
  name: string;
  description?: string;
  join_code: string;
  owner_id: string;
  owner_name?: string;
  created_at: string;
}

export interface ClassMember {
  class_id: string;
  user_id: string;
  role: UserRole;
  joined_at: string;
}

export interface Subject {
  id: string;
  class_id: string;
  title: string;
  order: number;
}

export interface Lesson {
  id: string;
  subject_id: string;
  title: string;
  order: number;
}

export type SectionContentType = "markdown" | "pdf" | "html";
export type SectionStatus = "locked" | "unlocked" | "passed" | "skipped_weak";

export interface Section {
  id: string;
  lesson_id: string;
  title: string;
  order: number;
  content_type: SectionContentType;
  content_url_or_text: string;
  pass_threshold: number; // e.g. 80 (%)
  questions_per_attempt: number; // default 10
  is_core: boolean; // true: core (80-90%), false: optional (60%)
}

export type QuestionType = "single_choice" | "multiple_choice" | "true_false";
export type QuestionDifficulty = "remember" | "understand" | "apply" | "clinical";

export interface QuestionOption {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  explanation?: string;
}

export interface Question {
  id: string;
  section_id: string;
  type: QuestionType;
  body: string;
  image_url?: string;
  explanation: string;
  difficulty: QuestionDifficulty;
  source_ref?: string; // Ví dụ: p1_xương_chi_trên hoặc trang 12
  created_by?: string;
  is_active: boolean;
  options: QuestionOption[];
}

// Client-safe version of question (never contains is_correct or explanation before submit)
export interface ClientQuestionOption {
  id: string;
  text: string;
}

export interface ClientQuestion {
  id: string;
  section_id: string;
  type: QuestionType;
  body: string;
  image_url?: string;
  difficulty: QuestionDifficulty;
  source_ref?: string;
  options: ClientQuestionOption[];
}

export type AttemptMode = "gate" | "review" | "mock";

export interface AttemptAnswer {
  question_id: string;
  selected_option_ids: string[];
  is_correct?: boolean;
}

export interface Attempt {
  id: string;
  user_id: string;
  section_id: string;
  started_at: string;
  submitted_at?: string;
  score_pct: number;
  passed: boolean;
  mode: AttemptMode;
  answers: AttemptAnswer[];
}

export interface SectionProgress {
  user_id: string;
  section_id: string;
  status: SectionStatus;
  best_score: number;
  last_position?: string;
  attempts_count?: number;
  last_attempt_at?: string;
}

export interface QuizSubmissionResult {
  attempt_id: string;
  score_pct: number;
  passed: boolean;
  correct_count: number;
  total_questions: number;
  pass_threshold: number;
  unlocked_next_section_id?: string;
  answers_feedback: {
    question_id: string;
    body: string;
    is_correct: boolean;
    selected_option_ids: string[];
    correct_option_ids: string[];
    explanation: string;
    source_ref?: string;
    options: {
      id: string;
      text: string;
      is_correct: boolean;
      explanation?: string;
    }[];
  }[];
}

export type HighlightColor = "yellow" | "green" | "pink" | "orange";

export interface Highlight {
  id: string;
  user_id: string;
  section_id: string;
  section_title?: string;
  lesson_title?: string;
  color: HighlightColor;
  text: string;
  range_data?: string;
  note?: string;
  created_at: string;
}

export interface ReviewQueueItem {
  id: string;
  user_id: string;
  question_id: string;
  box: number; // 1: 1 day, 2: 3 days, 3: 7 days, 4: 14 days, 5: 30 days
  next_due_at: string; // ISO date string
  wrong_count: number;
  last_result: "correct" | "wrong";
  updated_at: string;
  question?: Question;
}

export type ReportReason =
  | "wrong_answer"
  | "typo"
  | "broken_image"
  | "unclear_explanation"
  | "other";

export type ReportStatus = "pending" | "reviewed" | "fixed" | "rejected";

export interface QuestionReport {
  id: string;
  question_id: string;
  reporter_id: string;
  reporter_name?: string;
  reason: ReportReason;
  note: string;
  status: ReportStatus;
  created_at: string;
  resolved_at?: string;
  question_body?: string;
}

export interface DailyActivity {
  user_id: string;
  date: string; // YYYY-MM-DD
  questions_done: number;
  minutes: number;
}

export interface StudentLeaderboardEntry {
  user_id: string;
  full_name: string;
  sections_passed: number;
  total_questions_done: number;
  average_score: number;
  streak: number;
  is_anonymous?: boolean;
}

export interface MockExamConfig {
  lesson_ids: string[];
  section_ids: string[];
  question_count: number;
  duration_minutes: number;
}

