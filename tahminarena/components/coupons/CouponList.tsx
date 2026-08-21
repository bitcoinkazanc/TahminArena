import CouponCard from "@/components/coupons/CouponCard";
import EmptyState from "@/components/ui/EmptyState";
import type { Coupon } from "@/types/coupon";

type CouponListProps = {
  coupons: Coupon[];
};

export default function CouponList({
  coupons,
}: CouponListProps) {
  if (coupons.length === 0) {
    return (
      <EmptyState
        icon="🎫"
        title="Henüz kupon yok"
        description="Maçlardan seçim yaparak ilk kuponunu oluşturabilirsin."
      />
    );
  }

  return (
    <section
      className="coupon-list"
      aria-label="Kuponlar"
    >
      {coupons.map((coupon) => (
        <CouponCard
          key={coupon.id}
          coupon={coupon}
        />
      ))}
    </section>
  );
}