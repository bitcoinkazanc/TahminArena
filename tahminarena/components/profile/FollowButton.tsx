"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type FollowButtonProps = {
  username: string;
  initialFollowing?: boolean;
  onChange?: (following: boolean) => void;
};

export default function FollowButton({
  username,
  initialFollowing = false,
  onChange,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(
    initialFollowing,
  );

  const [loading, setLoading] = useState(false);

  async function handleFollow() {
    if (loading) {
      return;
    }

    const nextFollowing = !following;

    setLoading(true);

    try {
      const response = await fetch(
        "/api/follows",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            action: nextFollowing
              ? "follow"
              : "unfollow",
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Takip işlemi başarısız.",
        );
      }

      const data = (await response.json()) as {
        success: boolean;
        following?: boolean;
      };

      if (!data.success) {
        throw new Error(
          "Takip işlemi başarısız.",
        );
      }

      const followingState =
        typeof data.following === "boolean"
          ? data.following
          : nextFollowing;

      setFollowing(followingState);
      onChange?.(followingState);
    } catch (error) {
      console.error(
        "Follow button error:",
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
        following ? "secondary" : "primary"
      }
      fullWidth
      disabled={loading}
      onClick={handleFollow}
    >
      {loading
        ? "İşleniyor..."
        : following
          ? "Takibi Bırak"
          : "Takip Et"}
    </Button>
  );
}