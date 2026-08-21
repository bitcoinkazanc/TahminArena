import Link from "next/link";
import type { Coupon, CouponStatus } from "@/types/coupon";

type CouponCardProps = {
  coupon: Coupon;
};

function getStatusLabel(
  status: CouponStatus,
): string {
  if (status === "Kazandı") {
    return "Kazandı";
  }

  if (status === "Kaybetti") {
    return "Kaybetti";
  }

  if (status === "İptal") {
    return "İptal";
  }

  return "Bekliyor";
}

export default function CouponCard({
  coupon,
}: CouponCardProps) {
  return (
    <article className="coupon-card">
      <div className="coupon-card__header">
        <div>
          <h3 className="coupon-card__title">
            {coupon.name || "Kupon"}
          </h3>

          <span className="coupon-card__count">
            {coupon.selections.length} maç
          </span>
        </div>

        <span
          className={`coupon-card__status coupon-card__status--${coupon.status.toLowerCase()}`}
        >
          {getStatusLabel(coupon.status)}
        </span>
      </div>

      <div className="coupon-card__selections">
        {coupon.selections.map((selection) => (
          <Link
            key={selection.matchId}
            href={`/matches/${selection.matchId}`}
            className="coupon-card__selection"
          >
            <div className="coupon-card__teams">
              <span>{selection.homeTeam}</span>
              <strong>VS</strong>
              <span>{selection.awayTeam}</span>
            </div>

            <div className="coupon-card__prediction">
              {selection.option}
            </div>
          </Link>
        ))}
      </div>

      <div className="coupon-card__footer">
        <span>
          {new Date(coupon.createdAt).toLocaleDateString(
            "tr-TR",
          )}
        </span>

        <Link
          href={`/coupons/${coupon.id}`}
          className="coupon-card__detail"
        >
          Detay →
        </Link>
      </div>
    </article>
  );
}