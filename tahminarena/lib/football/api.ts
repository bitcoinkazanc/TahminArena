const MACKOLIK_BASE_URL =
  "https://www.mackolik.com/perform/p0/ajax/components/competition/livescores/json";

export type FootballMatch = {
  id: string;
  matchName: string;
  homeTeam: string;
  awayTeam: string;
  dateTime: string;
  status: string;
  state?: string | null;
  homeScore?: number | null;
  awayScore?: number | null;
  league?: string | null;
  country?: string | null;
};

type MackolikMatch = {
  id?: unknown;
  matchId?: unknown;
  match_id?: unknown;
  matchName?: unknown;
  name?: unknown;
  homeTeam?: unknown;
  awayTeam?: unknown;
  home?: unknown;
  away?: unknown;
  dateTime?: unknown;
  date?: unknown;
  time?: unknown;
  status?: unknown;
  state?: unknown;
  score?: unknown;
  competition?: unknown;
  league?: unknown;
  country?: unknown;
};

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getString(
  value: unknown,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0
    ? trimmed
    : null;
}

function getNumber(
  value: unknown,
): number | null {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.trim());

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function parseScore(
  value: unknown,
): {
  homeScore: number | null;
  awayScore: number | null;
} {
  if (Array.isArray(value)) {
    return {
      homeScore: getNumber(value[0]),
      awayScore: getNumber(value[1]),
    };
  }

  if (isRecord(value)) {
    return {
      homeScore: getNumber(
        value.home ??
          value.homeScore ??
          value.home_score,
      ),
      awayScore: getNumber(
        value.away ??
          value.awayScore ??
          value.away_score,
      ),
    };
  }

  if (typeof value === "string") {
    const parts = value.split(/[-:]/);

    if (parts.length >= 2) {
      return {
        homeScore: getNumber(parts[0]),
        awayScore: getNumber(parts[1]),
      };
    }
  }

  return {
    homeScore: null,
    awayScore: null,
  };
}

function normalizeStatus(
  status: string | null,
  state: string | null,
): string {
  const value =
    `${status ?? ""} ${state ?? ""}`.toLocaleLowerCase(
      "tr-TR",
    );

  if (
    value.includes("canlı") ||
    value.includes("canli") ||
    value.includes("live") ||
    value.includes("playing")
  ) {
    return "Canlı";
  }

  if (
    value.includes("bitti") ||
    value.includes("finished") ||
    value.includes("maç sonucu") ||
    value.includes("mac sonucu") ||
    value.includes("played")
  ) {
    return "Bitti";
  }

  if (
    value.includes("ertel") ||
    value.includes("postponed")
  ) {
    return "Ertelendi";
  }

  if (
    value.includes("iptal") ||
    value.includes("cancelled") ||
    value.includes("canceled")
  ) {
    return "İptal";
  }

  return "Yaklaşıyor";
}

function getCompetitionName(
  value: unknown,
): string | null {
  if (typeof value === "string") {
    return getString(value);
  }

  if (!isRecord(value)) {
    return null;
  }

  return (
    getString(value.name) ??
    getString(value.title) ??
    getString(value.competitionName) ??
    getString(value.leagueName)
  );
}

function getCountryName(
  value: unknown,
): string | null {
  if (typeof value === "string") {
    return getString(value);
  }

  if (!isRecord(value)) {
    return null;
  }

  return (
    getString(value.name) ??
    getString(value.title) ??
    getString(value.countryName)
  );
}

function normalizeMatch(
  raw: MackolikMatch,
  parentCompetition?: string | null,
  parentCountry?: string | null,
): FootballMatch | null {
  const id =
    getString(raw.id) ??
    getString(raw.matchId) ??
    getString(raw.match_id);

  const homeTeam =
    getString(raw.homeTeam) ??
    getString(raw.home);

  const awayTeam =
    getString(raw.awayTeam) ??
    getString(raw.away);

  let dateTime =
    getString(raw.dateTime);

  if (!dateTime) {
    const date =
      getString(raw.date);

    const time =
      getString(raw.time);

    if (date && time) {
      dateTime = `${date} ${time}`;
    } else {
      dateTime = date;
    }
  }

  if (
    !id ||
    !homeTeam ||
    !awayTeam ||
    !dateTime
  ) {
    return null;
  }

  const matchName =
    getString(raw.matchName) ??
    getString(raw.name) ??
    `${homeTeam} - ${awayTeam}`;

  const status =
    getString(raw.status);

  const state =
    getString(raw.state);

  const score =
    parseScore(raw.score);

  const league =
    getCompetitionName(
      raw.competition,
    ) ??
    getString(raw.league) ??
    parentCompetition ??
    null;

  const country =
    getCountryName(
      raw.country,
    ) ??
    parentCountry ??
    null;

  return {
    id,
    matchName,
    homeTeam,
    awayTeam,
    dateTime,
    status: normalizeStatus(
      status,
      state,
    ),
    state,
    homeScore:
      score.homeScore,
    awayScore:
      score.awayScore,
    league,
    country,
  };
}

function collectMatchObjects(
  value: unknown,
  result: MackolikMatch[],
  context?: {
    competition?: string | null;
    country?: string | null;
  },
): void {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectMatchObjects(
        item,
        result,
        context,
      );
    }

    return;
  }

  if (!isRecord(value)) {
    return;
  }

  const possibleId =
    value.id ??
    value.matchId ??
    value.match_id;

  const possibleHome =
    value.homeTeam ??
    value.home;

  const possibleAway =
    value.awayTeam ??
    value.away;

  if (
    possibleId !== undefined &&
    possibleHome !== undefined &&
    possibleAway !== undefined
  ) {
    result.push(
      value as MackolikMatch,
    );

    return;
  }

  let competition =
    context?.competition ?? null;

  let country =
    context?.country ?? null;

  const ownCompetition =
    getCompetitionName(
      value.competition,
    );

  const ownLeague =
    getCompetitionName(
      value.league,
    );

  const ownCountry =
    getCountryName(
      value.country,
    );

  if (ownCompetition) {
    competition =
      ownCompetition;
  } else if (ownLeague) {
    competition =
      ownLeague;
  }

  if (ownCountry) {
    country =
      ownCountry;
  }

  for (const [key, child] of Object.entries(
    value,
  )) {
    if (
      key === "competition" ||
      key === "league"
    ) {
      continue;
    }

    collectMatchObjects(
      child,
      result,
      {
        competition,
        country,
      },
    );
  }
}

function getMatchArray(
  payload: unknown,
): MackolikMatch[] {
  const result: MackolikMatch[] = [];

  collectMatchObjects(
    payload,
    result,
  );

  const seen = new Set<string>();

  return result.filter(
    (match) => {
      const id =
        getString(match.id) ??
        getString(match.matchId) ??
        getString(match.match_id);

      if (!id) {
        return false;
      }

      if (seen.has(id)) {
        return false;
      }

      seen.add(id);

      return true;
    },
  );
}

function createMatchUrl(
  date: string,
): string {
  const url =
    new URL(
      MACKOLIK_BASE_URL,
    );

  url.searchParams.append(
    "sports[]",
    "Soccer",
  );

  url.searchParams.set(
    "matchDate",
    date,
  );

  return url.toString();
}

function isValidDate(
  value: string,
): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(
    value,
  );
}

export async function getFootballMatches(
  date: string,
): Promise<FootballMatch[]> {
  if (!isValidDate(date)) {
    throw new Error(
      "Geçersiz maç tarihi.",
    );
  }

  const url =
    createMatchUrl(date);

  const response =
    await fetch(
      url,
      {
        method: "GET",
        headers: {
          Accept:
            "application/json, text/plain, */*",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36",
          Referer:
            "https://www.mackolik.com/",
        },
        cache: "no-store",
      },
    );

  if (!response.ok) {
    throw new Error(
      `Mackolik isteği başarısız: ${response.status}`,
    );
  }

  const payload =
    (await response.json()) as unknown;

  const rawMatches =
    getMatchArray(payload);

  const normalized =
    rawMatches
      .map((match) =>
        normalizeMatch(match),
      )
      .filter(
        (
          match,
        ): match is FootballMatch =>
          match !== null,
      );

  return normalized;
}

export function getTodayDate(): string {
  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1,
    ).padStart(2, "0");

  const day =
    String(
      now.getDate(),
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}