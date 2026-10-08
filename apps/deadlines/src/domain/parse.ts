/* Quick add: reads course, type and date out of a line like "CN quiz 15 oct".
   Pure: the caller passes today and the course list, so every rule is unit tested.

   Rules that keep it from guessing wrong:
   - Month names only count next to a day number, so "may", "march past" and "30 marks" stay text.
   - Weekdays and course codes only match whole words, so "monitor" is not Monday.
   - A date more than 60 days in the past is taken to mean next year. */
import { addDays, diffDays, makeISO, weekday, type ISODate } from "./dates";
import type { Course, Kind } from "../store/schema";

export interface QuickAdd {
  title: string;
  course?: string;
  kind?: Kind;
  due?: ISODate;
  /** Set when the text gave a range: the day is not fixed yet. */
  from?: ISODate;
  /** The words that were read as the date, as typed. */
  dateText?: string;
}

const MONTH = "(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)";
const DAY = "(\\d{1,2})(?:st|nd|rd|th)?";
const YEAR = "(?:,?\\s+(\\d{4}))?";
const TO = "\\s*(?:to|till|until|and|-|–)\\s*";
const B = "(?<![\\p{L}\\p{N}])"; // word start
const E = "(?![\\p{L}\\p{N}])"; // word end

const WEEKDAY = "(sun(?:day)?|mon(?:day)?|tue(?:s(?:day)?)?|wed(?:nesday)?|thu(?:r(?:s(?:day)?)?)?|fri(?:day)?|sat(?:urday)?)";
const WEEKDAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const MONTH_KEYS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const monthOf = (word: string) => MONTH_KEYS.indexOf(word.slice(0, 3).toLowerCase());

const KIND_RULES: [Kind, RegExp][] = [
  ["present", /\b(presentations?|present|seminar|viva|demo)\b/],
  ["attend", /\b(lectures?|workshop|attend|talk|webinar)\b/],
  ["test", /\b(quiz(?:zes)?|exams?|mid ?terms?|tests?|cat|fat|finals?)\b/],
  ["submit", /\b(submit|submission|case study|assignments?|report|review|project|paper|essay|homework|da|deadline)\b/],
];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

interface Hit { start: number; end: number; due: ISODate; from?: ISODate }

/** Picks a year for a day and month with no year given. */
function infer(day: number, month: number, today: ISODate, year?: number): ISODate | null {
  if (month < 0 || day < 1 || day > 31) return null;
  if (year) return makeISO(year, month, day);
  const y = +today.slice(0, 4);
  const date = makeISO(y, month, day);
  if (!date) return makeISO(y + 1, month, day);
  return diffDays(date, today) < -60 ? makeISO(y + 1, month, day) : date;
}

function nextWeekday(today: ISODate, target: number, mode: "next-after" | "this" | "next-week"): ISODate {
  const wd = weekday(today);
  if (mode === "next-after") {
    let n = (target - wd + 7) % 7;
    if (n === 0) n = 7;
    return addDays(today, n);
  }
  // Weeks run Monday to Sunday.
  const mondayThis = addDays(today, -((wd + 6) % 7));
  const offset = (target + 6) % 7;
  if (mode === "this") {
    const d = addDays(mondayThis, offset);
    return d < today ? addDays(d, 7) : d;
  }
  return addDays(mondayThis, 7 + offset);
}

function findDate(text: string, today: ISODate): Hit | null {
  const s = text.toLowerCase();
  const tries: [RegExp, (m: RegExpExecArray) => Omit<Hit, "start" | "end"> | null][] = [
    // 12 to 16 oct, between 12 and 16 October
    [new RegExp(`${B}(?:between\\s+)?${DAY}${TO}${DAY}\\s+(?:of\\s+)?${MONTH}${YEAR}${E}`, "u"), m => {
      const month = monthOf(m[3]), year = m[4] ? +m[4] : undefined;
      const a = infer(+m[1], month, today, year), b = infer(+m[2], month, today, year);
      return a && b && a < b ? { from: a, due: b } : null;
    }],
    // 28 oct to 2 nov
    [new RegExp(`${B}(?:between\\s+)?${DAY}\\s+(?:of\\s+)?${MONTH}${TO}${DAY}\\s+(?:of\\s+)?${MONTH}${YEAR}${E}`, "u"), m => {
      const year = m[5] ? +m[5] : undefined;
      const a = infer(+m[1], monthOf(m[2]), today, year);
      let b = infer(+m[3], monthOf(m[4]), today, year);
      if (a && b && b < a && !year) b = infer(+m[3], monthOf(m[4]), today, +a.slice(0, 4) + 1);
      return a && b && a < b ? { from: a, due: b } : null;
    }],
    // oct 12 to 16
    [new RegExp(`${B}(?:between\\s+)?${MONTH}\\s+${DAY}${TO}${DAY}${YEAR}${E}`, "u"), m => {
      const month = monthOf(m[1]), year = m[4] ? +m[4] : undefined;
      const a = infer(+m[2], month, today, year), b = infer(+m[3], month, today, year);
      return a && b && a < b ? { from: a, due: b } : null;
    }],
    // 15 oct, 22nd October, 1st of nov 2027
    [new RegExp(`${B}${DAY}\\s*(?:of\\s+)?${MONTH}${YEAR}${E}`, "u"), m => {
      const due = infer(+m[1], monthOf(m[2]), today, m[3] ? +m[3] : undefined);
      return due ? { due } : null;
    }],
    // oct 15, October 22nd
    [new RegExp(`${B}${MONTH}\\s+${DAY}${YEAR}${E}`, "u"), m => {
      const due = infer(+m[2], monthOf(m[1]), today, m[3] ? +m[3] : undefined);
      return due ? { due } : null;
    }],
    [new RegExp(`${B}day after tomorrow${E}`, "u"), () => ({ due: addDays(today, 2) })],
    [new RegExp(`${B}(?:today|tonight)${E}`, "u"), () => ({ due: today })],
    [new RegExp(`${B}(?:tomorrow|tmrw|tmr)${E}`, "u"), () => ({ due: addDays(today, 1) })],
    [new RegExp(`${B}in\\s+(\\d{1,2}|a|one|two|three)\\s+(days?|weeks?)${E}`, "u"), m => {
      const words: Record<string, number> = { a: 1, one: 1, two: 2, three: 3 };
      const n = words[m[1]] ?? +m[1];
      return { due: addDays(today, m[2].startsWith("week") ? n * 7 : n) };
    }],
    [new RegExp(`${B}next\\s+week${E}`, "u"), () => ({ due: nextWeekday(today, 1, "next-week") })],
    [new RegExp(`${B}(next|this)\\s+${WEEKDAY}${E}`, "u"), m => {
      const target = WEEKDAY_KEYS.indexOf(m[2].slice(0, 3));
      return { due: nextWeekday(today, target, m[1] === "next" ? "next-week" : "this") };
    }],
    [new RegExp(`${B}${WEEKDAY}${E}`, "u"), m => ({ due: nextWeekday(today, WEEKDAY_KEYS.indexOf(m[1].slice(0, 3)), "next-after") })],
  ];
  for (const [re, read] of tries) {
    const m = re.exec(s);
    if (!m) continue;
    const got = read(m);
    // A date-shaped phrase that is not a real date (31 feb, 16 to 12 oct) stops the search,
    // so a fragment of it is never read as some other date.
    if (!got) return null;
    return { ...got, start: m.index, end: m.index + m[0].length };
  }
  return null;
}

function stripDate(text: string, hit: Hit): string {
  let before = text.slice(0, hit.start).replace(/\s*\b(on|by|due|before|till|until|from|for|at)\s*$/i, "");
  const after = text.slice(hit.end);
  before = before.replace(/[\s,.;:-]+$/, "");
  const joined = (before + " " + after.replace(/^[\s,.;:-]+/, "")).replace(/\s+/g, " ").trim();
  return joined;
}

export function parseQuickAdd(text: string, today: ISODate, courses: Course[]): QuickAdd {
  const raw = text.trim();
  const out: QuickAdd = { title: raw };
  const low = " " + raw.toLowerCase() + " ";

  for (const c of courses) {
    const words = [c.name.toLowerCase(), ...c.aliases].filter(Boolean);
    if (words.some(w => new RegExp(`${B}${escape(w)}${E}`, "u").test(low))) { out.course = c.id; break; }
  }
  const kindText = low.replace(/[.,;:!?()]/g, " ");
  for (const [k, re] of KIND_RULES) if (re.test(kindText)) { out.kind = k; break; }

  const hit = findDate(raw, today);
  if (hit) {
    out.due = hit.due;
    if (hit.from) out.from = hit.from;
    out.dateText = raw.slice(hit.start, hit.end).trim();
    const title = stripDate(raw, hit);
    if (title) out.title = title;
  }
  return out;
}
