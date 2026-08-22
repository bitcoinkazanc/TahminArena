import { NextRequest, NextResponse } from "next/server";
import type { UserPrivacy } from "@/types/user";

type PrivacyRequestBody = {
  privacy?: unknown;
};

function isValidPrivacy(
  value: unknown,
): value is UserPrivacy {
  return (
    value === "Açık" ||
    value === "Gizli"
  );
}

export async function PATCH(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as PrivacyRequestBody;

    if (!isValidPrivacy(body.privacy)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçersiz gizlilik ayarı.",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        privacy: body.privacy,
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
      "Profile privacy API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Gizlilik ayarı güncellenemedi.",
      },
      {
        status: 500,
      },
    );
  }
}