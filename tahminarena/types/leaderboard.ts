export type LeaderboardPeriod =
  | "daily"
  | "weekly"
  | "monthly"
  | "all";

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  predictionsCount: number;
  correctPredictionsCount: number;
  incorrectPredictionsCount: number;
  successRate: number;
  points: number;
};

export type LeaderboardResponse = {
  period: LeaderboardPeriod;
  entries: LeaderboardEntry[];
};