import { NextRequest, NextResponse } from "next/server";
import type { BlockAction } from "@/types/block";

type BlockRequestBody = {
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
): value is BlockAction {
  return (
    value === "block" ||
    value === "unblock"
  );
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      blockedUsers: [],
    },
    {
      status: 200,
      headers: {
        "Cache-Control":
          "no-store",
      },
    },
  );
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as BlockRequestBody;

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
            "Geçersiz engelleme işlemi.",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        username:
          body.username.trim(),
        blocked:
          body.action === "block",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Blocks API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Engelleme işlemi gerçekleştirilemedi.",
      },
      {
        status: 500,
      },
    );
  }
}