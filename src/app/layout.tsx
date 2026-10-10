import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "MEDPATH — Nền Tảng Học Thuật & Workspace Y Khoa",
  description:
    "Không gian tự học lâm sàng dành cho sinh viên Y khoa: Đọc tài liệu chuyên sâu, Vượt cổng Knowledge Gate và Ôn tập ngắt quãng Spaced Repetition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen bg-[#F3EFE6] text-[#30312F] flex flex-col antialiased selection:bg-[#782F3B] selection:text-white">
        <AuthProvider>
          <main className="flex-1 flex flex-col">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

