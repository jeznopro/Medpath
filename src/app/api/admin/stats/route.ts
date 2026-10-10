import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";

export async function GET() {
  try {
    const stats = db.getSystemStats();
    return NextResponse.json({ stats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
