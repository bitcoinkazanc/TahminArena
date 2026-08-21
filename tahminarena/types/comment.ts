export type Comment = {
  id: string;
  userId: string;
  predictionId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

export type CommentWithUser = Comment & {
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
};