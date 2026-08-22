export type SearchResultType =
  | "user"
  | "match"
  | "prediction";

export type SearchUserResult = {
  type: "user";
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
};

export type SearchMatchResult = {
  type: "match";
  id: string;
  homeTeam: string;
  awayTeam: string;
  dateTime: string;
  status: string;
};

export type SearchPredictionResult = {
  type: "prediction";
  id: string;
  username: string;
  displayName: string;
  homeTeam: string;
  awayTeam: string;
  option: "1" | "X" | "2";
};

export type SearchResult =
  | SearchUserResult
  | SearchMatchResult
  | SearchPredictionResult;

export type SearchResponse = {
  query: string;
  results: SearchResult[];
};