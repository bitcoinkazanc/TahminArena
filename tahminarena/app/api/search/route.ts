import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function isValidQuery(
  value: string | null,
): value is string {
  if (!value) {
    return false;
  }

  const query =
    value.trim();

  return (
    query.length >= 1 &&
    query.length <= 50
  );
}

export async function GET(
  request: NextRequest,
) {
  try {
    const query =
      request.nextUrl.searchParams.get(
        "q",
      );

    if (
      !isValidQuery(query)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Arama metni en az 1 karakter olmalıdır.",
        },
        {
          status: 400,
        },
      );
    }

    const search =
      query.trim();

    const supabase =
      getSupabaseServerClient();

    const { data, error } =
      await supabase
        .from("users")
        .select(
          `
            id,
            username,
            display_name,
            avatar_url,
            bio,
            privacy,
            followers_count,
            following_count,
            predictions_count,
            correct_predictions_count
          `,
        )
        .or(
          `username.ilike.%${search}%,display_name.ilike.%${search}%`,
        )
        .order(
          "username",
          {
            ascending: true,
          },
        )
        .limit(20);

    if (error) {
      console.error(
        "Search users Supabase error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Arama yapılamadı.",
        },
        {
          status: 500,
        },
      );
    }

    const users =
      (data ?? []).map(
        (user) => ({
          id: user.id,
          username:
            user.username,
          displayName:
            user.display_name,
          avatarUrl:
            user.avatar_url,
          bio:
            user.bio,
          privacy:
            user.privacy,
          followersCount:
            user.followers_count,
          followingCount:
            user.following_count,
          predictionsCount:
            user.predictions_count,
          correctPredictionsCount:
            user.correct_predictions_count,
        }),
      );

    return NextResponse.json(
      {
        success: true,
        query: search,
        users,
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
      "Search API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Arama yapılamadı.",
      },
      {
        status: 500,
      },
    );
  }
}