import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  return NextResponse.json({
    status: "placeholder",
    message: "AI nutrition assistant backend is ready for model integration.",
    plannedCapabilities: [
      "review_daily_log",
      "suggest_meal_swaps",
      "explain_progress_patterns",
      "recommend_high_protein_meals",
      "identify_logging_consistency"
    ],
    receivedContext: body
  });
}
