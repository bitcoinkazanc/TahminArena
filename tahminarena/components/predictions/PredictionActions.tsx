"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import type { PredictionReaction } from "@/types/prediction";

type PredictionActionsProps = {
  predictionId: string;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  currentReaction?: PredictionReaction | null;
  onReactionChange?: (
    reaction: PredictionReaction | null,
  ) => void;
};

export default function PredictionActions({
  predictionId,
  likesCount,
  dislikesCount,
  commentsCount,
  currentReaction = null,
  onReactionChange,
}: PredictionActionsProps) {
  const [reaction, setReaction] =
    useState<PredictionReaction | null>(
      currentReaction,
    );

  const [likes, setLikes] =
    useState(likesCount);

  const [dislikes, setDislikes] =
    useState(dislikesCount);

  function handleReaction(
    nextReaction: PredictionReaction,
  ) {
    if (reaction === nextReaction) {
      setReaction(null);

      if (nextReaction === "like") {
        setLikes((value) => Math.max(0, value - 1));
      } else {
        setDislikes((value) =>
          Math.max(0, value - 1),
        );
      }

      onReactionChange?.(null);
      return;
    }

    if (reaction === "like") {
      setLikes((value) => Math.max(0, value - 1));
    }

    if (reaction === "dislike") {
      setDislikes((value) =>
        Math.max(0, value - 1),
      );
    }

    if (nextReaction === "like") {
      setLikes((value) => value + 1);
    }

    if (nextReaction === "dislike") {
      setDislikes((value) => value + 1);
    }

    setReaction(nextReaction);
    onReactionChange?.(nextReaction);
  }

  return (
    <div
      className="prediction-actions"
      data-prediction-id={predictionId}
    >
      <div className="prediction-actions__buttons">
        <Button
          type="button"
          variant={
            reaction === "like"
              ? "primary"
              : "secondary"
          }
          onClick={() => handleReaction("like")}
          aria-pressed={reaction === "like"}
        >
          👍 Beğen {likes}
        </Button>

        <Button
          type="button"
          variant={
            reaction === "dislike"
              ? "danger"
              : "secondary"
          }
          onClick={() =>
            handleReaction("dislike")
          }
          aria-pressed={reaction === "dislike"}
        >
          👎 Beğenme {dislikes}
        </Button>
      </div>

      <div className="prediction-actions__comments">
        <span>💬 {commentsCount} yorum</span>
      </div>
    </div>
  );
}