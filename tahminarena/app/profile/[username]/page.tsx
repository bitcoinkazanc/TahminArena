import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileStats from "@/components/profile/ProfileStats";
import FollowButton from "@/components/profile/FollowButton";
import EmptyState from "@/components/ui/EmptyState";
import type {
  PublicUser,
  UserProfileStats,
} from "@/types/user";

type ProfilePageProps = {
  params: {
    username: string;
  };
};

const demoUser: PublicUser = {
  id: "demo-user",
  username: "tahminci",
  displayName: "Tahminci",
  avatarUrl: null,
  bio: "Futbol ve tahmin tutkunu.",
  privacy: "Açık",
  followersCount: 128,
  followingCount: 74,
  predictionsCount: 246,
  correctPredictionsCount: 151,
};

const demoStats: UserProfileStats = {
  predictionsCount: 246,
  correctPredictionsCount: 151,
  incorrectPredictionsCount: 82,
  successRate: 61,
};

export default function ProfilePage({
  params,
}: ProfilePageProps) {
  const username = decodeURIComponent(
    params.username,
  );

  const user = {
    ...demoUser,
    username,
  };

  const isOwnProfile =
    username.toLowerCase() === "me";

  return (
    <main>
      <PageContainer>
        <Link
          href="/"
          className="match-detail__back"
        >
          ← Ana Sayfa
        </Link>

        <ProfileCard
          user={user}
          isOwnProfile={isOwnProfile}
        />

        {!isOwnProfile && (
          <section className="profile-actions">
            <FollowButton
              username={user.username}
            />
          </section>
        )}

        {user.privacy === "Gizli" ? (
          <EmptyState
            icon="🔒"
            title="Profil gizli"
            description="Bu kullanıcının özel profil bilgileri ve geçmiş istatistikleri görüntülenemiyor."
          />
        ) : (
          <ProfileStats
            stats={demoStats}
            isPrivate={false}
          />
        )}

        {user.privacy === "Açık" && (
          <section className="profile-predictions">
            <div className="section-heading">
              <h2>🔮 Tahminler</h2>

              <p>
                @{user.username} tarafından
                paylaşılan tahminler.
              </p>
            </div>

            <EmptyState
              icon="🔮"
              title="Tahmin geçmişi hazırlanıyor"
              description="Kullanıcının tahminleri veritabanı bağlantısı tamamlandığında burada listelenecek."
            />
          </section>
        )}
      </PageContainer>
    </main>
  );
}