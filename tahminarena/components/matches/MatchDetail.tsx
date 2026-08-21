type MatchDetailProps = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  status: "Yaklaşıyor" | "Canlı" | "Bitti";
};

export default function MatchDetail({
  id,
  homeTeam,
  awayTeam,
  time,
  status,
}: MatchDetailProps) {
  return (
    <section className="match-detail">
      <div className="match-detail__status">
        {status}
      </div>

      <div className="match-detail__teams">
        <div className="match-detail__team">
          <span className="match-detail__team-name">
            {homeTeam}
          </span>
        </div>

        <div className="match-detail__versus">
          <span>VS</span>
          <strong>{time}</strong>
        </div>

        <div className="match-detail__team match-detail__team--right">
          <span className="match-detail__team-name">
            {awayTeam}
          </span>
        </div>
      </div>

      <div className="match-detail__info">
        <span>Maç ID</span>
        <strong>{id}</strong>
      </div>
    </section>
  );
}