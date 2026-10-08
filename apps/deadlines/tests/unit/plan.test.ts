import { describe, expect, it } from "vitest";
import { addDays, dayLabel, diffDays, fromISO, makeISO, rangeLabel, relative } from "../../src/domain/dates";
import { crunches, nextToStart, plate, prepWindow, remainingPrep, skyline, slack, startDate } from "../../src/domain/plan";
import { normalizeTask, type Task } from "../../src/store/schema";

const TODAY = "2026-10-08";
const ids = new Set(["dbms", "cn", "os", "cloud", "compiler", "ai", "other"]);
const task = (o: Partial<Task> & { id: string }): Task => normalizeTask({ title: o.id, course: "cn", kind: "test", ...o }, ids);

describe("dates", () => {
  it("adds and diffs across month, year and DST boundaries", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(diffDays("2026-11-02", "2026-10-25")).toBe(8); // spans a European DST change
    expect(diffDays("2026-03-30", "2026-03-07")).toBe(23); // spans a US DST change
    expect(diffDays("2026-10-08", "2026-10-15")).toBe(-7);
  });

  it("rejects impossible dates", () => {
    expect(fromISO("2026-02-30")).toBeNull();
    expect(fromISO("2026-13-01")).toBeNull();
    expect(fromISO("15 oct")).toBeNull();
    expect(makeISO(2027, 1, 29)).toBeNull();
  });

  it("labels days and ranges", () => {
    expect(dayLabel("2026-10-15")).toBe("Thu 15 Oct");
    expect(rangeLabel("2026-10-12", "2026-10-16")).toBe("12 to 16 Oct");
    expect(rangeLabel("2026-10-28", "2026-11-02")).toBe("28 Oct to 2 Nov");
    expect(relative(0)).toBe("today");
    expect(relative(1)).toBe("tomorrow");
    expect(relative(-3)).toBe("3 days ago");
  });
});

describe("start date and slack", () => {
  it("counts prep back from the due date", () => {
    expect(startDate(task({ id: "a", due: "2026-10-15", lead: 2 }))).toBe("2026-10-13");
    expect(startDate(task({ id: "a", due: "" }))).toBeNull();
  });

  it("counts prep back from the earliest day when the day is not fixed", () => {
    expect(startDate(task({ id: "a", from: "2026-10-12", due: "2026-10-16", lead: 3 }))).toBe("2026-10-09");
  });

  it("shrinks remaining prep as steps are ticked", () => {
    const steps = [{ id: "1", text: "a", done: true }, { id: "2", text: "b", done: false }, { id: "3", text: "c", done: false }, { id: "4", text: "d", done: false }];
    const t = task({ id: "a", due: "2026-10-15", lead: 7, steps });
    expect(remainingPrep(t)).toBe(6);
    expect(remainingPrep({ ...t, steps: steps.map(s => ({ ...s, done: true })) })).toBe(0);
    expect(remainingPrep(task({ id: "b", lead: 4 }))).toBe(4);
  });

  it("computes slack as days left minus remaining prep", () => {
    expect(slack(task({ id: "a", due: "2026-10-15", lead: 5 }), TODAY)).toBe(2);
    expect(slack(task({ id: "a", due: "2026-10-10", lead: 5 }), TODAY)).toBe(-3);
  });
});

describe("on your plate", () => {
  it("includes only open dated work whose start day has arrived", () => {
    const list = [
      task({ id: "starts-today", due: "2026-10-10", lead: 2 }),
      task({ id: "starts-later", due: "2026-10-20", lead: 2 }),
      task({ id: "done", due: "2026-10-09", lead: 2, done: true }),
      task({ id: "undated", due: "" }),
    ];
    expect(plate(list, TODAY).map(x => x.task.id)).toEqual(["starts-today"]);
  });

  it("orders by urgency: overdue first, then least slack, then earliest", () => {
    const list = [
      task({ id: "roomy", due: "2026-10-12", lead: 4 }), // slack 0
      task({ id: "tight", due: "2026-10-10", lead: 5 }), // slack -3
      task({ id: "late", due: "2026-10-05", lead: 1 }), // overdue 3
      task({ id: "later-late", due: "2026-10-07", lead: 0 }), // overdue 1
      task({ id: "also-roomy", due: "2026-10-11", lead: 3 }), // slack 0, earlier day
    ];
    expect(plate(list, TODAY).map(x => x.task.id)).toEqual(["late", "later-late", "tight", "also-roomy", "roomy"]);
  });

  it("finds the next thing to start when the plate is empty", () => {
    const list = [task({ id: "a", due: "2026-10-20", lead: 2 }), task({ id: "b", due: "2026-10-14", lead: 1 })];
    expect(nextToStart(list, TODAY)).toEqual({ task: list[1], inDays: 5 });
  });
});

describe("crunches", () => {
  it("ignores items with no prep, done items and past items", () => {
    expect(prepWindow(task({ id: "a", due: "2026-10-12", lead: 0 }), TODAY)).toBeNull();
    expect(prepWindow(task({ id: "a", due: "2026-10-12", lead: 2, done: true }), TODAY)).toBeNull();
    expect(prepWindow(task({ id: "a", due: "2026-10-01", lead: 2 }), TODAY)).toBeNull();
    expect(prepWindow(task({ id: "a", due: "2026-10-09", lead: 5 }), TODAY)).toEqual(["2026-10-08", "2026-10-09"]);
  });

  it("flags stretches where three or more prep windows overlap", () => {
    const list = [
      task({ id: "a", due: "2026-10-15", lead: 5 }), // 10..15
      task({ id: "b", due: "2026-10-15", lead: 2 }), // 13..15
      task({ id: "c", due: "2026-10-14", lead: 3 }), // 11..14
      task({ id: "d", due: "2026-10-25", lead: 2 }), // 23..25 alone
    ];
    expect(crunches(list, TODAY)).toEqual([{ from: "2026-10-13", to: "2026-10-14", peak: 3, ids: ["a", "b", "c"] }]);
  });

  it("reports separate stretches and the peak", () => {
    const list = [
      task({ id: "a", due: "2026-10-12", lead: 2 }),
      task({ id: "b", due: "2026-10-12", lead: 2 }),
      task({ id: "c", due: "2026-10-12", lead: 2 }),
      task({ id: "d", due: "2026-10-12", lead: 1 }),
      task({ id: "e", due: "2026-10-22", lead: 1 }),
      task({ id: "f", due: "2026-10-22", lead: 1 }),
      task({ id: "g", due: "2026-10-22", lead: 1 }),
    ];
    const got = crunches(list, TODAY);
    expect(got.map(c => [c.from, c.to, c.peak])).toEqual([["2026-10-10", "2026-10-12", 4], ["2026-10-21", "2026-10-22", 3]]);
  });

  it("returns nothing below the threshold", () => {
    expect(crunches([task({ id: "a", due: "2026-10-12", lead: 3 }), task({ id: "b", due: "2026-10-12", lead: 3 })], TODAY)).toEqual([]);
  });
});

describe("skyline range", () => {
  it("spans today to at least 13 days ahead and to the last due date", () => {
    const days = skyline([task({ id: "a", due: "2026-10-30" })], TODAY, []);
    expect(days[0].date).toBe(TODAY);
    expect(days[days.length - 1].date).toBe("2026-10-30");
    expect(skyline([task({ id: "a", due: "2026-10-09" })], TODAY, []).length).toBe(14);
  });

  it("reaches back for open overdue work, at most 14 days", () => {
    expect(skyline([task({ id: "a", due: "2026-10-05" })], TODAY, [])[0].date).toBe("2026-10-05");
    expect(skyline([task({ id: "a", due: "2026-09-01" })], TODAY, [])[0].date).toBe("2026-09-24");
  });

  it("caps the range at 60 days and places ranges as maybe", () => {
    const days = skyline([task({ id: "a", due: "2027-03-01" }), task({ id: "r", from: "2026-10-12", due: "2026-10-14" })], TODAY, []);
    expect(days.length).toBe(60);
    expect(days.filter(d => d.maybe.length).map(d => d.date)).toEqual(["2026-10-12", "2026-10-13", "2026-10-14"]);
  });
});
