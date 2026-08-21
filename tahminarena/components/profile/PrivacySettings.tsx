"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import type { UserPrivacy } from "@/types/user";

type PrivacySettingsProps = {
  initialPrivacy: UserPrivacy;
  onChange?: (privacy: UserPrivacy) => void;
};

export default function PrivacySettings({
  initialPrivacy,
  onChange,
}: PrivacySettingsProps) {
  const [privacy, setPrivacy] =
    useState<UserPrivacy>(initialPrivacy);

  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (saving) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "/api/profile/privacy",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            privacy,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Gizlilik ayarı kaydedilemedi.",
        );
      }

      const data = (await response.json()) as {
        success: boolean;
        privacy?: UserPrivacy;
      };

      if (!data.success) {
        throw new Error(
          "Gizlilik ayarı kaydedilemedi.",
        );
      }

      const savedPrivacy =
        data.privacy ?? privacy;

      setPrivacy(savedPrivacy);
      onChange?.(savedPrivacy);
    } catch (error) {
      console.error(
        "Privacy settings error:",
        error,
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="privacy-settings">
      <div className="section-heading">
        <h2>🔒 Profil Gizliliği</h2>

        <p>
          Profilinin diğer kullanıcılar tarafından
          nasıl görüntüleneceğini belirle.
        </p>
      </div>

      <div
        className="privacy-settings__options"
        role="radiogroup"
        aria-label="Profil gizliliği"
      >
        <button
          type="button"
          className={`privacy-settings__option ${
            privacy === "Açık"
              ? "privacy-settings__option--selected"
              : ""
          }`}
          onClick={() => setPrivacy("Açık")}
          role="radio"
          aria-checked={privacy === "Açık"}
        >
          <strong>🌐 Açık Profil</strong>

          <span>
            Diğer kullanıcılar profilini ve
            herkese açık tahminlerini görebilir.
          </span>
        </button>

        <button
          type="button"
          className={`privacy-settings__option ${
            privacy === "Gizli"
              ? "privacy-settings__option--selected"
              : ""
          }`}
          onClick={() => setPrivacy("Gizli")}
          role="radio"
          aria-checked={privacy === "Gizli"}
        >
          <strong>🔐 Gizli Profil</strong>

          <span>
            Özel profil bilgilerin ve geçmiş
            istatistiklerin diğer kullanıcılara
            gösterilmez.
          </span>
        </button>
      </div>

      <Button
        type="button"
        fullWidth
        disabled={saving}
        onClick={handleSave}
      >
        {saving
          ? "Kaydediliyor..."
          : "Gizlilik Ayarını Kaydet"}
      </Button>
    </section>
  );
}