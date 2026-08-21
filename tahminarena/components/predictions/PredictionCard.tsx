import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import type {
  PredictionOption,
  PredictionStatus,
} from "@/types/prediction";

type PredictionCardProps = {
  id: string;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  homeTeam: string;
  awayTeam: string;
  matchTime: string;
  option: PredictionOption;
  status: PredictionStatus;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
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

function getStatusLabel(
  status: PredictionStatus,
): string {
  if (status === "Doğru") {
    return "Doğru";
  }

  if (status === "Yanlış") {
    return "Yanlış";
  }

  if (status === "İptal") {
    return "İptal";
  }

  return "Bekliyor";
}

export default function PredictionCard({
  id,
  username,
  displayName,
  avatarUrl,
  homeTeam,
  awayTeam,
  matchTime,
  option,
  status,
  likesCount,
  dislikesCount,
  commentsCount,
}: PredictionCardProps) {
  return (
    <article className="prediction-card">
      <div className="prediction-card__user">
        <Avatar
          src={avatarUrl}
          name={displayName ?? username}
          alt={`${displayName ?? username} profil fotoğrafı`}
          size="small"
        />

        <div className="prediction-card__user-info">
          <Link
            href={`/profile/${encodeURIComponent(username)}`}
            className="prediction-card__username"
          >
            {displayName || `@${username}`}
          </Link>

          <span className="prediction-card__match-time">
            {matchTime}
          </span>
        </div>
      </div>

      <Link
        href={`/predictions/${id}`}
        className="prediction-card__match"
      >
        <div className="prediction-card__teams">
          <span>{homeTeam}</span>
          <strong>VS</strong>
          <span>{awayTeam}</span>
        </div>

        <div className="prediction-card__prediction">
          <span>Tahmin</span>

          <strong>{option}</strong>

          <small>
            {getOptionLabel(option)}
          </small>
        </div>
      </Link>

      <div className="prediction-card__footer">
        <span
          className={`prediction-card__status prediction-card__status--${status.toLowerCase()}`}
        >
          {getStatusLabel(status)}
        </span>

        <div className="prediction-card__stats">
          <span>👍 {likesCount}</span>
          <span>👎 {dislikesCount}</span>
          <span>💬 {commentsCount}</span>
        </div>
      </div>
    </article>
  );
}