"use client";

import { useState } from "react";
import ChatInput from "@/components/chat/ChatInput";
import Message from "@/components/chat/Message";
import EmptyState from "@/components/ui/EmptyState";
import type { ChatMessage } from "@/types/chat";

type ChatBoxProps = {
  initialMessages: ChatMessage[];
  currentUserId?: string;
};

export default function ChatBox({
  initialMessages,
  currentUserId,
}: ChatBoxProps) {
  const [messages, setMessages] =
    useState<ChatMessage[]>(
      initialMessages,
    );

  async function handleSubmit(
    text: string,
  ) {
    const response = await fetch(
      "/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        "Mesaj gönderilemedi.",
      );
    }

    const data = (await response.json()) as {
      success: boolean;
      message?: ChatMessage;
    };

    if (!data.success || !data.message) {
      throw new Error(
        "Geçersiz mesaj yanıtı.",
      );
    }

    setMessages((current) => [
      ...current,
      data.message as ChatMessage,
    ]);
  }

  return (
    <section className="chat-box">
      <div
        className="chat-box__messages"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <EmptyState
            icon="💬"
            title="Henüz mesaj yok"
            description="Sohbeti başlatan ilk kişi sen ol."
          />
        ) : (
          messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isOwnMessage={
                message.userId ===
                currentUserId
              }
            />
          ))
        )}
      </div>

      <ChatInput
        onSubmit={handleSubmit}
      />
    </section>
  );
}