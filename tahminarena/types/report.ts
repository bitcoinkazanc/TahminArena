export type ReportReason =
  | "spam"
  | "harassment"
  | "inappropriate"
  | "fake"
  | "other";

export type ReportTargetType =
  | "user"
  | "prediction"
  | "comment"
  | "message";

export type ReportStatus =
  | "pending"
  | "reviewing"
  | "resolved"
  | "rejected";

export type Report = {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description?: string | null;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateReportInput = {
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description?: string;
};