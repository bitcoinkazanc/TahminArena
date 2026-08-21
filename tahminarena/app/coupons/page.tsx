"use client";

import { useEffect, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import CouponList from "@/components/coupons/CouponList";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";
import type { Coupon } from "@/types/coupon";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCoupons() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          "/api/coupons",
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            "Kuponlar alınamadı.",
          );
        }

        const data = (await response.json()) as {
          success: boolean;
          coupons?: Coupon[];
        };

        if (
          !data.success ||
          !Array.isArray(data.coupons)
        ) {
          throw new Error(
            "Geçersiz kupon verisi.",
          );
        }

        if (!cancelled) {
          setCoupons(data.coupons);
        }
      } catch (loadError) {
        console.error(
          "Coupons page error:",
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

    loadCoupons();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <PageContainer>
        <section>
          <h2>🎫 Kuponlar</h2>

          <p>
            Oluşturduğun kuponları görüntüle ve
            sonuçlarını takip et.
          </p>
        </section>

        {loading && (
          <Loading
            text="Kuponlar yükleniyor..."
            size="medium"
          />
        )}

        {!loading && error && (
          <EmptyState
            icon="⚠️"
            title="Kuponlar yüklenemedi"
            description="Kupon verileri şu anda alınamıyor. Lütfen biraz sonra tekrar dene."
          />
        )}

        {!loading && !error && (
          <CouponList coupons={coupons} />
        )}
      </PageContainer>
    </main>
  );
}