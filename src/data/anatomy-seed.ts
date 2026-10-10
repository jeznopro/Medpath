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
    id: "class-anat-1",
    name: "Lớp Giải Phẫu Y1 - K2026 (Đại Học Y Dược)",
    description: "Khóa học Giải phẫu học hệ cơ quan dành cho sinh viên Y đa khoa năm thứ nhất. Áp dụng phương pháp Mastery Learning đọc hiểu & vượt cổng.",
    join_code: "YK2026",
    owner_id: "admin-1",
    owner_name: "Quản Trị Viên (Admin)",
    created_at: new Date().toISOString(),
  },
];

export const SEED_SUBJECTS: Subject[] = [
  {
    "id": "subj-mod-8",
    "class_id": "class-anat-1",
    "title": "Module 8: Tim mạch (25.DY.K56.08)",
    "order": 1
  },
  {
    "id": "subj-mod-9",
    "class_id": "class-anat-1",
    "title": "Module 9: Tiêu hoá (25.DY.K57.09)",
    "order": 2
  },
  {
    "id": "subj-mod-10",
    "class_id": "class-anat-1",
    "title": "Module 10: Tiết niệu, sinh dục (25.DY.CM6.10)",
    "order": 3
  },
  {
    "id": "subj-mod-11",
    "class_id": "class-anat-1",
    "title": "Module 11: Hệ thần kinh (25.DY.K55.11)",
    "order": 4
  },
  {
    "id": "subj-anat-1",
    "class_id": "class-anat-1",
    "title": "Giải Phẫu Học Hệ Cơ Xương Khớp & Mạch Máu Chi Trên",
    "order": 5
  }
];

export const SEED_LESSONS: Lesson[] = [
  {
    "id": "les-mod-8-1-1",
    "subject_id": "subj-mod-8",
    "title": "K56.LT1: LT1. Hình thái của tim [Bộ môn Giải phẫu]",
    "order": 1
  },
  {
    "id": "les-mod-8-1-2",
    "subject_id": "subj-mod-8",
    "title": "K56.LT2: LT2. Mô học hệ thống tim mạch [Bộ môn Mô phôi]",
    "order": 2
  },
  {
    "id": "les-mod-8-1-3",
    "subject_id": "subj-mod-8",
    "title": "K56.LT4: LT4. Giải phẫu và cấu trúc hệ mạch máu [Bộ môn Giải phẫu]",
    "order": 3
  },
  {
    "id": "les-mod-8-1-4",
    "subject_id": "subj-mod-8",
    "title": "K56.TH1: TH1. Hình thái tim [Bộ môn Giải phẫu]",
    "order": 4
  },
  {
    "id": "les-mod-8-1-5",
    "subject_id": "subj-mod-8",
    "title": "K56.TH3: TH3. Giải phẫu mạch máu [Bộ môn Giải phẫu]",
    "order": 5
  },
  {
    "id": "les-mod-8-2-1",
    "subject_id": "subj-mod-8",
    "title": "K56.LT3: LT3. Chức năng và các hoạt động chức năng của tim [Bộ môn Sinh lý thường]",
    "order": 6
  },
  {
    "id": "les-mod-8-2-2",
    "subject_id": "subj-mod-8",
    "title": "K56.LT5: LT5. Tuần hoàn mạch máu và điều tiết tuần hoàn [Bộ môn Sinh lý thường]",
    "order": 7
  },
  {
    "id": "les-mod-8-2-3",
    "subject_id": "subj-mod-8",
    "title": "K56.TH2: TH2. Chức năng và hoạt động chức năng của tim [Bộ môn Sinh lý thường]",
    "order": 8
  },
  {
    "id": "les-mod-8-2-4",
    "subject_id": "subj-mod-8",
    "title": "K56.TH4: TH4. Tuần hoàn mạch máu và điều tiết tuần hoàn [Bộ môn Sinh lý thường]",
    "order": 9
  },
  {
    "id": "les-mod-8-3-1",
    "subject_id": "subj-mod-8",
    "title": "K56.LT6: LT6. Rối loạn hình thái và chức năng tim [Bộ môn Sinh lý bệnh]",
    "order": 10
  },
  {
    "id": "les-mod-8-3-2",
    "subject_id": "subj-mod-8",
    "title": "K56.LT7: LT7. Rối loạn lưu lượng tuần hoàn [Bộ môn Sinh lý bệnh]",
    "order": 11
  },
  {
    "id": "les-mod-8-3-3",
    "subject_id": "subj-mod-8",
    "title": "K56.LT9: LT9. Rối loạn hình thái và chức năng động mạch [Bộ môn Giải phẫu bệnh]",
    "order": 12
  },
  {
    "id": "les-mod-8-3-4",
    "subject_id": "subj-mod-8",
    "title": "K56.LT10: LT10. Rối loạn hình thái và chức năng tĩnh mạch [Bộ môn Giải phẫu bệnh]",
    "order": 13
  },
  {
    "id": "les-mod-8-3-5",
    "subject_id": "subj-mod-8",
    "title": "K56.TH5: TH5. Rối loạn lưu lượng tuần hoàn [Bộ môn Sinh lý bệnh]",
    "order": 14
  },
  {
    "id": "les-mod-8-4-1",
    "subject_id": "subj-mod-8",
    "title": "K56.LT8: LT8. Các thuốc tác động lên tim [Viện đào tạo dược]",
    "order": 15
  },
  {
    "id": "les-mod-8-4-2",
    "subject_id": "subj-mod-8",
    "title": "K56.LT11: LT11. Các thuốc tác động lên hệ mạch máu [Viện đào tạo dược]",
    "order": 16
  },
  {
    "id": "les-mod-9-1-1",
    "subject_id": "subj-mod-9",
    "title": "K57.LT1: LT1. Giải phẫu ống tiêu hóa [Bộ môn Giải phẫu]",
    "order": 17
  },
  {
    "id": "les-mod-9-1-2",
    "subject_id": "subj-mod-9",
    "title": "K57.LT2: LT2. Giải phẫu các tuyến tiêu hóa [Bộ môn Giải phẫu]",
    "order": 18
  },
  {
    "id": "les-mod-9-1-3",
    "subject_id": "subj-mod-9",
    "title": "K57.LT3: LT3. Phôi thai hệ tiêu hóa và mô học thành ống tiêu hoá chính thức [Bộ môn Mô phôi]",
    "order": 19
  },
  {
    "id": "les-mod-9-1-4",
    "subject_id": "subj-mod-9",
    "title": "K57.LT4: LT4. Mô học các đoạn ống tiêu hoá và tuyến tiêu hoá [Bộ môn Mô phôi]",
    "order": 20
  },
  {
    "id": "les-mod-9-1-5",
    "subject_id": "subj-mod-9",
    "title": "K57.TH1: TH1. Giải phẫu ổ bụng; ống tiêu hóa; phúc mạc [Bộ môn Giải phẫu]",
    "order": 21
  },
  {
    "id": "les-mod-9-1-6",
    "subject_id": "subj-mod-9",
    "title": "K57.TH2: TH2. Giải phẫu các tuyến tiêu hóa [Bộ môn Giải phẫu]",
    "order": 22
  },
  {
    "id": "les-mod-9-1-7",
    "subject_id": "subj-mod-9",
    "title": "K57.TH3: TH3. Mô học ống và tuyến tiêu hóa [Bộ môn Mô phôi]",
    "order": 23
  },
  {
    "id": "les-mod-9-2-1",
    "subject_id": "subj-mod-9",
    "title": "K57.LT5: LT5. Tiêu hóa ở dạ dày; Tiêu hóa và hấp thu ở ruột non [Bộ môn Sinh lý thường]",
    "order": 24
  },
  {
    "id": "les-mod-9-2-2",
    "subject_id": "subj-mod-9",
    "title": "K57.LT9: LT9. Hóa sinh hệ tiêu hóa, gan [Hóa sinh]",
    "order": 25
  },
  {
    "id": "les-mod-9-2-3",
    "subject_id": "subj-mod-9",
    "title": "K57.TH4: TH4. Chức năng hệ tiêu hóa [Bộ môn Sinh lý thường]",
    "order": 26
  },
  {
    "id": "les-mod-9-2-4",
    "subject_id": "subj-mod-9",
    "title": "K57.TH6: TH6. Xét nghiệm hóa sinh hệ tiêu hóa, chức năng gan [Hóa sinh]",
    "order": 27
  },
  {
    "id": "les-mod-9-3-1",
    "subject_id": "subj-mod-9",
    "title": "K57.LT6: LT6. Rối loạn chức năng ống tiêu hóa [Bộ môn Sinh lý bệnh]",
    "order": 28
  },
  {
    "id": "les-mod-9-3-2",
    "subject_id": "subj-mod-9",
    "title": "K57.LT7: LT7. Rối loạn chức năng tuyến tiêu hóa [Bộ môn Sinh lý bệnh]",
    "order": 29
  },
  {
    "id": "les-mod-9-3-3",
    "subject_id": "subj-mod-9",
    "title": "K57.LT8: LT8. Giải phẫu bệnh hệ tiêu hóa [Giải phẫu bệnh]",
    "order": 30
  },
  {
    "id": "les-mod-9-3-4",
    "subject_id": "subj-mod-9",
    "title": "K57.LT10: LT10. Vi sinh vật thường trú và gây bệnh đường tiêu hóa [Vi sinh]",
    "order": 31
  },
  {
    "id": "les-mod-9-3-5",
    "subject_id": "subj-mod-9",
    "title": "K57.LT11: LT11. Ký sinh trùng đường tiêu hóa [Ký sinh trùng]",
    "order": 32
  },
  {
    "id": "les-mod-9-3-6",
    "subject_id": "subj-mod-9",
    "title": "K57.TH5: TH5. Giải phẫu bệnh hệ tiêu hóa [Giải phẫu bệnh]",
    "order": 33
  },
  {
    "id": "les-mod-9-4-1",
    "subject_id": "subj-mod-9",
    "title": "K57.LT12: LT12. Các thuốc tác động lên ống tiêu hóa [Viện đào tạo dược]",
    "order": 34
  },
  {
    "id": "les-mod-10-1-1",
    "subject_id": "subj-mod-10",
    "title": "CM6.LT1: LT1. Giải phẫu hệ tiết niệu [Bộ môn Giải phẫu]",
    "order": 35
  },
  {
    "id": "les-mod-10-1-2",
    "subject_id": "subj-mod-10",
    "title": "CM6.LT2: LT2. Giải phẫu cơ quan sinh dục [Bộ môn Giải phẫu]",
    "order": 36
  },
  {
    "id": "les-mod-10-1-3",
    "subject_id": "subj-mod-10",
    "title": "CM6.LT3: LT3. Định khu chậu hông, đáy chậu [Bộ môn Giải phẫu]",
    "order": 37
  },
  {
    "id": "les-mod-10-1-4",
    "subject_id": "subj-mod-10",
    "title": "CM6.LT4: LT4. Phôi thai và mô học hệ tiết niệu [Bộ môn Mô phôi]",
    "order": 38
  },
  {
    "id": "les-mod-10-1-5",
    "subject_id": "subj-mod-10",
    "title": "CM6.LT5: LT5. Phôi thai và mô học sinh dục [Bộ môn Mô phôi]",
    "order": 39
  },
  {
    "id": "les-mod-10-1-6",
    "subject_id": "subj-mod-10",
    "title": "CM6.TH1: TH1. Giải phẫu hệ tiết niệu [Bộ môn Giải phẫu]",
    "order": 40
  },
  {
    "id": "les-mod-10-1-7",
    "subject_id": "subj-mod-10",
    "title": "CM6.TH2: TH2. Hệ sinh dục nam, nữ và đáy chậu [Bộ môn Giải phẫu]",
    "order": 41
  },
  {
    "id": "les-mod-10-1-8",
    "subject_id": "subj-mod-10",
    "title": "CM6.TH3: TH3. Mô học hệ tiết niệu [Bộ môn Mô phôi]",
    "order": 42
  },
  {
    "id": "les-mod-10-1-9",
    "subject_id": "subj-mod-10",
    "title": "CM6.TH4: TH4. Phôi thai và mô học hệ sinh dục [Bộ môn Mô phôi]",
    "order": 43
  },
  {
    "id": "les-mod-10-2-1",
    "subject_id": "subj-mod-10",
    "title": "CM6.LT6: LT6. Chức năng hệ tiết niệu [Bộ môn Sinh lý thường]",
    "order": 44
  },
  {
    "id": "les-mod-10-2-2",
    "subject_id": "subj-mod-10",
    "title": "CM6.LT7: LT7. Sinh lý sinh dục nam [Bộ môn Sinh lý thường]",
    "order": 45
  },
  {
    "id": "les-mod-10-2-3",
    "subject_id": "subj-mod-10",
    "title": "CM6.LT8: LT8. Sinh lý sinh dục nữ [Bộ môn Sinh lý thường]",
    "order": 46
  },
  {
    "id": "les-mod-10-2-4",
    "subject_id": "subj-mod-10",
    "title": "CM6.LT9: LT9. Rối loạn cân bằng nước - điện giải [Bộ môn Sinh lý bệnh]",
    "order": 47
  },
  {
    "id": "les-mod-10-2-5",
    "subject_id": "subj-mod-10",
    "title": "CM6.LT10: LT10. Rối loạn cân bằng acid - base [Bộ môn Sinh lý bệnh]",
    "order": 48
  },
  {
    "id": "les-mod-10-2-6",
    "subject_id": "subj-mod-10",
    "title": "CM6.TH5: TH5. Điều hoà bài tiết thận [Bộ môn Sinh lý thường]",
    "order": 49
  },
  {
    "id": "les-mod-10-2-7",
    "subject_id": "subj-mod-10",
    "title": "CM6.TH6: TH6. Các thử nghiệm thăm dò chức năng thận [Hóa sinh]",
    "order": 50
  },
  {
    "id": "les-mod-10-2-8",
    "subject_id": "subj-mod-10",
    "title": "CM6.TH7: TH7. Cơ chế rối loạn cân bằng nước - điện giải [Bộ môn Sinh lý bệnh]",
    "order": 51
  },
  {
    "id": "les-mod-10-2-9",
    "subject_id": "subj-mod-10",
    "title": "CM6.TH8: TH8. Phân tích rối loạn cân bằng acid - base và nước - điện giải [Hóa sinh]",
    "order": 52
  },
  {
    "id": "les-mod-10-3-1",
    "subject_id": "subj-mod-10",
    "title": "CM6.LT11: LT11. Bệnh sinh và mô bệnh học viêm cầu thận, viêm khe ống thận và ung thư biểu mô thận [Giải phẫu bệnh]",
    "order": 53
  },
  {
    "id": "les-mod-10-3-2",
    "subject_id": "subj-mod-10",
    "title": "CM6.LT12: LT12. Sinh lý bệnh tiền sản giật [Bộ môn Sinh lý bệnh]",
    "order": 54
  },
  {
    "id": "les-mod-10-3-3",
    "subject_id": "subj-mod-10",
    "title": "CM6.LT13: LT13. Giải phẫu bệnh u vú, u xơ tử cung, u nang buồng trứng, ung thư cổ tử cung [Giải phẫu bệnh]",
    "order": 55
  },
  {
    "id": "les-mod-10-4-1",
    "subject_id": "subj-mod-10",
    "title": "CM6.LT14: LT14. Thuốc lợi niệu [Viện đào tạo dược]",
    "order": 56
  },
  {
    "id": "les-mod-10-4-2",
    "subject_id": "subj-mod-10",
    "title": "CM6.LT15: LT15. Các thuốc tác động vào hệ sinh dục - sinh sản [Viện đào tạo dược]",
    "order": 57
  },
  {
    "id": "les-mod-11-1-1",
    "subject_id": "subj-mod-11",
    "title": "K55.LT1: LT1. Đại cương hệ thần kinh [Bộ môn Giải phẫu]",
    "order": 58
  },
  {
    "id": "les-mod-11-1-2",
    "subject_id": "subj-mod-11",
    "title": "K55.LT2: LT2. Giải phẫu tủy sống, thân não, tiểu não, gian não, bán cầu đại não [Bộ môn Giải phẫu]",
    "order": 59
  },
  {
    "id": "les-mod-11-1-3",
    "subject_id": "subj-mod-11",
    "title": "K55.LT5: LT5. Giải phẫu màng não, màng tủy, các não thất, dịch não tủy [Bộ môn Giải phẫu]",
    "order": 60
  },
  {
    "id": "les-mod-11-1-4",
    "subject_id": "subj-mod-11",
    "title": "K55.TH1: TH1. Giải phẫu tủy sống, dây thần kinh sống [Bộ môn Giải phẫu]",
    "order": 61
  },
  {
    "id": "les-mod-11-1-5",
    "subject_id": "subj-mod-11",
    "title": "K55.TH2: TH2. Giải phẫu thân não, tiểu não [Bộ môn Giải phẫu]",
    "order": 62
  },
  {
    "id": "les-mod-11-1-6",
    "subject_id": "subj-mod-11",
    "title": "K55.TH3: TH3. Giải phẫu gian não, bán cầu đại não [Bộ môn Giải phẫu]",
    "order": 63
  },
  {
    "id": "les-mod-11-1-7",
    "subject_id": "subj-mod-11",
    "title": "K55.TH5: TH5. Giải phẫu màng não, màng tủy, các não thất, dịch não tủy [Bộ môn Giải phẫu]",
    "order": 64
  },
  {
    "id": "les-mod-11-2-1",
    "subject_id": "subj-mod-11",
    "title": "K55.LT6: LT6. Các dây thần kinh sọ não [Bộ môn Giải phẫu]",
    "order": 65
  },
  {
    "id": "les-mod-11-2-2",
    "subject_id": "subj-mod-11",
    "title": "K55.LT7: LT7. Các đám rối thần kinh [Bộ môn Giải phẫu]",
    "order": 66
  },
  {
    "id": "les-mod-11-2-3",
    "subject_id": "subj-mod-11",
    "title": "K55.TH6: TH6. Giải phẫu các dây thần kinh sọ [Bộ môn Giải phẫu]",
    "order": 67
  },
  {
    "id": "les-mod-11-2-4",
    "subject_id": "subj-mod-11",
    "title": "K55.TH7: TH7. Giải phẫu các đám rối thần kinh [Bộ môn Giải phẫu]",
    "order": 68
  },
  {
    "id": "les-mod-11-3-1",
    "subject_id": "subj-mod-11",
    "title": "K55.LT3: LT3. Chức năng vận động, cảm giác của hệ thần kinh [Bộ môn Sinh lý thường]",
    "order": 69
  },
  {
    "id": "les-mod-11-3-2",
    "subject_id": "subj-mod-11",
    "title": "K55.LT4: LT4. Cảm giác chuyên biệt [Bộ môn Sinh lý thường]",
    "order": 70
  },
  {
    "id": "les-mod-11-3-3",
    "subject_id": "subj-mod-11",
    "title": "K55.LT8,9: LT 8, 9. Hệ thần kinh thực vật; Chức năng của các cấu trúc dưới vỏ và vỏ bán cầu đại não [Bộ môn Sinh lý thường]",
    "order": 71
  },
  {
    "id": "les-mod-11-3-4",
    "subject_id": "subj-mod-11",
    "title": "K55.LT10: LT10. Hoạt động thần kinh cấp cao, phản xạ có điều kiện, giấc ngủ [Bộ môn Sinh lý thường]",
    "order": 72
  },
  {
    "id": "les-mod-11-3-5",
    "subject_id": "subj-mod-11",
    "title": "K55.TH4: TH4. Giải phẫu tai, mắt [Bộ môn Giải phẫu]",
    "order": 73
  },
  {
    "id": "les-mod-11-3-6",
    "subject_id": "subj-mod-11",
    "title": "K55.TH8: TH8. Hoạt động dẫn truyền, cung phản xạ và vai trò một số cấu trúc dưới vỏ với vận động [Bộ môn Sinh lý thường]",
    "order": 74
  },
  {
    "id": "les-mod-11-3-7",
    "subject_id": "subj-mod-11",
    "title": "K55.TH9: TH9. Phản xạ có điều kiện và một số cảm giác chuyên biệt [Bộ môn Sinh lý thường]",
    "order": 75
  },
  {
    "id": "les-mod-11-4-1",
    "subject_id": "subj-mod-11",
    "title": "K55.LT11: LT11. Sinh lý bệnh, Giải phẫu bệnh phù não [Bộ môn Sinh lý bệnh]",
    "order": 76
  },
  {
    "id": "les-mod-11-4-2",
    "subject_id": "subj-mod-11",
    "title": "K55.LT12: LT12. Các thuốc tác động hướng thần [Viện đào tạo dược]",
    "order": 77
  },
  {
    "id": "les-mod-11-4-3",
    "subject_id": "subj-mod-11",
    "title": "K55.LT13: LT13. Các thuốc tác động lên hoạt động của các chất dẫn truyền thần kinh và kênh ion trong não [Viện đào tạo dược]",
    "order": 78
  },
  {
    "id": "les-mod-11-4-4",
    "subject_id": "subj-mod-11",
    "title": "K55.LT14: LT14. Thuốc tăng cường dinh dưỡng và bảo vệ tế bào thần kinh [Viện đào tạo dược]",
    "order": 79
  },
  {
    "id": "lesson-1",
    "subject_id": "subj-anat-1",
    "title": "Bài 1: Xương và Khớp Chi Trên",
    "order": 80
  },
  {
    "id": "lesson-2",
    "subject_id": "subj-anat-1",
    "title": "Bài 2: Hệ Cơ và Mạch Máu - Thần Kinh Chi Trên",
    "order": 81
  }
];

export const SEED_SECTIONS: Section[] = [
  {
    id: "sec-1-1",
    lesson_id: "lesson-1",
    title: "Mục 1.1: Xương đòn, xương vai và xương cánh tay",
    order: 1,
    content_type: "markdown",
    pass_threshold: 80,
    questions_per_attempt: 10,
    is_core: true,
    content_url_or_text: `# Mục 1.1: Xương đòn, xương vai và xương cánh tay

## 1. Đại cương chi trên
Chi trên của con người được thiết kế tối ưu hóa cho sự linh hoạt và khả năng cầm nắm tinh tế. Đai ngực (pectoral girdle) gồm **xương đòn** và **xương vai**, kết nối chi trên với lồng ngực qua khớp ức đòn duy nhất.

<a id="sec-1-1-clavicle"></a>
## 2. Xương đòn (Clavicle)
- **Đặc điểm hình thái**: Là một xương dài có hình chữ S nằm ngang ở nền cổ và ngực trên.
- **Hai đầu**:
  - *Đầu ức*: tròn bè, khớp với cán xương ức.
  - *Đầu cùng vai*: dẹt, có diện khớp khớp với mỏm cùng vai của xương vai.
- **Thân xương**:
  - $2/3$ trong lồi ra trước (hình lăng trụ tam giác), chịu lực chống đỡ.
  - $1/3$ ngoài lõm ra trước, dẹt theo hướng trên dưới.
- **Ứng dụng lâm sàng**:
  - Vị trí gãy xương đòn phổ biến nhất là **điểm nối giữa 1/3 ngoài và 2/3 trong** (nơi chuyển giao độ cong và hình thể tiết diện).
  - Phía dưới xương đòn có rãnh dưới đòn (cho cơ dưới đòn bám) và bó mạch thần kinh dưới đòn (động mạch, tĩnh mạch dưới đòn và các thân đám rối thần kinh cánh tay).

<a id="sec-1-1-scapula"></a>
## 3. Xương vai (Scapula)
- **Hình thể**: Là xương dẹt, hình tam giác, nằm ở phía sau trên của lồng ngực (từ khoảng xương sườn 2 đến sườn 7).
- **Mặt lưng**: Bị chia thành 2 hố bởi **gai vai (spine of scapula)**:
  - *Hố trên gai* (supraspinous fossa): nơi cơ trên gai bám.
  - *Hố dưới gai* (infraspinous fossa): nơi cơ dưới gai bám.
  - Gai vai chạy chếch lên trên và ra ngoài, tận hết bằng **mỏm cùng vai (acromion)**.
- **Góc ngoài**: Có **ổ chảo (glenoid cavity)** hình quả lê nông, khớp với chỏm xương cánh tay. Phía trên có *củ trên ổ chảo* (nguyên ủy đầu dài cơ nhị đầu), phía dưới có *củ dưới ổ chảo* (nguyên ủy đầu dài cơ tam đầu).
- **Mỏm quạ (coracoid process)**: Nhô ra phía trước ngoài, là nơi bám của gân kết hợp (đầu ngắn cơ nhị đầu và cơ quạ cánh tay) cùng cơ ngực bé.

<a id="sec-1-1-humerus"></a>
## 4. Xương cánh tay (Humerus)
- Là xương dài nhất của chi trên.
- **Đầu trên**:
  - **Chỏm xương cánh tay**: Hình $1/3$ khối cầu hướng vào trong, lên trên và ra sau.
  - **Cổ giải phẫu**: Rãnh hẹp bao quanh chu vi đáy chỏm.
  - **Củ lớn** (nơi bám cơ trên gai, dưới gai, tròn bé) và **Củ bé** (nơi bám cơ dưới vai).
  - Giữa 2 củ là **rãnh gian củ** (rãnh nhị đầu), có gân đầu dài cơ nhị đầu đi qua.
  - **Cổ phẫu thuật**: Đoạn thắt hẹp nối đầu trên với thân xương. Đây là **điểm yếu dễ gãy nhất**, có **dây thần kinh nách** và động mạch mũ cánh tay sau chạy vòng quanh.
- **Thân xương**:
  - Mặt sau có **rãnh thần kinh quay** (rãnh xoắn) chạy chếch xuống dưới ra ngoài, chứa **dây thần kinh quay** và động mạch cánh tay sâu.
  - Khi gãy $1/3$ giữa thân xương cánh tay, biến chứng thường gặp nhất là tổn thương dây thần kinh quay dẫn đến dấu hiệu "bàn tay rủ cổ cò".
- **Đầu dưới**:
  - Gồm **lồi cầu** (capitulum, khớp với chỏm xương quay) và **ròng rọc** (trochlea, khớp với khuyết ròng rọc xương trụ).
  - Phía trên trong có mỏm trên lồi cầu trong; phía sau có **rãnh thần kinh trụ** (chứa dây thần kinh trụ chạy sát bề mặt).
`,
  },
  {
    id: "sec-1-2",
    lesson_id: "lesson-1",
    title: "Mục 1.2: Khớp vai và Khớp khuỷu - Giải phẫu & Lâm sàng",
    order: 2,
    content_type: "markdown",
    pass_threshold: 80,
    questions_per_attempt: 10,
    is_core: true,
    content_url_or_text: `# Mục 1.2: Khớp vai và Khớp khuỷu - Giải phẫu & Lâm sàng

## 1. Khớp vai (Glenohumeral Joint)
<a id="sec-1-2-shoulder-joint"></a>
- **Loại khớp**: Khớp động hoạt dịch hình chỏm cầu (ball-and-socket), là khớp có biên độ vận động lớn nhất cơ thể người.
- **Mặt khớp**:
  - Chỏm xương cánh tay (diện tích lớn gấp 3-4 lần ổ chảo).
  - Ổ chảo xương vai: Nông, được viền quanh bởi **sụn viền ổ chảo (glenoid labrum)** làm tăng độ sâu khoảng 50%.
- **Bao khớp và dây chằng**:
  - Dây chằng ổ chảo - cánh tay (trên, giữa, dưới).
  - Dây chằng quạ - cánh tay.
  - Dây chằng quạ - cùng vai (tạo thành vòm quạ - cùng vai bảo vệ phía trên khớp).
- **Chóp xoay (Rotator Cuff)**: Nhóm 4 cơ giữ vững khớp vai chính yếu:
  1. *Cơ trên gai* (Supraspinatus): Khởi đầu dang cánh tay ($0^\circ - 15^\circ$).
  2. *Cơ dưới gai* (Infraspinatus): Xoay ngoài cánh tay.
  3. *Cơ tròn bé* (Teres minor): Xoay ngoài cánh tay.
  4. *Cơ dưới vai* (Subscapularis): Xoay trong cánh tay.
- **Lâm sàng trật khớp vai**:
  - Do mặt dưới bao khớp yếu nhất và không có gân cơ che chở, trật khớp vai **ra trước - xuống dưới** là phổ biến nhất (>95%).
  - Dấu hiệu lâm sàng: Dấu hiệu "nhát rìu", dấu hiệu "gù vai" (mất độ cong tròn vai), dấu hiệu lò xo (Berger).
  - Nguy cơ tổn thương kèm theo: **Dây thần kinh nách** (mất cảm giác vùng cơ delta, liệt cơ delta).

<a id="sec-1-2-elbow-joint"></a>
## 2. Khớp khuỷu (Elbow Joint)
- Là một phức hợp gồm 3 khớp chung một bao khớp và khoang hoạt dịch:
  1. *Khớp cánh tay - trụ*: Khớp bản lề (bản lề ròng rọc), chỉ cho phép gấp - duỗi cẳng tay.
  2. *Khớp cánh tay - quay*: Khớp lồi cầu.
  3. *Khớp quay - trụ gần*: Khớp xoay (pivot), cho phép sấp - ngửa cẳng tay.
- **Dây chằng giữ vững**:
  - Dây chằng bên trụ (chống vẹo ngoài - valgus stress).
  - Dây chằng bên quay.
  - **Dây chằng vòng quay (annular ligament)**: Ôm lấy chu vi chỏm xương quay, cho phép chỏm xoay trơn tru.
- **Ứng dụng lâm sàng khớp khuỷu**:
  - *Trật chỏm xương quay ở trẻ em (Nursemaid's elbow)*: Xảy ra khi trẻ bị kéo giật mạnh cổ tay lúc cẳng tay đang duỗi và sấp, làm chỏm xương quay trượt ra dưới dây chằng vòng.
  - *Tam giác Hueter & Đường Hueter*:
    - Khi khuỷu gấp $90^\circ$: Mỏm trên lồi cầu trong, mỏm trên lồi cầu ngoài và đỉnh mỏm khuỷu tạo thành một tam giác cân (Tam giác Hueter).
    - Khi khuỷu duỗi hoàn toàn: Ba mốc này nằm trên một đường thẳng (Đường Hueter).
    - Trong trật khớp khuỷu: Tam giác Hueter bị đảo lộn. Trong gãy trên lồi cầu xương cánh tay: Tam giác Hueter vẫn giữ nguyên tương quan.
`,
  },
  {
    id: "sec-2-1",
    lesson_id: "lesson-2",
    title: "Mục 2.1: Cơ vùng nách, cánh tay và cẳng tay",
    order: 1,
    content_type: "markdown",
    pass_threshold: 80,
    questions_per_attempt: 10,
    is_core: true,
    content_url_or_text: `# Mục 2.1: Cơ vùng nách, cánh tay và cẳng tay

## 1. Hố nách (Axilla)
<a id="sec-2-1-axilla"></a>
- Hình tháp tứ giác gồm 4 thành, 1 đỉnh và 1 đáy:
  - *Thành trước*: Cơ ngực lớn, cơ dưới đòn, cơ ngực bé và mạc quạ - ngực.
  - *Thành sau*: Cơ dưới vai, cơ tròn lớn, cơ lưng rộng, và đầu dài cơ tam đầu cánh tay (tạo các lỗ tứ giác và tam giác).
  - *Thành trong*: 4 xương sườn và các cơ gian sườn trên cùng cơ răng trước.
  - *Thành ngoài*: Cơ quạ cánh tay và cơ nhị đầu cánh tay (rãnh gian củ xương cánh tay).
- **Lỗ tứ giác (Quadrangular space)**:
  - Giới hạn: Bờ dưới cơ tròn bé (hoặc cơ dưới vai ở trước), bờ trên cơ tròn lớn, đầu dài cơ tam đầu và thân xương cánh tay.
  - Thành phần đi qua: **Dây thần kinh nách** và **động mạch mũ cánh tay sau**.

<a id="sec-2-1-arm-muscles"></a>
## 2. Các cơ vùng cánh tay
- Bị vách gian cơ trong và vách gian cơ ngoài chia làm 2 khoang:
- **Khoang cánh tay trước (vận động bởi Dây thần kinh Cơ bì)**:
  1. *Cơ quạ cánh tay*: Bám từ mỏm quạ đến $1/3$ giữa xương cánh tay, giúp khép và gấp cánh tay. Thần kinh cơ bì xuyên qua cơ này.
  2. *Cơ nhị đầu cánh tay*:
     - Đầu dài: bám vào củ trên ổ chảo, gân đi trong bao khớp vai rồi vào rãnh gian củ.
     - Đầu ngắn: bám vào mỏm quạ.
     - Tác dụng: Gấp cẳng tay mạnh nhất khi cẳng tay ngửa; là cơ ngửa cẳng tay mạnh khi khuỷu gấp.
  3. *Cơ cánh tay*: Bám từ nửa dưới thân xương cánh tay đến mỏm vẹt xương trụ, là cơ gấp cẳng tay thuần túy ở mọi tư thế.
- **Khoang cánh tay sau (vận động bởi Dây thần kinh Quay)**:
  - *Cơ tam đầu cánh tay*: Gồm 3 đầu (đầu dài bám củ dưới ổ chảo, đầu ngoài và đầu trong bám mặt sau xương cánh tay) bám tận vào **mỏm khuỷu** xương trụ. Tác dụng: Duỗi cẳng tay chính.

<a id="sec-2-1-forearm-muscles"></a>
## 3. Các cơ vùng cẳng tay
- **Khoang cẳng tay trước (gấp và sấp)**:
  - Hầu hết do **thần kinh giữa** chi phối, NGOẠI TRỪ:
    - *Cơ gấp cổ tay trụ* (do thần kinh trụ chi phối).
    - *Nửa trong cơ gấp sâu các ngón tay* (ngón IV, V - do thần kinh trụ chi phối).
  - Ống cổ tay (Carpal tunnel): Được giới hạn bởi các xương cổ tay và **dây chằng vòng cổ tay** (mạc hãm gân gấp). Chứa 9 gân gấp (4 gân cơ gấp nông, 4 gân cơ gấp sâu, 1 gân cơ gấp ngón cái dài) và **thần kinh giữa**. Chèn ép trong ống cổ tay gây *Hội chứng ống cổ tay*.
`,
  },
  {
    id: "sec-2-2",
    lesson_id: "lesson-2",
    title: "Mục 2.2: Đám rối thần kinh cánh tay & Động mạch cánh tay",
    order: 2,
    content_type: "markdown",
    pass_threshold: 80,
    questions_per_attempt: 10,
    is_core: true,
    content_url_or_text: `# Mục 2.2: Đám rối thần kinh cánh tay & Động mạch cánh tay

## 1. Đám rối thần kinh cánh tay (Brachial Plexus)
<a id="sec-2-2-brachial-plexus"></a>
- **Cấu tạo nguyên ủy**: Do các nhánh trước của dây thần kinh gai sống từ **C5 đến T1** tạo nên (có thể có nhánh nối từ C4 hoặc T2).
- **Phân chia theo thứ tự**: Rễ (Roots) $\rightarrow$ Thân (Trunks) $\rightarrow$ Ngành (Divisions) $\rightarrow$ Bó (Cords) $\rightarrow$ Nhánh tận (Branches).
  - *3 Thân*:
    - Thân trên (C5, C6).
    - Thân giữa (C7).
    - Thân dưới (C8, T1).
  - Mỗi thân chia thành 2 ngành (trước và sau).
  - *3 Bó* (đặt tên theo mối tương quan với động mạch nách đoạn sau cơ ngực bé):
    - **Bó ngoài**: Hợp bởi ngành trước thân trên và thân giữa (cho nhánh ngoài thần kinh giữa và thần kinh cơ bì).
    - **Bó trong**: Tiếp tục của ngành trước thân dưới (cho nhánh trong thần kinh giữa, thần kinh trụ, bì cánh tay trong, bì cẳng tay trong).
    - **Bó sau**: Hợp bởi cả 3 ngành sau của 3 thân (cho thần kinh nách và thần kinh quay).

<a id="sec-2-2-peripheral-nerves"></a>
## 2. Tổn thương các nhánh thần kinh chính
1. **Dây thần kinh Quay (Radial Nerve - C5-T1)**:
   - Chi phối toàn bộ nhóm cơ duỗi cánh tay, cẳng tay và cổ bàn tay.
   - Khi tổn thương ở rãnh xoắn xương cánh tay: Mất khả năng duỗi cổ tay và duỗi các ngón, tạo tư thế **"bàn tay rủ cổ cò"** (drop hand).
2. **Dây thần kinh Trụ (Ulnar Nerve - C8, T1)**:
   - Đi qua rãnh sau mỏm trên lồi cầu trong xương cánh tay, qua cổ tay ở kênh Guyon.
   - Chi phối phần lớn các cơ nội tại của bàn tay (cơ gian cốt, cơ giun III-IV, cơ khép ngón cái).
   - Khi tổn thương mạn tính: Mất vận động các cơ gian cốt, teo cơ mô út, các ngón IV-V gấp đốt 1 duỗi đốt 2-3 tạo tư thế **"bàn tay vuốt trụ"** (claw hand).
3. **Dây thần kinh Giữa (Median Nerve - C5-T1)**:
   - Đi cùng động mạch cánh tay ở ống cánh tay, đi qua ống cổ tay.
   - Chi phối các cơ mô cái (đối chiếu ngón cái, gấp ngón cái ngắn, dạng ngón cái ngắn).
   - Khi tổn thương: Teo cơ ô mô cái, mất động tác đối chiếu ngón cái, tạo tư thế **"bàn tay khỉ"** (ape hand).

<a id="sec-2-2-arteries"></a>
## 3. Hệ động mạch chi trên
- **Động mạch nách**: Tiếp nối động mạch dưới đòn từ bờ sau xương đòn đến bờ dưới cơ ngực lớn, rồi đổi tên thành **động mạch cánh tay**.
- **Động mạch cánh tay**:
  - Chạy dọc theo bờ trong cơ nhị đầu cánh tay (cơ tùy hành).
  - Tách nhánh bên lớn nhất là **động mạch cánh tay sâu** (đi cùng thần kinh quay vào rãnh xoắn).
  - Tới ngang mức dưới nếp gấp khuỷu $3\\text{ cm}$ (ngang mức cổ xương quay), chia thành 2 nhánh tận: **động mạch quay** và **động mạch trụ**.
`,
  },
];

export const SEED_QUESTIONS: Question[] = [
  // ==========================================
  // SECTION 1.1: Xương đòn, xương vai, xương cánh tay (15 câu)
  // ==========================================
  {
    id: "q-1-1-01",
    section_id: "sec-1-1",
    type: "single_choice",
    body: "Vị trí gãy phổ biến nhất của xương đòn trên lâm sàng là ở đâu?",
    explanation: "Xương đòn có điểm yếu cơ học tự nhiên nằm ở vị trí nối giữa 1/3 ngoài và 2/3 trong, nơi có sự chuyển đổi giữa hai đoạn cong ngược chiều nhau và hình dạng thiết diện thay đổi.",
    difficulty: "remember",
    source_ref: "sec-1-1-clavicle",
    is_active: true,
    options: [
      { id: "opt-1-1-01-a", question_id: "q-1-1-01", text: "Điểm nối giữa 1/3 ngoài và 2/3 trong", is_correct: true, explanation: "Chính xác. Đây là điểm yếu chịu lực kém nhất của xương đòn." },
      { id: "opt-1-1-01-b", question_id: "q-1-1-01", text: "Đầu ức của xương đòn", is_correct: false, explanation: "Đầu ức rất dày và được dây chằng ức đòn giữ chắc, hiếm khi gãy." },
      { id: "opt-1-1-01-c", question_id: "q-1-1-01", text: "Đầu cùng vai xương đòn", is_correct: false, explanation: "Đầu cùng vai thường bị trật khớp cùng đòn hơn là gãy xương." },
      { id: "opt-1-1-01-d", question_id: "q-1-1-01", text: "Chính giữa 1/3 trong", is_correct: false, explanation: "Phần 1/3 trong rất chắc chắn và có cơ ức đòn chũm che chở." },
    ],
  },
  {
    id: "q-1-1-02",
    section_id: "sec-1-1",
    type: "single_choice",
    body: "Gai vai (spine of scapula) liên tục ra phía ngoài và tận hết bằng cấu trúc nào sau đây?",
    explanation: "Gai vai chạy chếch lên trên và ra ngoài ở mặt lưng xương vai, tận cùng bằng một mỏm xương dẹt gọi là mỏm cùng vai (acromion).",
    difficulty: "remember",
    source_ref: "sec-1-1-scapula",
    is_active: true,
    options: [
      { id: "opt-1-1-02-a", question_id: "q-1-1-02", text: "Mỏm quạ", is_correct: false, explanation: "Mỏm quạ xuất phát từ bờ trên và góc ngoài xương vai, tách biệt với gai vai." },
      { id: "opt-1-1-02-b", question_id: "q-1-1-02", text: "Mỏm cùng vai (Acromion)", is_correct: true, explanation: "Chính xác, mỏm cùng vai là phần tiếp nối tận cùng của gai vai." },
      { id: "opt-1-1-02-c", question_id: "q-1-1-02", text: "Củ trên ổ chảo", is_correct: false, explanation: "Củ trên ổ chảo nằm ở ngay trên bờ ổ chảo." },
      { id: "opt-1-1-02-d", question_id: "q-1-1-02", text: "Hố trên gai", is_correct: false, explanation: "Hố trên gai là hố lõm nằm ở phía trên gai vai." },
    ],
  },
  {
    id: "q-1-1-03",
    section_id: "sec-1-1",
    type: "single_choice",
    body: "Khi gãy cổ phẫu thuật xương cánh tay, dây thần kinh và mạch máu nào có nguy cơ bị tổn thương cao nhất?",
    explanation: "Dây thần kinh nách và động mạch mũ cánh tay sau chạy vòng quanh cổ phẫu thuật xương cánh tay (chui qua lỗ tứ giác) nên rất dễ bị tổn thương khi gãy vị trí này.",
    difficulty: "apply",
    source_ref: "sec-1-1-humerus",
    is_active: true,
    options: [
      { id: "opt-1-1-03-a", question_id: "q-1-1-03", text: "Dây thần kinh nách và động mạch mũ cánh tay sau", is_correct: true, explanation: "Đúng. Thần kinh nách quấn quanh cổ phẫu thuật để phân nhánh vào cơ delta." },
      { id: "opt-1-1-03-b", question_id: "q-1-1-03", text: "Dây thần kinh quay và động mạch cánh tay sâu", is_correct: false, explanation: "Bó này đi trong rãnh thần kinh quay ở 1/3 giữa thân xương cánh tay." },
      { id: "opt-1-1-03-c", question_id: "q-1-1-03", text: "Dây thần kinh trụ và động mạch quặt ngược trụ", is_correct: false, explanation: "Thần kinh trụ đi ở rãnh sau mỏm trên lồi cầu trong ở đầu dưới." },
      { id: "opt-1-1-03-d", question_id: "q-1-1-03", text: "Dây thần kinh giữa và động mạch cánh tay", is_correct: false, explanation: "Bó mạch thần kinh cánh tay chạy ở mặt trước trong cánh tay." },
    ],
  },
  {
    id: "q-1-1-04",
    section_id: "sec-1-1",
    type: "single_choice",
    body: "Tổn thương cấu trúc nào đi trong rãnh xoắn mặt sau thân xương cánh tay dẫn đến triệu chứng 'bàn tay rủ cổ cò'?",
    explanation: "Dây thần kinh quay chạy trong rãnh thần kinh quay (rãnh xoắn) ở mặt sau thân xương cánh tay. Thần kinh quay chi phối các cơ duỗi cổ tay và ngón tay.",
    difficulty: "clinical",
    source_ref: "sec-1-1-humerus",
    is_active: true,
    options: [
      { id: "opt-1-1-04-a", question_id: "q-1-1-04", text: "Dây thần kinh cơ bì", is_correct: false, explanation: "Thần kinh cơ bì chi phối cơ gấp ở khoang cánh tay trước." },
      { id: "opt-1-1-04-b", question_id: "q-1-1-04", text: "Dây thần kinh giữa", is_correct: false, explanation: "Thần kinh giữa tổn thương gây bàn tay khỉ." },
      { id: "opt-1-1-04-c", question_id: "q-1-1-04", text: "Dây thần kinh quay", is_correct: true, explanation: "Chính xác. Liệt cơ duỗi làm cổ tay rủ xuống gọi là bàn tay rủ cổ cò." },
      { id: "opt-1-1-04-d", question_id: "q-1-1-04", text: "Dây thần kinh trụ", is_correct: false, explanation: "Thần kinh trụ tổn thương gây bàn tay vuốt trụ." },
    ],
  },
  {
    id: "q-1-1-05",
    section_id: "sec-1-1",
    type: "single_choice",
    body: "Củ lớn xương cánh tay là nơi bám tận của các cơ nào sau đây?",
    explanation: "Củ lớn xương cánh tay có 3 diện bám cho 3 cơ của chóp xoay: cơ trên gai (diện trên), cơ dưới gai (diện giữa), và cơ tròn bé (diện dưới). Cơ dưới vai bám vào củ bé.",
    difficulty: "understand",
    source_ref: "sec-1-1-humerus",
    is_active: true,
    options: [
      { id: "opt-1-1-05-a", question_id: "q-1-1-05", text: "Cơ trên gai, cơ dưới gai và cơ tròn bé", is_correct: true, explanation: "Chính xác. Cả 3 gân này bám vào 3 diện của củ lớn." },
      { id: "opt-1-1-05-b", question_id: "q-1-1-05", text: "Cơ dưới vai, cơ tròn lớn và cơ lưng rộng", is_correct: false, explanation: "Cơ dưới vai bám vào củ bé; cơ tròn lớn bám mép trong rãnh gian củ." },
      { id: "opt-1-1-05-c", question_id: "q-1-1-05", text: "Cơ delta, cơ quạ cánh tay và cơ nhị đầu", is_correct: false, explanation: "Cơ delta bám lồi củ delta trên thân xương cánh tay." },
      { id: "opt-1-1-05-d", question_id: "q-1-1-05", text: "Cơ ngực lớn và cơ quạ cánh tay", is_correct: false, explanation: "Cơ ngực lớn bám mép ngoài rãnh gian củ." },
    ],
  },
  {
    id: "q-1-1-06",
    section_id: "sec-1-1",
    type: "true_false",
    body: "Gân đầu dài của cơ nhị đầu cánh tay đi bên trong bao khớp vai và nằm trong rãnh gian củ xương cánh tay. Đúng hay Sai?",
    explanation: "Đầu dài cơ nhị đầu bám vào củ trên ổ chảo xương vai, đi xuyên qua khoang hoạt dịch bao khớp vai rồi chui vào rãnh gian củ.",
    difficulty: "remember",
    source_ref: "sec-1-1-humerus",
    is_active: true,
    options: [
      { id: "opt-1-1-06-t", question_id: "q-1-1-06", text: "Đúng", is_correct: true, explanation: "Chính xác, gân đầu dài nhị đầu là một cấu trúc nội khớp nhưng ngoại hoạt dịch." },
      { id: "opt-1-1-06-f", question_id: "q-1-1-06", text: "Sai", is_correct: false, explanation: "Nhận định này hoàn toàn đúng về mặt giải phẫu." },
    ],
  },
  {
    id: "q-1-1-07",
    section_id: "sec-1-1",
    type: "single_choice",
    body: "Cấu trúc nào nằm ở đầu dưới xương cánh tay khớp với chỏm xương quay?",
    explanation: "Ở đầu dưới xương cánh tay: lồi cầu (capitulum) hình cầu khớp với hõm khớp chỏm xương quay; còn ròng rọc (trochlea) khớp với khuyết ròng rọc của xương trụ.",
    difficulty: "understand",
    source_ref: "sec-1-1-humerus",
    is_active: true,
    options: [
      { id: "opt-1-1-07-a", question_id: "q-1-1-07", text: "Lồi cầu (Capitulum)", is_correct: true, explanation: "Đúng. Lồi cầu khớp với chỏm xương quay." },
      { id: "opt-1-1-07-b", question_id: "q-1-1-07", text: "Ròng rọc (Trochlea)", is_correct: false, explanation: "Ròng rọc khớp với khuyết ròng rọc của xương trụ." },
      { id: "opt-1-1-07-c", question_id: "q-1-1-07", text: "Hố vẹt", is_correct: false, explanation: "Hố vẹt tiếp nhận mỏm vẹt xương trụ khi khuỷu gấp." },
      { id: "opt-1-1-07-d", question_id: "q-1-1-07", text: "Hố khuỷu", is_correct: false, explanation: "Hố khuỷu tiếp nhận mỏm khuỷu xương trụ khi khuỷu duỗi." },
    ],
  },
  {
    id: "q-1-1-08",
    section_id: "sec-1-1",
    type: "single_choice",
    body: "Dây thần kinh trụ đi qua rãnh xương nào ở đầu dưới xương cánh tay?",
    explanation: "Dây thần kinh trụ chạy ngay phía sau mỏm trên lồi cầu trong xương cánh tay, trong rãnh thần kinh trụ (rãnh ròng rọc khuỷu). Vị trí này rất nông, khi va đập sẽ có cảm giác giật tê buồn xuống bàn tay.",
    difficulty: "remember",
    source_ref: "sec-1-1-humerus",
    is_active: true,
    options: [
      { id: "opt-1-1-08-a", question_id: "q-1-1-08", text: "Rãnh sau mỏm trên lồi cầu trong", is_correct: true, explanation: "Chính xác. Thần kinh trụ nằm sát xương sau mỏm trên lồi cầu trong." },
      { id: "opt-1-1-08-b", question_id: "q-1-1-08", text: "Rãnh trước mỏm trên lồi cầu ngoài", is_correct: false, explanation: "Thần kinh quay đi ở phía trước mỏm trên lồi cầu ngoài." },
      { id: "opt-1-1-08-c", question_id: "q-1-1-08", text: "Rãnh gian củ", is_correct: false, explanation: "Rãnh gian củ ở đầu trên cho gân nhị đầu đi qua." },
      { id: "opt-1-1-08-d", question_id: "q-1-1-08", text: "Hố quay", is_correct: false, explanation: "Hố quay nằm ở mặt trước trên lồi cầu." },
    ],
  },
  {
    id: "q-1-1-09",
    section_id: "sec-1-1",
    type: "multiple_choice",
    body: "Những cấu trúc nào sau đây bám vào mỏm quạ của xương vai? (Chọn 2 đáp án)",
    explanation: "Mỏm quạ là nguyên ủy của đầu ngắn cơ nhị đầu và cơ quạ cánh tay (gân kết hợp), đồng thời là nơi bám tận của cơ ngực bé.",
    difficulty: "understand",
    source_ref: "sec-1-1-scapula",
    is_active: true,
    options: [
      { id: "opt-1-1-09-a", question_id: "q-1-1-09", text: "Đầu ngắn cơ nhị đầu cánh tay", is_correct: true, explanation: "Đúng. Bám vào đỉnh mỏm quạ." },
      { id: "opt-1-1-09-b", question_id: "q-1-1-09", text: "Cơ ngực bé", is_correct: true, explanation: "Đúng. Bám vào bờ trong mỏm quạ." },
      { id: "opt-1-1-09-c", question_id: "q-1-1-09", text: "Đầu dài cơ nhị đầu cánh tay", is_correct: false, explanation: "Đầu dài bám vào củ trên ổ chảo xương vai." },
      { id: "opt-1-1-09-d", question_id: "q-1-1-09", text: "Cơ dưới gai", is_correct: false, explanation: "Cơ dưới gai bám vào hố dưới gai mặt sau xương vai." },
    ],
  },
  {
    id: "q-1-1-10",
    section_id: "sec-1-1",
    type: "single_choice",
    body: "Xương nào kết nối toàn bộ hệ thống xương chi trên với xương trục (thân mình) qua khớp hoạt dịch?",
    explanation: "Khớp ức đòn (Sternoclavicular joint) là khớp hoạt dịch duy nhất nối đai ngực và chi trên trực tiếp vào bộ xương trục của cơ thể.",
    difficulty: "understand",
    source_ref: "sec-1-1-clavicle",
    is_active: true,
    options: [
      { id: "opt-1-1-10-a", question_id: "q-1-1-10", text: "Xương đòn", is_correct: true, explanation: "Chính xác, qua khớp ức đòn." },
      { id: "opt-1-1-10-b", question_id: "q-1-1-10", text: "Xương bả vai", is_correct: false, explanation: "Xương vai nối với thành ngực qua khối cơ (khớp nối cơ ngực), không phải khớp hoạt dịch xương trục." },
      { id: "opt-1-1-10-c", question_id: "q-1-1-10", text: "Xương cánh tay", is_correct: false, explanation: "Xương cánh tay khớp với xương vai, không tiếp xúc xương trục." },
      { id: "opt-1-1-10-d", question_id: "q-1-1-10", text: "Xương sườn 1", is_correct: false, explanation: "Xương sườn 1 thuộc xương trục lồng ngực." },
    ],
  },
  {
    id: "q-1-1-11",
    section_id: "sec-1-1",
    type: "true_false",
    body: "Củ dưới ổ chảo của xương vai là nơi bám nguyên ủy của đầu dài cơ tam đầu cánh tay. Đúng hay Sai?",
    explanation: "Đầu dài cơ tam đầu bám vào củ dưới ổ chảo xương vai, trong khi đầu dài cơ nhị đầu bám vào củ trên ổ chảo.",
    difficulty: "remember",
    source_ref: "sec-1-1-scapula",
    is_active: true,
    options: [
      { id: "opt-1-1-11-t", question_id: "q-1-1-11", text: "Đúng", is_correct: true, explanation: "Chính xác." },
      { id: "opt-1-1-11-f", question_id: "q-1-1-11", text: "Sai", is_correct: false, explanation: "Đây là nhận định giải phẫu hoàn toàn chuẩn xác." },
    ],
  },
  {
    id: "q-1-1-12",
    section_id: "sec-1-1",
    type: "single_choice",
    body: "Bệnh nhân nam 24 tuổi ngã đập vai xuống nền cứng, chụp X-quang gãy kín 1/3 ngoài xương đòn. Bác sĩ cần khám cẩn thận cấu trúc giải phẫu nào ngay dưới xương đòn?",
    explanation: "Phía dưới xương đòn là đỉnh hố nách, nơi có động mạch dưới đòn, tĩnh mạch dưới đòn và các thân của đám rối thần kinh cánh tay đi qua.",
    difficulty: "clinical",
    source_ref: "sec-1-1-clavicle",
    is_active: true,
    options: [
      { id: "opt-1-1-12-a", question_id: "q-1-1-12", text: "Bó mạch thần kinh dưới đòn", is_correct: true, explanation: "Đúng. Mảnh xương gãy có thể chèn ép hoặc đâm rách mạch máu dưới đòn hoặc đám rối cánh tay." },
      { id: "opt-1-1-12-b", question_id: "q-1-1-12", text: "Động mạch cảnh chung", is_correct: false, explanation: "Động mạch cảnh chung nằm sâu trong bao cảnh ở vùng cổ trước." },
      { id: "opt-1-1-12-c", question_id: "q-1-1-12", text: "Thần kinh thanh quản quặt ngược", is_correct: false, explanation: "Thần kinh thanh quản quặt ngược nằm sâu trong rãnh khí thực quản." },
      { id: "opt-1-1-12-d", question_id: "q-1-1-12", text: "Động mạch đốt sống", is_correct: false, explanation: "Động mạch đốt sống chui vào lỗ mỏm ngang các đốt sống cổ từ C6." },
    ],
  },
  {
    id: "q-1-1-13",
    section_id: "sec-1-1",
    type: "single_choice",
    body: "Lồi củ delta (deltoid tuberosity) nằm ở vị trí nào của xương cánh tay?",
    explanation: "Lồi củ delta nằm ở mặt ngoài của 1/3 giữa thân xương cánh tay, có hình chữ V thô ráp là nơi bám tận của cơ delta.",
    difficulty: "remember",
    source_ref: "sec-1-1-humerus",
    is_active: true,
    options: [
      { id: "opt-1-1-13-a", question_id: "q-1-1-13", text: "Mặt ngoài của thân xương cánh tay", is_correct: true, explanation: "Đúng, cơ delta bám tận vào lồi củ này." },
      { id: "opt-1-1-13-b", question_id: "q-1-1-13", text: "Đầu trên, sát củ lớn", is_correct: false, explanation: "Củ lớn là nơi bám của các cơ chóp xoay." },
      { id: "opt-1-1-13-c", question_id: "q-1-1-13", text: "Mặt sau của đầu dưới", is_correct: false, explanation: "Mặt sau đầu dưới có hố khuỷu." },
      { id: "opt-1-1-13-d", question_id: "q-1-1-13", text: "Mép trong rãnh gian củ", is_correct: false, explanation: "Mép trong rãnh gian củ là nơi bám của cơ tròn lớn." },
    ],
  },
  {
    id: "q-1-1-14",
    section_id: "sec-1-1",
    type: "single_choice",
    body: "Khuyết quạ (hoặc khuyết vai - suprascapular notch) ở bờ trên xương vai có cấu trúc nào đi qua bên dưới dây chằng ngang vai trên?",
    explanation: "Dây thần kinh trên vai (suprascapular nerve) đi DƯỚI dây chằng ngang vai trên (chui qua khuyết quạ), trong khi động mạch trên vai đi PHÍA TRÊN dây chằng.",
    difficulty: "understand",
    source_ref: "sec-1-1-scapula",
    is_active: true,
    options: [
      { id: "opt-1-1-14-a", question_id: "q-1-1-14", text: "Dây thần kinh trên vai", is_correct: true, explanation: "Chính xác (thần kinh đi dưới cầu, mạch máu đi trên cầu)." },
      { id: "opt-1-1-14-b", question_id: "q-1-1-14", text: "Động mạch trên vai", is_correct: false, explanation: "Động mạch đi ở phía trên dây chằng ngang vai." },
      { id: "opt-1-1-14-c", question_id: "q-1-1-14", text: "Dây thần kinh nách", is_correct: false, explanation: "Thần kinh nách đi qua lỗ tứ giác ở vùng nách." },
      { id: "opt-1-1-14-d", question_id: "q-1-1-14", text: "Thần kinh ngực dài", is_correct: false, explanation: "Thần kinh ngực dài chạy dọc thành ngực bên chi phối cơ răng trước." },
    ],
  },
  {
    id: "q-1-1-15",
    section_id: "sec-1-1",
    type: "single_choice",
    body: "Mặt trước của xương bả vai (hố dưới vai) là diện bám nguyên ủy của cơ nào?",
    explanation: "Mặt trước xương vai là một hố lõm rộng gọi là hố dưới vai, là nguyên ủy của cơ dưới vai (subscapularis) trước khi gân cơ này bám vào củ bé xương cánh tay.",
    difficulty: "remember",
    source_ref: "sec-1-1-scapula",
    is_active: true,
    options: [
      { id: "opt-1-1-15-a", question_id: "q-1-1-15", text: "Cơ dưới vai (Subscapularis)", is_correct: true, explanation: "Chính xác, cơ dưới vai lấp đầy hố dưới vai." },
      { id: "opt-1-1-15-b", question_id: "q-1-1-15", text: "Cơ răng trước", is_correct: false, explanation: "Cơ răng trước bám dọc bờ trong mặt trước xương vai." },
      { id: "opt-1-1-15-c", question_id: "q-1-1-15", text: "Cơ ngực bé", is_correct: false, explanation: "Cơ ngực bé bám vào mỏm quạ." },
      { id: "opt-1-1-15-d", question_id: "q-1-1-15", text: "Cơ trên gai", is_correct: false, explanation: "Cơ trên gai bám ở mặt lưng xương vai." },
    ],
  },

  // ==========================================
  // SECTION 1.2: Khớp vai & Khớp khuỷu (15 câu)
  // ==========================================
  {
    id: "q-1-2-01",
    section_id: "sec-1-2",
    type: "single_choice",
    body: "Cơ nào trong nhóm chóp xoay (rotator cuff) có chức năng khởi đầu động tác dạng cánh tay từ 0 đến 15 độ?",
    explanation: "Cơ trên gai (Supraspinatus) chịu trách nhiệm khởi phát động tác dạng cánh tay từ 0° đến 15°. Sau góc 15°, cơ delta trở thành cơ dạng chính lực mạnh nhất.",
    difficulty: "understand",
    source_ref: "sec-1-2-shoulder-joint",
    is_active: true,
    options: [
      { id: "opt-1-2-01-a", question_id: "q-1-2-01", text: "Cơ trên gai (Supraspinatus)", is_correct: true, explanation: "Đúng. Rách gân cơ trên gai làm bệnh nhân không tự nhấc tay khởi đầu dạng được." },
      { id: "opt-1-2-01-b", question_id: "q-1-2-01", text: "Cơ dưới gai (Infraspinatus)", is_correct: false, explanation: "Cơ dưới gai chủ yếu làm động tác xoay ngoài cánh tay." },
      { id: "opt-1-2-01-c", question_id: "q-1-2-01", text: "Cơ dưới vai (Subscapularis)", is_correct: false, explanation: "Cơ dưới vai chủ yếu làm xoay trong cánh tay." },
      { id: "opt-1-2-01-d", question_id: "q-1-2-01", text: "Cơ tròn bé (Teres minor)", is_correct: false, explanation: "Cơ tròn bé làm xoay ngoài cánh tay." },
    ],
  },
  {
    id: "q-1-2-02",
    section_id: "sec-1-2",
    type: "single_choice",
    body: "Hướng trật khớp vai phổ biến nhất trên lâm sàng (>95%) là hướng nào?",
    explanation: "Phía trước dưới của bao khớp vai là vị trí yếu nhất do không có gân cơ chóp xoay che chắn, do đó trật khớp vai ra trước - xuống dưới chiếm đại đa số các ca lâm sàng.",
    difficulty: "remember",
    source_ref: "sec-1-2-shoulder-joint",
    is_active: true,
    options: [
      { id: "opt-1-2-02-a", question_id: "q-1-2-02", text: "Ra trước và xuống dưới", is_correct: true, explanation: "Chính xác, chiếm hơn 95% trường hợp trật khớp vai." },
      { id: "opt-1-2-02-b", question_id: "q-1-2-02", text: "Ra sau thuần túy", is_correct: false, explanation: "Trật ra sau rất hiếm (gặp khi bị điện giật hoặc co giật mạnh)." },
      { id: "opt-1-2-02-c", question_id: "q-1-2-02", text: "Lên trên", is_correct: false, explanation: "Phía trên có vòm cùng quạ rất chắc chắn ngăn cản chỏm trượt lên." },
      { id: "opt-1-2-02-d", question_id: "q-1-2-02", text: "Vào trong xuyên qua ổ chảo", is_correct: false, explanation: "Đây là vỡ ổ chảo chứ không phải cơ chế trật khớp đơn thuần." },
    ],
  },
  {
    id: "q-1-2-03",
    section_id: "sec-1-2",
    type: "single_choice",
    body: "Tổn thương thần kinh thường gặp nhất kèm theo trong trật khớp vai ra trước là gì?",
    explanation: "Dây thần kinh nách nằm ngay sát mặt dưới khớp vai trước khi chui qua lỗ tứ giác, nên khi chỏm xương cánh tay trật xuống dưới ra trước sẽ kéo căng hoặc chèn ép thần kinh nách.",
    difficulty: "clinical",
    source_ref: "sec-1-2-shoulder-joint",
    is_active: true,
    options: [
      { id: "opt-1-2-03-a", question_id: "q-1-2-03", text: "Dây thần kinh nách", is_correct: true, explanation: "Đúng. Cần kiểm tra cảm giác vùng huy hiệu quân hàm (vùng cơ delta)." },
      { id: "opt-1-2-03-b", question_id: "q-1-2-03", text: "Dây thần kinh quay", is_correct: false, explanation: "Thần kinh quay đi xa hơn ở phía dưới trong rãnh xoắn." },
      { id: "opt-1-2-03-c", question_id: "q-1-2-03", text: "Dây thần kinh giữa", is_correct: false, explanation: "Thần kinh giữa đi cùng động mạch cánh tay ở mặt trước trong." },
      { id: "opt-1-2-03-d", question_id: "q-1-2-03", text: "Dây thần kinh trụ", is_correct: false, explanation: "Thần kinh trụ chạy xuống khoang sau cẳng tay." },
    ],
  },
  {
    id: "q-1-2-04",
    section_id: "sec-1-2",
    type: "single_choice",
    body: "Cấu trúc sụn nào có vai trò làm tăng độ sâu và diện tích tiếp xúc của ổ chảo xương vai với chỏm xương cánh tay?",
    explanation: "Sụn viền ổ chảo (glenoid labrum) là vành sụn xơ bám quanh chu vi ổ chảo giúp làm sâu diện khớp thêm khoảng 50% để ôm lấy chỏm xương cánh tay.",
    difficulty: "remember",
    source_ref: "sec-1-2-shoulder-joint",
    is_active: true,
    options: [
      { id: "opt-1-2-04-a", question_id: "q-1-2-04", text: "Sụn viền ổ chảo (Glenoid labrum)", is_correct: true, explanation: "Chính xác, tổn thương sụn này được gọi là tổn thương Bankart." },
      { id: "opt-1-2-04-b", question_id: "q-1-2-04", text: "Sụn chêm ngoài", is_correct: false, explanation: "Sụn chêm thuộc khớp gối." },
      { id: "opt-1-2-04-c", question_id: "q-1-2-04", text: "Đĩa khớp ức đòn", is_correct: false, explanation: "Đĩa khớp nằm ở khớp ức đòn." },
      { id: "opt-1-2-04-d", question_id: "q-1-2-04", text: "Sụn trong khớp khuỷu", is_correct: false, explanation: "Khớp khuỷu không có sụn viền." },
    ],
  },
  {
    id: "q-1-2-05",
    section_id: "sec-1-2",
    type: "single_choice",
    body: "Ở khớp khuỷu, dây chằng nào ôm lấy chu vi chỏm xương quay và giữ chỏm khớp với khuyết quay xương trụ?",
    explanation: "Dây chằng vòng quay (annular ligament) bám vào hai bờ trước và sau của khuyết quay xương trụ, tạo thành một vòng đai xơ ôm trọn chu vi chỏm xương quay giúp cẳng tay sấp ngửa.",
    difficulty: "understand",
    source_ref: "sec-1-2-elbow-joint",
    is_active: true,
    options: [
      { id: "opt-1-2-05-a", question_id: "q-1-2-05", text: "Dây chằng vòng quay (Annular ligament)", is_correct: true, explanation: "Đúng. Trật chỏm quay ở trẻ em liên quan trực tiếp đến dây chằng này." },
      { id: "opt-1-2-05-b", question_id: "q-1-2-05", text: "Dây chằng bên trụ", is_correct: false, explanation: "Dây chằng bên trụ bám từ mỏm trên lồi cầu trong đến xương trụ." },
      { id: "opt-1-2-05-c", question_id: "q-1-2-05", text: "Dây chằng chéo trước", is_correct: false, explanation: "Dây chằng chéo trước thuộc khớp gối." },
      { id: "opt-1-2-05-d", question_id: "q-1-2-05", text: "Dây chằng quạ hầu", is_correct: false, explanation: "Không có dây chằng này ở khớp khuỷu." },
    ],
  },
  {
    id: "q-1-2-06",
    section_id: "sec-1-2",
    type: "single_choice",
    body: "Bé gái 3 tuổi được bố nắm cổ tay nhấc bổng lên khi bé suýt ngã. Sau đó bé khóc, không chịu cử động tay phải, cẳng tay ở tư thế gấp nhẹ và sấp. Chẩn đoán lâm sàng phù hợp nhất là gì?",
    explanation: "Đây là bệnh cảnh kinh điển của bán trật chỏm xương quay ở trẻ em (Nursemaid's elbow), do kéo giật đột ngột làm chỏm xương quay trượt một phần ra dưới dây chằng vòng.",
    difficulty: "clinical",
    source_ref: "sec-1-2-elbow-joint",
    is_active: true,
    options: [
      { id: "opt-1-2-06-a", question_id: "q-1-2-06", text: "Bán trật chỏm xương quay (Nursemaid's elbow)", is_correct: true, explanation: "Chính xác. Nắn chỉnh bằng động tác gấp và ngửa cẳng tay sẽ nghe tiếng tách và trẻ hoạt động lại bình thường." },
      { id: "opt-1-2-06-b", question_id: "q-1-2-06", text: "Gãy cành tươi thân xương cánh tay", is_correct: false, explanation: "Gãy xương cánh tay sẽ có điểm đau chói và sưng nề lớn ở cánh tay." },
      { id: "opt-1-2-06-c", question_id: "q-1-2-06", text: "Trật khớp vai ra sau", is_correct: false, explanation: "Rất hiếm gặp ở trẻ nhỏ với cơ chế nắm cổ tay nhấc bổng." },
      { id: "opt-1-2-06-d", question_id: "q-1-2-06", text: "Đứt dây chằng bên trụ khớp khuỷu", is_correct: false, explanation: "Tổn thương này thường gặp ở vận động viên ném bóng chày, không do cơ chế này." },
    ],
  },
  {
    id: "q-1-2-07",
    section_id: "sec-1-2",
    type: "true_false",
    body: "Khi khớp khuỷu gấp 90 độ, mỏm trên lồi cầu trong, mỏm trên lồi cầu ngoài và đỉnh mỏm khuỷu tạo thành một đường thẳng. Đúng hay Sai?",
    explanation: "Khi gấp 90°, ba mốc xương này tạo thành một tam giác cân (Tam giác Hueter). Chúng chỉ tạo thành một đường thẳng (Đường Hueter) khi khuỷu duỗi thẳng hoàn toàn.",
    difficulty: "remember",
    source_ref: "sec-1-2-elbow-joint",
    is_active: true,
    options: [
      { id: "opt-1-2-07-t", question_id: "q-1-2-07", text: "Đúng", is_correct: false, explanation: "Sai, khi gấp 90° tạo thành tam giác cân, không phải đường thẳng." },
      { id: "opt-1-2-07-f", question_id: "q-1-2-07", text: "Sai", is_correct: true, explanation: "Chính xác. Khi duỗi mới là đường thẳng, khi gấp là tam giác cân." },
    ],
  },
  {
    id: "q-1-2-08",
    section_id: "sec-1-2",
    type: "single_choice",
    body: "Khớp cánh tay - trụ thuộc loại khớp nào và cho phép những cử động nào?",
    explanation: "Khớp cánh tay - trụ là khớp bản lề ròng rọc (hinge joint), chỉ cho phép cử động gấp và duỗi cẳng tay theo 1 trục ngang.",
    difficulty: "understand",
    source_ref: "sec-1-2-elbow-joint",
    is_active: true,
    options: [
      { id: "opt-1-2-08-a", question_id: "q-1-2-08", text: "Khớp bản lề, chỉ cho phép gấp và duỗi", is_correct: true, explanation: "Đúng, ròng rọc khớp với khuyết ròng rọc như một bản lề cửa." },
      { id: "opt-1-2-08-b", question_id: "q-1-2-08", text: "Khớp xoay tròn, cho phép sấp và ngửa", is_correct: false, explanation: "Sấp ngửa là do khớp quay trụ gần và xa." },
      { id: "opt-1-2-08-c", question_id: "q-1-2-08", text: "Khớp chỏm cầu, vận động đa trục", is_correct: false, explanation: "Khớp chỏm cầu là khớp vai." },
      { id: "opt-1-2-08-d", question_id: "q-1-2-08", text: "Khớp yên ngựa, cho phép đối chiếu", is_correct: false, explanation: "Khớp yên ngựa điển hình là khớp bàn ngón cái." },
    ],
  },
  {
    id: "q-1-2-09",
    section_id: "sec-1-2",
    type: "multiple_choice",
    body: "Những cơ nào sau đây thuộc nhóm chóp xoay (Rotator cuff) của khớp vai? (Chọn 2 đáp án)",
    explanation: "Nhóm chóp xoay gồm 4 cơ: Cơ trên gai (Supraspinatus), Cơ dưới gai (Infraspinatus), Cơ tròn bé (Teres minor) và Cơ dưới vai (Subscapularis). Cơ delta và cơ tròn lớn không thuộc chóp xoay.",
    difficulty: "remember",
    source_ref: "sec-1-2-shoulder-joint",
    is_active: true,
    options: [
      { id: "opt-1-2-09-a", question_id: "q-1-2-09", text: "Cơ dưới gai (Infraspinatus)", is_correct: true, explanation: "Đúng. Thuộc nhóm chóp xoay." },
      { id: "opt-1-2-09-b", question_id: "q-1-2-09", text: "Cơ dưới vai (Subscapularis)", is_correct: true, explanation: "Đúng. Thuộc nhóm chóp xoay." },
      { id: "opt-1-2-09-c", question_id: "q-1-2-09", text: "Cơ tròn lớn (Teres major)", is_correct: false, explanation: "Cơ tròn lớn không thuộc chóp xoay." },
      { id: "opt-1-2-09-d", question_id: "q-1-2-09", text: "Cơ delta (Deltoid)", is_correct: false, explanation: "Cơ delta là cơ bao phủ bên ngoài, không thuộc chóp xoay." },
    ],
  },
  {
    id: "q-1-2-10",
    section_id: "sec-1-2",
    type: "single_choice",
    body: "Dấu hiệu 'nhát rìu' và dấu hiệu 'vai vuông' (gù vai) là biểu hiện lâm sàng đặc trưng của tổn thương nào?",
    explanation: "Khi chỏm xương cánh tay trật ra khỏi ổ chảo, góc ngoài của vai mất đi độ cong lồi đều đặn do cơ delta bị lõm xuống, làm mỏm cùng vai nhô ra sắc nhọn như nhát rìu chém.",
    difficulty: "clinical",
    source_ref: "sec-1-2-shoulder-joint",
    is_active: true,
    options: [
      { id: "opt-1-2-010-a", question_id: "q-1-2-10", text: "Trật khớp vai ra trước", is_correct: true, explanation: "Chính xác, đây là triệu chứng kinh điển của trật khớp vai." },
      { id: "opt-1-2-010-b", question_id: "q-1-2-10", text: "Gãy thân xương cánh tay", is_correct: false, explanation: "Gãy thân xương cánh tay không làm biến dạng khớp vai." },
      { id: "opt-1-2-010-c", question_id: "q-1-2-10", text: "Trật khớp khuỷu ra sau", is_correct: false, explanation: "Trật khớp khuỷu làm biến dạng vùng khuỷu tay." },
      { id: "opt-1-2-010-d", question_id: "q-1-2-10", text: "Rách gân cơ nhị đầu", is_correct: false, explanation: "Rách gân nhị đầu tạo dấu hiệu cơ Popeye ở giữa cánh tay." },
    ],
  },
  {
    id: "q-1-2-11",
    section_id: "sec-1-2",
    type: "single_choice",
    body: "Vòm quạ - cùng vai (coraco-acromial arch) có vai trò bảo vệ phía trên khớp vai được tạo thành bởi các thành phần nào?",
    explanation: "Vòm này gồm mỏm quạ ở trước, mỏm cùng vai ở sau và dây chằng quạ - cùng vai căng giữa chúng.",
    difficulty: "understand",
    source_ref: "sec-1-2-shoulder-joint",
    is_active: true,
    options: [
      { id: "opt-1-2-011-a", question_id: "q-1-2-11", text: "Mỏm quạ, mỏm cùng vai và dây chằng quạ - cùng vai", is_correct: true, explanation: "Đúng. Vòm này ngăn chỏm xương cánh tay trật lên trên." },
      { id: "opt-1-2-011-b", question_id: "q-1-2-11", text: "Đầu ngoài xương đòn và củ lớn xương cánh tay", is_correct: false, explanation: "Sai thành phần giải phẫu." },
      { id: "opt-1-2-011-c", question_id: "q-1-2-11", text: "Gai vai và củ trên ổ chảo", is_correct: false, explanation: "Gai vai ở mặt sau, củ trên ổ chảo ở trong bao khớp." },
      { id: "opt-1-2-011-d", question_id: "q-1-2-11", text: "Mỏm quạ và xương đòn", is_correct: false, explanation: "Dây chằng quạ đòn giữ treo xương vai chứ không tạo vòm khớp vai." },
    ],
  },
  {
    id: "q-1-2-12",
    section_id: "sec-1-2",
    type: "single_choice",
    body: "Khớp quay - trụ gần có chức năng chủ yếu phối hợp với khớp quay - trụ xa để thực hiện động tác nào?",
    explanation: "Hai khớp quay trụ (gần và xa) hoạt động đồng thì như một khớp trục dọc duy nhất, cho phép xương quay lăn quanh xương trụ tạo động tác sấp và ngửa cẳng tay.",
    difficulty: "understand",
    source_ref: "sec-1-2-elbow-joint",
    is_active: true,
    options: [
      { id: "opt-1-2-012-a", question_id: "q-1-2-12", text: "Sấp và ngửa cẳng tay", is_correct: true, explanation: "Chính xác, cử động quay quanh trục dọc cẳng tay." },
      { id: "opt-1-2-012-b", question_id: "q-1-2-12", text: "Gấp và duỗi cẳng tay", is_correct: false, explanation: "Gấp duỗi là chức năng của khớp cánh tay - trụ." },
      { id: "opt-1-2-012-c", question_id: "q-1-2-12", text: "Dạng và khép bàn tay", is_correct: false, explanation: "Dạng khép bàn tay xảy ra ở khớp cổ tay." },
      { id: "opt-1-2-012-d", question_id: "q-1-2-12", text: "Đối chiếu ngón cái", is_correct: false, explanation: "Đối chiếu ngón cái xảy ra ở khớp bàn ngón tay." },
    ],
  },
  {
    id: "q-1-2-13",
    section_id: "sec-1-2",
    type: "single_choice",
    body: "Phân biệt trật khớp khuỷu và gãy trên lồi cầu xương cánh tay trên lâm sàng dựa vào mốc giải phẫu nào?",
    explanation: "Trong trật khớp khuỷu, mỏm khuỷu bị di lệch làm tam giác Hueter bị đảo lộn. Còn trong gãy trên lồi cầu (gãy ngoài khớp), tương quan giữa 3 mốc mỏm trên lồi cầu trong, ngoài và mỏm khuỷu không đổi nên tam giác Hueter vẫn bình thường.",
    difficulty: "clinical",
    source_ref: "sec-1-2-elbow-joint",
    is_active: true,
    options: [
      { id: "opt-1-2-013-a", question_id: "q-1-2-13", text: "Tương quan của tam giác Hueter và đường Hueter", is_correct: true, explanation: "Chính xác. Tam giác Hueter đảo lộn trong trật khớp, còn nguyên trong gãy trên lồi cầu." },
      { id: "opt-1-2-013-b", question_id: "q-1-2-13", text: "Vị trí bắt mạch quay", is_correct: false, explanation: "Mạch quay có thể bị ảnh hưởng ở cả 2 trường hợp nếu có chèn ép mạch." },
      { id: "opt-1-2-013-c", question_id: "q-1-2-13", text: "Biên độ vận động khớp vai", is_correct: false, explanation: "Khớp vai không liên quan trực tiếp đến phân biệt này." },
      { id: "opt-1-2-013-d", question_id: "q-1-2-13", text: "Dấu hiệu bàn tay rủ", is_correct: false, explanation: "Bàn tay rủ là dấu hiệu liệt thần kinh quay." },
    ],
  },
  {
    id: "q-1-2-14",
    section_id: "sec-1-2",
    type: "single_choice",
    body: "Dây chằng bên trụ của khớp khuỷu đóng vai trò chủ yếu chống lại lực nào tác động lên cẳng tay?",
    explanation: "Dây chằng bên trụ (Ulnar collateral ligament) nằm ở bờ trong khớp khuỷu, chống lại lực bẻ góc ra ngoài của cẳng tay (valgus stress).",
    difficulty: "apply",
    source_ref: "sec-1-2-elbow-joint",
    is_active: true,
    options: [
      { id: "opt-1-2-014-a", question_id: "q-1-2-14", text: "Lực vẹo ngoài (Valgus stress)", is_correct: true, explanation: "Đúng. Đây là dây chằng hay bị đứt ở cầu thủ bóng chày (phải phẫu thuật Tommy John)." },
      { id: "opt-1-2-014-b", question_id: "q-1-2-14", text: "Lực vẹo trong (Varus stress)", is_correct: false, explanation: "Lực vẹo trong được chống đỡ bởi dây chằng bên quay." },
      { id: "opt-1-2-014-c", question_id: "q-1-2-14", text: "Lực kéo dài dọc trục", is_correct: false, explanation: "Lực kéo dọc trục chủ yếu do dây chằng vòng và màng gian cốt chịu." },
      { id: "opt-1-2-014-d", question_id: "q-1-2-14", text: "Lực ép dồn nén sụn khớp", is_correct: false, explanation: "Lực nén do bề mặt sụn khớp chịu tải." },
    ],
  },
  {
    id: "q-1-2-15",
    section_id: "sec-1-2",
    type: "true_false",
    body: "Khớp vai có biên độ vận động lớn nhất trong các khớp cơ thể người vì diện tích tiếp xúc của chỏm xương cánh tay lớn gấp 3-4 lần diện tích ổ chảo xương vai. Đúng hay Sai?",
    explanation: "Chính vì sự chênh lệch diện tích rất lớn này (chỏm cầu to trên một ổ chảo nông hẹp), khớp vai cực kỳ linh hoạt nhưng đổi lại độ vững chắc nội tại thấp và dễ trật nhất.",
    difficulty: "understand",
    source_ref: "sec-1-2-shoulder-joint",
    is_active: true,
    options: [
      { id: "opt-1-2-015-t", question_id: "q-1-2-15", text: "Đúng", is_correct: true, explanation: "Chính xác, đây là quy luật đánh đổi giữa tính linh hoạt và độ vững chắc của khớp." },
      { id: "opt-1-2-015-f", question_id: "q-1-2-15", text: "Sai", is_correct: false, explanation: "Mệnh đề giải phẫu này hoàn toàn đúng." },
    ],
  },

  // ==========================================
  // SECTION 2.1: Cơ vùng nách, cánh tay & cẳng tay (15 câu)
  // ==========================================
  {
    id: "q-2-1-01",
    section_id: "sec-2-1",
    type: "single_choice",
    body: "Lỗ tứ giác (Quadrangular space) ở thành sau hố nách chứa các thành phần nào đi qua?",
    explanation: "Lỗ tứ giác được tạo bởi cơ tròn bé, cơ tròn lớn, đầu dài cơ tam đầu và thân xương cánh tay; cho dây thần kinh nách và động mạch mũ cánh tay sau đi qua.",
    difficulty: "remember",
    source_ref: "sec-2-1-axilla",
    is_active: true,
    options: [
      { id: "opt-2-1-01-a", question_id: "q-2-1-01", text: "Dây thần kinh nách và động mạch mũ cánh tay sau", is_correct: true, explanation: "Chính xác." },
      { id: "opt-2-1-01-b", question_id: "q-2-1-01", text: "Dây thần kinh quay và động mạch cánh tay sâu", is_correct: false, explanation: "Đi qua tam giác cánh tay tam đầu." },
      { id: "opt-2-1-01-c", question_id: "q-2-1-01", text: "Động mạch mũ vai", is_correct: false, explanation: "Động mạch mũ vai đi qua tam giác bả vai tam đầu." },
      { id: "opt-2-1-01-d", question_id: "q-2-1-01", text: "Dây thần kinh ngực dài và động mạch ngực ngoài", is_correct: false, explanation: "Đi ở thành trong hố nách." },
    ],
  },
  {
    id: "q-2-1-02",
    section_id: "sec-2-1",
    type: "single_choice",
    body: "Dây thần kinh nào xuyên qua cơ quạ cánh tay để vận động các cơ ở khoang cánh tay trước?",
    explanation: "Dây thần kinh cơ bì (Musculocutaneous nerve) xuất phát từ bó ngoài, xuyên qua bụng cơ quạ cánh tay và đi giữa cơ nhị đầu và cơ cánh tay để chi phối cả 3 cơ này.",
    difficulty: "understand",
    source_ref: "sec-2-1-arm-muscles",
    is_active: true,
    options: [
      { id: "opt-2-1-02-a", question_id: "q-2-1-02", text: "Dây thần kinh cơ bì", is_correct: true, explanation: "Đúng, đây là mốc giải phẫu quan trọng để xác định thần kinh cơ bì trong phẫu tích." },
      { id: "opt-2-1-02-b", question_id: "q-2-1-02", text: "Dây thần kinh giữa", is_correct: false, explanation: "Thần kinh giữa không xuyên qua cơ quạ cánh tay." },
      { id: "opt-2-1-02-c", question_id: "q-2-1-02", text: "Dây thần kinh nách", is_correct: false, explanation: "Thần kinh nách đi ra sau qua lỗ tứ giác." },
      { id: "opt-2-1-02-d", question_id: "q-2-1-02", text: "Dây thần kinh quay", is_correct: false, explanation: "Thần kinh quay đi ra khoang sau." },
    ],
  },
  {
    id: "q-2-1-03",
    section_id: "sec-2-1",
    type: "single_choice",
    body: "Cơ nhị đầu cánh tay có tác dụng gấp cẳng tay mạnh nhất ở tư thế nào của cẳng tay?",
    explanation: "Cơ nhị đầu bám vào lồi củ xương quay. Khi cẳng tay ở tư thế NGỬA, gân cơ nhị đầu có góc kéo cơ học tối ưu nhất để thực hiện động tác gấp cẳng tay mạnh mẽ.",
    difficulty: "apply",
    source_ref: "sec-2-1-arm-muscles",
    is_active: true,
    options: [
      { id: "opt-2-1-03-a", question_id: "q-2-1-03", text: "Cẳng tay ở tư thế ngửa hoàn toàn", is_correct: true, explanation: "Chính xác. Khi cẳng tay sấp, gân nhị đầu bị xoắn quanh xương quay làm giảm lực gấp." },
      { id: "opt-2-1-03-b", question_id: "q-2-1-03", text: "Cẳng tay ở tư thế sấp hoàn toàn", is_correct: false, explanation: "Khi sấp hoàn toàn, cơ gấp chính hoạt động là cơ cánh tay." },
      { id: "opt-2-1-03-c", question_id: "q-2-1-03", text: "Cẳng tay ở tư thế nửa sấp nửa ngửa", is_correct: false, explanation: "Tư thế này ưu tiên cho cơ cánh tay quay." },
      { id: "opt-2-1-03-d", question_id: "q-2-1-03", text: "Không phụ thuộc vào tư thế sấp ngửa", is_correct: false, explanation: "Lực của cơ nhị đầu phụ thuộc rất lớn vào độ xoay của xương quay." },
    ],
  },
  {
    id: "q-2-1-04",
    section_id: "sec-2-1",
    type: "single_choice",
    body: "Cơ nào ở vùng cánh tay bám tận vào mỏm khuỷu xương trụ và là cơ duỗi cẳng tay chính?",
    explanation: "Cơ tam đầu cánh tay (Triceps brachii) có 3 đầu hợp lại thành một gân chung rất khỏe bám vào mặt trên và sau mỏm khuỷu xương trụ, có chức năng duỗi cẳng tay.",
    difficulty: "remember",
    source_ref: "sec-2-1-arm-muscles",
    is_active: true,
    options: [
      { id: "opt-2-1-04-a", question_id: "q-2-1-04", text: "Cơ tam đầu cánh tay", is_correct: true, explanation: "Chính xác, do thần kinh quay chi phối." },
      { id: "opt-2-1-04-b", question_id: "q-2-1-04", text: "Cơ cánh tay", is_correct: false, explanation: "Cơ cánh tay là cơ gấp cẳng tay, bám mỏm vẹt." },
      { id: "opt-2-1-04-c", question_id: "q-2-1-04", text: "Cơ nhị đầu cánh tay", is_correct: false, explanation: "Cơ nhị đầu bám lồi củ xương quay." },
      { id: "opt-2-1-04-d", question_id: "q-2-1-04", text: "Cơ quạ cánh tay", is_correct: false, explanation: "Cơ quạ cánh tay bám vào 1/3 giữa thân xương cánh tay." },
    ],
  },
  {
    id: "q-2-1-05",
    section_id: "sec-2-1",
    type: "single_choice",
    body: "Trong số các cơ ở khoang cẳng tay trước, cơ nào sau đây KHÔNG do dây thần kinh giữa chi phối mà do dây thần kinh trụ chi phối?",
    explanation: "Khoang cẳng tay trước hầu hết do thần kinh giữa chi phối, ngoại trừ cơ gấp cổ tay trụ (Flexor carpi ulnaris) và nửa trong (ngón IV, V) của cơ gấp sâu các ngón tay do thần kinh trụ chi phối.",
    difficulty: "understand",
    source_ref: "sec-2-1-forearm-muscles",
    is_active: true,
    options: [
      { id: "opt-2-1-05-a", question_id: "q-2-1-05", text: "Cơ gấp cổ tay trụ", is_correct: true, explanation: "Đúng. Thần kinh trụ chạy dọc ngay dưới cơ này." },
      { id: "opt-2-1-05-b", question_id: "q-2-1-05", text: "Cơ sấp tròn", is_correct: false, explanation: "Cơ sấp tròn do thần kinh giữa chi phối." },
      { id: "opt-2-1-05-c", question_id: "q-2-1-05", text: "Cơ gấp cổ tay quay", is_correct: false, explanation: "Cơ gấp cổ tay quay do thần kinh giữa chi phối." },
      { id: "opt-2-1-05-d", question_id: "q-2-1-05", text: "Cơ gan tay dài", is_correct: false, explanation: "Cơ gan tay dài do thần kinh giữa chi phối." },
    ],
  },
  {
    id: "q-2-1-06",
    section_id: "sec-2-1",
    type: "single_choice",
    body: "Ống cổ tay (Carpal tunnel) chứa tổng cộng bao nhiêu gân gấp và dây thần kinh nào?",
    explanation: "Ống cổ tay chứa 9 gân gấp (4 gân cơ gấp các ngón nông, 4 gân cơ gấp các ngón sâu, 1 gân cơ gấp ngón cái dài) cùng với 1 dây thần kinh DUY NHẤT là dây thần kinh giữa.",
    difficulty: "remember",
    source_ref: "sec-2-1-forearm-muscles",
    is_active: true,
    options: [
      { id: "opt-2-1-06-a", question_id: "q-2-1-06", text: "9 gân gấp và dây thần kinh giữa", is_correct: true, explanation: "Chính xác. Gân cơ gan tay dài đi nông phía trên mạc hãm, không chui vào ống cổ tay." },
      { id: "opt-2-1-06-b", question_id: "q-2-1-06", text: "8 gân gấp và dây thần kinh trụ", is_correct: false, explanation: "Thần kinh trụ đi qua kênh Guyon ngoài ống cổ tay." },
      { id: "opt-2-1-06-c", question_id: "q-2-1-06", text: "10 gân gấp và dây thần kinh quay", is_correct: false, explanation: "Thần kinh quay không đi qua ống cổ tay." },
      { id: "opt-2-1-06-d", question_id: "q-2-1-06", text: "6 gân gấp và động mạch quay", is_correct: false, explanation: "Động mạch quay đi qua hõm lào giải phẫu." },
    ],
  },
  {
    id: "q-2-1-07",
    section_id: "sec-2-1",
    type: "single_choice",
    body: "Bệnh nhân nữ 48 tuổi, nhân viên văn phòng, than phiền tê bì và châm chích ở mặt lòng ngón cái, ngón trỏ, ngón giữa và nửa ngoài ngón nhẫn, hay thức giấc vì tê tay về đêm. Gõ vào mặt trước cổ tay thấy có cảm giác giật điện (Tinel sign dương tính). Bệnh nhân bị chèn ép cấu trúc nào?",
    explanation: "Đây là biểu hiện kinh điển của Hội chứng ống cổ tay (Carpal Tunnel Syndrome) do chèn ép dây thần kinh giữa trong ống cổ tay, gây rối loạn cảm giác theo vùng chi phối cảm giác gan tay của thần kinh giữa.",
    difficulty: "clinical",
    source_ref: "sec-2-1-forearm-muscles",
    is_active: true,
    options: [
      { id: "opt-2-1-07-a", question_id: "q-2-1-07", text: "Dây thần kinh giữa trong ống cổ tay", is_correct: true, explanation: "Chính xác. Test Tinel và Phalen dương tính đặc trưng cho hội chứng ống cổ tay." },
      { id: "opt-2-1-07-b", question_id: "q-2-1-07", text: "Dây thần kinh trụ tại kênh Guyon", is_correct: false, explanation: "Thần kinh trụ gây tê ngón út và nửa trong ngón nhẫn." },
      { id: "opt-2-1-07-c", question_id: "q-2-1-07", text: "Dây thần kinh quay tại hõm lào", is_correct: false, explanation: "Thần kinh quay chi phối cảm giác mu bàn tay." },
      { id: "opt-2-1-07-d", question_id: "q-2-1-07", text: "Động mạch trụ ở cổ tay", is_correct: false, explanation: "Chèn ép động mạch gây tím tái, lạnh đầu ngón chứ không gây dấu Tinel." },
    ],
  },
  {
    id: "q-2-1-08",
    section_id: "sec-2-1",
    type: "single_choice",
    body: "Thành ngoài của hố nách được tạo nên bởi các cấu trúc nào sau đây?",
    explanation: "Thành ngoài của hố nách rất hẹp, tương ứng với rãnh gian củ xương cánh tay, được bao phủ bởi cơ quạ cánh tay và đầu ngắn cơ nhị đầu cánh tay.",
    difficulty: "remember",
    source_ref: "sec-2-1-axilla",
    is_active: true,
    options: [
      { id: "opt-2-1-08-a", question_id: "q-2-1-08", text: "Rãnh gian củ xương cánh tay, cơ quạ cánh tay và cơ nhị đầu", is_correct: true, explanation: "Đúng." },
      { id: "opt-2-1-08-b", question_id: "q-2-1-08", text: "Cơ ngực lớn và cơ ngực bé", is_correct: false, explanation: "Tạo nên thành trước hố nách." },
      { id: "opt-2-1-08-c", question_id: "q-2-1-08", text: "Cơ lưng rộng và cơ dưới vai", is_correct: false, explanation: "Tạo nên thành sau hố nách." },
      { id: "opt-2-1-08-d", question_id: "q-2-1-08", text: "Cơ răng trước và 4 xương sườn trên", is_correct: false, explanation: "Tạo nên thành trong hố nách." },
    ],
  },
  {
    id: "q-2-1-09",
    section_id: "sec-2-1",
    type: "true_false",
    body: "Cơ cánh tay (Brachialis) là cơ gấp cẳng tay thuần túy ở khớp khuỷu và hoạt động độc lập không bị ảnh hưởng bởi tư thế cẳng tay sấp hay ngửa. Đúng hay Sai?",
    explanation: "Vì cơ cánh tay bám tận vào mỏm vẹt xương trụ (xương trụ không xoay trong động tác sấp ngửa), nên cơ cánh tay luôn tạo lực gấp cẳng tay như nhau dù cẳng tay đang sấp hay ngửa.",
    difficulty: "understand",
    source_ref: "sec-2-1-arm-muscles",
    is_active: true,
    options: [
      { id: "opt-2-1-09-t", question_id: "q-2-1-09", text: "Đúng", is_correct: true, explanation: "Chính xác, cơ cánh tay được gọi là 'con ngựa thồ' của động tác gấp khuỷu." },
      { id: "opt-2-1-09-f", question_id: "q-2-1-09", text: "Sai", is_correct: false, explanation: "Mệnh đề này hoàn toàn đúng về mặt giải phẫu học chức năng." },
    ],
  },
  {
    id: "q-2-1-10",
    section_id: "sec-2-1",
    type: "single_choice",
    body: "Tổn thương thần kinh ngực dài (Long thoracic nerve) trong phẫu thuật vét hạch nách sẽ dẫn đến tình trạng liệt cơ răng trước và gây ra dấu hiệu gì?",
    explanation: "Thần kinh ngực dài chi phối cơ răng trước. Cơ răng trước giữ bờ trong xương bả vai áp sát vào thành ngực. Khi bị liệt, bờ trong xương vai bật ra sau tạo dấu hiệu 'xương bả vai hình cánh chim' (winged scapula).",
    difficulty: "clinical",
    source_ref: "sec-2-1-axilla",
    is_active: true,
    options: [
      { id: "opt-2-1-010-a", question_id: "q-2-1-10", text: "Xương bả vai hình cánh chim (Winged scapula)", is_correct: true, explanation: "Chính xác. Rất rõ khi bệnh nhân chống tay đẩy vào tường." },
      { id: "opt-2-1-010-b", question_id: "q-2-1-10", text: "Dấu hiệu bàn tay rủ cổ cò", is_correct: false, explanation: "Do liệt thần kinh quay." },
      { id: "opt-2-1-010-c", question_id: "q-2-1-10", text: "Dấu hiệu bàn tay vuốt trụ", is_correct: false, explanation: "Do liệt thần kinh trụ." },
      { id: "opt-2-1-010-d", question_id: "q-2-1-10", text: "Mất hoàn toàn phản xạ gân xương bánh chè", is_correct: false, explanation: "Thuộc dây thần kinh đùi ở chi dưới." },
    ],
  },
  {
    id: "q-2-1-11",
    section_id: "sec-2-1",
    type: "single_choice",
    body: "Cơ nào sau đây là mốc giải phẫu chia thành các thành phần giải phẫu của hố nách và chia động mạch nách làm 3 đoạn liên quan?",
    explanation: "Cơ ngực bé (Pectoralis minor) bắc chéo phía trước động mạch nách, chia động mạch nách thành 3 đoạn: đoạn trên cơ ngực bé, đoạn sau cơ ngực bé và đoạn dưới cơ ngực bé.",
    difficulty: "remember",
    source_ref: "sec-2-1-axilla",
    is_active: true,
    options: [
      { id: "opt-2-1-011-a", question_id: "q-2-1-11", text: "Cơ ngực bé", is_correct: true, explanation: "Đúng. Đây là cơ chuẩn mốc của vùng nách." },
      { id: "opt-2-1-011-b", question_id: "q-2-1-11", text: "Cơ ngực lớn", is_correct: false, explanation: "Cơ ngực lớn phủ nông toàn bộ thành trước." },
      { id: "opt-2-1-011-c", question_id: "q-2-1-11", text: "Cơ dưới đòn", is_correct: false, explanation: "Cơ dưới đòn nằm ở đỉnh nách." },
      { id: "opt-2-1-011-d", question_id: "q-2-1-11", text: "Cơ quạ cánh tay", is_correct: false, explanation: "Cơ quạ cánh tay ở thành ngoài." },
    ],
  },
  {
    id: "q-2-1-12",
    section_id: "sec-2-1",
    type: "multiple_choice",
    body: "Những cơ nào sau đây bám tận vào xương quay và có tác dụng làm sấp cẳng tay? (Chọn 2 đáp án)",
    explanation: "Cơ sấp tròn (Pronator teres) bám vào mặt ngoài giữa thân xương quay, cơ sấp vuông (Pronator quadratus) bám vào mặt trước 1/4 dưới xương quay. Cả 2 đều làm sấp cẳng tay.",
    difficulty: "understand",
    source_ref: "sec-2-1-forearm-muscles",
    is_active: true,
    options: [
      { id: "opt-2-1-012-a", question_id: "q-2-1-12", text: "Cơ sấp tròn", is_correct: true, explanation: "Đúng." },
      { id: "opt-2-1-012-b", question_id: "q-2-1-12", text: "Cơ sấp vuông", is_correct: true, explanation: "Đúng." },
      { id: "opt-2-1-012-c", question_id: "q-2-1-12", text: "Cơ ngửa", is_correct: false, explanation: "Cơ ngửa làm ngửa cẳng tay." },
      { id: "opt-2-1-012-d", question_id: "q-2-1-12", text: "Cơ gấp cổ tay trụ", is_correct: false, explanation: "Bám vào xương đậu, móc và xương bàn V thuộc phía trong." },
    ],
  },
  {
    id: "q-2-1-13",
    section_id: "sec-2-1",
    type: "single_choice",
    body: "Gân cơ nào đi qua rãnh gian củ xương cánh tay và được giữ lại bởi dây chằng ngang xương cánh tay?",
    explanation: "Gân đầu dài cơ nhị đầu cánh tay đi từ củ trên ổ chảo chui qua rãnh gian củ và được dây chằng ngang xương cánh tay giữ vững trong rãnh.",
    difficulty: "remember",
    source_ref: "sec-2-1-arm-muscles",
    is_active: true,
    options: [
      { id: "opt-2-1-013-a", question_id: "q-2-1-13", text: "Gân đầu dài cơ nhị đầu cánh tay", is_correct: true, explanation: "Chính xác." },
      { id: "opt-2-1-013-b", question_id: "q-2-1-13", text: "Gân đầu ngắn cơ nhị đầu cánh tay", is_correct: false, explanation: "Đầu ngắn bám vào mỏm quạ." },
      { id: "opt-2-1-013-c", question_id: "q-2-1-13", text: "Gân đầu dài cơ tam đầu cánh tay", is_correct: false, explanation: "Đầu dài tam đầu bám củ dưới ổ chảo đi ở khoang sau." },
      { id: "opt-2-1-013-d", question_id: "q-2-1-13", text: "Gân cơ quạ cánh tay", is_correct: false, explanation: "Cơ quạ cánh tay không đi trong rãnh gian củ." },
    ],
  },
  {
    id: "q-2-1-14",
    section_id: "sec-2-1",
    type: "single_choice",
    body: "Tất cả các cơ ở khoang cẳng tay sau (duỗi và ngửa) đều được vận động bởi các nhánh của dây thần kinh nào?",
    explanation: "Dây thần kinh quay (đặc biệt là nhánh sâu/thần kinh gian cốt sau) chi phối vận động cho toàn bộ các cơ ở vùng cẳng tay sau và ngoài.",
    difficulty: "remember",
    source_ref: "sec-2-1-arm-muscles",
    is_active: true,
    options: [
      { id: "opt-2-1-014-a", question_id: "q-2-1-14", text: "Dây thần kinh quay", is_correct: true, explanation: "Chính xác. Thần kinh quay là thần kinh của nhóm cơ duỗi." },
      { id: "opt-2-1-014-b", question_id: "q-2-1-14", text: "Dây thần kinh giữa", is_correct: false, explanation: "Thần kinh giữa là thần kinh của nhóm cơ gấp." },
      { id: "opt-2-1-014-c", question_id: "q-2-1-14", text: "Dây thần kinh trụ", is_correct: false, explanation: "Thần kinh trụ chi phối cơ gấp cổ tay trụ và cơ bàn tay." },
      { id: "opt-2-1-014-d", question_id: "q-2-1-14", text: "Dây thần kinh nách", is_correct: false, explanation: "Thần kinh nách chi phối cơ delta và cơ tròn bé." },
    ],
  },
  {
    id: "q-2-1-15",
    section_id: "sec-2-1",
    type: "true_false",
    body: "Mạc hãm gân gấp (dây chằng vòng cổ tay) tạo thành trần của ống cổ tay. Đúng hay Sai?",
    explanation: "Đúng. Các xương cổ tay tạo thành nền và thành bên hình máng lõm, mạc hãm gân gấp bắc ngang qua biến máng này thành một ống kín gọi là ống cổ tay.",
    difficulty: "understand",
    source_ref: "sec-2-1-forearm-muscles",
    is_active: true,
    options: [
      { id: "opt-2-1-015-t", question_id: "q-2-1-15", text: "Đúng", is_correct: true, explanation: "Chính xác. Cắt mạc hãm gân gấp là phẫu thuật giải phóng chèn ép trong hội chứng ống cổ tay." },
      { id: "opt-2-1-015-f", question_id: "q-2-1-15", text: "Sai", is_correct: false, explanation: "Đây là cấu trúc hoàn toàn chính xác của ống cổ tay." },
    ],
  },

  // ==========================================
  // SECTION 2.2: Đám rối TK cánh tay & Mạch máu (15 câu)
  // ==========================================
  {
    id: "q-2-2-01",
    section_id: "sec-2-2",
    type: "single_choice",
    body: "Đám rối thần kinh cánh tay được hình thành từ nhánh trước của các dây thần kinh gai sống nào?",
    explanation: "Đám rối thần kinh cánh tay được tạo bởi các nhánh trước của rễ C5, C6, C7, C8 và T1.",
    difficulty: "remember",
    source_ref: "sec-2-2-brachial-plexus",
    is_active: true,
    options: [
      { id: "opt-2-2-01-a", question_id: "q-2-2-01", text: "C5 đến T1", is_correct: true, explanation: "Chính xác: C5, C6, C7, C8, T1." },
      { id: "opt-2-2-01-b", question_id: "q-2-2-01", text: "C1 đến C5", is_correct: false, explanation: "C1 đến C4 tạo nên đám rối thần kinh cổ." },
      { id: "opt-2-2-01-c", question_id: "q-2-2-01", text: "C6 đến T4", is_correct: false, explanation: "T2-T4 là các dây thần kinh gian sườn." },
      { id: "opt-2-2-01-d", question_id: "q-2-2-01", text: "C3 đến C7", is_correct: false, explanation: "Thiếu C8, T1 và C3 không thuộc đám rối cánh tay." },
    ],
  },
  {
    id: "q-2-2-02",
    section_id: "sec-2-2",
    type: "single_choice",
    body: "Bó sau (Posterior cord) của đám rối thần kinh cánh tay tách ra hai nhánh tận lớn nào sau đây?",
    explanation: "Bó sau do ngành sau của cả 3 thân hợp thành, tận cùng bằng 2 nhánh lớn: Dây thần kinh Nách và Dây thần kinh Quay.",
    difficulty: "understand",
    source_ref: "sec-2-2-brachial-plexus",
    is_active: true,
    options: [
      { id: "opt-2-2-02-a", question_id: "q-2-2-02", text: "Dây thần kinh Nách và Dây thần kinh Quay", is_correct: true, explanation: "Đúng. Cả 2 đều chi phối cho các cơ ở mặt sau." },
      { id: "opt-2-2-02-b", question_id: "q-2-2-02", text: "Dây thần kinh Giữa và Dây thần kinh Trụ", is_correct: false, explanation: "Thần kinh trụ xuất phát từ bó trong; thần kinh giữa từ rễ ngoài và rễ trong." },
      { id: "opt-2-2-02-c", question_id: "q-2-2-02", text: "Dây thần kinh Cơ bì và Dây thần kinh Nách", is_correct: false, explanation: "Thần kinh cơ bì xuất phát từ bó ngoài." },
      { id: "opt-2-2-02-d", question_id: "q-2-2-02", text: "Dây thần kinh Trụ và Dây thần kinh Cơ bì", is_correct: false, explanation: "Bó sau không cho ra thần kinh cơ bì và thần kinh trụ." },
    ],
  },
  {
    id: "q-2-2-03",
    section_id: "sec-2-2",
    type: "single_choice",
    body: "Tư thế 'bàn tay vuốt trụ' (Claw hand) đặc trưng cho tổn thương mạn tính của dây thần kinh nào?",
    explanation: "Tổn thương thần kinh trụ làm liệt các cơ gian cốt và cơ giun III, IV; dẫn đến mất cân bằng lực kéo: đốt 1 bị kéo duỗi quá mức trong khi đốt 2 và 3 bị kéo gấp, đặc biệt rõ ở ngón IV và V tạo hình dạng vuốt trụ.",
    difficulty: "clinical",
    source_ref: "sec-2-2-peripheral-nerves",
    is_active: true,
    options: [
      { id: "opt-2-2-03-a", question_id: "q-2-2-03", text: "Dây thần kinh Trụ", is_correct: true, explanation: "Chính xác, điển hình ở ngón IV và V." },
      { id: "opt-2-2-03-b", question_id: "q-2-2-03", text: "Dây thần kinh Quay", is_correct: false, explanation: "Thần kinh quay gây bàn tay rủ cổ cò." },
      { id: "opt-2-2-03-c", question_id: "q-2-2-03", text: "Dây thần kinh Giữa", is_correct: false, explanation: "Thần kinh giữa gây bàn tay khỉ hoặc bàn tay cầu nguyện." },
      { id: "opt-2-2-03-d", question_id: "q-2-2-03", text: "Dây thần kinh Cơ bì", is_correct: false, explanation: "Thần kinh cơ bì gây yếu gấp cẳng tay." },
    ],
  },
  {
    id: "q-2-2-04",
    section_id: "sec-2-2",
    type: "single_choice",
    body: "Dây thần kinh giữa được hình thành bởi sự hợp lưu của hai rễ xuất phát từ các bó nào của đám rối cánh tay?",
    explanation: "Dây thần kinh giữa được tạo thành bởi rễ ngoài (xuất phát từ bó ngoài) và rễ trong (xuất phát từ bó trong) chập lại phía trước động mạch nách tạo thành hình chữ V hoặc chữ Y.",
    difficulty: "understand",
    source_ref: "sec-2-2-brachial-plexus",
    is_active: true,
    options: [
      { id: "opt-2-2-04-a", question_id: "q-2-2-04", text: "Bó ngoài và Bó trong", is_correct: true, explanation: "Chính xác, rễ ngoài của bó ngoài và rễ trong của bó trong." },
      { id: "opt-2-2-04-b", question_id: "q-2-2-04", text: "Bó sau và Bó ngoài", is_correct: false, explanation: "Bó sau không đóng góp nhánh tạo thần kinh giữa." },
      { id: "opt-2-2-04-c", question_id: "q-2-2-04", text: "Bó sau và Bó trong", is_correct: false, explanation: "Sai kết hợp." },
      { id: "opt-2-2-04-d", question_id: "q-2-2-04", text: "Chỉ từ Bó ngoài duy nhất", is_correct: false, explanation: "Bó ngoài chỉ cho thần kinh cơ bì và rễ ngoài thần kinh giữa." },
    ],
  },
  {
    id: "q-2-2-05",
    section_id: "sec-2-2",
    type: "single_choice",
    body: "Tổn thương rễ C5-C6 của đám rối cánh tay (liệt Erb-Duchenne) ở trẻ sơ sinh do kéo đẻ khó thường biểu hiện cánh tay ở tư thế nào?",
    explanation: "Liệt C5-C6 làm mất chức năng cơ delta, cơ trên gai (mất dạng vai), cơ dưới gai (mất xoay ngoài) và cơ nhị đầu (mất gấp và ngửa cẳng tay). Chi trên ở tư thế khép, xoay trong, cẳng tay duỗi và sấp, gọi là tư thế 'bàn tay người bồi bàn chờ tiền boa' (Waiter's tip posture).",
    difficulty: "clinical",
    source_ref: "sec-2-2-peripheral-nerves",
    is_active: true,
    options: [
      { id: "opt-2-2-05-a", question_id: "q-2-2-05", text: "Cánh tay khép, xoay trong; cẳng tay duỗi và sấp ('Bàn tay người hầu bàn')", is_correct: true, explanation: "Chính xác (Waiter's tip position)." },
      { id: "opt-2-2-05-b", question_id: "q-2-2-05", text: "Cánh tay dang 90 độ, cẳng tay gấp tối đa", is_correct: false, explanation: "Không phù hợp với cơ chế liệt cơ dạng và gấp." },
      { id: "opt-2-2-05-c", question_id: "q-2-2-05", text: "Bàn tay rủ cổ cò đơn độc", is_correct: false, explanation: "Bàn tay rủ cổ cò do tổn thương thần kinh quay." },
      { id: "opt-2-2-05-d", question_id: "q-2-2-05", text: "Mất cảm giác hoàn toàn toàn bộ vùng bàn tay", is_correct: false, explanation: "Cảm giác bàn tay chủ yếu do C7, C8, T1." },
    ],
  },
  {
    id: "q-2-2-06",
    section_id: "sec-2-2",
    type: "single_choice",
    body: "Động mạch nách đổi tên thành động mạch cánh tay khi đi qua mốc giải phẫu nào?",
    explanation: "Động mạch nách liên tục từ bờ sau xương đòn xuống đến bờ dưới của cơ ngực lớn (hoặc bờ dưới cơ tròn lớn) thì đổi tên thành động mạch cánh tay.",
    difficulty: "remember",
    source_ref: "sec-2-2-arteries",
    is_active: true,
    options: [
      { id: "opt-2-2-06-a", question_id: "q-2-2-06", text: "Bờ dưới cơ ngực lớn (hoặc cơ tròn lớn)", is_correct: true, explanation: "Chính xác." },
      { id: "opt-2-2-06-b", question_id: "q-2-2-06", text: "Mỏm quạ xương vai", is_correct: false, explanation: "Mỏm quạ nằm ở thành ngoài vùng nách." },
      { id: "opt-2-2-06-c", question_id: "q-2-2-06", text: "Bờ dưới xương sườn 1", is_correct: false, explanation: "Bờ ngoài xương sườn 1 là nơi động mạch dưới đòn đổi tên thành động mạch nách." },
      { id: "opt-2-2-06-d", question_id: "q-2-2-06", text: "Nếp gấp khuỷu tay", is_correct: false, explanation: "Nếp gấp khuỷu là nơi động mạch cánh tay chia 2 nhánh tận." },
    ],
  },
  {
    id: "q-2-2-07",
    section_id: "sec-2-2",
    type: "single_choice",
    body: "Nhánh bên lớn nhất của động mạch cánh tay đi cùng dây thần kinh quay vào rãnh xoắn là động mạch nào?",
    explanation: "Động mạch cánh tay sâu (Profunda brachii artery) là nhánh bên lớn nhất của động mạch cánh tay, đi cùng thần kinh quay qua tam giác cánh tay tam đầu vào rãnh xoắn xương cánh tay.",
    difficulty: "understand",
    source_ref: "sec-2-2-arteries",
    is_active: true,
    options: [
      { id: "opt-2-2-07-a", question_id: "q-2-2-07", text: "Động mạch cánh tay sâu", is_correct: true, explanation: "Đúng. Cung cấp máu cho khoang cánh tay sau." },
      { id: "opt-2-2-07-b", question_id: "q-2-2-07", text: "Động mạch bên trụ trên", is_correct: false, explanation: "Động mạch bên trụ trên đi cùng thần kinh trụ." },
      { id: "opt-2-2-07-c", question_id: "q-2-2-07", text: "Động mạch mũ cánh tay sau", is_correct: false, explanation: "Là nhánh của động mạch nách." },
      { id: "opt-2-2-07-d", question_id: "q-2-2-07", text: "Động mạch gian cốt chung", is_correct: false, explanation: "Là nhánh của động mạch trụ ở cẳng tay." },
    ],
  },
  {
    id: "q-2-2-08",
    section_id: "sec-2-2",
    type: "single_choice",
    body: "Cơ nào là 'cơ tùy hành' (cơ chỉ dẫn) của động mạch cánh tay?",
    explanation: "Cơ nhị đầu cánh tay (đặc biệt là bờ trong của cơ nhị đầu) là cơ tùy hành của động mạch cánh tay. Bác sĩ tìm động mạch bằng cách sờ dọc bờ trong cơ nhị đầu.",
    difficulty: "apply",
    source_ref: "sec-2-2-arteries",
    is_active: true,
    options: [
      { id: "opt-2-2-08-a", question_id: "q-2-2-08", text: "Cơ nhị đầu cánh tay", is_correct: true, explanation: "Chính xác, động mạch chạy dọc bờ trong cơ này." },
      { id: "opt-2-2-08-b", question_id: "q-2-2-08", text: "Cơ tam đầu cánh tay", is_correct: false, explanation: "Cơ tam đầu ở khoang sau." },
      { id: "opt-2-2-08-c", question_id: "q-2-2-08", text: "Cơ quạ cánh tay", is_correct: false, explanation: "Cơ quạ cánh tay chỉ ở đoạn 1/3 trên cánh tay." },
      { id: "opt-2-2-08-d", question_id: "q-2-2-08", text: "Cơ delta", is_correct: false, explanation: "Cơ delta ở vùng vai." },
    ],
  },
  {
    id: "q-2-2-09",
    section_id: "sec-2-2",
    type: "true_false",
    body: "Động mạch cánh tay tận hết ở ngang mức cổ xương quay (dưới nếp gấp khuỷu khoảng 3 cm) bằng cách chia thành động mạch quay và động mạch trụ. Đúng hay Sai?",
    explanation: "Đúng. Đây là vị trí giải phẫu chuẩn xác mà động mạch cánh tay phân chia thành 2 nhánh tận cấp máu cho cẳng tay và bàn tay.",
    difficulty: "remember",
    source_ref: "sec-2-2-arteries",
    is_active: true,
    options: [
      { id: "opt-2-2-09-t", question_id: "q-2-2-09", text: "Đúng", is_correct: true, explanation: "Chính xác." },
      { id: "opt-2-2-09-f", question_id: "q-2-2-09", text: "Sai", is_correct: false, explanation: "Mệnh đề giải phẫu này hoàn toàn đúng." },
    ],
  },
  {
    id: "q-2-2-10",
    section_id: "sec-2-2",
    type: "single_choice",
    body: "Khi đo huyết áp bằng ống nghe ở vùng nếp khuỷu, tai nghe của bác sĩ được đặt lên trên vị trí của động mạch nào?",
    explanation: "Ở hố khuỷu, động mạch cánh tay đi ở phía trong gân cơ nhị đầu và ở sâu dưới trẽ cân cơ nhị đầu. Đặt màng ống nghe vào vị trí này để nghe tiếng đập Korotkoff.",
    difficulty: "clinical",
    source_ref: "sec-2-2-arteries",
    is_active: true,
    options: [
      { id: "opt-2-2-010-a", question_id: "q-2-2-10", text: "Động mạch cánh tay (ở phía trong gân nhị đầu)", is_correct: true, explanation: "Chính xác, đây là kỹ năng thăm khám lâm sàng thiết yếu." },
      { id: "opt-2-2-010-b", question_id: "q-2-2-10", text: "Động mạch quay", is_correct: false, explanation: "Động mạch quay bắt ở rãnh mạch quay tại cổ tay." },
      { id: "opt-2-2-010-c", question_id: "q-2-2-10", text: "Động mạch trụ", is_correct: false, explanation: "Động mạch trụ đi sâu vào trong khối cơ cẳng tay trước." },
      { id: "opt-2-2-010-d", question_id: "q-2-2-10", text: "Động mạch cánh tay sâu", is_correct: false, explanation: "Động mạch cánh tay sâu ở mặt sau cánh tay." },
    ],
  },
  {
    id: "q-2-2-11",
    section_id: "sec-2-2",
    type: "single_choice",
    body: "Các bó (Cords) của đám rối thần kinh cánh tay được đặt tên là Ngoài, Trong, Sau dựa trên mối tương quan giải phẫu với cấu trúc nào?",
    explanation: "Tên gọi 'Ngoài, Trong, Sau' của 3 bó được xác định hoàn toàn dựa vào vị trí của chúng so với đoạn thứ hai của ĐỘNG MẠCH NÁCH (đoạn nằm sau cơ ngực bé).",
    difficulty: "understand",
    source_ref: "sec-2-2-brachial-plexus",
    is_active: true,
    options: [
      { id: "opt-2-2-011-a", question_id: "q-2-2-11", text: "Đoạn sau cơ ngực bé của Động mạch nách", is_correct: true, explanation: "Chính xác, tên các bó được định danh theo động mạch nách." },
      { id: "opt-2-2-011-b", question_id: "q-2-2-11", text: "Tĩnh mạch nách", is_correct: false, explanation: "Tĩnh mạch nách luôn nằm phía trong nhất." },
      { id: "opt-2-2-011-c", question_id: "q-2-2-11", text: "Xương đòn", is_correct: false, explanation: "Các thân ở trên xương đòn, các bó ở dưới xương đòn." },
      { id: "opt-2-2-011-d", question_id: "q-2-2-11", text: "Mỏm quạ xương vai", is_correct: false, explanation: "Không dùng làm mốc đặt tên bó." },
    ],
  },
  {
    id: "q-2-2-12",
    section_id: "sec-2-2",
    type: "single_choice",
    body: "Bệnh nhân bị vết thương cắt đứt cổ tay trước, đứt dây thần kinh giữa. Triệu chứng teo cơ đặc trưng sẽ xuất hiện ở vùng nào của bàn tay?",
    explanation: "Dây thần kinh giữa chi phối vận động các cơ mô cái (đối chiếu, gấp ngắn, dạng ngắn). Tổn thương thần kinh giữa làm teo mô cái phẳng lì, mất đối chiếu ngón cái tạo nên bàn tay phẳng giống bàn tay khỉ (ape hand).",
    difficulty: "clinical",
    source_ref: "sec-2-2-peripheral-nerves",
    is_active: true,
    options: [
      { id: "opt-2-2-012-a", question_id: "q-2-2-12", text: "Teo khối cơ ô mô cái (thenar eminence)", is_correct: true, explanation: "Chính xác. Khối cơ ngón cái bị teo lép." },
      { id: "opt-2-2-012-b", question_id: "q-2-2-12", text: "Teo khối cơ ô mô út", is_correct: false, explanation: "Teo mô út gặp trong tổn thương thần kinh trụ." },
      { id: "opt-2-2-012-c", question_id: "q-2-2-12", text: "Teo các cơ gian cốt mu tay", is_correct: false, explanation: "Các cơ gian cốt do thần kinh trụ chi phối." },
      { id: "opt-2-2-012-d", question_id: "q-2-2-12", text: "Teo cơ delta", is_correct: false, explanation: "Cơ delta ở vai do thần kinh nách chi phối." },
    ],
  },
  {
    id: "q-2-2-13",
    section_id: "sec-2-2",
    type: "single_choice",
    body: "Mạch quay được bắt để đếm tần số tim và nhịp thở của bệnh nhân nằm ở rãnh mạch quay giữa hai gân cơ nào?",
    explanation: "Rãnh mạch quay ở 1/3 dưới cẳng tay trước được giới hạn bởi gân cơ cánh tay quay ở phía ngoài và gân cơ gấp cổ tay quay ở phía trong. Động mạch quay nằm ngay dưới da trong rãnh này.",
    difficulty: "apply",
    source_ref: "sec-2-2-arteries",
    is_active: true,
    options: [
      { id: "opt-2-2-013-a", question_id: "q-2-2-13", text: "Gân cơ cánh tay quay và gân cơ gấp cổ tay quay", is_correct: true, explanation: "Chính xác, đây là mốc bắt mạch quay kinh điển." },
      { id: "opt-2-2-013-b", question_id: "q-2-2-13", text: "Gân cơ gấp cổ tay trụ và gân cơ gan tay dài", is_correct: false, explanation: "Ở phía trong là đường đi của mạch trụ." },
      { id: "opt-2-2-013-c", question_id: "q-2-2-13", text: "Gân cơ duỗi dài và duỗi ngắn ngón cái", is_correct: false, explanation: "Hai gân này giới hạn hõm lào giải phẫu." },
      { id: "opt-2-2-013-d", question_id: "q-2-2-13", text: "Gân nhị đầu cánh tay và cơ cánh tay", is_correct: false, explanation: "Nằm ở vùng khuỷu tay." },
    ],
  },
  {
    id: "q-2-2-14",
    section_id: "sec-2-2",
    type: "single_choice",
    body: "Thần kinh nào sau đây chịu trách nhiệm chi phối cảm giác cho da vùng 'huy hiệu quân hàm' (vùng ngoài khớp vai bao phủ bởi cơ delta)?",
    explanation: "Dây thần kinh nách sau khi chui qua lỗ tứ giác sẽ cho nhánh bì cánh tay trên ngoài chi phối cảm giác vùng da bao phủ cơ delta (vùng huy hiệu quân hàm).",
    difficulty: "remember",
    source_ref: "sec-2-2-peripheral-nerves",
    is_active: true,
    options: [
      { id: "opt-2-2-014-a", question_id: "q-2-2-14", text: "Dây thần kinh Nách", is_correct: true, explanation: "Chính xác. Mất cảm giác vùng này là bằng chứng liệt thần kinh nách." },
      { id: "opt-2-2-014-b", question_id: "q-2-2-14", text: "Dây thần kinh Cơ bì", is_correct: false, explanation: "Thần kinh cơ bì tận cùng bằng thần kinh bì cẳng tay ngoài." },
      { id: "opt-2-2-014-c", question_id: "q-2-2-14", text: "Dây thần kinh Quay", is_correct: false, explanation: "Thần kinh quay cho nhánh bì cánh tay sau." },
      { id: "opt-2-2-014-d", question_id: "q-2-2-14", text: "Dây thần kinh Trên đòn", is_correct: false, explanation: "Thần kinh trên đòn chi phối vùng ngực trên và đỉnh vai." },
    ],
  },
  {
    id: "q-2-2-15",
    section_id: "sec-2-2",
    type: "true_false",
    body: "Tổn thương dây thần kinh quay ở rãnh xoắn xương cánh tay làm mất cảm giác gan tay của các ngón I, II, III. Đúng hay Sai?",
    explanation: "Sai hoàn toàn. Thần kinh quay chỉ chi phối cảm giác mu tay (vùng da mu tay ngón cái, ngón trỏ và nửa ngoài ngón giữa). Cảm giác GAN TAY của ngón I, II, III do DÂY THẦN KINH GIỮA chi phối.",
    difficulty: "understand",
    source_ref: "sec-2-2-peripheral-nerves",
    is_active: true,
    options: [
      { id: "opt-2-2-015-t", question_id: "q-2-2-15", text: "Đúng", is_correct: false, explanation: "Sai. Cảm giác gan tay ngón I, II, III là của dây thần kinh giữa." },
      { id: "opt-2-2-015-f", question_id: "q-2-2-15", text: "Sai", is_correct: true, explanation: "Chính xác. Thần kinh quay không chi phối cảm giác gan bàn tay." },
    ],
  },
];
