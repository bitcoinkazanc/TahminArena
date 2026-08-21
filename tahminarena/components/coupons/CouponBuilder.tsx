"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import type { CouponSelection } from "@/types/coupon";
import type { Match, MatchPredictionOption } from "@/types/match";

type CouponBuilderProps = {
  matches: Match[];
  onSubmit?: (
    selections: CouponSelection[],
  ) => void;
};

function formatMatchTime(dateTime: string): string {
  if (!dateTime) {
    return "--:--";
  }

  const date = new Date(dateTime);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return date.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const options: Array<{
  value: MatchPredictionOption;
  label: string;
}> = [
  {
    value: "1",
    label: "1",
  },
  {
    value: "X",
    label: "X",
  },
  {
    value: "2",
    label: "2",
  },
];

export default function CouponBuilder({
  matches,
  onSubmit,
}: CouponBuilderProps) {
  const [selections, setSelections] =
    useState<Record<string, MatchPredictionOption>>(
      {},
    );

  const selectedCount = Object.keys(
    selections,
  ).length;

  const selectedMatches = useMemo(
    () =>
      matches.filter(
        (match) => selections[match.id],
      ),
    [matches, selections],
  );

  function handleOptionChange(
    match: Match,
    option: MatchPredictionOption,
  ) {
    setSelections((current) => ({
      ...current,
      [match.id]: option,
    }));
  }

  function handleClearMatch(matchId: string) {
    setSelections((current) => {
      const next = { ...current };
      delete next[matchId];
      return next;
    });
  }

  function handleSubmit() {
    if (selectedMatches.length === 0) {
      return;
    }

    const couponSelections: CouponSelection[] =
      selectedMatches.map((match) => ({
        matchId: match.id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        matchTime: formatMatchTime(
          match.dateTime,
        ),
        option: selections[match.id],
      }));

    onSubmit?.(couponSelections);
  }

  return (
    <section className="coupon-builder">
      <div className="section-heading">
        <h2>🎫 Kupon Oluştur</h2>

        <p>
          Kuponuna eklemek istediğin maçları seç.
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="empty-state">
          <strong>Maç bulunamadı</strong>

          <span>
            Kupon oluşturmak için önce maçların
            yüklenmesi gerekiyor.
          </span>
        </div>
      ) : (
        <div className="coupon-builder__matches">
          {matches.map((match) => {
            const selectedOption =
              selections[match.id];

            return (
              <article
                key={match.id}
                className="coupon-builder__match"
              >
                <div className="coupon-builder__match-header">
                  <div>
                    <strong>
                      {match.homeTeam}
                    </strong>

                    <span> vs </span>

                    <strong>
                      {match.awayTeam}
                    </strong>
                  </div>

                  <span>
                    {formatMatchTime(
                      match.dateTime,
                    )}
                  </span>
                </div>

                <div
                  className="coupon-builder__options"
                  role="radiogroup"
                  aria-label={`${match.homeTeam} - ${match.awayTeam} tahmini`}
                >
                  {options.map((option) => {
                    const isSelected =
                      selectedOption ===
                      option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={`coupon-builder__option ${
                          isSelected
                            ? "coupon-builder__option--selected"
                            : ""
                        }`}
                        onClick={() =>
                          handleOptionChange(
                            match,
                            option.value,
                          )
                        }
                        role="radio"
                        aria-checked={
                          isSelected
                        }
                      >
                        {option.label}
                      </button>
                    );
                  })}

                  {selectedOption && (
                    <button
                      type="button"
                      className="coupon-builder__clear"
                      onClick={() =>
                        handleClearMatch(
                          match.id,
                        )
                      }
                      aria-label="Maçı kupondan çıkar"
                    >
                      ×
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="coupon-builder__footer">
        <span>
          {selectedCount} maç seçildi
        </span>

        <Button
          type="button"
          fullWidth
          disabled={selectedCount === 0}
          onClick={handleSubmit}
        >
          Kuponu Oluştur
        </Button>
      </div>
    </section>
  );
}