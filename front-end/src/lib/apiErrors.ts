export type FormErrors = Record<string, string>;

/** RTK Query failures have {status,data}; ordinary Error has {message}. */
export const apiErrorMessage = (error: unknown, fallback = "Something went wrong. Please try again."): string => {
  if (error && typeof error === "object") {
    const parsed = error as { data?: { message?: unknown }; message?: unknown; error?: unknown };
    if (typeof parsed.data?.message === "string") return parsed.data.message;
    if (typeof parsed.message === "string") return parsed.message;
    if (typeof parsed.error === "string") return parsed.error;
  }
  return fallback;
};

export const apiFieldErrors = (error: unknown): FormErrors => {
  if (!error || typeof error !== "object") return {};
  const failures = (error as { data?: { errors?: unknown } }).data?.errors;
  if (!Array.isArray(failures)) return {};
  return failures.reduce<FormErrors>((output, item: unknown) => {
    if (item && typeof item === "object" && "field" in item && "message" in item &&
      typeof item.field === "string" && typeof item.message === "string") {
      output[item.field] = item.message;
    }
    return output;
  }, {});
};
