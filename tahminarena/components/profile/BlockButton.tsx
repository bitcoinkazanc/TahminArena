"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type BlockButtonProps = {
  username: string;
  initialBlocked?: boolean;
  onChange?: (blocked: boolean) => void;
};

export default function BlockButton({
  username,
  initialBlocked = false,
  onChange,
}: BlockButtonProps) {
  const [blocked, setBlocked] =
    useState(initialBlocked);

  const [loading, setLoading] =
    useState(false);

  async function handleBlock() {
    if (loading) {
      return;
    }

    const nextBlocked = !blocked;

    setLoading(true);

    try {
      const response = await fetch(
        "/api/blocks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            action: nextBlocked
              ? "block"
              : "unblock",
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Engelleme işlemi başarısız.",
        );
      }

      const data = (await response.json()) as {
        success: boolean;
        blocked?: boolean;
      };

      if (!data.success) {
        throw new Error(
          "Engelleme işlemi başarısız.",
        );
      }

      const blockedState =
        typeof data.blocked === "boolean"
          ? data.blocked
          : nextBlocked;

      setBlocked(blockedState);
      onChange?.(blockedState);
    } catch (error) {
      console.error(
        "Block button error:",
        error,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant={
        blocked ? "secondary" : "danger"
      }
      fullWidth
      disabled={loading}
      onClick={() => void handleBlock()}
    >
      {loading
        ? "İşleniyor..."
        : blocked
          ? "Engeli Kaldır"
          : "Kullanıcıyı Engelle"}
    </Button>
  );
}