import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getTelegramAuthFromRequest } from "@/lib/telegram/server";

type PrivacyValue =
  | "Açık"
  | "Gizli";

type PrivacyRequestBody = {
  privacy?: unknown;
};

function isValidPrivacy(
  value: unknown,
): value is PrivacyValue {
  return (
    value === "Açık" ||
    value === "Gizli"
  );
}

export async function PATCH(
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
      (await request.json()) as PrivacyRequestBody;

    if (
      !isValidPrivacy(
        body.privacy,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz gizlilik ayarı.",
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      getSupabaseServerClient();

    const telegramId =
      String(
        telegramAuth.user.id,
      );

    const { data: user, error: userError } =
      await supabase
        .from("users")
        .select("id")
        .eq(
          "telegram_id",
          telegramId,
        )
        .maybeSingle();

    if (userError) {
      console.error(
        "Privacy user lookup error:",
        userError,
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

    if (!user) {
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
        .from("users")
        .update({
          privacy:
            body.privacy,
        })
        .eq(
          "id",
          user.id,
        )
        .select(
          "id, username, privacy, updated_at",
        )
        .single();

    if (error) {
      console.error(
        "Privacy update error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Gizlilik ayarı güncellenemedi.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        profile: data,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Privacy API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Gizlilik ayarı güncellenemedi.",
      },
      {
        status: 500,
      },
    );
  }
}