import PageContainer from "@/components/layout/PageContainer";
import PredictionCard from "@/components/predictions/PredictionCard";
import EmptyState from "@/components/ui/EmptyState";
import type {
  PredictionOption,
  PredictionStatus,
} from "@/types/prediction";

type DemoPrediction = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  homeTeam: string;
  awayTeam: string;
  matchTime: string;
  option: PredictionOption;
  status: PredictionStatus;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
};

const predictions: DemoPrediction[] = [
  {
    id: "demo-prediction-1",
    username: "tahminci",
    displayName: "Tahminci",
    avatarUrl: null,
    homeTeam: "Galatasaray",
    awayTeam: "Fenerbahçe",
    matchTime: "20:00",
    option: "1",
    status: "Bekliyor",
    likesCount: 12,
    dislikesCount: 2,
    commentsCount: 4,
  },
  {
    id: "demo-prediction-2",
    username: "futbolsever",
    displayName: "Futbolsever",
    avatarUrl: null,
    homeTeam: "Beşiktaş",
    awayTeam: "Trabzonspor",
    matchTime: "20:30",
    option: "X",
    status: "Bekliyor",
    likesCount: 8,
    dislikesCount: 1,
    commentsCount: 2,
  },
];

export default function PredictionsPage() {
  return (
    <main>
      <PageContainer>
        <section>
          <h2>🔮 Tahminler</h2>

          <p>
            Topluluğun tahminlerini keşfet,
            kendi tahminini paylaş.
          </p>
        </section>

        {predictions.length === 0 ? (
          <EmptyState
            icon="🔮"
            title="Henüz tahmin yok"
            description="İlk tahmini sen paylaşabilirsin."
          />
        ) : (
          <section
            className="predictions-list"
            aria-label="Tahminler"
          >
            {predictions.map((prediction) => (
              <PredictionCard
                key={prediction.id}
                id={prediction.id}
                username={prediction.username}
                displayName={
                  prediction.displayName
                }
                avatarUrl={
                  prediction.avatarUrl
                }
                homeTeam={
                  prediction.homeTeam
                }
                awayTeam={
                  prediction.awayTeam
                }
                matchTime={
                  prediction.matchTime
                }
                option={prediction.option}
                status={prediction.status}
                likesCount={
                  prediction.likesCount
                }
                dislikesCount={
                  prediction.dislikesCount
                }
                commentsCount={
                  prediction.commentsCount
                }
              />
            ))}
          </section>
        )}
      </PageContainer>
    </main>
  );
}