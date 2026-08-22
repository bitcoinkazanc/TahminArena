import { NextRequest } from "next/server";
import {
  getTelegramBotToken,
  validateTelegramInitData,
  type TelegramAuthResult,
} from "@/lib/telegram/auth";

export function getTelegramAuthFromRequest(
  request: NextRequest,
): TelegramAuthResult {
  const initData =
    request.headers.get(
      "x-telegram-init-data",
    );

  if (!initData) {
    return {
      valid: false,
      user: null,
      authDate: null,
    };
  }

  const botToken =
    getTelegramBotToken();

  if (!botToken) {
    return {
      valid: false,
      user: null,
      authDate: null,
    };
  }

  return validateTelegramInitData(
    initData,
    botToken,
  );
}

export function getTelegramUserId(
  request: NextRequest,
): number | null {
  const auth =
    getTelegramAuthFromRequest(
      request,
    );

  if (
    !auth.valid ||
    !auth.user
  ) {
    return null;
  }

  return auth.user.id;
}