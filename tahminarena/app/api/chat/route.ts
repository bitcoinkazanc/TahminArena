import { NextRequest, NextResponse } from "next/server";
import type { ChatMessage } from "@/types/chat";

type CreateChatMessageBody = {
  text?: unknown;
  type?: unknown;
  predictionId?: unknown;
};

function isValidText(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length >= 1 &&
    value.trim().length <= 500
  );
}

function isValidPredictionId(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= 100
  );
}

function isValidType(
  value: unknown,
): value is "text" | "prediction" {
  return (
    value === "text" ||
    value === "prediction"
  );
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as CreateChatMessageBody;

    if (!isValidText(body.text)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Mesaj 1 ile 500 karakter arasında olmalıdır.",
        },
        {
          status: 400,
        },
      );
    }

    const type = isValidType(body.type)
      ? body.type
      : "text";

    if (
      type === "prediction" &&
      !isValidPredictionId(
        body.predictionId,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tahmin mesajı için geçerli bir tahmin ID'si gereklidir.",
        },
        {
          status: 400,
        },
      );
    }

    const now =
      new Date().toISOString();

    const message: ChatMessage = {
      id: `demo-message-${Date.now()}`,
      userId: "demo-current-user",
      username: "demo",
      displayName: "Demo Kullanıcı",
      avatarUrl: null,
      text: body.text.trim(),
      type,
      predictionId:
        type === "prediction"
          ? body.predictionId as string
          : null,
      createdAt: now,
      updatedAt: now,
    };

    return NextResponse.json(
      {
        success: true,
        message,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Chat API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Mesaj gönderilemedi.",
      },
      {
        status: 500,
      },
    );
  }
}