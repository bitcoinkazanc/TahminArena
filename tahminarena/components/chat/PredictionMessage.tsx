import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import type {
  PredictionOption,
  PredictionStatus,
} from "@/types/prediction";

type PredictionMessageProps = {
  predictionId: string;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  homeTeam: string;
  awayTeam: string;
  option: PredictionOption;
  status: PredictionStatus;
  createdAt: string;
};

function getOptionLabel(
  option: PredictionOption,
): string {
  if (option === "1") {
    return "Ev Sahibi";
  }

  if (option === "X") {
    return "Beraberlik";
  }

  return "Deplasman";
}

export default function PredictionMessage({
  predictionId,
  username,
  displayName,
  avatarUrl,
  homeTeam,
  awayTeam,
  option,
  status,
  createdAt,
}: PredictionMessageProps) {
  return (
    <article className="prediction-message">
      <div className="prediction-message__user">
        <Avatar
          src={avatarUrl}
          name={displayName ?? username}
          alt={`${displayName ?? username} profil fotoğrafı`}
          size="small"
        />

        <div>
          <Link
            href={`/profile/${encodeURIComponent(username)}`}
            className="prediction-message__username"
          >
            {displayName || `@${username}`}
          </Link>

          <time
            className="prediction-message__time"
            dateTime={createdAt}
          >
            {new Date(
              createdAt,
            ).toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>
      </div>

      <Link
        href={`/predictions/${predictionId}`}
        className="prediction-message__card"
      >
        <span className="prediction-message__label">
          🔮 Tahmin
        </span>

        <div className="prediction-message__teams">
          <span>{homeTeam}</span>
          <strong>VS</strong>
          <span>{awayTeam}</span>
        </div>

        <div className="prediction-message__selection">
          <strong>{option}</strong>

          <span>
            {getOptionLabel(option)}
          </span>
        </div>

        <span
          className={`prediction-message__status prediction-message__status--${status.toLowerCase()}`}
        >
          {status}
        </span>
      </Link>
    </article>
  );
}