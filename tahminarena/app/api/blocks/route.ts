import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getTelegramAuthFromRequest } from "@/lib/telegram/server";

type BlockAction =
  | "block"
  | "unblock";

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
      (await request.json()) as BlockRequestBody;

    if (
      !isValidUsername(
        body.username,
      )
    ) {
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

    if (
      !isValidAction(
        body.action,
      )
    ) {
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

    const username =
      body.username.trim();

    const supabase =
      getSupabaseServerClient();

    const telegramId =
      String(
        telegramAuth.user.id,
      );

    const { data: blocker, error: blockerError } =
      await supabase
        .from("users")
        .select("id")
        .eq(
          "telegram_id",
          telegramId,
        )
        .maybeSingle();

    if (blockerError) {
      console.error(
        "Blocker lookup error:",
        blockerError,
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

    if (!blocker) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Önce kullanıcı profili oluşturmalısın.",
        },
        {
          status: 404,
        },
      );
    }

    const { data: blockedUser, error: blockedUserError } =
      await supabase
        .from("users")
        .select("id, username")
        .eq(
          "username",
          username,
        )
        .maybeSingle();

    if (blockedUserError) {
      console.error(
        "Blocked user lookup error:",
        blockedUserError,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Kullanıcı bulunamadı.",
        },
        {
          status: 500,
        },
      );
    }

    if (!blockedUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Kullanıcı bulunamadı.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      blocker.id ===
      blockedUser.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Kendini engelleyemezsin.",
        },
        {
          status: 409,
        },
      );
    }

    if (
      body.action === "block"
    ) {
      const { error } =
        await supabase
          .from("blocks")
          .insert({
            blocker_id:
              blocker.id,
            blocked_id:
              blockedUser.id,
          });

      if (error) {
        if (
          error.code ===
          "23505"
        ) {
          return NextResponse.json(
            {
              success: true,
              username,
              blocked: true,
            },
            {
              status: 200,
            },
          );
        }

        console.error(
          "Block insert error:",
          error,
        );

        return NextResponse.json(
          {
            success: false,
            message:
              "Kullanıcı engellenemedi.",
          },
          {
            status: 500,
          },
        );
      }

      return NextResponse.json(
        {
          success: true,
          username,
          blocked: true,
        },
        {
          status: 200,
        },
      );
    }

    const { error } =
      await supabase
        .from("blocks")
        .delete()
        .eq(
          "blocker_id",
          blocker.id,
        )
        .eq(
          "blocked_id",
          blockedUser.id,
        );

    if (error) {
      console.error(
        "Block delete error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Engel kaldırılamadı.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        username,
        blocked: false,
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