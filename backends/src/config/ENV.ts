import dotenv from "dotenv";

dotenv.config({ quiet: true });

/**
 * Helper function to ensure required env variables exist
 */
function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// ==========================
// Server Configuration
// ==========================
export const BACKEND_IP: string = requiredEnv("BACKEND_IP");
export const PORT: number = parseInt(requiredEnv("PORT"), 10);
export const SOCKET_PORT: number = parseInt(requiredEnv("SOCKET_PORT"), 10);

// ==========================
// Database
// ==========================
export const DATABASE_URL: string = requiredEnv("DATABASE_URL");

// ==========================
// JWT
// ==========================
export const JWT_SECRET: string = requiredEnv("JWT_SECRET");
export const JWT_EXPIRE_TIME: number = parseInt(
  requiredEnv("JWT_EXPIRE_TIME"),
  10,
);
export const JWT_REFRESH_SECRET: string = requiredEnv("JWT_REFRESH_SECRET");

// ==========================
// Email
// ==========================
export const EMAIL_USERNAME: string = requiredEnv("EMAIL_USERNAME");
export const EMAIL_PASSWORD: string = requiredEnv("EMAIL_PASSWORD");

// ==========================
// Stripe
// ==========================
export const STRIPE_SECRET_KEY: string = requiredEnv("STRIPE_SECRET_KEY");

// ==========================
// Frontend URL (optional)
// ==========================
export const FRONTEND_URL: string | undefined = process.env.FRONTEND_URL;

// ==========================
// Redis
// ==========================
export const REDIS_HOST: string = requiredEnv("REDIS_HOST");
export const REDIS_PORT: number = parseInt(requiredEnv("REDIS_PORT"), 10);
export const REDIS_PASSWORD: string | undefined =
  process.env.REDIS_PASSWORD || undefined;
export const REDIS_DB: number = parseInt(requiredEnv("REDIS_DB"), 10);

// ==========================
// Cloudinary
// ==========================
export const CLOUDINARY_CLOUD_NAME: string = requiredEnv(
  "CLOUDINARY_CLOUD_NAME",
);

export const CLOUDINARY_API_KEY: string = requiredEnv("CLOUDINARY_API_KEY");

export const CLOUDINARY_API_SECRET: string = requiredEnv(
  "CLOUDINARY_API_SECRET",
);

// ==========================
// Crypto
// ==========================
export const CRYPTO_SECRET_KEY: string = requiredEnv("CRYPTO_SECRET_KEY");
