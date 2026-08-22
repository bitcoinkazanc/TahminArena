import { NextRequest, NextResponse } from "next/server";
import type {
  LeaderboardEntry,
  LeaderboardPeriod,
} from "@/types/leaderboard";

const validPeriods: LeaderboardPeriod[] = [
  "daily",
  "weekly",
  "monthly",
  "all",
];

const demoEntries: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: "user-1",
    username: "futbolsever",
    displayName: "Futbolsever",
    avatarUrl: null,
    predictionsCount: 42,
    correctPredictionsCount: 31,
    incorrectPredictionsCount: 11,
    successRate: 74,
    points: 310,
  },
  {
    rank: 2,
    userId: "user-2",
    username: "tahminci",
    displayName: "Tahminci",
    avatarUrl: null,
    predictionsCount: 38,
    correctPredictionsCount: 27,
    incorrectPredictionsCount: 11,
    successRate: 71,
    points: 285,
  },
  {
    rank: 3,
    userId: "user-3",
    username: "golustasi",
    displayName: "Gol Ustası",
    avatarUrl: null,
    predictionsCount: 35,
    correctPredictionsCount: 24,
    incorrectPredictionsCount: 11,
    successRate: 69,
    points: 260,
  },
  {
    rank: 4,
    userId: "user-4",
    username: "macanalisti",
    displayName: "Maç Analisti",
    avatarUrl: null,
    predictionsCount: 41,
    correctPredictionsCount: 27,
    incorrectPredictionsCount: 14,
    successRate: 66,
    points: 245,
  },
  {
    rank: 5,
    userId: "user-5",
    username: "futbolkolik",
    displayName: "Futbolkolik",
    avatarUrl: null,
    predictionsCount: 33,
    correctPredictionsCount: 21,
    incorrectPredictionsCount: 12,
    successRate: 64,
    points: 220,
  },
];

function isValidPeriod(
  value: string | null,
): value is LeaderboardPeriod {
  return (
    value !== null &&
    validPeriods.includes(
      value as LeaderboardPeriod,
    )
  );
}

export async function GET(
  request: NextRequest,
) {
  try {
    const periodParam =
      request.nextUrl.searchParams.get(
        "period",
      );

    const period: LeaderboardPeriod =
      isValidPeriod(periodParam)
        ? periodParam
        : "weekly";

    return NextResponse.json(
      {
        success: true,
        period,
        entries: demoEntries,
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
          "Liderlik verileri alınamadı.",
      },
      {
        status: 500,
      },
    );
  }
}