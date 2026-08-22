"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import type {
  ReportReason,
  ReportTargetType,
} from "@/types/report";

type ReportPageProps = {
  searchParams?: {
    targetType?: string;
    targetId?: string;
  };
};

const reasons: Array<{
  value: ReportReason;
  label: string;
}> = [
  {
    value: "spam",
    label: "Spam",
  },
  {
    value: "harassment",
    label: "Taciz / Rahatsız Etme",
  },
  {
    value: "inappropriate",
    label: "Uygunsuz İçerik",
  },
  {
    value: "fake",
    label: "Sahte / Yanıltıcı İçerik",
  },
  {
    value: "other",
    label: "Diğer",
  },
];

const targetTypes: ReportTargetType[] = [
  "user",
  "prediction",
  "comment",
  "message",
];

function isValidTargetType(
  value?: string,
): value is ReportTargetType {
  return (
    typeof value === "string" &&
    targetTypes.includes(
      value as ReportTargetType,
    )
  );
}

export default function ReportPage({
  searchParams,
}: ReportPageProps) {
  const targetType = isValidTargetType(
    searchParams?.targetType,
  )
    ? searchParams?.targetType
    : null;

  const targetId =
    typeof searchParams?.targetId ===
    "string"
      ? searchParams.targetId
      : "";

  const [reason, setReason] =
    useState<ReportReason | null>(null);

  const [description, setDescription] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  async function handleSubmit() {
    if (
      !targetType ||
      !targetId ||
      !reason ||
      submitting
    ) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "/api/reports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetType,
            targetId,
            reason,
            description:
              description.trim(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Bildirim gönderilemedi.",
        );
      }

      const data = (await response.json()) as {
        success: boolean;
      };

      if (!data.success) {
        throw new Error(
          "Bildirim gönderilemedi.",
        );
      }

      setSubmitted(true);
    } catch (error) {
      console.error(
        "Report page error:",
        error,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <PageContainer>
        <section>
          <div className="section-heading">
            <h2>🚩 Bildir</h2>

            <p>
              Uygunsuz veya kurallara aykırı
              içerikleri moderasyon ekibine
              bildirebilirsin.
            </p>
          </div>
        </section>

        {!targetType || !targetId ? (
          <EmptyState
            icon="⚠️"
            title="Bildirilecek içerik bulunamadı"
            description="Geçerli bir kullanıcı, tahmin, yorum veya mesaj seçerek tekrar dene."
          />
        ) : submitted ? (
          <EmptyState
            icon="✅"
            title="Bildirimin alındı"
            description="Bildirim moderasyon ekibi tarafından incelenecek."
          />
        ) : (
          <section className="report-form">
            <div className="report-form__target">
              <span>İçerik türü</span>
              <strong>{targetType}</strong>
            </div>

            <div className="report-form__reasons">
              <span className="report-form__label">
                Bildirim nedeni
              </span>

              <div
                className="report-form__options"
                role="radiogroup"
                aria-label="Bildirim nedeni"
              >
                {reasons.map((item) => {
                  const selected =
                    reason === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      className={`report-form__option ${
                        selected
                          ? "report-form__option--selected"
                          : ""
                      }`}
                      onClick={() =>
                        setReason(
                          item.value,
                        )
                      }
                      role="radio"
                      aria-checked={selected}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="report-form__field">
              <span>
                Açıklama
              </span>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                placeholder="İstersen bildiriminle ilgili ek bilgi yaz..."
                maxLength={500}
                rows={5}
                disabled={submitting}
              />

              <small>
                {description.length}/500
              </small>
            </label>

            <Button
              type="button"
              fullWidth
              disabled={
                !reason || submitting
              }
              onClick={() =>
                void handleSubmit()
              }
            >
              {submitting
                ? "Gönderiliyor..."
                : "Bildirimi Gönder"}
            </Button>
          </section>
        )}
      </PageContainer>
    </main>
  );
}