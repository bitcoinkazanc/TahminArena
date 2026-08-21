export type UserPrivacy = "Açık" | "Gizli";

export type User = {
  id: string;
  telegramId: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  privacy: UserPrivacy;
  followersCount: number;
  followingCount: number;
  predictionsCount: number;
  correctPredictionsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type PublicUser = Pick<
  User,
  | "id"
  | "username"
  | "displayName"
  | "avatarUrl"
  | "bio"
  | "privacy"
  | "followersCount"
  | "followingCount"
  | "predictionsCount"
  | "correctPredictionsCount"
>;

export type UserProfileStats = {
  predictionsCount: number;
  correctPredictionsCount: number;
  incorrectPredictionsCount: number;
  successRate: number;
};