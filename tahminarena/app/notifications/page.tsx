"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import NotificationItem from "@/components/notifications/NotificationItem";
import EmptyState from "@/components/ui/EmptyState";
import type { Notification } from "@/types/notification";

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
    createdAt: new Date(
      Date.now() - 5 * 60 * 1000,
    ).toISOString(),
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
    createdAt: new Date(
      Date.now() - 20 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: "notification-3",
    userId: "demo-user",
    type: "comment",
    title: "Yeni yorum",
    message:
      "@futbolsever tahminine yorum yaptı.",
    actorUserId: "demo-user-1",
    actorUsername: "futbolsever",
    predictionId:
      "demo-prediction-1",
    read: true,
    createdAt: new Date(
      Date.now() - 60 * 60 * 1000,
    ).toISOString(),
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(
      demoNotifications,
    );

  function markAsRead(
    notificationId: string,
  ) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id ===
        notificationId
          ? {
              ...notification,
              read: true,
            }
          : notification,
      ),
    );
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  }

  const unreadCount =
    notifications.filter(
      (notification) => !notification.read,
    ).length;

  return (
    <main>
      <PageContainer>
        <section>
          <div className="section-heading">
            <h2>🔔 Bildirimler</h2>

            <p>
              Takip, beğeni, yorum ve tahmin
              sonuçlarını buradan takip et.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              className="ui-button ui-button--secondary"
              onClick={markAllAsRead}
            >
              Tümünü Okundu İşaretle
            </button>
          )}
        </section>

        {notifications.length === 0 ? (
          <EmptyState
            icon="🔔"
            title="Henüz bildirimin yok"
            description="Yeni etkileşimler olduğunda bildirimlerin burada görünecek."
          />
        ) : (
          <section
            className="notifications-list"
            aria-label="Bildirimler"
          >
            {notifications.map(
              (notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={
                    notification
                  }
                  onRead={markAsRead}
                />
              ),
            )}
          </section>
        )}
      </PageContainer>
    </main>
  );
}