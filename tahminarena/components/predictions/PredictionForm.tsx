"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import type { PredictionOption } from "@/types/prediction";

type PredictionFormProps = {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  onSubmit?: (option: PredictionOption) => void;
};

const options: Array<{
  value: PredictionOption;
  label: string;
  description: string;
}> = [
  {
    value: "1",
    label: "1",
    description: "Ev Sahibi",
  },
  {
    value: "X",
    label: "X",
    description: "Beraberlik",
  },
  {
    value: "2",
    label: "2",
    description: "Deplasman",
  },
];

export default function PredictionForm({
  matchId,
  homeTeam,
  awayTeam,
  onSubmit,
}: PredictionFormProps) {
  const [selectedOption, setSelectedOption] =
    useState<PredictionOption | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!selectedOption) {
      return;
    }

    onSubmit?.(selectedOption);
    setSubmitted(true);
  }

  return (
    <section
      className="prediction-form"
      data-match-id={matchId}
    >
      <div className="section-heading">
        <h2>🔮 Tahmin Yap</h2>

        <p>
          {homeTeam} - {awayTeam} maçındaki tahminini seç.
        </p>
      </div>

      <div
        className="prediction-options"
        role="radiogroup"
        aria-label="Tahmin seçeneği"
      >
        {options.map((option) => {
          const isSelected =
            selectedOption === option.value;

          return (
            <button
              key={option.value}
              type="button"
              className={`prediction-option ${
                isSelected
                  ? "prediction-option--selected"
                  : ""
              }`}
              onClick={() => {
                setSelectedOption(option.value);
                setSubmitted(false);
              }}
              role="radio"
              aria-checked={isSelected}
            >
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </button>
          );
        })}
      </div>

      <div className="prediction-form__action">
        <Button
          type="button"
          fullWidth
          disabled={!selectedOption || submitted}
          onClick={handleSubmit}
        >
          {submitted
            ? "Tahmin Gönderildi"
            : "Tahmini Gönder"}
        </Button>
      </div>

      {submitted && (
        <p
          className="prediction-form__success"
          role="status"
        >
          Tahminin seçildi. Veritabanı bağlantısı
          tamamlandığında sunucuya kaydedilecek.
        </p>
      )}
    </section>
  );
}