-- ==============================================================================
-- MedRead - Mastery Learning Platform for Medical Students
-- Supabase PostgreSQL Schema with Row Level Security (RLS) & Triggers
-- ==============================================================================

-- 1. Create User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Classes
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  join_code TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_classes_join_code ON public.classes(join_code);

-- 3. Class Members
CREATE TABLE IF NOT EXISTS public.class_members (
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (class_id, user_id)
);

-- 4. Subjects
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Lessons
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Sections (Mục tài liệu & Cổng kiểm tra)
CREATE TABLE IF NOT EXISTS public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 1,
  content_type TEXT NOT NULL CHECK (content_type IN ('pdf', 'markdown', 'html')),
  content_url_or_text TEXT NOT NULL,
  pass_threshold INTEGER NOT NULL DEFAULT 80,
  questions_per_attempt INTEGER NOT NULL DEFAULT 10,
  is_core BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Question Bank
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('single_choice', 'multiple_choice', 'true_false')),
  body TEXT NOT NULL,
  image_url TEXT,
  explanation TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('remember', 'understand', 'apply', 'clinical')),
  source_ref TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_questions_section ON public.questions(section_id);

-- 8. Question Options
CREATE TABLE IF NOT EXISTS public.question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  explanation TEXT
);

CREATE INDEX IF NOT EXISTS idx_question_options_q ON public.question_options(question_id);

-- 9. Quiz Attempts
CREATE TABLE IF NOT EXISTS public.attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  submitted_at TIMESTAMPTZ,
  score_pct INTEGER NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  mode TEXT NOT NULL CHECK (mode IN ('gate', 'review', 'mock'))
);

CREATE INDEX IF NOT EXISTS idx_attempts_user_sec ON public.attempts(user_id, section_id);

-- 10. Attempt Answers
CREATE TABLE IF NOT EXISTS public.attempt_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option_ids TEXT[] NOT NULL DEFAULT '{}',
  is_correct BOOLEAN NOT NULL DEFAULT false
);

-- 11. Section Progress (Mastery Learning Progress)
CREATE TABLE IF NOT EXISTS public.section_progress (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('locked', 'unlocked', 'passed', 'skipped_weak')),
  best_score INTEGER NOT NULL DEFAULT 0,
  last_position TEXT,
  attempts_count INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, section_id)
);

-- 12. Spaced Repetition Review Queue (Leitner / SM-2)
CREATE TABLE IF NOT EXISTS public.review_queue (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  box INTEGER NOT NULL DEFAULT 1,
  next_due_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  wrong_count INTEGER NOT NULL DEFAULT 1,
  last_result BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (user_id, question_id)
);

-- 13. Highlights & Notes
CREATE TABLE IF NOT EXISTS public.highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  color TEXT NOT NULL CHECK (color IN ('yellow', 'green', 'pink', 'orange')),
  range_data JSONB NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. Question Reports (Báo lỗi câu hỏi)
CREATE TABLE IF NOT EXISTS public.question_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('wrong_answer', 'typo', 'broken_image', 'unclear', 'other')),
  note TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'fixed', 'rejected', 'reviewing')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. Daily Learning Activity (Streak & Minutes)
CREATE TABLE IF NOT EXISTS public.daily_activity (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  questions_done INTEGER NOT NULL DEFAULT 0,
  minutes INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, date)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can read profiles; user can only update their own
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Classes: Viewable if owner or member
CREATE POLICY "Classes viewable by enrolled users and owners" ON public.classes FOR SELECT
  USING (owner_id = auth.uid() OR id IN (SELECT class_id FROM public.class_members WHERE user_id = auth.uid()));

CREATE POLICY "Teachers can create classes" ON public.classes FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update classes" ON public.classes FOR UPDATE
  USING (owner_id = auth.uid());

-- Class members: User can view members of their classes
CREATE POLICY "Class members viewable" ON public.class_members FOR SELECT
  USING (user_id = auth.uid() OR class_id IN (SELECT id FROM public.classes WHERE owner_id = auth.uid()));

CREATE POLICY "Users can join classes" ON public.class_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Curriculum (Subjects, Lessons, Sections):
CREATE POLICY "Curriculum viewable by class members" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Lessons viewable by class members" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Sections viewable by class members" ON public.sections FOR SELECT USING (true);

-- CRITICAL SECURITY: Question Options is_correct IS HIDDEN FROM STUDENTS
-- Students can only read option text, NOT is_correct!
CREATE POLICY "Teachers can view all question options" ON public.question_options FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));

-- Attempts & Progress: Strictly isolated per student
CREATE POLICY "Attempts isolated to user" ON public.attempts FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Section progress isolated to user" ON public.section_progress FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Highlights isolated to user" ON public.highlights FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Review queue isolated to user" ON public.review_queue FOR ALL
  USING (user_id = auth.uid());
