import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getTelegramAuthFromRequest } from "@/lib/telegram/server";
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

    const supabase =
      getSupabaseServerClient();

    const telegramId =
      String(
        telegramAuth.user.id,
      );

    const { data: follower, error: followerError } =
      await supabase
        .from("users")
        .select("id")
        .eq(
          "telegram_id",
          telegramId,
        )
        .maybeSingle();

    if (followerError) {
      console.error(
        "Follower lookup error:",
        followerError,
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

    if (!follower) {
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

    const { data: followingUser, error: followingError } =
      await supabase
        .from("users")
        .select("id, username")
        .eq(
          "username",
          username,
        )
        .maybeSingle();

    if (followingError) {
      console.error(
        "Following user lookup error:",
        followingError,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Takip edilecek kullanıcı bulunamadı.",
        },
        {
          status: 500,
        },
      );
    }

    if (!followingUser) {
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
      follower.id ===
      followingUser.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Kendini takip edemezsin.",
        },
        {
          status: 409,
        },
      );
    }

    if (
      body.action === "follow"
    ) {
      const { error } =
        await supabase
          .from("follows")
          .insert({
            follower_id:
              follower.id,
            following_id:
              followingUser.id,
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
              following: true,
            },
            {
              status: 200,
            },
          );
        }

        console.error(
          "Follow insert error:",
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

      return NextResponse.json(
        {
          success: true,
          username,
          following: true,
        },
        {
          status: 200,
        },
      );
    }

    const { error } =
      await supabase
        .from("follows")
        .delete()
        .eq(
          "follower_id",
          follower.id,
        )
        .eq(
          "following_id",
          followingUser.id,
        );

    if (error) {
      console.error(
        "Follow delete error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Takip bırakma işlemi gerçekleştirilemedi.",
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
        following: false,
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