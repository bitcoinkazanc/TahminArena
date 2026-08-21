import Link from "next/link";

type MatchCardProps = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  status: "Yaklaşıyor" | "Canlı" | "Bitti";
};

export default function MatchCard({
  id,
  homeTeam,
  awayTeam,
  time,
  status,
}: MatchCardProps) {
  const statusClass =
    status === "Canlı"
      ? "match-card__status--live"
      : status === "Bitti"
        ? "match-card__status--finished"
        : "match-card__status--upcoming";

  return (
    <Link
      href={`/matches/${id}`}
      className="match-card"
    >
      <div className={`match-card__status ${statusClass}`}>
        {status}
      </div>

      <div className="match-card__teams">
        <span>{homeTeam}</span>

        <strong>VS</strong>

        <span>{awayTeam}</span>
      </div>

      <div className="match-card__time">
        {time}
      </div>
    </Link>
  );
}