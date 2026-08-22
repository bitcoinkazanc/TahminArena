import { NextRequest, NextResponse } from "next/server";
import type {
  Notification,
  NotificationAction,
} from "@/types/notification";

type NotificationRequestBody = {
  action?: unknown;
  notificationId?: unknown;
};

const demoNotifications: Notification[] = [
  {
    id: "notification-1",
    userId: "demo-user",
    type: "follow",
    title: "Yeni takipçi",
    message:
      "@futbolsever seni takip etmeye başladı.",
    actorUserId: "demo-user-1",
    actorUsername: "futbolsever",
    predictionId: null,
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "notification-2",
    userId: "demo-user",
    type: "like",
    title: "Tahminin beğenildi",
    message:
      "@tahminci tahminini beğendi.",
    actorUserId: "demo-user-2",
    actorUsername: "tahminci",
    predictionId:
      "demo-prediction-1",
    read: false,
    createdAt: new Date().toISOString(),
  },
];

function isValidAction(
  value: unknown,
): value is NotificationAction {
  return (
    value === "mark_read" ||
    value === "mark_all_read"
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

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      notifications: demoNotifications,
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

export async function PATCH(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as NotificationRequestBody;

    if (!isValidAction(body.action)) {
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

    if (
      body.action === "mark_read" &&
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

    return NextResponse.json(
      {
        success: true,
        action: body.action,
        notificationId:
          body.notificationId ?? null,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Notifications API error:",
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