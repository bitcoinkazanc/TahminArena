import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getTelegramAuthFromRequest } from "@/lib/telegram/server";
import { validateText } from "@/lib/security/validation";

type ChatRequestBody = {
  message?: unknown;
  matchId?: unknown;
};

function isValidMatchId(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= 100
  );
}

export async function GET(
  request: NextRequest,
) {
  try {
    const matchId =
      request.nextUrl.searchParams.get(
        "matchId",
      );

    if (
      matchId !== null &&
      !isValidMatchId(matchId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz maç ID'si.",
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      getSupabaseServerClient();

    let query = supabase
      .from("chat_messages")
      .select(
        `
          id,
          user_id,
          match_id,
          message,
          created_at,
          updated_at,
          users (
            username,
            display_name,
            avatar_url
          )
        `,
      )
      .order(
        "created_at",
        {
          ascending: true,
        },
      )
      .limit(100);

    if (matchId) {
      query = query.eq(
        "match_id",
        matchId.trim(),
      );
    } else {
      query = query.is(
        "match_id",
        null,
      );
    }

    const { data, error } =
      await query;

    if (error) {
      console.error(
        "Chat GET Supabase error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Mesajlar alınamadı.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        messages:
          data ?? [],
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
      "Chat GET API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Mesajlar alınamadı.",
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
      (await request.json()) as ChatRequestBody;

    const messageResult =
      validateText(
        body.message,
        "Mesaj",
        1,
        1000,
      );

    if (!messageResult.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            messageResult.message,
        },
        {
          status: 400,
        },
      );
    }

    if (
      body.matchId !== undefined &&
      body.matchId !== null &&
      !isValidMatchId(
        body.matchId,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz maç ID'si.",
        },
        {
          status: 400,
        },
      );
    }

    const matchId =
      body.matchId
        ? body.matchId.trim()
        : null;

    const supabase =
      getSupabaseServerClient();

    const { data: user, error: userError } =
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

    if (userError) {
      console.error(
        "Chat user lookup error:",
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
            "Önce kullanıcı profili oluşturmalısın.",
        },
        {
          status: 404,
        },
      );
    }

    if (matchId) {
      const { data: match, error: matchError } =
        await supabase
          .from("matches")
          .select("id")
          .eq(
            "id",
            matchId,
          )
          .maybeSingle();

      if (matchError) {
        console.error(
          "Chat match lookup error:",
          matchError,
        );

        return NextResponse.json(
          {
            success: false,
            message:
              "Maç doğrulanamadı.",
          },
          {
            status: 500,
          },
        );
      }

      if (!match) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Maç bulunamadı.",
          },
          {
            status: 404,
          },
        );
      }
    }

    const { data, error } =
      await supabase
        .from("chat_messages")
        .insert({
          user_id: user.id,
          match_id: matchId,
          message:
            messageResult.data,
        })
        .select(
          `
            id,
            user_id,
            match_id,
            message,
            created_at,
            updated_at
          `,
        )
        .single();

    if (error) {
      console.error(
        "Chat POST Supabase error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Mesaj gönderilemedi.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: data,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Chat POST API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Mesaj gönderilemedi.",
      },
      {
        status: 500,
      },
    );
  }
}