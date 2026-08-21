"use client";

import { useEffect, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import MatchList from "@/components/matches/MatchList";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";
import type { Match } from "@/types/match";

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadMatches() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch("/api/matches", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Maç verileri alınamadı.");
        }

        const data = (await response.json()) as {
          success: boolean;
          matches?: Match[];
        };

        if (!data.success || !data.matches) {
          throw new Error("Geçersiz maç verisi.");
        }

        if (!cancelled) {
          setMatches(data.matches);
        }
      } catch (loadError) {
        console.error("Matches page error:", loadError);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMatches();

    return () => {
      cancelled = true;
    };
  }, []);

  const firstGroup = matches.slice(0, 3);
  const secondGroup = matches.slice(3, 6);
  const remainingMatches = matches.slice(6);

  return (
    <main>
      <PageContainer>
        <section>
          <h2>⚽ Maçlar</h2>
          <p>
            Güncel futbol maçlarını incele ve tahminini oluştur.
          </p>
        </section>

        {loading && (
          <Loading
            text="Maçlar yükleniyor..."
            size="medium"
          />
        )}

        {!loading && error && (
          <EmptyState
            icon="⚠️"
            title="Maçlar yüklenemedi"
            description="Maç verileri şu anda alınamıyor. Lütfen biraz sonra tekrar dene."
          />
        )}

        {!loading && !error && matches.length === 0 && (
          <EmptyState
            icon="⚽"
            title="Bugün maç bulunamadı"
            description="Bugün için gösterilecek maç bulunmuyor."
          />
        )}

        {!loading && !error && matches.length > 0 && (
          <>
            {firstGroup.length > 0 && (
              <MatchList matches={firstGroup} />
            )}

            {matches.length > 3 && (
              <section
                className="ad-slot"
                aria-label="Reklam alanı"
              >
                <span>Reklam Alanı</span>
              </section>
            )}

            {secondGroup.length > 0 && (
              <MatchList matches={secondGroup} />
            )}

            {matches.length > 6 && (
              <section
                className="ad-slot"
                aria-label="Reklam alanı"
              >
                <span>Reklam Alanı</span>
              </section>
            )}

            {remainingMatches.length > 0 && (
              <MatchList matches={remainingMatches} />
            )}
          </>
        )}
      </PageContainer>
    </main>
  );
}