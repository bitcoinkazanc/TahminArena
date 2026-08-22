import { NextRequest, NextResponse } from "next/server";
import {
  getFootballMatches,
  getTodayDate,
  type FootballMatch,
} from "@/lib/football/api";

function normalizeMatch(
  match: FootballMatch,
) {
  return {
    id: match.id,
    matchName: match.matchName,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    dateTime: match.dateTime,
    status: match.status,
    state: match.state ?? null,
    homeScore:
      match.homeScore ?? null,
    awayScore:
      match.awayScore ?? null,
    league: match.league ?? null,
    country: match.country ?? null,
  };
}

export async function GET(
  request: NextRequest,
) {
  try {
    const requestedDate =
      request.nextUrl.searchParams.get(
        "date",
      );

    const date =
      requestedDate?.trim() ||
      getTodayDate();

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(
        date,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz maç tarihi.",
        },
        {
          status: 400,
        },
      );
    }

    const matches =
      await getFootballMatches(
        date,
      );

    return NextResponse.json(
      {
        success: true,
        date,
        matches:
          matches.map(
            normalizeMatch,
          ),
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
      "Matches API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Maç verileri alınamadı.",
      },
      {
        status: 502,
        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  }
}