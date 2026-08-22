import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getTelegramAuthFromRequest } from "@/lib/telegram/server";

type FriendListType =
  | "following"
  | "followers";

function isValidListType(
  value: string | null,
): value is FriendListType {
  return (
    value === "following" ||
    value === "followers"
  );
}

export async function GET(
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

    const type =
      request.nextUrl.searchParams.get(
        "type",
      ) ?? "following";

    if (
      !isValidListType(type)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz arkadaş listesi.",
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

    const { data: currentUser, error: userError } =
      await supabase
        .from("users")
        .select(
          "id, followers_count, following_count",
        )
        .eq(
          "telegram_id",
          telegramId,
        )
        .maybeSingle();

    if (userError) {
      console.error(
        "Friends user lookup error:",
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

    if (!currentUser) {
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

    if (
      type === "following"
    ) {
      const { data, error } =
        await supabase
          .from("follows")
          .select(
            `
              created_at,
              following_id,
              users:following_id (
                id,
                username,
                display_name,
                avatar_url,
                bio,
                privacy,
                followers_count,
                following_count
              )
            `,
          )
          .eq(
            "follower_id",
            currentUser.id,
          )
          .order(
            "created_at",
            {
              ascending: false,
            },
          )
          .limit(100);

      if (error) {
        console.error(
          "Following list error:",
          error,
        );

        return NextResponse.json(
          {
            success: false,
            message:
              "Takip edilenler alınamadı.",
          },
          {
            status: 500,
          },
        );
      }

      return NextResponse.json(
        {
          success: true,
          type,
          users:
            (data ?? []).map(
              (item) => ({
                followedAt:
                  item.created_at,
                user:
                  item.users ?? null,
              }),
            ),
          counts: {
            followers:
              currentUser.followers_count,
            following:
              currentUser.following_count,
          },
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

    const { data, error } =
      await supabase
        .from("follows")
        .select(
          `
            created_at,
            follower_id,
            users:follower_id (
              id,
              username,
              display_name,
              avatar_url,
              bio,
              privacy,
              followers_count,
              following_count
            )
          `,
        )
        .eq(
          "following_id",
          currentUser.id,
        )
        .order(
          "created_at",
          {
            ascending: false,
          },
        )
        .limit(100);

    if (error) {
      console.error(
        "Followers list error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Takipçiler alınamadı.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        type,
        users:
          (data ?? []).map(
            (item) => ({
              followedAt:
                item.created_at,
              user:
                item.users ?? null,
            }),
          ),
        counts: {
          followers:
            currentUser.followers_count,
          following:
            currentUser.following_count,
        },
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
      "Friends API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Arkadaş listesi alınamadı.",
      },
      {
        status: 500,
      },
    );
  }
}