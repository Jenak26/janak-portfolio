/* Calendar export. The app cannot remind you on its own (iOS home screen apps cannot schedule
   notifications without a push server), so this hands the dates to the calendar, which can.
   Each open dated deadline becomes an all-day event with alerts at 9:00 on the start day and
   at 9:00 the day before it is due. */
import { addDays, type ISODate } from "./dates";
import { anchor, startDate } from "./plan";
import type { BoardState } from "../store/schema";

const compact = (d: ISODate) => d.replace(/-/g, "");

function escapeText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Folds lines at 75 octets as RFC 5545 asks. */
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let cur = "";
  let size = 0;
  for (const ch of line) {
    const n = new TextEncoder().encode(ch).length;
    if (size + n > (out.length ? 74 : 75)) { out.push(cur); cur = ""; size = 0; }
    cur += ch; size += n;
  }
  out.push(cur);
  return out.join("\r\n ");
}

function alarm(trigger: string, text: string): string[] {
  return ["BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${escapeText(text)}`, `TRIGGER:${trigger}`, "END:VALARM"];
}

/** Whole days and hours as an ISO 8601 duration relative to the event start (midnight). */
function offset(days: number, hour: number): string {
  // An alert at `hour` o'clock `days` days before midnight on the event day.
  const total = days * 24 - hour;
  if (total <= 0) return `PT${-total}H`;
  const d = Math.floor(total / 24), h = total % 24;
  return `-P${d ? d + "D" : ""}${h ? "T" + h + "H" : d ? "" : "T0H"}`;
}

export function toICS(state: BoardState, today: ISODate, now = new Date()): { text: string; count: number } {
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const names = new Map(state.courses.map(c => [c.id, c.name]));
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//janakkabra.in//Deadlines 2//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:Deadlines"];
  let count = 0;
  for (const t of state.tasks) {
    if (t.done || !t.due || t.due < today) continue;
    count++;
    const first = anchor(t);
    const course = names.get(t.course) ?? "Other";
    const desc = [
      t.from ? `Day not fixed yet. Could be any day from ${t.from} to ${t.due}.` : "",
      t.lead ? `Start prep on ${startDate(t)}.` : "",
      t.steps.length ? "Steps: " + t.steps.map(s => (s.done ? "[x] " : "[ ] ") + s.text).join("; ") : "",
      t.note,
    ].filter(Boolean).join("\n");
    lines.push(
      "BEGIN:VEVENT",
      `UID:${t.id}@deadlines.janakkabra.in`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compact(first)}`,
      `DTEND;VALUE=DATE:${compact(addDays(t.due, 1))}`,
      `SUMMARY:${escapeText(`${course}: ${t.title}`)}`,
      ...(desc ? [`DESCRIPTION:${escapeText(desc)}`] : []),
      "TRANSP:TRANSPARENT",
    );
    if (t.lead > 0 && startDate(t)! >= today) lines.push(...alarm(offset(t.lead, 9), `Start prep: ${t.title}`));
    if (!t.from && t.lead !== 1) lines.push(...alarm(offset(1, 9), `Due tomorrow: ${t.title}`));
    if (t.from) lines.push(...alarm(offset(1, 9), `Could be due from tomorrow: ${t.title}`));
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return { text: lines.map(fold).join("\r\n") + "\r\n", count };
}
