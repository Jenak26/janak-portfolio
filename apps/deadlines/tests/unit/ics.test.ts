import { describe, expect, it } from "vitest";
import { toICS } from "../../src/domain/ics";
import { DEFAULT_COURSES, normalizeBoard } from "../../src/store/schema";

const TODAY = "2026-10-08";

describe("calendar export", () => {
  const board = normalizeBoard(DEFAULT_COURSES, [
    { id: "a", title: "CN quiz, chapter 3", course: "cn", due: "2026-10-15", lead: 2 },
    { id: "b", title: "Cloud talk", course: "cloud", from: "2026-10-12", due: "2026-10-16", lead: 0 },
    { id: "c", title: "Done thing", due: "2026-10-20", done: true },
    { id: "d", title: "Past", due: "2026-10-01" },
    { id: "e", title: "Undated" },
    { id: "f", title: "Lab", due: "2026-10-10", lead: 1 },
  ]);
  const { text, count } = toICS(board, TODAY, new Date("2026-10-08T10:00:00Z"));

  it("exports only open, dated, upcoming items", () => {
    expect(count).toBe(3);
    expect(text.match(/BEGIN:VEVENT/g)).toHaveLength(3);
    expect(text).not.toContain("Done thing");
    expect(text).not.toContain("Undated");
  });

  it("writes all-day events, ranges and escaped summaries", () => {
    expect(text).toContain("DTSTART;VALUE=DATE:20261015\r\nDTEND;VALUE=DATE:20261016");
    expect(text).toContain("SUMMARY:CN: CN quiz\\, chapter 3");
    expect(text).toContain("DTSTART;VALUE=DATE:20261012\r\nDTEND;VALUE=DATE:20261017");
  });

  it("sets alerts at 9:00 on the start day and the day before", () => {
    // Start day is 2 days before: 2 * 24 - 9 = 39 hours before midnight on the due day.
    expect(text).toContain("TRIGGER:-P1DT15H");
    // The day before at 9:00 is 15 hours before midnight.
    expect(text).toContain("TRIGGER:-PT15H");
  });

  it("uses CRLF line endings and folds long lines", () => {
    expect(text.split("\r\n").every(l => new TextEncoder().encode(l).length <= 75)).toBe(true);
    expect(text.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
  });
});
