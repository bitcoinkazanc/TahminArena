import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";

type MatchPageProps = {
  params: {
    matchId: string;
  };
};

export default function MatchDetailPage({
  params,
}: MatchPageProps) {
  return (
    <main>
      <PageContainer>
        <Link href="/matches" className="match-detail__back">
          ← Maçlara dön
        </Link>

        <section className="match-detail">
          <div className="match-detail__status">Yaklaşıyor</div>

          <div className="match-detail__teams">
            <div className="match-detail__team">
              <span className="match-detail__team-name">
                Galatasaray
              </span>
            </div>

            <div className="match-detail__versus">
              <span>VS</span>
              <strong>20:00</strong>
            </div>

            <div className="match-detail__team match-detail__team--right">
              <span className="match-detail__team-name">
                Fenerbahçe
              </span>
            </div>
          </div>

          <div className="match-detail__info">
            <span>Maç ID</span>
            <strong>{params.matchId}</strong>
          </div>
        </section>

        <section className="prediction-section">
          <div className="section-heading">
            <h2>🔮 Tahmin Yap</h2>
            <p>
              Maç için tahminini seç ve toplulukla paylaş.
            </p>
          </div>

          <div className="prediction-options">
            <button type="button" className="prediction-option">
              <strong>1</strong>
              <span>Ev Sahibi</span>
            </button>

            <button type="button" className="prediction-option">
              <strong>X</strong>
              <span>Beraberlik</span>
            </button>

            <button type="button" className="prediction-option">
              <strong>2</strong>
              <span>Deplasman</span>
            </button>
          </div>
        </section>

        <section className="match-chat">
          <div className="section-heading">
            <h2>💬 Maç Sohbeti</h2>
            <p>Bu maç hakkında toplulukla konuş.</p>
          </div>

          <div className="empty-state">
            <strong>Henüz mesaj yok</strong>
            <span>
              İlk mesajı göndererek maç sohbetini başlatabilirsin.
            </span>
          </div>
        </section>
      </PageContainer>
    </main>
  );
}