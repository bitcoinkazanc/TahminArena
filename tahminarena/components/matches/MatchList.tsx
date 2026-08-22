import MatchCard from "@/components/matches/MatchCard";
import type { Match } from "@/types/match";

type MatchListProps = {
  matches: Match[];
};

export default function MatchList({
  matches,
}: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="empty-state">
        <strong>
          Maç bulunamadı
        </strong>

        <span>
          Gösterilecek maç
          bulunmuyor.
        </span>
      </div>
    );
  }

  return (
    <div className="matches-list">
      {matches.map(
        (match) => (
          <MatchCard
            key={match.id}
            id={match.id}
            homeTeam={
              match.homeTeam
            }
            awayTeam={
              match.awayTeam
            }
            dateTime={
              match.dateTime
            }
            status={
              match.status
            }
            homeScore={
              match.homeScore
            }
            awayScore={
              match.awayScore
            }
          />
        ),
      )}
    </div>
  );
}