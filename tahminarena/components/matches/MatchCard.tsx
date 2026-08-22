import Link from "next/link";
import type { MatchStatus } from "@/types/match";

type MatchCardProps = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  dateTime: string;
  status: MatchStatus;
  homeScore?: number | null;
  awayScore?: number | null;
};

function formatMatchTime(
  dateTime: string,
): string {
  const date =
    new Date(dateTime);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return dateTime;
  }

  return new Intl.DateTimeFormat(
    "tr-TR",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
}

export default function MatchCard({
  id,
  homeTeam,
  awayTeam,
  dateTime,
  status,
  homeScore,
  awayScore,
}: MatchCardProps) {
  const statusClass =
    status === "Canlı"
      ? "match-card__status--live"
      : status === "Bitti"
        ? "match-card__status--finished"
        : "match-card__status--upcoming";

  const showScore =
    (status === "Canlı" ||
      status === "Bitti") &&
    homeScore !== null &&
    homeScore !== undefined &&
    awayScore !== null &&
    awayScore !== undefined;

  return (
    <Link
      href={`/matches/${id}`}
      className="match-card"
    >
      <div
        className={`match-card__status ${statusClass}`}
      >
        {status}
      </div>

      <div className="match-card__teams">
        <span>
          {homeTeam}
        </span>

        <strong>
          {showScore
            ? `${homeScore} - ${awayScore}`
            : "VS"}
        </strong>

        <span>
          {awayTeam}
        </span>
      </div>

      <div className="match-card__time">
        {formatMatchTime(
          dateTime,
        )}
      </div>
    </Link>
  );
}