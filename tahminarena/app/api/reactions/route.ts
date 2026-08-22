import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getTelegramAuthFromRequest } from "@/lib/telegram/server";
import type {
  ReactionAction,
  ReactionType,
} from "@/types/reaction";

type ReactionRequestBody = {
  predictionId?: unknown;
  action?: unknown;
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

function isValidAction(
  value: unknown,
): value is ReactionAction {
  return (
    value === "like" ||
    value === "dislike" ||
    value === "remove"
  );
}

function getReactionType(
  action: ReactionAction,
): ReactionType | null {
  if (action === "like") {
    return "like";
  }

  if (action === "dislike") {
    return "dislike";
  }

  return null;
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
      (await request.json()) as ReactionRequestBody;

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

    if (
      !isValidAction(
        body.action,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz tepki işlemi.",
        },
        {
          status: 400,
        },
      );
    }

    const predictionId =
      body.predictionId.trim();

    const reaction =
      getReactionType(
        body.action,
      );

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
        "Reaction user lookup error:",
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
        "Reaction prediction lookup error:",
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

    if (body.action === "remove") {
      const { error } =
        await supabase
          .from("reactions")
          .delete()
          .eq(
            "user_id",
            user.id,
          )
          .eq(
            "prediction_id",
            predictionId,
          );

      if (error) {
        console.error(
          "Reaction delete error:",
          error,
        );

        return NextResponse.json(
          {
            success: false,
            message:
              "Tepki kaldırılamadı.",
          },
          {
            status: 500,
          },
        );
      }

      return NextResponse.json(
        {
          success: true,
          predictionId,
          reaction: null,
        },
        {
          status: 200,
        },
      );
    }

    const { data, error } =
      await supabase
        .from("reactions")
        .upsert(
          {
            user_id: user.id,
            prediction_id:
              predictionId,
            type: reaction,
          },
          {
            onConflict:
              "user_id,prediction_id",
          },
        )
        .select(
          "id, user_id, prediction_id, type, created_at, updated_at",
        )
        .single();

    if (error) {
      console.error(
        "Reaction upsert error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Tepki kaydedilemedi.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        predictionId,
        reaction:
          data?.type ?? null,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Reactions API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Tepki işlemi gerçekleştirilemedi.",
      },
      {
        status: 500,
      },
    );
  }
}