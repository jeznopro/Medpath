# MedRead - Nền Tảng Học Y Khoa Theo Triết Lý Mastery Learning

Ứng dụng web học Y khoa toàn diện dành cho sinh viên Y/dược Việt Nam.
Giải quyết vấn đề *"đọc nhiều mau quên"* bằng phương pháp **Mastery Learning**:
**ĐỌC LÝ THUYẾT $\rightarrow$ VƯỢT CỔNG TRẮC NGHIỆM $\rightarrow$ ĐẠT NGƯỠNG ĐIỂM ĐỂ MỞ KHÓA MỤC KẾ TIẾP**.

---

## 🌟 Tính Năng Đã Hoàn Thành (Giai Đoạn 1 - MVP)

1. **Hệ thống Đăng nhập, Đăng ký & Phân quyền 3 Vai trò:**
   - **👑 Quản trị viên (Admin):** Toàn quyền truy cập Dashboard Quản trị (`/admin`), xem thống kê hệ thống (tổng user, tổng câu hỏi, lượt làm bài, tỉ lệ vượt cổng), quản lý danh sách người dùng (đổi vai trò trên bảng, xóa tài khoản), xem danh sách lớp và reset hệ thống.
   - **👨‍🏫 Giảng viên (Teacher):** Quản lý ngân hàng câu hỏi, tải file mẫu Excel, import câu hỏi, cấu hình ngưỡng đạt.
   - **👨‍🎓 Học viên (Student):** Tham gia lớp bằng mã, đọc tài liệu, làm bài kiểm tra vượt cổng.
   - **Trang Đăng nhập thông minh (`/login`):** Tích hợp cả form email/password lẫn **3 nút Đăng nhập nhanh 1-chạm (Admin / Giảng viên / Học viên)** để kiểm thử tức thì.
   - **Trang Đăng ký tài khoản (`/register`):** Tự tạo tài khoản với vai trò Học viên hoặc Giảng viên.
   - **Thanh Navbar đa năng:** Hiển thị vai trò, liên kết Admin, và thanh chuyển đổi vai trò 1-click mọi lúc mọi nơi.

2. **Quản lý Lớp & Mã tham gia (Join Code):**
   - Lớp học mẫu: *Lớp Giải Phẫu Y1 - K2026* (Mã vào lớp: `YK2026`).
   - Học viên nhập mã để tham gia lớp và mở khóa lộ trình học.

3. **Cấu trúc tri thức phân cấp:**
   - Môn học $\rightarrow$ Bài học $\rightarrow$ Mục (Section).
   - Mỗi mục có cấu hình riêng: Ngưỡng đạt (80% cốt lõi, 60% phụ), số câu mỗi lần làm (10 câu), tài liệu lý thuyết.

4. **Trình đọc tài liệu Y khoa (Document Reader):**
   - Giao diện thân thiện mắt, tối ưu đọc tài liệu dài trên cả PC và Mobile.
   - Mục lục tự động bên cạnh (TOC collapsible).
   - Tự động lưu vị trí cuộn trang của học viên.
   - Điều chỉnh cỡ chữ (A- / A+).
   - Chế độ hiển thị: Ban ngày (Light), Đọc dịu mắt (Sepia ban đêm), Ban đêm (Dark).
   - Nút "Bỏ qua tạm" (đánh dấu mục chưa vững).
   - Thanh ghim dưới cùng kêu gọi hành động: "Làm bài kiểm tra mục này".

5. **Ngân hàng câu hỏi & Import Excel (.xlsx) / CSV:**
   - Có sẵn bộ dữ liệu mẫu **60 câu hỏi Giải phẫu học** chất lượng cao (tim mạch, cơ xương khớp, thần kinh).
   - Tính năng tải file Excel mẫu chuẩn cấu trúc (`MedRead_Mau_Import_Cau_Hoi.xlsx`).
   - Kéo thả import file Excel với trình xác thực nghiêm ngặt bằng **Zod**.
   - Cơ chế **chống trùng lặp câu hỏi** (chuẩn hóa nội dung so sánh).
   - Báo lỗi chi tiết theo từng dòng (line-by-line validation).
   - Form thêm câu hỏi thủ công cho giảng viên.
   - Cảnh báo nếu số câu hỏi trong ngân hàng ít hơn số câu mỗi lần làm.

6. **Cổng kiểm tra thông minh & Bảo mật:**
   - Thuật toán random có trọng số: ưu tiên câu học viên từng làm sai hoặc chưa làm, loại bỏ câu trùng lặp trong cùng một lần thi.
   - **Bảo mật tuyệt đối phía Client:** Máy chủ loại bỏ hoàn toàn thuộc tính `is_correct` và lời giải thích trước khi gửi đề thi xuống client (F12 DevTools không thể xem trước đáp án).
   - Hỗ trợ phím tắt máy tính: `1`, `2`, `3`, `4` để chọn phương án, phím `Enter` để qua câu tiếp theo.
   - Đánh dấu câu hỏi cần xem lại (Flag question).

7. **Chấm điểm Server-side & Mở khóa tiến độ:**
   - Đạt ngưỡng (≥ 80%): Tự động đánh dấu hoàn thành, kích hoạt hiệu ứng pháo hoa và **MỞ KHÓA MỤC KẾ TIẾP**.
   - Chưa đạt ngưỡng (< 80%): Giữ trạng thái, hiển thị danh sách câu sai kèm nút **"Xem lại đoạn này"** (nhảy thẳng về đúng đoạn văn bản trong tài liệu).
   - Cho phép làm lại không giới hạn với một bộ câu hỏi random hoàn toàn mới.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Local Trên Windows

### Yêu cầu môi trường:
- Node.js version 18.x trở lên (đã kiểm thử mượt mà trên Node v24).
- npm hoặc pnpm.

### Bước 1: Mở Terminal tại thư mục dự án
```powershell
cd C:\Users\MinhTriet\.gemini\antigravity\scratch\medread
```

### Bước 2: Cài đặt dependencies (nếu chưa cài)
```powershell
npm install
```

### Bước 3: Chạy ứng dụng ở chế độ Development
```powershell
npm run dev
```
Ứng dụng sẽ chạy tại địa chỉ: **[http://localhost:3000](http://localhost:3000)**.

---

## 🧪 Kịch Bản Kiểm Thử Nhanh (Demo Flow)

1. **Trang chủ (`http://localhost:3000`):**
   - Xem tổng quan các tính năng, thống kê 60 câu hỏi giải phẫu mẫu.
   - Thử nút chuyển đổi vai trò ở thanh điều hướng trên cùng (Giảng viên $\leftrightarrow$ Học viên).

2. **Học viên vào lớp & Đọc tài liệu (`/classes`):**
   - Xem danh sách: Bài 1 có Mục 1.1 đang mở khóa (`Đang học`), Mục 1.2 đang ở trạng thái `Đang khóa` 🔒.
   - Bấm **"Đọc tài liệu"** ở Mục 1.1: Trải nghiệm thanh cuộn nhớ vị trí, đổi cỡ chữ, đổi chế độ Sepia dịu mắt.

3. **Làm bài kiểm tra Vượt cổng (`/sections/sec-1-1/quiz`):**
   - Hệ thống random 10 câu từ ngân hàng 15 câu của Mục 1.1.
   - Thử mở F12 DevTools $\rightarrow$ Network $\rightarrow$ Xem response API `/api/quiz/generate` $\rightarrow$ Xác nhận không có `is_correct`.
   - Dùng phím `1`, `2`, `3`, `4` và `Enter` để làm bài.

4. **Trường hợp Trượt ngưỡng (< 80%):**
   - Làm đúng ít câu rồi nộp bài.
   - Màn hình hiện thông báo Chưa đạt, danh sách các câu làm sai.
   - Bấm nút **"Xem lại đoạn này"**: Trình duyệt nhảy thẳng về mục lý thuyết tương ứng ở trang đọc.
   - Bấm **"Làm bộ câu hỏi random khác"**: Nhận ngay 10 câu mới với thứ tự và đáp án được xáo trộn.

5. **Trường hợp Đạt ngưỡng (≥ 80%):**
   - Làm đúng từ 8/10 câu trở lên.
   - Pháo hoa ăn mừng xuất hiện.
   - Quay lại `/classes`: **Mục 1.2 đã được tự động MỞ KHÓA thành công!**

6. **Giảng viên Quản lý Ngân hàng câu hỏi (`/teacher/question-bank`):**
   - Chuyển sang vai trò Giảng viên (BS.CKII Nguyễn Văn Giảng).
   - Chọn mục cần quản lý, xem 15 câu hỏi có sẵn kèm đáp án.
   - Bấm **"Tải file Excel mẫu"** để tải file `.xlsx`.
   - Chọn file Excel kéo thả vào ô Import để kiểm tra xác thực Zod và tính năng chống trùng lặp câu hỏi.

---

## 🗄️ Cấu Trúc Database & Triển Khai Supabase

- Toàn bộ script DDL tạo bảng, khóa ngoại, chỉ mục và chính sách bảo mật Row Level Security (RLS) đã được viết sẵn tại:
  `supabase/schema.sql`.
- Khi triển khai lên Supabase:
  1. Tạo project mới trên [supabase.com](https://supabase.com).
  2. Dán nội dung file [supabase/schema.sql](file:///C:/Users/MinhTriet/.gemini/antigravity/scratch/medread/supabase/schema.sql) vào mục **SQL Editor** trên Dashboard của Supabase và bấm **Run**.
  3. Sao chép URL và Key vào file `.env.local`:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
     SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
     ```
