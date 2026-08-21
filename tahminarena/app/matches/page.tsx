import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";

type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  status: "Yaklaşıyor" | "Canlı" | "Bitti";
};

const matches: Match[] = [
  {
    id: "demo-1",
    homeTeam: "Galatasaray",
    awayTeam: "Fenerbahçe",
    time: "20:00",
    status: "Yaklaşıyor",
  },
  {
    id: "demo-2",
    homeTeam: "Beşiktaş",
    awayTeam: "Trabzonspor",
    time: "20:30",
    status: "Yaklaşıyor",
  },
  {
    id: "demo-3",
    homeTeam: "Başakşehir",
    awayTeam: "Kasımpaşa",
    time: "21:00",
    status: "Yaklaşıyor",
  },
];

export default function MatchesPage() {
  return (
    <main>
      <PageContainer>
        <section>
          <h2>⚽ Maçlar</h2>
          <p>Bugünkü futbol maçlarını ve tahmin seçeneklerini keşfet.</p>
        </section>

        <section className="matches-list" aria-label="Maç listesi">
          {matches.map((match) => (
            <Link
              key={match.id}
              href={`/matches/${match.id}`}
              className="match-card"
            >
              <div className="match-card__status">{match.status}</div>

              <div className="match-card__teams">
                <span>{match.homeTeam}</span>
                <strong>VS</strong>
                <span>{match.awayTeam}</span>
              </div>

              <div className="match-card__time">{match.time}</div>
            </Link>
          ))}
        </section>

        <section className="ad-slot" aria-label="Reklam alanı">
          <span>Reklam Alanı</span>
        </section>

        <section className="matches-list" aria-label="Maç listesi">
          <div className="empty-state">
            <strong>Daha fazla maç yakında</strong>
            <span>
              Gerçek maç verileri Mackolik entegrasyonu tamamlandığında
              gösterilecektir.
            </span>
          </div>
        </section>
      </PageContainer>
    </main>
  );
}