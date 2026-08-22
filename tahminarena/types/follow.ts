export type FollowStatus =
  | "following"
  | "not_following"
  | "blocked";

export type Follow = {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
};

export type FollowUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  status: FollowStatus;
};

export type FollowAction =
  | "follow"
  | "unfollow";