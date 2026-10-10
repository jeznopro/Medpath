import * as XLSX from "xlsx";
import { z } from "zod";
import { normalizeText } from "./utils";
import { Question, QuestionDifficulty, QuestionOption, QuestionType } from "./types";

export interface ParsedQuestionRow {
  rowNumber: number;
  body: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  source_ref?: string;
  image_url?: string;
  explanation: string;
  options: {
    key: string;
    text: string;
    is_correct: boolean;
  }[];
}

export interface ImportResult {
  success: boolean;
  validQuestions: Question[];
  totalRows: number;
  importedCount: number;
  duplicateCount: number;
  errors: {
    row: number;
    message: string;
  }[];
}

const QuestionRowSchema = z.object({
  cau_hoi: z.string().min(5, "Nội dung câu hỏi phải có ít nhất 5 ký tự"),
  dap_an_dung: z.string().min(1, "Bắt buộc phải chỉ định đáp án đúng (VD: A hoặc A,C hoặc Đúng)"),
});

export function parseExcelFile(
  buffer: Buffer,
  sectionId: string,
  existingQuestions: Question[] = []
): ImportResult {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Chuyển sheet sang dạng JSON với header chữ thường
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

  const errors: { row: number; message: string }[] = [];
  const validQuestions: Question[] = [];
  let duplicateCount = 0;

  // Tập hợp các câu hỏi đã có để chống trùng
  const existingNormalizedSet = new Set(
    existingQuestions.map((q) => normalizeText(q.body))
  );
  const currentBatchNormalizedSet = new Set<string>();

  rawRows.forEach((row, index) => {
    const rowNumber = index + 2; // Dòng 1 là tiêu đề (header)

    // Chuẩn hóa key của row sang lowercase và không dấu cách
    const normalizedRow: Record<string, string> = {};
    Object.keys(row).forEach((key) => {
      const cleanKey = key.trim().toLowerCase().replace(/\s+/g, "_");
      normalizedRow[cleanKey] = String(row[key] || "").trim();
    });

    const body =
      normalizedRow["cau_hoi"] ||
      normalizedRow["noi_dung"] ||
      normalizedRow["body"] ||
      normalizedRow["question"] ||
      "";

    const rawCorrect =
      normalizedRow["dap_an_dung"] ||
      normalizedRow["dap_an"] ||
      normalizedRow["correct"] ||
      "";

    // Validate Zod cơ bản
    const validation = QuestionRowSchema.safeParse({
      cau_hoi: body,
      dap_an_dung: rawCorrect,
    });

    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        errors.push({ row: rowNumber, message: issue.message });
      });
      return;
    }

    // Chống trùng lặp (Duplicate Check)
    const normalizedBody = normalizeText(body);
    if (existingNormalizedSet.has(normalizedBody) || currentBatchNormalizedSet.has(normalizedBody)) {
      duplicateCount += 1;
      errors.push({
        row: rowNumber,
        message: `Câu hỏi đã tồn tại trong ngân hàng hoặc bị trùng lặp: "${body.substring(0, 45)}..."`,
      });
      return;
    }
    currentBatchNormalizedSet.add(normalizedBody);

    // Xác định loại câu hỏi
    const rawType = (normalizedRow["loai_cau"] || normalizedRow["type"] || "").toLowerCase();
    let type: QuestionType = "single_choice";
    if (rawType.includes("nhieu") || rawType.includes("multiple") || rawCorrect.includes(",")) {
      type = "multiple_choice";
    } else if (
      rawType.includes("dung_sai") ||
      rawType.includes("true_false") ||
      rawCorrect.toLowerCase() === "đúng" ||
      rawCorrect.toLowerCase() === "dung" ||
      rawCorrect.toLowerCase() === "sai"
    ) {
      type = "true_false";
    }

    // Xác định mức độ (Difficulty)
    const rawDiff = (normalizedRow["muc_do"] || normalizedRow["difficulty"] || "").toLowerCase();
    let difficulty: QuestionDifficulty = "understand";
    if (rawDiff.includes("nho") || rawDiff.includes("remember")) {
      difficulty = "remember";
    } else if (rawDiff.includes("van_dung") || rawDiff.includes("apply")) {
      difficulty = "apply";
    } else if (rawDiff.includes("lam_sang") || rawDiff.includes("clinical")) {
      difficulty = "clinical";
    }

    const explanation =
      normalizedRow["giai_thich"] ||
      normalizedRow["explanation"] ||
      "Chưa có giải thích chi tiết cho câu hỏi này.";
    const sourceRef =
      normalizedRow["doan_trich_dan"] ||
      normalizedRow["nguon"] ||
      normalizedRow["source_ref"] ||
      "";
    const imageUrl = normalizedRow["anh_dinh_kem"] || normalizedRow["image_url"] || "";

    const questionId = `q-imp-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`;
    const options: QuestionOption[] = [];

    if (type === "true_false") {
      const isTrueCorrect =
        rawCorrect.toLowerCase().includes("dung") ||
        rawCorrect.toLowerCase().includes("đúng") ||
        rawCorrect.toLowerCase() === "t" ||
        rawCorrect.toLowerCase() === "true" ||
        rawCorrect.toUpperCase() === "A";

      options.push(
        {
          id: `opt-${questionId}-t`,
          question_id: questionId,
          text: "Đúng",
          is_correct: isTrueCorrect,
        },
        {
          id: `opt-${questionId}-f`,
          question_id: questionId,
          text: "Sai",
          is_correct: !isTrueCorrect,
        }
      );
    } else {
      // Đọc các phương án A, B, C, D, E, F
      const optionMap: { key: string; text: string }[] = [
        { key: "A", text: normalizedRow["phuong_an_a"] || normalizedRow["a"] || "" },
        { key: "B", text: normalizedRow["phuong_an_b"] || normalizedRow["b"] || "" },
        { key: "C", text: normalizedRow["phuong_an_c"] || normalizedRow["c"] || "" },
        { key: "D", text: normalizedRow["phuong_an_d"] || normalizedRow["d"] || "" },
        { key: "E", text: normalizedRow["phuong_an_e"] || normalizedRow["e"] || "" },
        { key: "F", text: normalizedRow["phuong_an_f"] || normalizedRow["f"] || "" },
      ].filter((item) => item.text.length > 0);

      if (optionMap.length < 2) {
        errors.push({
          row: rowNumber,
          message: "Câu hỏi trắc nghiệm phải có ít nhất 2 phương án trả lời (A và B).",
        });
        return;
      }

      // Xử lý các đáp án đúng (VD: "A" hoặc "A, C" hoặc "B;D")
      const correctKeys = rawCorrect
        .toUpperCase()
        .split(/[,;|/\s]+/)
        .map((k) => k.trim())
        .filter(Boolean);

      if (correctKeys.length === 0) {
        errors.push({
          row: rowNumber,
          message: `Không nhận diện được đáp án đúng từ giá trị: "${rawCorrect}"`,
        });
        return;
      }

      // Kiểm tra xem đáp án đúng có nằm trong số phương án được điền không
      const missingKey = correctKeys.find((ck) => !optionMap.some((o) => o.key === ck));
      if (missingKey) {
        errors.push({
          row: rowNumber,
          message: `Phương án đúng '${missingKey}' không có nội dung phương án tương ứng.`,
        });
        return;
      }

      optionMap.forEach((opt) => {
        const isCorrect = correctKeys.includes(opt.key);
        options.push({
          id: `opt-${questionId}-${opt.key.toLowerCase()}`,
          question_id: questionId,
          text: opt.text,
          is_correct: isCorrect,
        });
      });
    }

    validQuestions.push({
      id: questionId,
      section_id: sectionId,
      type,
      body,
      difficulty,
      explanation,
      source_ref: sourceRef || undefined,
      image_url: imageUrl || undefined,
      is_active: true,
      options,
    });
  });

  return {
    success: validQuestions.length > 0,
    validQuestions,
    totalRows: rawRows.length,
    importedCount: validQuestions.length,
    duplicateCount,
    errors,
  };
}

export function generateSampleExcelWorkbook(): Buffer {
  const sampleData = [
    {
      cau_hoi: "Đặc điểm giải phẫu nào của xương cánh tay thường liên quan đến tổn thương thần kinh quay?",
      loai_cau: "single_choice",
      phuong_an_a: "Rãnh thần kinh quay (rãnh xoắn) ở mặt sau thân xương",
      phuong_an_b: "Cổ phẫu thuật xương cánh tay",
      phuong_an_c: "Rãnh thần kinh trụ ở mỏm trên lồi cầu trong",
      phuong_an_d: "Củ lớn xương cánh tay",
      dap_an_dung: "A",
      muc_do: "hiểu",
      giai_thich: "Thần kinh quay chạy trong rãnh xoắn mặt sau xương cánh tay cùng động mạch cánh tay sâu.",
      doan_trich_dan: "sec-1-1-humerus",
    },
    {
      cau_hoi: "Gãy cổ phẫu thuật xương cánh tay dễ làm đứt bó mạch thần kinh nào chạy quanh nó?",
      loai_cau: "single_choice",
      phuong_an_a: "Dây thần kinh nách và động mạch mũ cánh tay sau",
      phuong_an_b: "Dây thần kinh quay và động mạch cánh tay sâu",
      phuong_an_c: "Dây thần kinh trụ và động mạch quặt ngược trụ",
      phuong_an_d: "Dây thần kinh giữa và động mạch cánh tay",
      dap_an_dung: "A",
      muc_do: "lâm sàng",
      giai_thich: "Thần kinh nách và động mạch mũ cánh tay sau chui qua lỗ tứ giác đi vòng quanh cổ phẫu thuật.",
      doan_trich_dan: "sec-1-1-humerus",
    },
    {
      cau_hoi: "Dây chằng vòng quay ôm lấy cấu trúc nào của xương quay để hỗ trợ động tác sấp ngửa?",
      loai_cau: "single_choice",
      phuong_an_a: "Chu vi chỏm xương quay",
      phuong_an_b: "Cổ xương quay",
      phuong_an_c: "Lồi củ xương quay",
      phuong_an_d: "Mỏm trâm quay",
      dap_an_dung: "A",
      muc_do: "nhớ",
      giai_thich: "Dây chằng vòng quay bám vào khuyết quay xương trụ ôm trọn chu vi chỏm xương quay.",
      doan_trich_dan: "sec-1-2-elbow-joint",
    },
    {
      cau_hoi: "Các cơ nào sau đây thuộc nhóm chóp xoay (Rotator cuff)? (Nhiều đáp án)",
      loai_cau: "multiple_choice",
      phuong_an_a: "Cơ trên gai",
      phuong_an_b: "Cơ dưới gai",
      phuong_an_c: "Cơ tròn lớn",
      phuong_an_d: "Cơ delta",
      dap_an_dung: "A, B",
      muc_do: "nhớ",
      giai_thich: "Chóp xoay gồm 4 cơ: trên gai, dưới gai, tròn bé và dưới vai. Cơ tròn lớn và cơ delta không thuộc chóp xoay.",
      doan_trich_dan: "sec-1-2-shoulder-joint",
    },
    {
      cau_hoi: "Dây thần kinh cơ bì xuyên qua bụng cơ quạ cánh tay. Đúng hay Sai?",
      loai_cau: "true_false",
      phuong_an_a: "Đúng",
      phuong_an_b: "Sai",
      phuong_an_c: "",
      phuong_an_d: "",
      dap_an_dung: "Đúng",
      muc_do: "nhớ",
      giai_thich: "Dây thần kinh cơ bì xuất phát từ bó ngoài và xuyên thẳng qua cơ quạ cánh tay.",
      doan_trich_dan: "sec-2-1-arm-muscles",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Mau_Cau_Hoi");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return buffer;
}
