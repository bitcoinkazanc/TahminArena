export type CouponStatus =
  | "Bekliyor"
  | "Kazandı"
  | "Kaybetti"
  | "İptal";

export type CouponSelection = {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  matchTime: string;
  option: "1" | "X" | "2";
};

export type Coupon = {
  id: string;
  userId: string;
  name?: string | null;
  selections: CouponSelection[];
  status: CouponStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateCouponInput = {
  name?: string;
  selections: CouponSelection[];
};