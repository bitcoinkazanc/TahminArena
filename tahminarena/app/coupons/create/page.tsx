"use client";

import { useEffect, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import CouponBuilder from "@/components/coupons/CouponBuilder";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";
import type { Match } from "@/types/match";
import type { CouponSelection } from "@/types/coupon";

export default function CreateCouponPage() {
  const [matches, setMatches] = useState<Match[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [created, setCreated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadMatches() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          "/api/matches",
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            "Maçlar alınamadı.",
          );
        }

        const data = (await response.json()) as {
          success: boolean;
          matches?: Match[];
        };

        if (
          !data.success ||
          !Array.isArray(data.matches)
        ) {
          throw new Error(
            "Geçersiz maç verisi.",
          );
        }

        if (!cancelled) {
          setMatches(data.matches);
        }
      } catch (loadError) {
        console.error(
          "Create coupon matches error:",
          loadError,
        );

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

  async function handleCreateCoupon(
    selections: CouponSelection[],
  ) {
    if (selections.length === 0) {
      return;
    }

    try {
      const response = await fetch(
        "/api/coupons",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selections,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Kupon oluşturulamadı.",
        );
      }

      const data = (await response.json()) as {
        success: boolean;
      };

      if (!data.success) {
        throw new Error(
          "Kupon oluşturma başarısız.",
        );
      }

      setCreated(true);
    } catch (createError) {
      console.error(
        "Create coupon error:",
        createError,
      );
    }
  }

  return (
    <main>
      <PageContainer>
        <section>
          <h2>🎫 Yeni Kupon</h2>

          <p>
            Maçlarını seç ve tahminlerinden kupon
            oluştur.
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
            description="Kupon oluşturmak için maç verileri alınamadı."
          />
        )}

        {!loading && !error && created && (
          <EmptyState
            icon="✅"
            title="Kupon oluşturuldu"
            description="Kuponun başarıyla oluşturuldu. Kuponlar sayfasından takip edebilirsin."
          />
        )}

        {!loading && !error && !created && (
          <CouponBuilder
            matches={matches}
            onSubmit={handleCreateCoupon}
          />
        )}
      </PageContainer>
    </main>
  );
}