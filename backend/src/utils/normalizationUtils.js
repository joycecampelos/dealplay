export function normalizeFields(obj) {
  const normalized = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      normalized[key] = trimmed === "" ? null : trimmed;
    } else {
      normalized[key] = value ?? null;
    }
  }

  return normalized;
}
