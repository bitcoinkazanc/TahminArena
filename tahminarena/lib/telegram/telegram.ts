export type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
};

export type TelegramWebApp = {
  initData: string;
  initDataUnsafe?: {
    user?: TelegramUser;
    auth_date?: number;
    query_id?: string;
  };
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export function getTelegramWebApp(): TelegramWebApp | null {
  if (
    typeof window === "undefined" ||
    !window.Telegram?.WebApp
  ) {
    return null;
  }

  return window.Telegram.WebApp;
}

export function getTelegramInitData(): string | null {
  const webApp = getTelegramWebApp();

  if (!webApp?.initData) {
    return null;
  }

  return webApp.initData;
}

export function getTelegramUnsafeUser():
  | TelegramUser
  | null {
  const webApp = getTelegramWebApp();

  return webApp?.initDataUnsafe?.user ?? null;
}

export function isTelegramMiniApp(): boolean {
  return Boolean(getTelegramWebApp());
}