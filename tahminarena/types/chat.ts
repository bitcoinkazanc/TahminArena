export type ChatMessageType =
  | "text"
  | "prediction"
  | "system";

export type ChatMessage = {
  id: string;
  userId: string;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  text: string;
  type: ChatMessageType;
  predictionId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateChatMessageInput = {
  text: string;
  type?: ChatMessageType;
  predictionId?: string;
};