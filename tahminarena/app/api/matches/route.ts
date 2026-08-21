import { NextResponse } from "next/server";
import { getMatches } from "@/lib/football/api";

export async function GET() {
  try {
    const matches = await getMatches();

    return NextResponse.json(
      {
        success: true,
        matches,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, s-maxage=60, stale-while-revalidate=120",
        },
      },
    );
  } catch (error) {
    console.error("Matches API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Maç verileri şu anda alınamıyor.",
      },
      {
        status: 500,
      },
    );
  }
}