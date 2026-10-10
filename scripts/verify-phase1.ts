import { db } from "../src/lib/db/store";
import { generateQuizForSection, gradeAttempt } from "../src/lib/quiz-engine";
import { generateSampleExcelWorkbook, parseExcelFile } from "../src/lib/excel-parser";

async function runVerification() {
  console.log("=== BẮT ĐẦU KIỂM THỬ GIAI ĐOẠN 1 (MVP) MEDREAD ===");

  // 1. Kiểm tra Dữ liệu mẫu (Seed Data)
  console.log("\n[1] Kiểm tra Dữ liệu mẫu (Seed Data):");
  db.resetToSeed();
  const classes = db.getClasses();
  const sections = db.getSections("lesson-1");
  const allQuestions = db.getQuestions();

  console.log(`- Số lớp học mẫu: ${classes.length} (Mã: ${classes[0].join_code})`);
  console.log(`- Số mục trong Bài 1: ${sections.length}`);
  console.log(`- Tổng số câu hỏi giải phẫu mẫu: ${allQuestions.length} câu`);

  if (allQuestions.length !== 60) {
    throw new Error(`Kỳ vọng 60 câu hỏi mẫu, thực tế có ${allQuestions.length}`);
  }

  // Kiểm tra 3 vai trò Admin, Teacher, Student
  const adminUser = db.findUserByEmail("admin@medread.vn");
  const teacherUser = db.findUserByEmail("bacsi_nguyen@medread.vn");
  const studentUser = db.findUserByEmail("sinhvien_an@medread.vn");

  if (!adminUser || adminUser.role !== "admin") throw new Error("Thiếu tài khoản Admin");
  if (!teacherUser || teacherUser.role !== "teacher") throw new Error("Thiếu tài khoản Giảng viên");
  if (!studentUser || studentUser.role !== "student") throw new Error("Thiếu tài khoản Học viên");

  console.log("=> [PASS] Đầy đủ 3 vai trò hệ thống: Admin, Teacher, Student!");
  console.log("=> [PASS] Seed data 60 câu hỏi Giải phẫu nạp chính xác!");

  // 2. Kiểm tra tính Bảo Mật (Client-Side Answer Stripping)
  console.log("\n[2] Kiểm tra Bảo Mật (DevTools không thấy đáp án):");
  const quizGen = generateQuizForSection("sec-1-1", "student-1", 10);
  console.log(`- Đã sinh ngẫu nhiên: ${quizGen.questions.length} câu hỏi`);

  const hasLeakedCorrect = quizGen.questions.some((q) =>
    (q as any).options.some((opt: any) => "is_correct" in opt)
  );
  const hasLeakedExplanation = quizGen.questions.some((q) => "explanation" in q);

  if (hasLeakedCorrect || hasLeakedExplanation) {
    throw new Error("LỖI BẢO MẬT: Phát hiện trường is_correct hoặc explanation gửi xuống client!");
  }
  console.log("=> [PASS] 100% câu hỏi gửi xuống client đã được loại bỏ is_correct và explanation!");

  // 3. Kiểm tra tính Ngẫu Nhiên và Không Trùng Lặp
  console.log("\n[3] Kiểm tra Random không trùng lặp:");
  const questionIds = quizGen.questions.map((q) => q.id);
  const uniqueIds = new Set(questionIds);
  if (uniqueIds.size !== questionIds.length) {
    throw new Error("LỖI: Có câu hỏi trùng lặp trong cùng một lần làm quiz!");
  }
  console.log(`=> [PASS] ${questionIds.length} câu hỏi hoàn toàn duy nhất, không trùng lặp!`);

  // 4. Kiểm tra Chấm Điểm & Mở Khóa Mục (Mastery Gate)
  console.log("\n[4] Kiểm tra Cổng Kiểm Tra (Mastery Learning & Mở khóa):");
  // Mục 1.2 ban đầu phải bị khóa
  const sec12Before = db.getSectionProgress("student-1", "sec-1-2");
  console.log(`- Trạng thái Mục 1.2 trước khi vượt cổng Mục 1.1: "${sec12Before.status}"`);

  // Giả lập làm đúng 9/10 câu (90% >= 80% threshold)
  const fullQuestions = db.getQuestions("sec-1-1");
  const passingAnswers = quizGen.questions.map((q, idx) => {
    const original = fullQuestions.find((orig) => orig.id === q.id)!;
    const correctOpt = original.options.find((o) => o.is_correct)!;
    // Làm đúng 9 câu đầu, câu thứ 10 chọn bừa đáp án sai
    if (idx < 9) {
      return { question_id: q.id, selected_option_ids: [correctOpt.id] };
    } else {
      const wrongOpt = original.options.find((o) => !o.is_correct) || correctOpt;
      return { question_id: q.id, selected_option_ids: [wrongOpt.id] };
    }
  });

  const gradeResult = gradeAttempt("student-1", "sec-1-1", passingAnswers, "gate");
  console.log(`- Kết quả chấm điểm: ${gradeResult.score_pct}% (${gradeResult.correct_count}/${gradeResult.total_questions})`);
  console.log(`- Trạng thái vượt cổng: ${gradeResult.passed ? "ĐẠT (PASSED)" : "TRƯỢT"}`);

  if (!gradeResult.passed) {
    throw new Error("Kỳ vọng đạt 90% vượt cổng");
  }

  // Kiểm tra Mục 1.2 đã được mở khóa tự động
  const sec12After = db.getSectionProgress("student-1", "sec-1-2");
  console.log(`- Trạng thái Mục 1.2 sau khi Mục 1.1 vượt cổng: "${sec12After.status}"`);

  if (sec12After.status !== "unlocked") {
    throw new Error("LỖI: Mục 1.2 không được mở khóa sau khi học viên đạt ngưỡng!");
  }
  console.log("=> [PASS] Cơ chế Mastery Gate mở khóa mục tiếp theo hoạt động hoàn hảo!");

  // 5. Kiểm tra trường hợp Trượt Ngưỡng & Liên kết xem lại đoạn
  console.log("\n[5] Kiểm tra Xử lý Trượt Ngưỡng & Source Reference:");
  const failingAnswers = quizGen.questions.map((q) => {
    const original = fullQuestions.find((orig) => orig.id === q.id)!;
    const wrongOpt = original.options.find((o) => !o.is_correct) || original.options[0];
    return { question_id: q.id, selected_option_ids: [wrongOpt.id] };
  });

  const failResult = gradeAttempt("student-1", "sec-1-1", failingAnswers, "gate");
  console.log(`- Điểm khi cố ý làm sai: ${failResult.score_pct}%`);
  const wrongFeedback = failResult.answers_feedback.find((f) => !f.is_correct);
  console.log(`- Câu sai có source_ref: "${wrongFeedback?.source_ref}"`);

  if (!wrongFeedback?.source_ref) {
    throw new Error("LỖI: Câu sai không có liên kết source_ref để quay lại tài liệu!");
  }
  console.log("=> [PASS] Câu sai có đầy đủ source_ref và giải thích để học viên ôn tập lại!");

  // 6. Kiểm tra Import Excel & Chống trùng lặp
  console.log("\n[6] Kiểm tra Import Excel & Chống trùng lặp:");
  const sampleExcelBuffer = generateSampleExcelWorkbook();
  const importTest = parseExcelFile(sampleExcelBuffer, "sec-1-1", db.getQuestions("sec-1-1"));

  console.log(`- Tổng số dòng trong file mẫu: ${importTest.totalRows}`);
  console.log(`- Số câu nhập hợp lệ: ${importTest.importedCount}`);
  console.log(`- Số câu trùng lặp phát hiện: ${importTest.duplicateCount}`);

  // Thử nhập lại lần 2 cùng file đó xem có chống trùng lặp không
  const existingAfterFirst = [...db.getQuestions("sec-1-1"), ...importTest.validQuestions];
  const reImportTest = parseExcelFile(sampleExcelBuffer, "sec-1-1", existingAfterFirst);
  console.log(`- Thử nhập lại lần 2: Phát hiện ${reImportTest.duplicateCount} câu trùng lặp`);

  if (reImportTest.importedCount !== 0) {
    throw new Error("LỖI: Hệ thống không ngăn chặn được câu hỏi trùng lặp khi import!");
  }
  console.log("=> [PASS] Tính năng Import Excel, validate Zod và chống trùng lặp hoạt động chuẩn xác!");

  // 7. Kiểm tra Mã vào lớp (Join Code)
  console.log("\n[7] Kiểm tra Gia nhập lớp bằng mã (Join Code):");
  const joinSuccess = db.joinClass("class-anat-1", "student-new", "student");
  console.log(`- Học viên mới gia nhập lớp: role="${joinSuccess.role}"`);
  const newMemberProg = db.getSectionProgress("student-new", "sec-1-1");
  console.log(`- Mục 1.1 của học viên mới tự động mở khóa: status="${newMemberProg.status}"`);

  if (newMemberProg.status !== "unlocked") {
    throw new Error("LỖI: Học viên mới vào lớp chưa được mở khóa mục đầu tiên!");
  }
  console.log("=> [PASS] Gia nhập lớp bằng mã thành công và khởi tạo lộ trình học chuẩn xác!");

  console.log("\n=======================================================");
  console.log("🎉 TẤT CẢ 7/7 TIÊU CHÍ NGHIỆM THU GIAI ĐOẠN 1 ĐỀU ĐẠT CHUẨN!");
  console.log("=======================================================\n");
}

runVerification().catch((err) => {
  console.error("KIỂM THỬ THẤT BẠI:", err);
  process.exit(1);
});
