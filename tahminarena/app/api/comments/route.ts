import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getTelegramAuthFromRequest } from "@/lib/telegram/server";
import { validateText } from "@/lib/security/validation";

type CommentRequestBody = {
  predictionId?: unknown;
  comment?: unknown;
};

function isValidPredictionId(
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
    const predictionId =
      request.nextUrl.searchParams.get(
        "predictionId",
      );

    if (
      !isValidPredictionId(
        predictionId,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz tahmin ID'si.",
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      getSupabaseServerClient();

    const { data, error } =
      await supabase
        .from("comments")
        .select(
          `
            id,
            user_id,
            prediction_id,
            comment,
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
        .eq(
          "prediction_id",
          predictionId.trim(),
        )
        .order(
          "created_at",
          {
            ascending: true,
          },
        )
        .limit(100);

    if (error) {
      console.error(
        "Comments GET Supabase error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Yorumlar alınamadı.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        comments:
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
      "Comments GET API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Yorumlar alınamadı.",
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
      (await request.json()) as CommentRequestBody;

    if (
      !isValidPredictionId(
        body.predictionId,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz tahmin ID'si.",
        },
        {
          status: 400,
        },
      );
    }

    const commentResult =
      validateText(
        body.comment,
        "Yorum",
        1,
        1000,
      );

    if (!commentResult.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            commentResult.message,
        },
        {
          status: 400,
        },
      );
    }

    const predictionId =
      body.predictionId.trim();

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
        "Comment user lookup error:",
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

    const { data: prediction, error: predictionError } =
      await supabase
        .from("predictions")
        .select("id")
        .eq(
          "id",
          predictionId,
        )
        .maybeSingle();

    if (predictionError) {
      console.error(
        "Comment prediction lookup error:",
        predictionError,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Tahmin doğrulanamadı.",
        },
        {
          status: 500,
        },
      );
    }

    if (!prediction) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tahmin bulunamadı.",
        },
        {
          status: 404,
        },
      );
    }

    const { data, error } =
      await supabase
        .from("comments")
        .insert({
          user_id: user.id,
          prediction_id:
            predictionId,
          comment:
            commentResult.data,
        })
        .select(
          `
            id,
            user_id,
            prediction_id,
            comment,
            created_at,
            updated_at
          `,
        )
        .single();

    if (error) {
      console.error(
        "Comments POST Supabase error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Yorum gönderilemedi.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        comment: data,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Comments POST API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Yorum gönderilemedi.",
      },
      {
        status: 500,
      },
    );
  }
}