import { NextRequest, NextResponse } from "next/server";

type CreateCommentBody = {
  predictionId?: unknown;
  text?: unknown;
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

function isValidCommentText(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length >= 1 &&
    value.trim().length <= 500
  );
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as CreateCommentBody;

    if (!isValidPredictionId(body.predictionId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Geçersiz tahmin.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidCommentText(body.text)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Yorum 1 ile 500 karakter arasında olmalıdır.",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        comment: {
          id: `demo-comment-${Date.now()}`,
          userId: "demo-user",
          predictionId:
            body.predictionId.trim(),
          text: body.text.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          username: "demo",
          displayName: "Demo Kullanıcı",
          avatarUrl: null,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Comments API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Yorum oluşturulamadı.",
      },
      {
        status: 500,
      },
    );
  }
}