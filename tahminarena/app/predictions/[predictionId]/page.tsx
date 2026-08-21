import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import PredictionActions from "@/components/predictions/PredictionActions";
import PredictionComments from "@/components/predictions/PredictionComments";
import PredictionCard from "@/components/predictions/PredictionCard";
import type {
  PredictionOption,
  PredictionStatus,
} from "@/types/prediction";

type PredictionPageProps = {
  params: {
    predictionId: string;
  };
};

type Comment = {
  id: string;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  text: string;
  createdAt: string;
};

const demoComments: Comment[] = [
  {
    id: "comment-1",
    username: "futbolsever",
    displayName: "Futbolsever",
    avatarUrl: null,
    text: "Bence bu maçta ev sahibi avantajı belirleyici olabilir.",
    createdAt: "Az önce",
  },
];

const demoPrediction = {
  id: "demo-prediction-1",
  username: "tahminci",
  displayName: "Tahminci",
  avatarUrl: null,
  homeTeam: "Galatasaray",
  awayTeam: "Fenerbahçe",
  matchTime: "20:00",
  option: "1" as PredictionOption,
  status: "Bekliyor" as PredictionStatus,
  likesCount: 12,
  dislikesCount: 2,
  commentsCount: 1,
};

export default function PredictionDetailPage({
  params,
}: PredictionPageProps) {
  const predictionId = params.predictionId;

  const prediction = {
    ...demoPrediction,
    id: predictionId,
  };

  return (
    <main>
      <PageContainer>
        <Link
          href="/predictions"
          className="match-detail__back"
        >
          ← Tahminlere dön
        </Link>

        <PredictionCard
          id={prediction.id}
          username={prediction.username}
          displayName={prediction.displayName}
          avatarUrl={prediction.avatarUrl}
          homeTeam={prediction.homeTeam}
          awayTeam={prediction.awayTeam}
          matchTime={prediction.matchTime}
          option={prediction.option}
          status={prediction.status}
          likesCount={prediction.likesCount}
          dislikesCount={prediction.dislikesCount}
          commentsCount={prediction.commentsCount}
        />

        <PredictionActions
          predictionId={prediction.id}
          likesCount={prediction.likesCount}
          dislikesCount={
            prediction.dislikesCount
          }
          commentsCount={
            prediction.commentsCount
          }
        />

        <PredictionComments
          predictionId={prediction.id}
          comments={demoComments}
        />
      </PageContainer>
    </main>
  );
}