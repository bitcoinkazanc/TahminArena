import { NextRequest, NextResponse } from "next/server";
import type {
  CreateReportInput,
  ReportReason,
  ReportTargetType,
} from "@/types/report";

type ReportRequestBody = {
  targetType?: unknown;
  targetId?: unknown;
  reason?: unknown;
  description?: unknown;
};

const targetTypes: ReportTargetType[] = [
  "user",
  "prediction",
  "comment",
  "message",
];

const reasons: ReportReason[] = [
  "spam",
  "harassment",
  "inappropriate",
  "fake",
  "other",
];

function isValidTargetType(
  value: unknown,
): value is ReportTargetType {
  return (
    typeof value === "string" &&
    targetTypes.includes(
      value as ReportTargetType,
    )
  );
}

function isValidReason(
  value: unknown,
): value is ReportReason {
  return (
    typeof value === "string" &&
    reasons.includes(
      value as ReportReason,
    )
  );
}

function isValidTargetId(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= 100
  );
}

function isValidDescription(
  value: unknown,
): value is string | undefined {
  return (
    value === undefined ||
    (typeof value === "string" &&
      value.trim().length <= 500)
  );
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as ReportRequestBody;

    if (
      !isValidTargetType(
        body.targetType,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz bildirim hedefi.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !isValidTargetId(body.targetId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz hedef ID'si.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidReason(body.reason)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz bildirim nedeni.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !isValidDescription(
        body.description,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Açıklama en fazla 500 karakter olabilir.",
        },
        {
          status: 400,
        },
      );
    }

    const input: CreateReportInput = {
      targetType: body.targetType,
      targetId: body.targetId.trim(),
      reason: body.reason,
      description:
        typeof body.description ===
        "string"
          ? body.description
              .trim()
              .slice(0, 500)
          : undefined,
    };

    return NextResponse.json(
      {
        success: true,
        report: {
          id: `demo-report-${Date.now()}`,
          ...input,
          status: "pending",
          createdAt:
            new Date().toISOString(),
          updatedAt:
            new Date().toISOString(),
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Reports API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Bildirim oluşturulamadı.",
      },
      {
        status: 500,
      },
    );
  }
}