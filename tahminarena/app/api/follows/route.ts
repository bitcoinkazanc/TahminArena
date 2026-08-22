import { NextRequest, NextResponse } from "next/server";
import type { FollowAction } from "@/types/follow";

type FollowRequestBody = {
  username?: unknown;
  action?: unknown;
};

function isValidUsername(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length >= 1 &&
    value.trim().length <= 50 &&
    /^[a-zA-Z0-9_]+$/.test(
      value.trim(),
    )
  );
}

function isValidAction(
  value: unknown,
): value is FollowAction {
  return (
    value === "follow" ||
    value === "unfollow"
  );
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as FollowRequestBody;

    if (!isValidUsername(body.username)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz kullanıcı adı.",
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
            "Geçersiz takip işlemi.",
        },
        {
          status: 400,
        },
      );
    }

    const username =
      body.username.trim();

    const following =
      body.action === "follow";

    return NextResponse.json(
      {
        success: true,
        username,
        following,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Follows API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Takip işlemi gerçekleştirilemedi.",
      },
      {
        status: 500,
      },
    );
  }
}