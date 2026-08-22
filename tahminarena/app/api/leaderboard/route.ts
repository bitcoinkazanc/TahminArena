import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type LeaderboardPeriod =
  | "daily"
  | "weekly"
  | "monthly"
  | "all";

function isValidPeriod(
  value: string | null,
): value is LeaderboardPeriod {
  return (
    value === "daily" ||
    value === "weekly" ||
    value === "monthly" ||
    value === "all"
  );
}

export async function GET(
  request: NextRequest,
) {
  try {
    const requestedPeriod =
      request.nextUrl.searchParams.get(
        "period",
      );

    const period =
      requestedPeriod ??
      "weekly";

    if (
      !isValidPeriod(period)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz liderlik dönemi.",
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      getSupabaseServerClient();

    const { data, error } =
      await supabase
        .from(
          "leaderboard_scores",
        )
        .select(
          `
            id,
            user_id,
            period,
            points,
            predictions_count,
            correct_predictions_count,
            incorrect_predictions_count,
            success_rate,
            updated_at,
            users (
              username,
              display_name,
              avatar_url,
              privacy
            )
          `,
        )
        .eq(
          "period",
          period,
        )
        .order(
          "points",
          {
            ascending: false,
          },
        )
        .order(
          "correct_predictions_count",
          {
            ascending: false,
          },
        )
        .order(
          "predictions_count",
          {
            ascending: true,
          },
        )
        .limit(100);

    if (error) {
      console.error(
        "Leaderboard GET Supabase error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Liderlik tablosu alınamadı.",
        },
        {
          status: 500,
        },
      );
    }

    const leaderboard =
      (data ?? []).map(
        (
          item,
          index,
        ) => ({
          rank: index + 1,
          id: item.id,
          userId:
            item.user_id,
          period:
            item.period,
          points:
            item.points,
          predictionsCount:
            item.predictions_count,
          correctPredictionsCount:
            item.correct_predictions_count,
          incorrectPredictionsCount:
            item.incorrect_predictions_count,
          successRate:
            Number(
              item.success_rate,
            ),
          user:
            item.users ?? null,
          updatedAt:
            item.updated_at,
        }),
      );

    return NextResponse.json(
      {
        success: true,
        period,
        leaderboard,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "Leaderboard API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Liderlik tablosu alınamadı.",
      },
      {
        status: 500,
      },
    );
  }
}