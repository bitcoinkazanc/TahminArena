import { NextRequest, NextResponse } from "next/server";
import type {
  SearchMatchResult,
  SearchPredictionResult,
  SearchResponse,
  SearchUserResult,
} from "@/types/search";

const demoUsers: SearchUserResult[] = [
  {
    type: "user",
    id: "user-1",
    username: "futbolsever",
    displayName: "Futbolsever",
    avatarUrl: null,
  },
  {
    type: "user",
    id: "user-2",
    username: "tahminci",
    displayName: "Tahminci",
    avatarUrl: null,
  },
  {
    type: "user",
    id: "user-3",
    username: "golustasi",
    displayName: "Gol Ustası",
    avatarUrl: null,
  },
];

const demoMatches: SearchMatchResult[] = [
  {
    type: "match",
    id: "demo-match-1",
    homeTeam: "Galatasaray",
    awayTeam: "Fenerbahçe",
    dateTime: "2026-08-22T20:00:00+03:00",
    status: "Yaklaşıyor",
  },
  {
    type: "match",
    id: "demo-match-2",
    homeTeam: "Beşiktaş",
    awayTeam: "Trabzonspor",
    dateTime: "2026-08-22T20:30:00+03:00",
    status: "Yaklaşıyor",
  },
];

const demoPredictions: SearchPredictionResult[] = [
  {
    type: "prediction",
    id: "demo-prediction-1",
    username: "tahminci",
    displayName: "Tahminci",
    homeTeam: "Galatasaray",
    awayTeam: "Fenerbahçe",
    option: "1",
  },
  {
    type: "prediction",
    id: "demo-prediction-2",
    username: "futbolsever",
    displayName: "Futbolsever",
    homeTeam: "Beşiktaş",
    awayTeam: "Trabzonspor",
    option: "X",
  },
];

function normalizeSearchValue(
  value: string,
): string {
  return value
    .trim()
    .toLocaleLowerCase("tr-TR");
}

function matchesQuery(
  values: string[],
  query: string,
): boolean {
  return values.some((value) =>
    normalizeSearchValue(value).includes(
      query,
    ),
  );
}

export async function GET(
  request: NextRequest,
) {
  try {
    const rawQuery =
      request.nextUrl.searchParams.get(
        "q",
      ) ?? "";

    const query = rawQuery.trim();

    if (query.length === 0) {
      const response: SearchResponse = {
        query: "",
        results: [],
      };

      return NextResponse.json(
        {
          success: true,
          ...response,
        },
        {
          status: 200,
          headers: {
            "Cache-Control":
              "no-store",
          },
        },
      );
    }

    if (query.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Arama metni en fazla 100 karakter olabilir.",
        },
        {
          status: 400,
        },
      );
    }

    const normalizedQuery =
      normalizeSearchValue(query);

    const users = demoUsers.filter(
      (user) =>
        matchesQuery(
          [
            user.username,
            user.displayName,
          ],
          normalizedQuery,
        ),
    );

    const matches = demoMatches.filter(
      (match) =>
        matchesQuery(
          [
            match.homeTeam,
            match.awayTeam,
          ],
          normalizedQuery,
        ),
    );

    const predictions =
      demoPredictions.filter(
        (prediction) =>
          matchesQuery(
            [
              prediction.username,
              prediction.displayName,
              prediction.homeTeam,
              prediction.awayTeam,
            ],
            normalizedQuery,
          ),
      );

    const response: SearchResponse = {
      query,
      results: [
        ...users,
        ...matches,
        ...predictions,
      ].slice(0, 50),
    };

    return NextResponse.json(
      {
        success: true,
        ...response,
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
      "Search API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Arama gerçekleştirilemedi.",
      },
      {
        status: 500,
      },
    );
  }
}