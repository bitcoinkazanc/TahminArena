export type Block = {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: string;
};

export type BlockAction =
  | "block"
  | "unblock";

export type BlockedUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  blockedAt: string;
};