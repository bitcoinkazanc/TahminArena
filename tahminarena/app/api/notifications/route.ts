import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getTelegramAuthFromRequest } from "@/lib/telegram/server";

type NotificationAction =
  | "read"
  | "read_all";

type NotificationRequestBody = {
  action?: unknown;
  notificationId?: unknown;
};

function isValidAction(
  value: unknown,
): value is NotificationAction {
  return (
    value === "read" ||
    value === "read_all"
  );
}

function isValidNotificationId(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= 100
  );
}

async function getCurrentUserId(
  request: NextRequest,
) {
  const telegramAuth =
    getTelegramAuthFromRequest(
      request,
    );

  if (
    !telegramAuth.valid ||
    !telegramAuth.user
  ) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message:
            "Telegram oturumu doğrulanamadı.",
        },
        {
          status: 401,
        },
      ),
      userId: null,
    };
  }

  const supabase =
    getSupabaseServerClient();

  const { data: user, error } =
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

  if (error) {
    console.error(
      "Notification user lookup error:",
      error,
    );

    return {
      error: NextResponse.json(
        {
          success: false,
          message:
            "Kullanıcı doğrulanamadı.",
        },
        {
          status: 500,
        },
      ),
      userId: null,
    };
  }

  if (!user) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message:
            "Kullanıcı profili bulunamadı.",
        },
        {
          status: 404,
        },
      ),
      userId: null,
    };
  }

  return {
    error: null,
    userId: user.id,
  };
}

export async function GET(
  request: NextRequest,
) {
  try {
    const {
      error,
      userId,
    } = await getCurrentUserId(
      request,
    );

    if (error || !userId) {
      return error;
    }

    const supabase =
      getSupabaseServerClient();

    const { data, error: notificationsError } =
      await supabase
        .from("notifications")
        .select(
          `
            id,
            user_id,
            actor_user_id,
            type,
            title,
            message,
            reference_id,
            is_read,
            created_at
          `,
        )
        .eq(
          "user_id",
          userId,
        )
        .order(
          "created_at",
          {
            ascending: false,
          },
        )
        .limit(100);

    if (notificationsError) {
      console.error(
        "Notifications GET Supabase error:",
        notificationsError,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Bildirimler alınamadı.",
        },
        {
          status: 500,
        },
      );
    }

    const unreadCount =
      (data ?? []).filter(
        (
          notification,
        ) =>
          !notification.is_read,
      ).length;

    return NextResponse.json(
      {
        success: true,
        notifications:
          data ?? [],
        unreadCount,
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
      "Notifications GET API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Bildirimler alınamadı.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: NextRequest,
) {
  try {
    const {
      error,
      userId,
    } = await getCurrentUserId(
      request,
    );

    if (error || !userId) {
      return error;
    }

    const body =
      (await request.json()) as NotificationRequestBody;

    if (
      !isValidAction(
        body.action,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz bildirim işlemi.",
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      getSupabaseServerClient();

    if (
      body.action ===
      "read_all"
    ) {
      const { error: updateError } =
        await supabase
          .from("notifications")
          .update({
            is_read: true,
          })
          .eq(
            "user_id",
            userId,
          )
          .eq(
            "is_read",
            false,
          );

      if (updateError) {
        console.error(
          "Notifications read all error:",
          updateError,
        );

        return NextResponse.json(
          {
            success: false,
            message:
              "Bildirimler okundu olarak işaretlenemedi.",
          },
          {
            status: 500,
          },
        );
      }

      return NextResponse.json(
        {
          success: true,
          action:
            "read_all",
        },
        {
          status: 200,
        },
      );
    }

    if (
      !isValidNotificationId(
        body.notificationId,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz bildirim ID'si.",
        },
        {
          status: 400,
        },
      );
    }

    const notificationId =
      body.notificationId.trim();

    const { data, error: updateError } =
      await supabase
        .from("notifications")
        .update({
          is_read: true,
        })
        .eq(
          "id",
          notificationId,
        )
        .eq(
          "user_id",
          userId,
        )
        .select(
          "id, is_read",
        )
        .maybeSingle();

    if (updateError) {
      console.error(
        "Notification read error:",
        updateError,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Bildirim okundu olarak işaretlenemedi.",
        },
        {
          status: 500,
        },
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Bildirim bulunamadı.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        action: "read",
        notification: data,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Notifications PATCH API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Bildirim işlemi gerçekleştirilemedi.",
      },
      {
        status: 500,
      },
    );
  }
}