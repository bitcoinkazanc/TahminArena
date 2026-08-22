"use client";

import { useState } from "react";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import SearchBox from "@/components/search/SearchBox";
import FollowButton from "@/components/profile/FollowButton";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";

type FriendUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  following: boolean;
};

const demoUsers: FriendUser[] = [
  {
    id: "user-1",
    username: "futbolsever",
    displayName: "Futbolsever",
    avatarUrl: null,
    following: true,
  },
  {
    id: "user-2",
    username: "tahminci",
    displayName: "Tahminci",
    avatarUrl: null,
    following: false,
  },
  {
    id: "user-3",
    username: "golustasi",
    displayName: "Gol Ustası",
    avatarUrl: null,
    following: true,
  },
];

export default function FriendsPage() {
  const [users, setUsers] =
    useState<FriendUser[]>(demoUsers);

  function handleFollowChange(
    userId: string,
    following: boolean,
  ) {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? {
              ...user,
              following,
            }
          : user,
      ),
    );
  }

  return (
    <main>
      <PageContainer>
        <section>
          <div className="section-heading">
            <h2>👥 Arkadaşlar</h2>

            <p>
              Kullanıcıları bul, takip et ve
              futbol topluluğunu genişlet.
            </p>
          </div>

          <SearchBox />
        </section>

        <section
          className="friends-list"
          aria-label="Kullanıcılar"
        >
          <div className="section-heading">
            <h2>Önerilen Kullanıcılar</h2>

            <p>
              Takip edebileceğin kullanıcılar.
            </p>
          </div>

          {users.length === 0 ? (
            <EmptyState
              icon="👥"
              title="Kullanıcı bulunamadı"
              description="Şu anda gösterilecek kullanıcı bulunmuyor."
            />
          ) : (
            users.map((user) => (
              <article
                key={user.id}
                className="friend-card"
              >
                <Link
                  href={`/profile/${encodeURIComponent(
                    user.username,
                  )}`}
                  className="friend-card__user"
                >
                  <Avatar
                    src={user.avatarUrl}
                    name={user.displayName}
                    alt={`${user.displayName} profil fotoğrafı`}
                    size="medium"
                  />

                  <div className="friend-card__info">
                    <strong>
                      {user.displayName}
                    </strong>

                    <span>
                      @{user.username}
                    </span>
                  </div>
                </Link>

                <FollowButton
                  username={user.username}
                  initialFollowing={
                    user.following
                  }
                  onChange={(following) =>
                    handleFollowChange(
                      user.id,
                      following,
                    )
                  }
                />
              </article>
            ))
          )}
        </section>
      </PageContainer>
    </main>
  );
}