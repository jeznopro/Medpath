import { NextResponse } from "next/server";
import { generateSampleExcelWorkbook } from "@/lib/excel-parser";

export async function GET() {
  try {
    const buffer = generateSampleExcelWorkbook();

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          'attachment; filename="MedRead_Mau_Import_Cau_Hoi.xlsx"',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Lỗi tạo file mẫu Excel: " + error.message },
      { status: 500 }
    );
  }
}
