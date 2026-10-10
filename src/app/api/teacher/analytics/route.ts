import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId") || "class-anat-1";
    const exportCsv = searchParams.get("export") === "csv";

    const analytics = db.getTeacherClassAnalytics(classId);

    // Xử lý xuất báo cáo CSV
    if (exportCsv) {
      const header = "Học viên,Email,Mục hoàn thành,Tổng số mục,Tỉ lệ hoàn thành,Điểm trung bình\n";
      const rows = analytics.studentMatrix
        .map(
          (s) =>
            `"${s.name}","${s.email}",${s.passedCount},${s.totalSections},${s.progressPct}%,${s.avgScore}%`
        )
        .join("\n");

      const csvContent = "\uFEFF" + header + rows; // BOM for Vietnamese UTF-8 Excel support
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="bao-cao-lop-${classId}-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json(analytics);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi khi lấy dữ liệu thống kê giảng viên" },
      { status: 500 }
    );
  }
}
