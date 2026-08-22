import { NextRequest, NextResponse } from "next/server";
import type {
  ReactionAction,
  ReactionType,
} from "@/types/reaction";

type ReactionRequestBody = {
  predictionId?: unknown;
  action?: unknown;
};

function isValidPredictionId(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= 100
  );
}

function isValidAction(
  value: unknown,
): value is ReactionAction {
  return (
    value === "like" ||
    value === "dislike" ||
    value === "remove"
  );
}

function getReactionType(
  action: ReactionAction,
): ReactionType | null {
  if (action === "like") {
    return "like";
  }

  if (action === "dislike") {
    return "dislike";
  }

  return null;
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as ReactionRequestBody;

    if (
      !isValidPredictionId(
        body.predictionId,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz tahmin ID'si.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidAction(body.action)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz tepki işlemi.",
        },
        {
          status: 400,
        },
      );
    }

    const reaction =
      getReactionType(body.action);

    return NextResponse.json(
      {
        success: true,
        predictionId:
          body.predictionId.trim(),
        reaction,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Reactions API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Tepki işlemi gerçekleştirilemedi.",
      },
      {
        status: 500,
      },
    );
  }
}