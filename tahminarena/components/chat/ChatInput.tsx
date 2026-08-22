"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type ChatInputProps = {
  onSubmit?: (text: string) => Promise<void> | void;
  placeholder?: string;
  disabled?: boolean;
};

export default function ChatInput({
  onSubmit,
  placeholder = "Mesajını yaz...",
  disabled = false,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  async function handleSubmit() {
    const trimmedText = text.trim();

    if (
      !trimmedText ||
      submitting ||
      disabled
    ) {
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit?.(trimmedText);
      setText("");
    } catch (error) {
      console.error(
        "Chat input error:",
        error,
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      void handleSubmit();
    }
  }

  return (
    <div className="chat-input">
      <textarea
        value={text}
        onChange={(event) =>
          setText(event.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={500}
        rows={2}
        disabled={disabled || submitting}
        aria-label="Mesaj"
      />

      <div className="chat-input__footer">
        <span>{text.length}/500</span>

        <Button
          type="button"
          disabled={
            !text.trim() ||
            submitting ||
            disabled
          }
          onClick={() => void handleSubmit()}
        >
          {submitting
            ? "Gönderiliyor..."
            : "Gönder"}
        </Button>
      </div>
    </div>
  );
}