import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sectionId = searchParams.get("sectionId") || undefined;

  const questions = db.getQuestions(sectionId);
  return NextResponse.json({ questions });
}
