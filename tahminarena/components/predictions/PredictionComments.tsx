"use client";

import { useState } from "react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

type Comment = {
  id: string;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  text: string;
  createdAt: string;
};

type PredictionCommentsProps = {
  predictionId: string;
  comments: Comment[];
};

export default function PredictionComments({
  predictionId,
  comments: initialComments,
}: PredictionCommentsProps) {
  const [comments, setComments] =
    useState<Comment[]>(initialComments);

  const [text, setText] = useState("");

  const [submitting, setSubmitting] =
    useState(false);

  async function handleSubmit() {
    const trimmedText = text.trim();

    if (!trimmedText || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "/api/comments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            predictionId,
            text: trimmedText,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Yorum gönderilemedi.",
        );
      }

      const data = (await response.json()) as {
        success: boolean;
        comment?: Comment;
      };

      if (!data.success || !data.comment) {
        throw new Error(
          "Geçersiz yorum yanıtı.",
        );
      }

      setComments((current) => [
        ...current,
        data.comment as Comment,
      ]);

      setText("");
    } catch (error) {
      console.error(
        "Prediction comment error:",
        error,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="prediction-comments">
      <div className="section-heading">
        <h2>💬 Yorumlar</h2>

        <p>
          Bu tahmin hakkında düşünceni paylaş.
        </p>
      </div>

      <div className="prediction-comments__form">
        <textarea
          value={text}
          onChange={(event) =>
            setText(event.target.value)
          }
          placeholder="Yorumunu yaz..."
          maxLength={500}
          rows={3}
          disabled={submitting}
          aria-label="Yorum"
        />

        <div className="prediction-comments__form-footer">
          <span>{text.length}/500</span>

          <Button
            type="button"
            disabled={
              !text.trim() || submitting
            }
            onClick={handleSubmit}
          >
            {submitting
              ? "Gönderiliyor..."
              : "Yorum Gönder"}
          </Button>
        </div>
      </div>

      <div className="prediction-comments__list">
        {comments.length === 0 ? (
          <div className="empty-state">
            <strong>Henüz yorum yok</strong>

            <span>
              İlk yorumu sen yap.
            </span>
          </div>
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="prediction-comment"
            >
              <Avatar
                src={comment.avatarUrl}
                name={
                  comment.displayName ??
                  comment.username
                }
                alt={`${comment.displayName ?? comment.username} profil fotoğrafı`}
                size="small"
              />

              <div className="prediction-comment__content">
                <div className="prediction-comment__header">
                  <strong>
                    {comment.displayName ||
                      `@${comment.username}`}
                  </strong>

                  <time>
                    {comment.createdAt}
                  </time>
                </div>

                <p>{comment.text}</p>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}