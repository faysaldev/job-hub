/** Convert a recruiter's local wall-clock appointment to unambiguous UTC instants. */
export type InterviewSlot = { date: Date; startAt: Date; endAt: Date; start_time: string; end_time: string; timeZone: string };
const MINUTE = 60_000;
const isoDay = (date: string | Date) => {
  const text = date instanceof Date ? date.toISOString() : date;
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(text);
  if (!match) throw new Error("Choose a valid interview date");
  const dateOnly = match[0].slice(0, 10);
  if (new Date(`${dateOnly}T00:00:00.000Z`).toISOString().slice(0, 10) !== dateOnly)
    throw new Error("Choose a valid calendar date");
  return dateOnly;
};
const minutes = (value: string) => {
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) throw new Error("Use 24-hour time (HH:mm)");
  return Number(value.slice(0, 2)) * 60 + Number(value.slice(3));
};
const wallMilliseconds = (instant: number, timeZone: string) => {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(instant));
  const field = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return Date.UTC(field("year"), field("month") - 1, field("day"), field("hour"), field("minute"));
};
const asUtc = (day: string, clock: string, timeZone: string) => {
  const [y, m, d] = day.split("-").map(Number);
  const target = Date.UTC(y, m - 1, d, Math.floor(minutes(clock) / 60), minutes(clock) % 60);
  let guess = target;
  for (let i = 0; i < 5; i++) {
    const next = guess + target - wallMilliseconds(guess, timeZone);
    if (next === guess) break;
    guess = next;
  }
  if (wallMilliseconds(guess, timeZone) !== target) throw new Error("Time does not exist in the selected time zone (DST transition)");
  // Fall-back hours are ambiguous; request another time instead of silently choosing a different instant.
  for (const delta of [-60, -30, 30, 60]) {
    if (wallMilliseconds(guess + delta * MINUTE, timeZone) === target)
      throw new Error("Time occurs twice during daylight-saving change; choose another time");
  }
  return new Date(guess);
};
export const createInterviewSlot = (input: { date: string | Date; start_time: string; end_time: string; timeZone?: string }, now = new Date()): InterviewSlot => {
  const timeZone = input.timeZone || "UTC";
  try { new Intl.DateTimeFormat("en-GB", { timeZone }); }
  catch { throw new Error("Enter a valid IANA time zone (e.g. Asia/Dhaka)"); }
  const day = isoDay(input.date);
  const duration = minutes(input.end_time) - minutes(input.start_time);
  if (duration < 15 || duration > 480) throw new Error("Interview must last 15 minutes to 8 hours on the same day");
  const startAt = asUtc(day, input.start_time, timeZone);
  const endAt = asUtc(day, input.end_time, timeZone);
  if (startAt.getTime() <= now.getTime()) throw new Error("Interview start must be in the future");
  return { date: new Date(`${day}T00:00:00.000Z`), startAt, endAt,
    start_time: input.start_time, end_time: input.end_time, timeZone };
};
