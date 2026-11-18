import { AppError } from "../../lib/errors";

/** Price and availability are read exclusively from server configuration. */
export const boostOffer = () => {
  const cents = Number(process.env.APPLICATION_BOOST_PRICE_CENTS || 0);
  const valid = Number.isSafeInteger(cents) && cents >= 50 && cents <= 100000;
  const live = /^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY || "");
  let originReady = true;
  try { frontendOrigin(); } catch { originReady = false; }
  const available = originReady && valid && !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_WEBHOOK_SECRET &&
    (!live || process.env.STRIPE_LIVE_PAYMENTS_ENABLED === "true");
  return {
    available,
    priceCents: valid ? cents : null,
    currency: "usd" as const,
    description: "Optional application highlight. Does not guarantee an interview or an offer.",
  };
};

/** Prevent accidental live charges during test-mode rollout. Webhooks remain enabled for reversals. */
export const assertPaymentsEnabled = () => {
  const key = process.env.STRIPE_SECRET_KEY || "";
  if (!key || !process.env.STRIPE_WEBHOOK_SECRET) throw new AppError("Secure payments are not configured", 503);
  if (/^(sk|rk)_live_/.test(key) && process.env.STRIPE_LIVE_PAYMENTS_ENABLED !== "true")
    throw new AppError("Live payments are disabled until staging verification is complete", 503);
};

export const frontendOrigin = () => {
  const value = (process.env.FRONTEND_URL || "").split(",")[0].trim().replace(/\/$/, "");
  if (!value.startsWith("https://") && !(process.env.NODE_ENV !== "production" && value.startsWith("http://localhost")))
    throw new AppError("A secure FRONTEND_URL is required for checkout", 503);
  return value;
};
