import AdSlot from "@/components/ads/AdSlot";
import MatchCard from "@/components/matches/MatchCard";

type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  status: "Yaklaşıyor" | "Canlı" | "Bitti";
};

type MatchListProps = {
  matches: Match[];
};

export default function MatchList({
  matches,
}: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="empty-state">
        <strong>Maç bulunamadı</strong>
        <span>
          Gösterilecek maç bulunmuyor.
        </span>
      </div>
    );
  }

  return (
    <div className="matches-list">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          id={match.id}
          homeTeam={match.homeTeam}
          awayTeam={match.awayTeam}
          time={match.time}
          status={match.status}
        />
      ))}
    </div>
  );
}