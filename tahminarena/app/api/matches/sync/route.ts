import { NextRequest, NextResponse } from "next/server";
import {
  getFootballMatches,
  getTodayDate,
} from "@/lib/football/api";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function isAuthorized(
  request: NextRequest,
): boolean {
  const cronSecret =
    process.env.CRON_SECRET;

  if (!cronSecret) {
    return false;
  }

  const authorization =
    request.headers.get(
      "authorization",
    );

  return (
    authorization ===
    `Bearer ${cronSecret}`
  );
}

async function syncMatches(
  request: NextRequest,
) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Yetkisiz istek.",
        },
        {
          status: 401,
        },
      );
    }

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

    const supabase =
      getSupabaseServerClient();

    const rows = matches.map(
      (match) => ({
        id: match.id,
        home_team:
          match.homeTeam,
        away_team:
          match.awayTeam,
        date_time:
          match.dateTime,
        status:
          match.status,
        home_score:
          match.homeScore,
        away_score:
          match.awayScore,
        league:
          match.league,
        country:
          match.country,
        source:
          "mackolik",
        updated_at:
          new Date().toISOString(),
      }),
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: true,
          date,
          synced: 0,
          message:
            "Bu tarih için maç bulunamadı.",
        },
        {
          status: 200,
        },
      );
    }

    const { error } =
      await supabase
        .from("matches")
        .upsert(
          rows,
          {
            onConflict: "id",
          },
        );

    if (error) {
      console.error(
        "Match sync database error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Maçlar veritabanına kaydedilemedi.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        date,
        synced:
          rows.length,
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
      "Match sync error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Maç senkronizasyonu başarısız.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(
  request: NextRequest,
) {
  return syncMatches(request);
}

export async function POST(
  request: NextRequest,
) {
  return syncMatches(request);
}