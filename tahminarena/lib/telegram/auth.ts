import crypto from "crypto";

type TelegramInitDataUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
};

export type TelegramAuthResult = {
  valid: boolean;
  user: TelegramInitDataUser | null;
  authDate: number | null;
};

function parseInitData(
  initData: string,
): URLSearchParams | null {
  if (
    typeof initData !== "string" ||
    initData.trim().length === 0
  ) {
    return null;
  }

  try {
    return new URLSearchParams(initData);
  } catch {
    return null;
  }
}

function createDataCheckString(
  params: URLSearchParams,
): string {
  return Array.from(params.entries())
    .filter(([key]) => key !== "hash")
    .sort(([keyA], [keyB]) =>
      keyA.localeCompare(keyB),
    )
    .map(
      ([key, value]) =>
        `${key}=${value}`,
    )
    .join("\n");
}

function createTelegramSecretKey(
  botToken: string,
): Buffer {
  return crypto
    .createHmac(
      "sha256",
      "WebAppData",
    )
    .update(botToken)
    .digest();
}

function createTelegramHash(
  dataCheckString: string,
  secretKey: Buffer,
): string {
  return crypto
    .createHmac(
      "sha256",
      secretKey,
    )
    .update(dataCheckString)
    .digest("hex");
}

function isSafeAuthDate(
  authDate: number,
  maxAgeSeconds: number,
): boolean {
  const now = Math.floor(
    Date.now() / 1000,
  );

  return (
    authDate > 0 &&
    authDate <= now &&
    now - authDate <= maxAgeSeconds
  );
}

function parseTelegramUser(
  rawUser: string | null,
): TelegramInitDataUser | null {
  if (!rawUser) {
    return null;
  }

  try {
    const user =
      JSON.parse(
        rawUser,
      ) as TelegramInitDataUser;

    if (
      typeof user.id !== "number" ||
      !Number.isSafeInteger(user.id)
    ) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export function validateTelegramInitData(
  initData: string,
  botToken: string,
  maxAgeSeconds = 86400,
): TelegramAuthResult {
  if (!botToken) {
    return {
      valid: false,
      user: null,
      authDate: null,
    };
  }

  const params =
    parseInitData(initData);

  if (!params) {
    return {
      valid: false,
      user: null,
      authDate: null,
    };
  }

  const hash = params.get("hash");

  if (!hash || !/^[a-f0-9]{64}$/i.test(hash)) {
    return {
      valid: false,
      user: null,
      authDate: null,
    };
  }

  const authDateValue =
    params.get("auth_date");

  const authDate = Number(
    authDateValue,
  );

  if (
    !Number.isSafeInteger(authDate) ||
    !isSafeAuthDate(
      authDate,
      maxAgeSeconds,
    )
  ) {
    return {
      valid: false,
      user: null,
      authDate: Number.isFinite(authDate)
        ? authDate
        : null,
    };
  }

  const dataCheckString =
    createDataCheckString(params);

  const secretKey =
    createTelegramSecretKey(
      botToken,
    );

  const calculatedHash =
    createTelegramHash(
      dataCheckString,
      secretKey,
    );

  const providedHash =
    Buffer.from(
      hash,
      "hex",
    );

  const expectedHash =
    Buffer.from(
      calculatedHash,
      "hex",
    );

  if (
    providedHash.length !==
      expectedHash.length ||
    !crypto.timingSafeEqual(
      providedHash,
      expectedHash,
    )
  ) {
    return {
      valid: false,
      user: null,
      authDate,
    };
  }

  return {
    valid: true,
    user: parseTelegramUser(
      params.get("user"),
    ),
    authDate,
  };
}

export function getTelegramBotToken(): string {
  return (
    process.env.TELEGRAM_BOT_TOKEN ??
    ""
  );
}