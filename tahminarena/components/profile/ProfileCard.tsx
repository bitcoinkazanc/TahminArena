import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import type { PublicUser } from "@/types/user";

type ProfileCardProps = {
  user: PublicUser;
  isOwnProfile?: boolean;
};

export default function ProfileCard({
  user,
  isOwnProfile = false,
}: ProfileCardProps) {
  return (
    <section className="profile-card">
      <div className="profile-card__header">
        <Avatar
          src={user.avatarUrl}
          name={user.displayName}
          alt={`${user.displayName} profil fotoğrafı`}
          size="large"
        />

        <div className="profile-card__identity">
          <h2>{user.displayName}</h2>

          <Link
            href={`/profile/${encodeURIComponent(user.username)}`}
            className="profile-card__username"
          >
            @{user.username}
          </Link>
        </div>
      </div>

      {user.bio && (
        <p className="profile-card__bio">
          {user.bio}
        </p>
      )}

      <div className="profile-card__stats">
        <div className="profile-card__stat">
          <strong>{user.predictionsCount}</strong>
          <span>Tahmin</span>
        </div>

        <div className="profile-card__stat">
          <strong>{user.followersCount}</strong>
          <span>Takipçi</span>
        </div>

        <div className="profile-card__stat">
          <strong>{user.followingCount}</strong>
          <span>Takip</span>
        </div>
      </div>

      {isOwnProfile && (
        <Link
          href="/settings"
          className="ui-button ui-button--secondary ui-button--full"
        >
          Profili Düzenle
        </Link>
      )}
    </section>
  );
}