import { NextRequest, NextResponse } from "next/server";
import type {
  Coupon,
  CouponSelection,
} from "@/types/coupon";

type CreateCouponBody = {
  name?: unknown;
  selections?: unknown;
};

function isValidSelection(
  value: unknown,
): value is CouponSelection {
  if (!value || typeof value !== "object") {
    return false;
  }

  const selection =
    value as Partial<CouponSelection>;

  return (
    typeof selection.matchId === "string" &&
    selection.matchId.trim().length > 0 &&
    typeof selection.homeTeam === "string" &&
    selection.homeTeam.trim().length > 0 &&
    typeof selection.awayTeam === "string" &&
    selection.awayTeam.trim().length > 0 &&
    typeof selection.matchTime === "string" &&
    selection.matchTime.trim().length > 0 &&
    (selection.option === "1" ||
      selection.option === "X" ||
      selection.option === "2")
  );
}

function isValidSelections(
  value: unknown,
): value is CouponSelection[] {
  return (
    Array.isArray(value) &&
    value.length >= 1 &&
    value.length <= 20 &&
    value.every(isValidSelection)
  );
}

function createDemoCoupon(
  selections: CouponSelection[],
  name?: string,
): Coupon {
  const now = new Date().toISOString();

  return {
    id: `demo-coupon-${Date.now()}`,
    userId: "demo-user",
    name:
      typeof name === "string" &&
      name.trim().length > 0
        ? name.trim().slice(0, 100)
        : "Yeni Kupon",
    selections,
    status: "Bekliyor",
    createdAt: now,
    updatedAt: now,
  };
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      coupons: [],
    },
    {
      status: 200,
      headers: {
        "Cache-Control":
          "no-store",
      },
    },
  );
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as CreateCouponBody;

    if (!isValidSelections(body.selections)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "En az 1, en fazla 20 geçerli maç seçimi eklenmelidir.",
        },
        {
          status: 400,
        },
      );
    }

    const coupon = createDemoCoupon(
      body.selections,
      typeof body.name === "string"
        ? body.name
        : undefined,
    );

    return NextResponse.json(
      {
        success: true,
        coupon,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Coupons API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Kupon işlemi gerçekleştirilemedi.",
      },
      {
        status: 500,
      },
    );
  }
}