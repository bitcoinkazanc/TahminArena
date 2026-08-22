import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  validateText,
  validateId,
  isValidUsername,
  isValidUserPrivacy,
} from "@/lib/security/validation";
import type { UserPrivacy } from "@/types/user";

type CreateUserBody = {
  telegramId?: unknown;
  username?: unknown;
  displayName?: unknown;
  avatarUrl?: unknown;
  bio?: unknown;
  privacy?: unknown;
};

function isValidAvatarUrl(
  value: unknown,
): value is string | null | undefined {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" &&
      value.length <= 1000)
  );
}

export async function GET(
  request: NextRequest,
) {
  try {
    const username =
      request.nextUrl.searchParams.get(
        "username",
      );

    if (
      username &&
      !isValidUsername(username)
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

    const supabase =
      getSupabaseServerClient();

    let query = supabase
      .from("users")
      .select(
        "id, telegram_id, username, display_name, avatar_url, bio, privacy, followers_count, following_count, predictions_count, correct_predictions_count, created_at, updated_at",
      );

    if (username) {
      query = query.eq(
        "username",
        username.trim(),
      );
    }

    const { data, error } =
      await query.limit(50);

    if (error) {
      console.error(
        "Users GET Supabase error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Kullanıcı verileri alınamadı.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        users: data ?? [],
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
      "Users GET API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Kullanıcı verileri alınamadı.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as CreateUserBody;

    const telegramIdResult =
      validateId(
        body.telegramId,
        "Telegram ID",
        50,
      );

    if (!telegramIdResult.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            telegramIdResult.message,
        },
        {
          status: 400,
        },
      );
    }

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

    const displayNameResult =
      validateText(
        body.displayName,
        "Görünen ad",
        1,
        100,
      );

    if (!displayNameResult.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            displayNameResult.message,
        },
        {
          status: 400,
        },
      );
    }

    let bio: string | null = null;

    if (body.bio !== undefined) {
      const bioResult = validateText(
        body.bio,
        "Biyografi",
        0,
        500,
      );

      if (!bioResult.success) {
        return NextResponse.json(
          {
            success: false,
            message:
              bioResult.message,
          },
          {
            status: 400,
          },
        );
      }

      bio = bioResult.data;
    }

    if (
      !isValidAvatarUrl(
        body.avatarUrl,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz profil fotoğrafı.",
        },
        {
          status: 400,
        },
      );
    }

    const privacy: UserPrivacy =
      body.privacy === undefined
        ? "Açık"
        : isValidUserPrivacy(
              body.privacy,
            )
          ? body.privacy
          : "Açık";

    const supabase =
      getSupabaseServerClient();

    const { data, error } =
      await supabase
        .from("users")
        .insert({
          telegram_id:
            telegramIdResult.data,
          username:
            body.username.trim(),
          display_name:
            displayNameResult.data,
          avatar_url:
            body.avatarUrl ?? null,
          bio,
          privacy,
        })
        .select(
          "id, telegram_id, username, display_name, avatar_url, bio, privacy, followers_count, following_count, predictions_count, correct_predictions_count, created_at, updated_at",
        )
        .single();

    if (error) {
      console.error(
        "Users POST Supabase error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Kullanıcı oluşturulamadı.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: data,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Users POST API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Kullanıcı oluşturulamadı.",
      },
      {
        status: 500,
      },
    );
  }
}