import type { UserProfileStats } from "@/types/user";

type ProfileStatsProps = {
  stats: UserProfileStats;
  isPrivate?: boolean;
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

export default function ProfileStats({
  stats,
  isPrivate = false,
}: ProfileStatsProps) {
  if (isPrivate) {
    return (
      <section className="profile-stats">
        <div className="empty-state">
          <strong>🔒 Profil gizli</strong>

          <span>
            Bu kullanıcının detaylı başarı
            istatistikleri gizlilik ayarları nedeniyle
            görüntülenemiyor.
          </span>
        </div>
      </section>
    );
  }

  return (
    <section
      className="profile-stats"
      aria-label="Profil istatistikleri"
    >
      <div className="profile-stats__grid">
        <div className="profile-stats__item">
          <strong>{stats.predictionsCount}</strong>
          <span>Toplam Tahmin</span>
        </div>

        <div className="profile-stats__item">
          <strong>
            {stats.correctPredictionsCount}
          </strong>
          <span>Doğru</span>
        </div>

        <div className="profile-stats__item">
          <strong>
            {stats.incorrectPredictionsCount}
          </strong>
          <span>Yanlış</span>
        </div>

        <div className="profile-stats__item">
          <strong>
            {formatSuccessRate(
              stats.successRate,
            )}
          </strong>
          <span>Başarı</span>
        </div>
      </div>
    </section>
  );
}