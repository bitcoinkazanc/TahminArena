import Link from "next/link";
import type { Notification } from "@/types/notification";

type NotificationItemProps = {
  notification: Notification;
  onRead?: (notificationId: string) => void;
};

function getIcon(
  type: Notification["type"],
): string {
  if (type === "follow") {
    return "👤";
  }

  if (type === "like") {
    return "👍";
  }

  if (type === "dislike") {
    return "👎";
  }

  if (type === "comment") {
    return "💬";
  }

  if (type === "prediction_result") {
    return "🔮";
  }

  return "🔔";
}

function getHref(
  notification: Notification,
): string | null {
  if (notification.predictionId) {
    return `/predictions/${encodeURIComponent(
      notification.predictionId,
    )}`;
  }

  if (
    notification.actorUsername
  ) {
    return `/profile/${encodeURIComponent(
      notification.actorUsername,
    )}`;
  }

  return null;
}

export default function NotificationItem({
  notification,
  onRead,
}: NotificationItemProps) {
  const href = getHref(notification);

  function handleClick() {
    if (!notification.read) {
      onRead?.(notification.id);
    }
  }

  const content = (
    <>
      <div
        className="notification-item__icon"
        aria-hidden="true"
      >
        {getIcon(notification.type)}
      </div>

      <div className="notification-item__content">
        <strong>
          {notification.title}
        </strong>

        <p>{notification.message}</p>

        <time dateTime={notification.createdAt}>
          {new Date(
            notification.createdAt,
          ).toLocaleString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>

      {!notification.read && (
        <span
          className="notification-item__unread"
          aria-label="Okunmamış bildirim"
        />
      )}
    </>
  );

  return href ? (
    <Link
      href={href}
      className={`notification-item ${
        !notification.read
          ? "notification-item--unread"
          : ""
      }`}
      onClick={handleClick}
    >
      {content}
    </Link>
  ) : (
    <article
      className={`notification-item ${
        !notification.read
          ? "notification-item--unread"
          : ""
      }`}
      onClick={handleClick}
    >
      {content}
    </article>
  );
}