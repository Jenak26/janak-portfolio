/* Calendar dates as local "YYYY-MM-DD" strings. Strings compare correctly with < and >,
   survive JSON untouched and never drift across time zones or daylight saving. */
export type ISODate = string;

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const pad = (n: number) => String(n).padStart(2, "0");

export function toISO(d: Date): ISODate {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function makeISO(year: number, monthIndex: number, day: number): ISODate | null {
  const d = new Date(year, monthIndex, day);
  if (d.getFullYear() !== year || d.getMonth() !== monthIndex || d.getDate() !== day) return null;
  return toISO(d);
}

export function fromISO(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const y = +m[1], mo = +m[2] - 1, day = +m[3];
  const d = new Date(y, mo, day);
  return d.getFullYear() === y && d.getMonth() === mo && d.getDate() === day ? d : null;
}

export const isISODate = (s: unknown): s is ISODate => typeof s === "string" && fromISO(s) !== null;

export const todayISO = (now: Date = new Date()): ISODate => toISO(now);

function parts(s: ISODate): [number, number, number] {
  const d = fromISO(s);
  if (!d) throw new RangeError("Not a date: " + s);
  return [d.getFullYear(), d.getMonth(), d.getDate()];
}

export function addDays(s: ISODate, n: number): ISODate {
  const [y, m, d] = parts(s);
  return toISO(new Date(y, m, d + n));
}

/** Whole days from b to a (a minus b). */
export function diffDays(a: ISODate, b: ISODate): number {
  const [ay, am, ad] = parts(a), [by, bm, bd] = parts(b);
  return Math.round((Date.UTC(ay, am, ad) - Date.UTC(by, bm, bd)) / 864e5);
}

export const weekday = (s: ISODate): number => fromISO(s)!.getDay();
export const dayOfMonth = (s: ISODate): number => +s.slice(8, 10);
export const monthIndex = (s: ISODate): number => +s.slice(5, 7) - 1;

/** "Thu 15 Oct" */
export const dayLabel = (s: ISODate): string => `${WEEKDAYS[weekday(s)]} ${dayOfMonth(s)} ${MONTHS[monthIndex(s)]}`;

/** "Thursday 15 October", for screen readers. */
export const dayLabelLong = (s: ISODate): string =>
  `${WEEKDAYS_LONG[weekday(s)]} ${dayOfMonth(s)} ${MONTHS_LONG[monthIndex(s)]}`;

/** "today", "tomorrow", "in 3 days", "2 days ago" */
export function relative(n: number): string {
  if (n === 0) return "today";
  if (n === 1) return "tomorrow";
  if (n === -1) return "yesterday";
  return n > 0 ? `in ${n} days` : `${-n} days ago`;
}

export const plural = (n: number, one: string, many = one + "s") => `${n} ${n === 1 ? one : many}`;

/** "12 to 16 Oct" or "28 Oct to 2 Nov" */
export function rangeLabel(from: ISODate, to: ISODate): string {
  const same = monthIndex(from) === monthIndex(to);
  return same
    ? `${dayOfMonth(from)} to ${dayOfMonth(to)} ${MONTHS[monthIndex(to)]}`
    : `${dayOfMonth(from)} ${MONTHS[monthIndex(from)]} to ${dayOfMonth(to)} ${MONTHS[monthIndex(to)]}`;
}
