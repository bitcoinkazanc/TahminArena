"use client";

import { useState } from "react";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import PrivacySettings from "@/components/profile/PrivacySettings";
import Button from "@/components/ui/Button";
import type { UserPrivacy } from "@/types/user";

export default function SettingsPage() {
  const [privacy, setPrivacy] =
    useState<UserPrivacy>("Açık");

  const [saved, setSaved] =
    useState(false);

  function handlePrivacyChange(
    nextPrivacy: UserPrivacy,
  ) {
    setPrivacy(nextPrivacy);
    setSaved(true);
  }

  return (
    <main>
      <PageContainer>
        <Link
          href="/profile/me"
          className="match-detail__back"
        >
          ← Profilime dön
        </Link>

        <section>
          <div className="section-heading">
            <h2>⚙️ Ayarlar</h2>

            <p>
              Hesabını ve gizlilik tercihlerini
              buradan yönet.
            </p>
          </div>
        </section>

        <PrivacySettings
          initialPrivacy={privacy}
          onChange={handlePrivacyChange}
        />

        {saved && (
          <div
            className="empty-state"
            role="status"
          >
            <strong>✅ Ayar güncellendi</strong>

            <span>
              Profil gizliliğin{" "}
              {privacy.toLowerCase()} olarak
              ayarlandı.
            </span>
          </div>
        )}

        <section className="settings-section">
          <div className="section-heading">
            <h2>🛡️ Güvenlik</h2>

            <p>
              Hesap güvenliği ve topluluk
              kurallarıyla ilgili işlemler.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            fullWidth
            disabled
          >
            Telegram Hesabı Bağlı
          </Button>
        </section>

        <section className="settings-section">
          <div className="section-heading">
            <h2>📋 Topluluk</h2>

            <p>
              Uygunsuz içerikleri bildirmek için
              bildirim merkezini kullanabilirsin.
            </p>
          </div>

          <Link
            href="/report"
            className="ui-button ui-button--secondary ui-button--full"
          >
            İçerik Bildir
          </Link>
        </section>
      </PageContainer>
    </main>
  );
}