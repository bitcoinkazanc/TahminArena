export type MatchStatus =
  | "Yaklaşıyor"
  | "Canlı"
  | "Bitti";

export type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  dateTime: string;
  status: MatchStatus;
  homeScore?: number | null;
  awayScore?: number | null;
  league?: string | null;
  country?: string | null;
};

export type MatchPredictionOption = "1" | "X" | "2";

export type MatchListItem = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  status: MatchStatus;
};