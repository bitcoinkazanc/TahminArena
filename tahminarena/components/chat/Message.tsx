import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import type { ChatMessage } from "@/types/chat";

type MessageProps = {
  message: ChatMessage;
  isOwnMessage?: boolean;
};

export default function Message({
  message,
  isOwnMessage = false,
}: MessageProps) {
  return (
    <article
      className={`chat-message ${
        isOwnMessage
          ? "chat-message--own"
          : ""
      }`}
    >
      <Avatar
        src={message.avatarUrl}
        name={
          message.displayName ??
          message.username
        }
        alt={`${message.displayName ?? message.username} profil fotoğrafı`}
        size="small"
      />

      <div className="chat-message__content">
        <div className="chat-message__header">
          <Link
            href={`/profile/${encodeURIComponent(message.username)}`}
            className="chat-message__username"
          >
            {message.displayName ||
              `@${message.username}`}
          </Link>

          <time
            className="chat-message__time"
            dateTime={message.createdAt}
          >
            {new Date(
              message.createdAt,
            ).toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>

        <p className="chat-message__text">
          {message.text}
        </p>
      </div>
    </article>
  );
}