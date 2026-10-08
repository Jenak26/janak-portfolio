import { describe, expect, it } from "vitest";
import { parseQuickAdd } from "../../src/domain/parse";
import { DEFAULT_COURSES } from "../../src/store/schema";

/* 2026-10-08 is a Thursday. */
const TODAY = "2026-10-08";
const p = (s: string, today = TODAY) => parseQuickAdd(s, today, DEFAULT_COURSES);

describe("quick add: dates", () => {
  it("reads today and tomorrow", () => {
    expect(p("OS lab today").due).toBe("2026-10-08");
    expect(p("OS lab tonight").due).toBe("2026-10-08");
    expect(p("OS lab tomorrow").due).toBe("2026-10-09");
    expect(p("OS lab tmrw").due).toBe("2026-10-09");
    expect(p("OS lab day after tomorrow").due).toBe("2026-10-10");
  });

  it("reads weekday names as the next one after today", () => {
    expect(p("quiz friday").due).toBe("2026-10-09");
    expect(p("quiz fri").due).toBe("2026-10-09");
    expect(p("quiz monday").due).toBe("2026-10-12");
    expect(p("quiz Mon").due).toBe("2026-10-12");
    expect(p("quiz tues").due).toBe("2026-10-13");
    // Same weekday as today means a week from now.
    expect(p("quiz thursday").due).toBe("2026-10-15");
  });

  it("reads next and this with weekdays", () => {
    expect(p("viva next friday").due).toBe("2026-10-16");
    expect(p("viva next monday").due).toBe("2026-10-12");
    expect(p("viva this friday").due).toBe("2026-10-09");
    expect(p("viva this thursday").due).toBe("2026-10-08");
  });

  it("reads next week as the Monday of next week", () => {
    expect(p("report next week").due).toBe("2026-10-12");
    expect(p("report next week", "2026-10-12").due).toBe("2026-10-19");
    expect(p("report next week", "2026-10-11").due).toBe("2026-10-12");
  });

  it("reads in N days and weeks", () => {
    expect(p("essay in 3 days").due).toBe("2026-10-11");
    expect(p("essay in a week").due).toBe("2026-10-15");
    expect(p("essay in 2 weeks").due).toBe("2026-10-22");
  });

  it("reads day then month", () => {
    expect(p("CN quiz 15 oct").due).toBe("2026-10-15");
    expect(p("CN quiz 15th October").due).toBe("2026-10-15");
    expect(p("CN quiz 22nd October").due).toBe("2026-10-22");
    expect(p("CN quiz 1st of nov").due).toBe("2026-11-01");
    expect(p("CN quiz 3 Sept").due).toBe("2026-09-03");
    expect(p("CN quiz 3 aug").due).toBe("2027-08-03");
  });

  it("reads month then day", () => {
    expect(p("CN quiz oct 15").due).toBe("2026-10-15");
    expect(p("CN quiz October 22nd").due).toBe("2026-10-22");
    expect(p("CN quiz Nov 3").due).toBe("2026-11-03");
  });

  it("respects an explicit year and rolls past dates into next year", () => {
    expect(p("exam 15 oct 2027").due).toBe("2027-10-15");
    expect(p("exam 10 jan").due).toBe("2027-01-10");
    // A few weeks back stays this year, so a late entry still shows as overdue.
    expect(p("exam 20 sep").due).toBe("2026-09-20");
  });

  it("reads ranges as day not fixed", () => {
    expect(p("Cloud presentation 12 to 16 oct")).toMatchObject({ from: "2026-10-12", due: "2026-10-16" });
    expect(p("Cloud presentation 12-16 oct")).toMatchObject({ from: "2026-10-12", due: "2026-10-16" });
    expect(p("Cloud presentation oct 12 to 16")).toMatchObject({ from: "2026-10-12", due: "2026-10-16" });
    expect(p("Cloud presentation between 12 and 16 October")).toMatchObject({ from: "2026-10-12", due: "2026-10-16" });
    expect(p("Cloud presentation 28 oct to 2 nov")).toMatchObject({ from: "2026-10-28", due: "2026-11-02" });
  });

  it("ignores impossible dates", () => {
    expect(p("thing 31 feb").due).toBeUndefined();
    expect(p("thing 40 oct").due).toBeUndefined();
    expect(p("thing 16 to 12 oct").due).toBeUndefined();
  });
});

describe("quick add: things that are not dates", () => {
  it("does not read 30 marks as 30 March", () => {
    expect(p("AI research paper 30 marks").due).toBeUndefined();
    expect(p("AI research paper for 30 marks 15 oct").due).toBe("2026-10-15");
    expect(p("AI research paper 30 marks").title).toBe("AI research paper 30 marks");
  });

  it("does not read monitor as Monday or similar words as weekdays", () => {
    expect(p("CN monitor setup").due).toBeUndefined();
    expect(p("satellite report").due).toBeUndefined();
    expect(p("wedding card").due).toBeUndefined();
    expect(p("sundial model").due).toBeUndefined();
    expect(p("frit test").due).toBeUndefined();
  });

  it("does not read a month word without a day", () => {
    expect(p("you may submit late").due).toBeUndefined();
    expect(p("march past practice").due).toBeUndefined();
    expect(p("decide topic").due).toBeUndefined();
    expect(p("lab 2026 report").due).toBeUndefined();
  });

  it("does not read next week inside other words", () => {
    expect(p("context weekly").due).toBeUndefined();
  });
});

describe("quick add: title, course and type", () => {
  it("strips the date phrase and a leading connector from the title", () => {
    expect(p("CN quiz 15 oct").title).toBe("CN quiz");
    expect(p("OS lab due tomorrow").title).toBe("OS lab");
    expect(p("DBMS project by next friday").title).toBe("DBMS project");
    expect(p("Cloud talk on 12 to 16 oct").title).toBe("Cloud talk");
    expect(p("15 oct CN quiz").title).toBe("CN quiz");
  });

  it("keeps the original text when the date is all there is", () => {
    expect(p("tomorrow").title).toBe("tomorrow");
  });

  it("reports the matched date text", () => {
    expect(p("CN quiz 15 oct").dateText).toBe("15 oct");
  });

  it("detects the course", () => {
    expect(p("CN quiz 15 oct").course).toBe("cn");
    expect(p("dbms lab project").course).toBe("dbms");
    expect(p("databases assignment").course).toBe("dbms");
    expect(p("operating systems review").course).toBe("os");
    expect(p("aws lab").course).toBe("cloud");
    expect(p("random errand").course).toBeUndefined();
    // Course codes only match as whole words.
    expect(p("costume cnc").course).toBeUndefined();
  });

  it("uses custom course aliases", () => {
    const courses = [...DEFAULT_COURSES, { id: "maths", name: "Maths", color: "red" as const, aliases: ["la", "linear algebra"] }];
    expect(parseQuickAdd("linear algebra quiz fri", TODAY, courses).course).toBe("maths");
    expect(parseQuickAdd("Maths sheet", TODAY, courses).course).toBe("maths");
  });

  it("detects the type", () => {
    expect(p("CN quiz").kind).toBe("test");
    expect(p("OS mid term 2").kind).toBe("test");
    expect(p("cloud presentation").kind).toBe("present");
    expect(p("DBMS guest lecture").kind).toBe("attend");
    expect(p("DBMS case study").kind).toBe("submit");
    expect(p("buy snacks").kind).toBeUndefined();
  });
});
