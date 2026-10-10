import { db } from "./db/store";
import {
  Attempt,
  AttemptAnswer,
  ClientQuestion,
  Question,
  QuizSubmissionResult,
} from "./types";

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateQuizForSection(
  sectionId: string,
  userId: string,
  requestedCount?: number
): {
  questions: ClientQuestion[];
  totalAvailable: number;
  isBankSmallerThanN: boolean;
  passThreshold: number;
} {
  const section = db.getSectionById(sectionId);
  if (!section) {
    throw new Error(`Không tìm thấy mục với ID: ${sectionId}`);
  }

  const allQuestions = db.getQuestions(sectionId);
  const targetCount = requestedCount || section.questions_per_attempt || 10;
  const isBankSmallerThanN = allQuestions.length < targetCount;

  // Lấy lịch sử làm bài trước đó của user để tính trọng số
  const userAttempts = db.getUserAttempts(userId, sectionId);
  const questionStats = new Map<string, { correctCount: number; wrongCount: number }>();

  userAttempts.forEach((attempt) => {
    attempt.answers.forEach((ans) => {
      const current = questionStats.get(ans.question_id) || { correctCount: 0, wrongCount: 0 };
      if (ans.is_correct) {
        current.correctCount += 1;
      } else {
        current.wrongCount += 1;
      }
      questionStats.set(ans.question_id, current);
    });
  });

  // Gán trọng số (Weight):
  // - Chưa từng làm: weight 10
  // - Làm sai nhiều hơn đúng: weight 15
  // - Đã làm đúng nhiều lần: weight 3
  const weightedQuestions: { question: Question; weight: number }[] = allQuestions.map((q) => {
    const stats = questionStats.get(q.id);
    let weight = 10;
    if (!stats || (stats.correctCount === 0 && stats.wrongCount === 0)) {
      weight = 10; // Chưa từng làm
    } else if (stats.wrongCount > stats.correctCount) {
      weight = 15; // Từng làm sai nhiều
    } else {
      weight = 3; // Đã làm đúng nhiều lần
    }
    return { question: q, weight };
  });

  // Chọn ngẫu nhiên không trùng lặp dựa trên trọng số
  const selectedQuestions: Question[] = [];
  const pool = [...weightedQuestions];

  const countToSelect = Math.min(targetCount, allQuestions.length);

  while (selectedQuestions.length < countToSelect && pool.length > 0) {
    const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
    let randomVal = Math.random() * totalWeight;
    let selectedIndex = 0;

    for (let i = 0; i < pool.length; i++) {
      randomVal -= pool[i].weight;
      if (randomVal <= 0) {
        selectedIndex = i;
        break;
      }
    }

    selectedQuestions.push(pool[selectedIndex].question);
    pool.splice(selectedIndex, 1);
  }

  // Xáo thứ tự câu hỏi đã chọn
  const randomizedQuestions = shuffleArray(selectedQuestions);

  // Chuyển đổi sang ClientQuestion:
  // LOẠI BỎ HOÀN TOÀN is_correct và explanation để bảo mật (chống gian lận bằng DevTools)
  // Xáo thứ tự phương án đáp án trong từng câu
  const clientQuestions: ClientQuestion[] = randomizedQuestions.map((q) => {
    const shuffledOptions = shuffleArray(q.options).map((opt) => ({
      id: opt.id,
      text: opt.text,
    }));

    return {
      id: q.id,
      section_id: q.section_id,
      type: q.type,
      body: q.body,
      image_url: q.image_url,
      difficulty: q.difficulty,
      source_ref: q.source_ref,
      options: shuffledOptions,
    };
  });

  return {
    questions: clientQuestions,
    totalAvailable: allQuestions.length,
    isBankSmallerThanN,
    passThreshold: section.pass_threshold,
  };
}

export function gradeAttempt(
  userId: string,
  sectionId: string,
  userAnswers: { question_id: string; selected_option_ids: string[] }[],
  mode: "gate" | "review" | "mock" = "gate"
): QuizSubmissionResult {
  const section = db.getSectionById(sectionId);
  if (!section) {
    throw new Error(`Không tìm thấy mục với ID: ${sectionId}`);
  }

  let correctCount = 0;
  const processedAnswers: AttemptAnswer[] = [];

  const answersFeedback = userAnswers.map((userAns) => {
    const question = db.getQuestionById(userAns.question_id);
    if (!question) {
      return {
        question_id: userAns.question_id,
        body: "Câu hỏi không tồn tại",
        is_correct: false,
        selected_option_ids: userAns.selected_option_ids,
        correct_option_ids: [],
        explanation: "Không tìm thấy câu hỏi",
        options: [],
      };
    }

    const correctOptionIds = question.options
      .filter((opt) => opt.is_correct)
      .map((opt) => opt.id);

    // Kiểm tra câu trả lời
    let isCorrect = false;
    if (question.type === "single_choice" || question.type === "true_false") {
      isCorrect =
        userAns.selected_option_ids.length === 1 &&
        correctOptionIds.includes(userAns.selected_option_ids[0]);
    } else if (question.type === "multiple_choice") {
      const selectedSet = new Set(userAns.selected_option_ids);
      const correctSet = new Set(correctOptionIds);
      isCorrect =
        selectedSet.size === correctSet.size &&
        userAns.selected_option_ids.every((id) => correctSet.has(id));
    }

    if (isCorrect) {
      correctCount += 1;
    }

    processedAnswers.push({
      question_id: question.id,
      selected_option_ids: userAns.selected_option_ids,
      is_correct: isCorrect,
    });

    return {
      question_id: question.id,
      body: question.body,
      is_correct: isCorrect,
      selected_option_ids: userAns.selected_option_ids,
      correct_option_ids: correctOptionIds,
      explanation: question.explanation,
      source_ref: question.source_ref,
      options: question.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        is_correct: opt.is_correct,
        explanation: opt.explanation,
      })),
    };
  });

  const totalQuestions = userAnswers.length;
  const scorePct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passed = scorePct >= section.pass_threshold;

  // Lưu lượt làm bài (Attempt)
  const attemptId = `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const attempt: Attempt = {
    id: attemptId,
    user_id: userId,
    section_id: sectionId,
    started_at: new Date(Date.now() - 300000).toISOString(),
    submitted_at: new Date().toISOString(),
    score_pct: scorePct,
    passed,
    mode,
    answers: processedAnswers,
  };
  db.recordAttempt(attempt);

  // 1. Tự động đưa câu sai vào Hàng đợi Ôn lại theo khoảng cách (Spaced Repetition / Leitner)
  // và cập nhật câu đúng nếu đang có trong hàng đợi
  processedAnswers.forEach((ans) => {
    if (!ans.is_correct) {
      db.queueQuestionForReview(userId, ans.question_id, false);
    } else {
      db.queueQuestionForReview(userId, ans.question_id, true);
    }
  });

  // 2. Ghi nhận hoạt động hàng ngày & duy trì chuỗi Streak
  db.recordDailyActivity(
    userId,
    processedAnswers.length,
    Math.max(2, Math.round(processedAnswers.length * 0.8))
  );

  // Cập nhật tiến độ học tập (Section Progress)
  const currentProgress = db.getSectionProgress(userId, sectionId);
  const bestScore = Math.max(currentProgress.best_score || 0, scorePct);

  let unlockedNextSectionId: string | undefined = undefined;

  if (passed) {
    db.updateSectionProgress(userId, sectionId, {
      status: "passed",
      best_score: bestScore,
      attempts_count: (currentProgress.attempts_count || 0) + 1,
      last_attempt_at: new Date().toISOString(),
    });

    // Mở khóa mục kế tiếp trong giáo trình
    const nextSection = db.getNextSection(sectionId);
    if (nextSection) {
      const nextProg = db.getSectionProgress(userId, nextSection.id);
      if (nextProg.status === "locked") {
        db.updateSectionProgress(userId, nextSection.id, {
          status: "unlocked",
        });
        unlockedNextSectionId = nextSection.id;
      }
    }
  } else {
    // Chưa đạt ngưỡng
    db.updateSectionProgress(userId, sectionId, {
      status: currentProgress.status === "passed" ? "passed" : "unlocked",
      best_score: bestScore,
      attempts_count: (currentProgress.attempts_count || 0) + 1,
      last_attempt_at: new Date().toISOString(),
    });
  }

  return {
    attempt_id: attemptId,
    score_pct: scorePct,
    passed,
    correct_count: correctCount,
    total_questions: totalQuestions,
    pass_threshold: section.pass_threshold,
    unlocked_next_section_id: unlockedNextSectionId,
    answers_feedback: answersFeedback,
  };
}
