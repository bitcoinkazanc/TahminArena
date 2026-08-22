export type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: string;
    };

export function isNonEmptyString(
  value: unknown,
  maxLength = 500,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
}

export function isValidId(
  value: unknown,
  maxLength = 100,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
}

export function isValidUsername(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length >= 1 &&
    value.trim().length <= 50 &&
    /^[a-zA-Z0-9_]+$/.test(
      value.trim(),
    )
  );
}

export function isValidPredictionOption(
  value: unknown,
): value is "1" | "X" | "2" {
  return (
    value === "1" ||
    value === "X" ||
    value === "2"
  );
}

export function isValidUserPrivacy(
  value: unknown,
): value is "Açık" | "Gizli" {
  return (
    value === "Açık" ||
    value === "Gizli"
  );
}

export function validateText(
  value: unknown,
  fieldName: string,
  minLength = 1,
  maxLength = 500,
): ValidationResult<string> {
  if (typeof value !== "string") {
    return {
      success: false,
      message: `${fieldName} geçerli bir metin olmalıdır.`,
    };
  }

  const text = value.trim();

  if (
    text.length < minLength ||
    text.length > maxLength
  ) {
    return {
      success: false,
      message: `${fieldName} ${minLength} ile ${maxLength} karakter arasında olmalıdır.`,
    };
  }

  return {
    success: true,
    data: text,
  };
}

export function validateId(
  value: unknown,
  fieldName: string,
  maxLength = 100,
): ValidationResult<string> {
  if (!isValidId(value, maxLength)) {
    return {
      success: false,
      message: `${fieldName} geçersiz.`,
    };
  }

  return {
    success: true,
    data: value.trim(),
  };
}