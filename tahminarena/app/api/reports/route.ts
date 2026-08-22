import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getTelegramAuthFromRequest } from "@/lib/telegram/server";
import { validateText } from "@/lib/security/validation";

type ReportTargetType =
  | "user"
  | "prediction"
  | "comment"
  | "chat_message";

type ReportRequestBody = {
  targetType?: unknown;
  targetId?: unknown;
  reason?: unknown;
};

function isValidTargetType(
  value: unknown,
): value is ReportTargetType {
  return (
    value === "user" ||
    value === "prediction" ||
    value === "comment" ||
    value === "chat_message"
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

export async function POST(
  request: NextRequest,
) {
  try {
    const telegramAuth =
      getTelegramAuthFromRequest(
        request,
      );

    if (
      !telegramAuth.valid ||
      !telegramAuth.user
    ) {
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
            "Geçersiz rapor hedefi.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !isValidTargetId(
        body.targetId,
      )
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

    const reasonResult =
      validateText(
        body.reason,
        "Rapor nedeni",
        1,
        500,
      );

    if (!reasonResult.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            reasonResult.message,
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      getSupabaseServerClient();

    const { data: reporter, error: reporterError } =
      await supabase
        .from("users")
        .select("id")
        .eq(
          "telegram_id",
          String(
            telegramAuth.user.id,
          ),
        )
        .maybeSingle();

    if (reporterError) {
      console.error(
        "Reporter lookup error:",
        reporterError,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Kullanıcı doğrulanamadı.",
        },
        {
          status: 500,
        },
      );
    }

    if (!reporter) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Kullanıcı profili bulunamadı.",
        },
        {
          status: 404,
        },
      );
    }

    const { data, error } =
      await supabase
        .from("reports")
        .insert({
          reporter_id:
            reporter.id,
          target_type:
            body.targetType,
          target_id:
            body.targetId.trim(),
          reason:
            reasonResult.data,
          status:
            "pending",
        })
        .select(
          "id, reporter_id, target_type, target_id, reason, status, created_at, updated_at",
        )
        .single();

    if (error) {
      console.error(
        "Reports POST Supabase error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Rapor gönderilemedi.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        report: data,
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
          "Rapor gönderilemedi.",
      },
      {
        status: 500,
      },
    );
  }
}