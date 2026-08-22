import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getTelegramAuthFromRequest } from "@/lib/telegram/server";

type CouponSelection = {
  matchId?: unknown;
  option?: unknown;
};

type CouponRequestBody = {
  name?: unknown;
  selections?: unknown;
};

function isValidOption(
  value: unknown,
): value is "1" | "X" | "2" {
  return (
    value === "1" ||
    value === "X" ||
    value === "2"
  );
}

function isValidMatchId(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= 100
  );
}

function isValidName(
  value: unknown,
): value is string {
  return (
    value === undefined ||
    value === null ||
    (
      typeof value === "string" &&
      value.trim().length <= 100
    )
  );
}

function isValidSelections(
  value: unknown,
): value is CouponSelection[] {
  if (!Array.isArray(value)) {
    return false;
  }

  if (
    value.length < 2 ||
    value.length > 20
  ) {
    return false;
  }

  const matchIds =
    new Set<string>();

  for (const selection of value) {
    if (
      typeof selection !==
        "object" ||
      selection === null
    ) {
      return false;
    }

    const item =
      selection as CouponSelection;

    if (
      !isValidMatchId(
        item.matchId,
      ) ||
      !isValidOption(
        item.option,
      )
    ) {
      return false;
    }

    const matchId =
      item.matchId.trim();

    if (
      matchIds.has(matchId)
    ) {
      return false;
    }

    matchIds.add(matchId);
  }

  return true;
}

async function getCurrentUserId(
  request: NextRequest,
) {
  const telegramAuth =
    getTelegramAuthFromRequest(
      request,
    );

  if (
    !telegramAuth.valid ||
    !telegramAuth.user
  ) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message:
            "Telegram oturumu doğrulanamadı.",
        },
        {
          status: 401,
        },
      ),
      userId: null,
    };
  }

  const supabase =
    getSupabaseServerClient();

  const { data: user, error } =
    await supabase
      .from("users")
      .select("id")
      .eq(
        "telegram_id",
        String(
          telegramAuth.user.id,
        ),
      )
      .maybeSingle();

  if (error) {
    console.error(
      "Coupon user lookup error:",
      error,
    );

    return {
      error: NextResponse.json(
        {
          success: false,
          message:
            "Kullanıcı doğrulanamadı.",
        },
        {
          status: 500,
        },
      ),
      userId: null,
    };
  }

  if (!user) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message:
            "Önce kullanıcı profili oluşturmalısın.",
        },
        {
          status: 404,
        },
      ),
      userId: null,
    };
  }

  return {
    error: null,
    userId: user.id,
  };
}

export async function GET(
  request: NextRequest,
) {
  try {
    const {
      error,
      userId,
    } = await getCurrentUserId(
      request,
    );

    if (error || !userId) {
      return error;
    }

    const supabase =
      getSupabaseServerClient();

    const { data, error: couponsError } =
      await supabase
        .from("coupons")
        .select(
          `
            id,
            user_id,
            name,
            status,
            created_at,
            updated_at,
            coupon_selections (
              id,
              match_id,
              option,
              created_at
            )
          `,
        )
        .eq(
          "user_id",
          userId,
        )
        .order(
          "created_at",
          {
            ascending: false,
          },
        )
        .limit(50);

    if (couponsError) {
      console.error(
        "Coupons GET Supabase error:",
        couponsError,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Kuponlar alınamadı.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        coupons:
          data ?? [],
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "Coupons GET API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Kuponlar alınamadı.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const {
      error,
      userId,
    } = await getCurrentUserId(
      request,
    );

    if (error || !userId) {
      return error;
    }

    const body =
      (await request.json()) as CouponRequestBody;

    if (
      !isValidName(
        body.name,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz kupon adı.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !isValidSelections(
        body.selections,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Kupon seçimleri geçersiz. En az 2, en fazla 20 maç seçmelisin.",
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      getSupabaseServerClient();

    const selections =
      body.selections.map(
        (selection) => ({
          matchId:
            selection.matchId.trim(),
          option:
            selection.option,
        }),
      );

    const matchIds =
      selections.map(
        (selection) =>
          selection.matchId,
      );

    const { data: matches, error: matchesError } =
      await supabase
        .from("matches")
        .select(
          "id, date_time, status",
        )
        .in(
          "id",
          matchIds,
        );

    if (matchesError) {
      console.error(
        "Coupon matches lookup error:",
        matchesError,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Maçlar doğrulanamadı.",
        },
        {
          status: 500,
        },
      );
    }

    if (
      !matches ||
      matches.length !==
        matchIds.length
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Seçilen maçlardan biri veya birkaçı bulunamadı.",
        },
        {
          status: 404,
        },
      );
    }

    const now =
      Date.now();

    const hasStartedMatch =
      matches.some(
        (match) =>
          new Date(
            match.date_time,
          ).getTime() <= now ||
          match.status ===
            "Canlı" ||
          match.status ===
            "Bitti",
      );

    if (hasStartedMatch) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Başlamış veya tamamlanmış maçlar kupona eklenemez.",
        },
        {
          status: 409,
        },
      );
    }

    const couponName =
      typeof body.name ===
        "string"
        ? body.name.trim() ||
          null
        : null;

    const { data: coupon, error: couponError } =
      await supabase
        .from("coupons")
        .insert({
          user_id: userId,
          name: couponName,
          status: "Bekliyor",
        })
        .select(
          "id, user_id, name, status, created_at, updated_at",
        )
        .single();

    if (couponError) {
      console.error(
        "Coupon insert error:",
        couponError,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Kupon oluşturulamadı.",
        },
        {
          status: 500,
        },
      );
    }

    const selectionRows =
      selections.map(
        (selection) => ({
          coupon_id:
            coupon.id,
          match_id:
            selection.matchId,
          option:
            selection.option,
        }),
      );

    const {
      data: insertedSelections,
      error: selectionError,
    } = await supabase
      .from("coupon_selections")
      .insert(
        selectionRows,
      )
      .select(
        "id, coupon_id, match_id, option, created_at",
      );

    if (selectionError) {
      console.error(
        "Coupon selections insert error:",
        selectionError,
      );

      await supabase
        .from("coupons")
        .delete()
        .eq(
          "id",
          coupon.id,
        );

      return NextResponse.json(
        {
          success: false,
          message:
            "Kupon seçimleri kaydedilemedi.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        coupon: {
          ...coupon,
          coupon_selections:
            insertedSelections ??
            [],
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Coupons POST API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Kupon oluşturulamadı.",
      },
      {
        status: 500,
      },
    );
  }
}