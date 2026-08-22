import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getTelegramAuthFromRequest } from "@/lib/telegram/server";
import { validateText } from "@/lib/security/validation";

type PredictionRequestBody = {
  matchId?: unknown;
  option?: unknown;
};

type PredictionOption =
  | "1"
  | "X"
  | "2";

function isValidPredictionOption(
  value: unknown,
): value is PredictionOption {
  return (
    value === "1" ||
    value === "X" ||
    value === "2"
  );
}

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

    const supabase =
      getSupabaseServerClient();

    let query = supabase
      .from("predictions")
      .select(
        `
          id,
          user_id,
          match_id,
          option,
          status,
          likes_count,
          dislikes_count,
          comments_count,
          created_at,
          updated_at,
          users (
            username,
            display_name,
            avatar_url,
            privacy
          )
        `,
      )
      .order(
        "created_at",
        {
          ascending: false,
        },
      )
      .limit(100);

    if (matchId) {
      if (
        !isValidMatchId(
          matchId,
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

      query = query.eq(
        "match_id",
        matchId.trim(),
      );
    }

    const { data, error } =
      await query;

    if (error) {
      console.error(
        "Predictions GET Supabase error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Tahminler alınamadı.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        predictions:
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
      "Predictions GET API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Tahminler alınamadı.",
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
      (await request.json()) as PredictionRequestBody;

    if (
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

    if (
      !isValidPredictionOption(
        body.option,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz tahmin seçeneği.",
        },
        {
          status: 400,
        },
      );
    }

    const matchId =
      body.matchId.trim();

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
        "Prediction user lookup error:",
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
            "Tahmin oluşturmak için önce profil oluşturmalısın.",
        },
        {
          status: 404,
        },
      );
    }

    const { data: match, error: matchError } =
      await supabase
        .from("matches")
        .select(
          "id, date_time, status",
        )
        .eq(
          "id",
          matchId,
        )
        .maybeSingle();

    if (matchError) {
      console.error(
        "Prediction match lookup error:",
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

    const matchDate =
      new Date(
        match.date_time,
      );

    if (
      Number.isNaN(
        matchDate.getTime(),
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Maç tarihi geçersiz.",
        },
        {
          status: 500,
        },
      );
    }

    if (
      matchDate.getTime() <=
      Date.now()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Başlamış maç için tahmin yapılamaz.",
        },
        {
          status: 409,
        },
      );
    }

    const { data, error } =
      await supabase
        .from("predictions")
        .insert({
          user_id: user.id,
          match_id: matchId,
          option: body.option,
        })
        .select(
          `
            id,
            user_id,
            match_id,
            option,
            status,
            likes_count,
            dislikes_count,
            comments_count,
            created_at,
            updated_at
          `,
        )
        .single();

    if (error) {
      console.error(
        "Predictions POST Supabase error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Tahmin oluşturulamadı.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        prediction: data,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Predictions POST API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Tahmin oluşturulamadı.",
      },
      {
        status: 500,
      },
    );
  }
}