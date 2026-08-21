export type PredictionOption = "1" | "X" | "2";

export type PredictionStatus =
  | "Bekliyor"
  | "Doğru"
  | "Yanlış"
  | "İptal";

export type Prediction = {
  id: string;
  userId: string;
  matchId: string;
  option: PredictionOption;
  status: PredictionStatus;
  createdAt: string;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
};

export type PredictionWithMatch = Prediction & {
  homeTeam: string;
  awayTeam: string;
  matchTime: string;
};

export type PredictionReaction =
  | "like"
  | "dislike";