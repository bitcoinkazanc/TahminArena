export type ReactionType =
  | "like"
  | "dislike";

export type Reaction = {
  id: string;
  userId: string;
  predictionId: string;
  type: ReactionType;
  createdAt: string;
  updatedAt: string;
};

export type ReactionAction =
  | "like"
  | "dislike"
  | "remove";

export type ReactionSummary = {
  likesCount: number;
  dislikesCount: number;
  currentReaction:
    | ReactionType
    | null;
};