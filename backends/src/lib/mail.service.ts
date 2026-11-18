import nodemailer, { Transporter } from "nodemailer";

/** One pooled transport for both verification and password recovery; no per-request SMTP handshakes. */
let transport: Transporter | undefined;

const mailUser = () => process.env.SMTP_USER || process.env.EMAIL_USERNAME || "";
const mailPassword = () => process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD || "";

export const isMailConfigured = () => Boolean(mailUser() && mailPassword() &&
  (process.env.SMTP_HOST || process.env.EMAIL_USERNAME));

export const assertMailConfigured = () => {
  if (!isMailConfigured()) throw new Error("Email delivery is not configured: set SMTP_HOST/SMTP_USER/SMTP_PASSWORD or EMAIL_USERNAME/EMAIL_PASSWORD");
};

const getTransport = (): Transporter => {
  if (transport) return transport;
  assertMailConfigured();
  const shared = {
    auth: { user: mailUser(), pass: mailPassword() },
    pool: true,
    maxConnections: 2,
    maxMessages: 100,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  };
  transport = process.env.SMTP_HOST
    ? nodemailer.createTransport({ ...shared, host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT || 587) === 465,
      requireTLS: process.env.SMTP_REQUIRE_TLS !== "false" && Number(process.env.SMTP_PORT || 587) !== 465 })
    : nodemailer.createTransport({ ...shared, service: "Gmail" });
  return transport;
};

export const verifyMailConnection = async () => { await getTransport().verify(); };
export const closeMailTransport = () => { transport?.close(); transport = undefined; };

export const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  await getTransport().sendMail({
    from: process.env.EMAIL_FROM || `"JobHub" <${mailUser()}>`,
    to,
    subject,
    text,
  });
};
