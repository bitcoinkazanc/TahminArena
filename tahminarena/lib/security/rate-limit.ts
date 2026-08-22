type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

const store = new Map<
  string,
  RateLimitEntry
>();

function cleanupExpiredEntries(
  now: number,
) {
  for (const [
    key,
    entry,
  ] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function checkRateLimit(
  key: string,
  options: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();

  cleanupExpiredEntries(now);

  const existing = store.get(key);

  if (
    !existing ||
    existing.resetAt <= now
  ) {
    const resetAt =
      now + options.windowMs;

    store.set(key, {
      count: 1,
      resetAt,
    });

    return {
      allowed: true,
      limit: options.limit,
      remaining: Math.max(
        0,
        options.limit - 1,
      ),
      resetAt,
    };
  }

  if (existing.count >= options.limit) {
    return {
      allowed: false,
      limit: options.limit,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;

  store.set(key, existing);

  return {
    allowed: true,
    limit: options.limit,
    remaining: Math.max(
      0,
      options.limit - existing.count,
    ),
    resetAt: existing.resetAt,
  };
}

export function createRateLimitKey(
  scope: string,
  identifier: string,
): string {
  return `${scope}:${identifier}`;
}

export function getRateLimitHeaders(
  result: RateLimitResult,
): Record<string, string> {
  return {
    "X-RateLimit-Limit":
      String(result.limit),
    "X-RateLimit-Remaining":
      String(result.remaining),
    "X-RateLimit-Reset":
      String(
        Math.ceil(
          result.resetAt / 1000,
        ),
      ),
  };
}