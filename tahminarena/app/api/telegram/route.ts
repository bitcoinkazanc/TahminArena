import { NextRequest, NextResponse } from "next/server";
import {
  getTelegramBotToken,
  validateTelegramInitData,
} from "@/lib/telegram/auth";

type TelegramAuthRequestBody = {
  initData?: unknown;
};

function isValidInitData(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= 10000
  );
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as TelegramAuthRequestBody;

    if (!isValidInitData(body.initData)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz Telegram doğrulama verisi.",
        },
        {
          status: 400,
        },
      );
    }

    const botToken =
      getTelegramBotToken();

    if (!botToken) {
      console.error(
        "TELEGRAM_BOT_TOKEN environment variable is missing.",
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Telegram doğrulama yapılandırması eksik.",
        },
        {
          status: 500,
        },
      );
    }

    const result =
      validateTelegramInitData(
        body.initData.trim(),
        botToken,
      );

    if (!result.valid || !result.user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Telegram oturumu doğrulanamadı.",
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: result.user.id,
          firstName:
            result.user.first_name ??
            "",
          lastName:
            result.user.last_name ??
            "",
          username:
            result.user.username ??
            null,
          languageCode:
            result.user.language_code ??
            null,
          photoUrl:
            result.user.photo_url ??
            null,
        },
        authDate: result.authDate,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "Telegram auth API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Telegram oturumu doğrulanamadı.",
      },
      {
        status: 500,
      },
    );
  }
}