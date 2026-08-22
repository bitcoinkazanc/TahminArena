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
  matchName?: unknown;
  homeTeam?: unknown;
  awayTeam?: unknown;
  dateTime?: unknown;
  status?: unknown;
  state?: unknown;
  score?: unknown;
  competition?: unknown;
};

type MackolikResponse = {
  matches?: unknown;
  data?: unknown;
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

  const trimmed =
    value.trim();

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
    const parsed =
      Number(value);

    if (
      Number.isFinite(parsed)
    ) {
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
      homeScore:
        getNumber(value[0]),
      awayScore:
        getNumber(value[1]),
    };
  }

  if (isRecord(value)) {
    return {
      homeScore:
        getNumber(
          value.home ??
            value.homeScore,
        ),
      awayScore:
        getNumber(
          value.away ??
            value.awayScore,
        ),
    };
  }

  if (typeof value === "string") {
    const parts =
      value.split(/[-:]/);

    if (parts.length >= 2) {
      return {
        homeScore:
          getNumber(parts[0]),
        awayScore:
          getNumber(parts[1]),
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
    `${status ?? ""} ${
      state ?? ""
    }`.toLocaleLowerCase(
      "tr-TR",
    );

  if (
    value.includes("canlı") ||
    value.includes("live")
  ) {
    return "Canlı";
  }

  if (
    value.includes("bitti") ||
    value.includes("finished") ||
    value.includes("maç sonucu")
  ) {
    return "Bitti";
  }

  return "Yaklaşıyor";
}

function getMatchArray(
  payload: unknown,
): MackolikMatch[] {
  if (Array.isArray(payload)) {
    return payload.filter(
      isRecord,
    ) as MackolikMatch[];
  }

  if (!isRecord(payload)) {
    return [];
  }

  const response =
    payload as MackolikResponse;

  if (Array.isArray(response.matches)) {
    return response.matches.filter(
      isRecord,
    ) as MackolikMatch[];
  }

  if (Array.isArray(response.data)) {
    return response.data.filter(
      isRecord,
    ) as MackolikMatch[];
  }

  return [];
}

function normalizeMatch(
  raw: MackolikMatch,
): FootballMatch | null {
  const id =
    getString(raw.id);

  const homeTeam =
    getString(raw.homeTeam);

  const awayTeam =
    getString(raw.awayTeam);

  const dateTime =
    getString(raw.dateTime);

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
    `${homeTeam} - ${awayTeam}`;

  const status =
    getString(raw.status);

  const state =
    getString(raw.state);

  const score =
    parseScore(raw.score);

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
  };
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

  const response =
    await fetch(
      createMatchUrl(date),
      {
        method: "GET",
        headers: {
          Accept:
            "application/json",
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

  return rawMatches
    .map(normalizeMatch)
    .filter(
      (
        match,
      ): match is FootballMatch =>
        match !== null,
    );
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