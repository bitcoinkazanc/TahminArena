import type { Match, MatchStatus } from "@/types/match";

const MACKOLIK_BASE_URL =
  "https://www.mackolik.com/perform/p0/ajax/components/competition/livescores/json";

type MackolikTeam = {
  name?: string;
};

type MackolikScore = {
  home?: number | null;
  away?: number | null;
};

type MackolikMatch = {
  id?: string | number;
  matchName?: string;
  homeTeam?: string | MackolikTeam;
  awayTeam?: string | MackolikTeam;
  dateTime?: string;
  status?: string;
  state?: string;
  score?: MackolikScore;
};

type MackolikResponse = {
  matches?: MackolikMatch[];
  data?: {
    matches?: MackolikMatch[];
  };
};

function getTeamName(
  team: string | MackolikTeam | undefined,
): string {
  if (typeof team === "string") {
    return team.trim();
  }

  return team?.name?.trim() ?? "Bilinmeyen takım";
}

function normalizeStatus(
  status?: string,
  state?: string,
): MatchStatus {
  const value = `${status ?? ""} ${state ?? ""}`.toLowerCase();

  if (
    value.includes("live") ||
    value.includes("canlı") ||
    value.includes("playing")
  ) {
    return "Canlı";
  }

  if (
    value.includes("finished") ||
    value.includes("finished") ||
    value.includes("ended") ||
    value.includes("bitti")
  ) {
    return "Bitti";
  }

  return "Yaklaşıyor";
}

function normalizeMatch(
  match: MackolikMatch,
): Match | null {
  if (!match.id) {
    return null;
  }

  const homeTeam = getTeamName(match.homeTeam);
  const awayTeam = getTeamName(match.awayTeam);

  if (
    homeTeam === "Bilinmeyen takım" ||
    awayTeam === "Bilinmeyen takım"
  ) {
    return null;
  }

  return {
    id: String(match.id),
    homeTeam,
    awayTeam,
    dateTime: match.dateTime ?? "",
    status: normalizeStatus(
      match.status,
      match.state,
    ),
    homeScore: match.score?.home ?? null,
    awayScore: match.score?.away ?? null,
  };
}

function getTodayDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
  }).format(new Date());
}

export async function getMatches(
  date = getTodayDate(),
): Promise<Match[]> {
  const url = new URL(MACKOLIK_BASE_URL);

  url.searchParams.set("sports[]", "Soccer");
  url.searchParams.set("matchDate", date);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Mackolik maç verisi alınamadı: ${response.status}`,
    );
  }

  const data =
    (await response.json()) as MackolikResponse;

  const rawMatches =
    data.matches ??
    data.data?.matches ??
    [];

  return rawMatches
    .map(normalizeMatch)
    .filter(
      (match): match is Match => match !== null,
    );
}