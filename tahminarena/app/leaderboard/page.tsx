"use client";

import { useMemo, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";

type LeaderboardPeriod =
  | "daily"
  | "weekly"
  | "monthly"
  | "all";

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

const demoUsers: LeaderboardUser[] = [
  {
    rank: 1,
    userId: "user-1",
    username: "futbolsever",
    displayName: "Futbolsever",
    avatarUrl: null,
    predictionsCount: 42,
    correctPredictionsCount: 31,
    successRate: 74,
  },
  {
    rank: 2,
    userId: "user-2",
    username: "tahminci",
    displayName: "Tahminci",
    avatarUrl: null,
    predictionsCount: 38,
    correctPredictionsCount: 27,
    successRate: 71,
  },
  {
    rank: 3,
    userId: "user-3",
    username: "golustasi",
    displayName: "Gol Ustası",
    avatarUrl: null,
    predictionsCount: 35,
    correctPredictionsCount: 24,
    successRate: 69,
  },
  {
    rank: 4,
    userId: "user-4",
    username: "macanalisti",
    displayName: "Maç Analisti",
    avatarUrl: null,
    predictionsCount: 41,
    correctPredictionsCount: 27,
    successRate: 66,
  },
  {
    rank: 5,
    userId: "user-5",
    username: "futbolkolik",
    displayName: "Futbolkolik",
    avatarUrl: null,
    predictionsCount: 33,
    correctPredictionsCount: 21,
    successRate: 64,
  },
];

const periodLabels: Array<{
  value: LeaderboardPeriod;
  label: string;
}> = [
  {
    value: "daily",
    label: "Günlük",
  },
  {
    value: "weekly",
    label: "Haftalık",
  },
  {
    value: "monthly",
    label: "Aylık",
  },
  {
    value: "all",
    label: "Tüm Zamanlar",
  },
];

export default function LeaderboardPage() {
  const [period, setPeriod] =
    useState<LeaderboardPeriod>("weekly");

  const users = useMemo(
    () => demoUsers,
    [period],
  );

  return (
    <main>
      <PageContainer>
        <section>
          <div className="section-heading">
            <h2>🏆 Liderlik</h2>

            <p>
              En başarılı tahmincileri keşfet ve
              sıralamadaki yerini takip et.
            </p>
          </div>

          <div
            className="leaderboard-periods"
            role="tablist"
            aria-label="Liderlik dönemi"
          >
            {periodLabels.map((item) => {
              const isActive =
                period === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  className={`leaderboard-periods__item ${
                    isActive
                      ? "leaderboard-periods__item--active"
                      : ""
                  }`}
                  onClick={() =>
                    setPeriod(item.value)
                  }
                  role="tab"
                  aria-selected={isActive}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </section>

        <LeaderboardTable users={users} />
      </PageContainer>
    </main>
  );
}