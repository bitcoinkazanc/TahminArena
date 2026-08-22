export type NotificationType =
  | "follow"
  | "like"
  | "dislike"
  | "comment"
  | "prediction_result"
  | "system";

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actorUserId?: string | null;
  actorUsername?: string | null;
  predictionId?: string | null;
  read: boolean;
  createdAt: string;
};

export type NotificationAction =
  | "mark_read"
  | "mark_all_read";