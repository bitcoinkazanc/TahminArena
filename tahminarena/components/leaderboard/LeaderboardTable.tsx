import Link from "next/link";
import Avatar from "@/components/ui/Avatar";

type LeaderboardUser = {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  predictionsCount: number;
  correctPredictionsCount: number;
  successRate: number;
};

type LeaderboardTableProps = {
  users: LeaderboardUser[];
};

function formatSuccessRate(
  successRate: number,
): string {
  if (!Number.isFinite(successRate)) {
    return "%0";
  }

  return `%${Math.max(
    0,
    Math.min(100, Math.round(successRate)),
  )}`;
}

export default function LeaderboardTable({
  users,
}: LeaderboardTableProps) {
  if (users.length === 0) {
    return (
      <div className="empty-state">
        <strong>Henüz sıralama yok</strong>

        <span>
          Tahminler oluşturuldukça liderlik
          tablosu burada oluşacak.
        </span>
      </div>
    );
  }

  return (
    <section
      className="leaderboard-table"
      aria-label="Liderlik tablosu"
    >
      <div className="leaderboard-table__header">
        <span>Sıra</span>
        <span>Kullanıcı</span>
        <span>Başarı</span>
      </div>

      <div className="leaderboard-table__body">
        {users.map((user) => (
          <Link
            key={user.userId}
            href={`/profile/${encodeURIComponent(
              user.username,
            )}`}
            className={`leaderboard-table__row ${
              user.rank <= 3
                ? "leaderboard-table__row--top"
                : ""
            }`}
          >
            <strong className="leaderboard-table__rank">
              {user.rank}
            </strong>

            <div className="leaderboard-table__user">
              <Avatar
                src={user.avatarUrl}
                name={user.displayName}
                alt={`${user.displayName} profil fotoğrafı`}
                size="small"
              />

              <div>
                <strong>
                  {user.displayName}
                </strong>

                <span>
                  @{user.username}
                </span>
              </div>
            </div>

            <div className="leaderboard-table__stats">
              <strong>
                {formatSuccessRate(
                  user.successRate,
                )}
              </strong>

              <span>
                {user.correctPredictionsCount}/
                {user.predictionsCount}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}