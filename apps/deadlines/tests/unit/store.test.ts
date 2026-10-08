import { describe, expect, it } from "vitest";
import fixture from "../fixtures/v1-storage.json";
import { addTask, deleteTask, replaceBoard, setDone, setStep, updateTask } from "../../src/store/actions";
import { migrate, MigrationError } from "../../src/store/migrate";
import { DEFAULT_COURSES, normalizeBoard } from "../../src/store/schema";
import { SEED_V1 } from "../../src/store/seed";
import { backupText, GOOD_KEY, KEY, load, QUARANTINE_PREFIX, readBackup, save, V1_KEY, type KV } from "../../src/store/storage";

function memKV(init: Record<string, string> = {}, opts: { full?: boolean } = {}): KV & { data: Record<string, string> } {
  const data = { ...init };
  return {
    data,
    get: k => (k in data ? data[k] : null),
    set: (k, v) => {
      if (opts.full) { const e = new Error("full"); e.name = "QuotaExceededError"; throw e; }
      data[k] = v;
    },
  };
}

describe("migrations", () => {
  it("takes v1 storage to v2 without losing fields", () => {
    const { state, from } = migrate(fixture);
    expect(from).toBe(1);
    expect(state.v).toBe(2);
    expect(state.tasks).toHaveLength(fixture.tasks.length);
    const v1 = fixture.tasks[1];
    const t = state.tasks.find(x => x.id === v1.id)!;
    expect(t).toMatchObject({ title: v1.title, course: v1.course, kind: v1.kind, due: v1.due, from: v1.from, lead: v1.lead, note: v1.note, done: v1.done, steps: [] });
    expect(state.tasks.find(x => x.id === fixture.tasks[0].id)!.done).toBe(true);
    expect(state.courses.map(c => c.id)).toEqual(DEFAULT_COURSES.map(c => c.id));
  });

  it("accepts v1 backup files and bare arrays", () => {
    expect(migrate({ app: "deadline-board", v: 1, exported: "x", tasks: SEED_V1 }).state.tasks).toHaveLength(14);
    expect(migrate(SEED_V1).state.tasks).toHaveLength(14);
  });

  it("maps unknown courses to Other and repairs bad fields", () => {
    const { state } = migrate({ v: 1, tasks: [{ id: "x", title: "Odd", course: "maths", due: "2026-02-30", from: "nope", lead: "abc", kind: "party" }] });
    expect(state.tasks[0]).toMatchObject({ course: "other", due: "", from: "", lead: 0, kind: "other" });
  });

  it("keeps v2 data as it is", () => {
    const v2 = normalizeBoard(DEFAULT_COURSES, [{ id: "a", title: "A", steps: [{ id: "s", text: "Step", done: true }] }]);
    expect(migrate(JSON.parse(JSON.stringify(v2))).state).toEqual(v2);
  });

  it("refuses data from a newer version and junk", () => {
    expect(() => migrate({ v: 3, tasks: [] })).toThrow(MigrationError);
    expect(() => migrate({ v: 3, tasks: [] })).toThrow(/newer/);
    expect(() => migrate({ hello: 1 })).toThrow(MigrationError);
    expect(() => migrate({ v: 1, tasks: [{ nope: 1 }] })).toThrow(MigrationError);
    expect(() => migrate(null)).toThrow(MigrationError);
  });
});

describe("loading", () => {
  it("seeds the v1 list on a first run", () => {
    const r = load(memKV());
    expect(r.source).toBe("seeded");
    expect(r.state.tasks.map(t => t.id)).toEqual(SEED_V1.map(t => t.id));
    expect(r.needsSave).toBe(true);
  });

  it("migrates v1 data on first run and leaves the v1 key alone", () => {
    const raw = JSON.stringify(fixture);
    const kv = memKV({ [V1_KEY]: raw });
    const r = load(kv);
    expect(r.source).toBe("migrated");
    expect(r.notice).toMatch(/Moved 14 deadlines/);
    expect(r.state.tasks[0].done).toBe(true);
    expect(kv.data[V1_KEY]).toBe(raw);
  });

  it("prefers v2 data over v1 data once migrated", () => {
    const v2 = normalizeBoard(DEFAULT_COURSES, [{ id: "only", title: "Only v2" }]);
    const r = load(memKV({ [KEY]: JSON.stringify(v2), [V1_KEY]: JSON.stringify(fixture) }));
    expect(r.source).toBe("saved");
    expect(r.state.tasks.map(t => t.id)).toEqual(["only"]);
  });

  it("keeps a last good copy and recovers from it when the main copy is corrupt", () => {
    const v2 = normalizeBoard(DEFAULT_COURSES, [{ id: "a", title: "Keep me" }]);
    const kv = memKV({ [KEY]: JSON.stringify(v2) });
    load(kv);
    expect(kv.data[GOOD_KEY]).toBe(kv.data[KEY]);
    kv.data[KEY] = "{not json";
    const r = load(kv, 123);
    expect(r.source).toBe("recovered");
    expect(r.state.tasks[0].title).toBe("Keep me");
    expect(kv.data[QUARANTINE_PREFIX + 123]).toBe("{not json");
  });

  it("never seeds over unreadable data", () => {
    const kv = memKV({ [KEY]: "garbage" });
    const r = load(kv, 5);
    expect(r.source).toBe("empty");
    expect(r.state.tasks).toEqual([]);
    expect(r.needsSave).toBe(false);
    expect(kv.data[KEY]).toBe("garbage");
    expect(kv.data[QUARANTINE_PREFIX + 5]).toBe("garbage");
  });

  it("goes read-only for data from a newer version", () => {
    const kv = memKV({ [KEY]: JSON.stringify({ v: 9, courses: [], tasks: [{ id: "f", title: "Future" }] }) });
    const r = load(kv);
    expect(r.readOnly).toBe(true);
    expect(r.state.tasks[0].title).toBe("Future");
  });
});

describe("saving", () => {
  it("reports a full storage instead of throwing", () => {
    expect(save(normalizeBoard(DEFAULT_COURSES, []), memKV({}, { full: true }))).toEqual({ ok: false, reason: "quota" });
    const kv = memKV();
    expect(save(normalizeBoard(DEFAULT_COURSES, []), kv)).toEqual({ ok: true });
    expect(JSON.parse(kv.data[KEY]).v).toBe(2);
  });

  it("round-trips a backup", () => {
    const s = migrate(fixture).state;
    expect(readBackup(backupText(s))).toEqual(s);
    expect(() => readBackup("not json")).toThrow(MigrationError);
  });
});

describe("actions and undo", () => {
  const base = () => normalizeBoard(DEFAULT_COURSES, [{ id: "a", title: "A" }, { id: "b", title: "B", steps: [{ id: "s1", text: "One" }] }, { id: "c", title: "C" }]);

  it("ticks and undoes without touching later edits", () => {
    const c1 = setDone(base(), "a", true, 1000);
    expect(c1.state.tasks[0].done).toBe(true);
    expect(c1.state.tasks[0].doneAt).toBe(new Date(1000).toISOString());
    const later = setDone(c1.state, "c", true).state;
    const undone = c1.undo!(later);
    expect(undone.tasks.find(t => t.id === "a")!.done).toBe(false);
    expect(undone.tasks.find(t => t.id === "c")!.done).toBe(true);
  });

  it("deletes and undoes back into the same place", () => {
    const c = deleteTask(base(), "b");
    expect(c.state.tasks.map(t => t.id)).toEqual(["a", "c"]);
    expect(c.undo!(c.state).tasks.map(t => t.id)).toEqual(["a", "b", "c"]);
    expect(c.undo!(c.undo!(c.state)).tasks).toHaveLength(3);
  });

  it("adds, edits and ticks steps", () => {
    const added = addTask(base(), { title: "New", course: "cn", due: "2026-10-15" });
    expect(added.state.tasks).toHaveLength(4);
    expect(added.undo!(added.state).tasks).toHaveLength(3);
    const edited = updateTask(added.state, added.id, { title: "Renamed", steps: [{ id: "x", text: "Step", done: false }] });
    expect(edited.state.tasks[3]).toMatchObject({ title: "Renamed", course: "cn" });
    const stepped = setStep(edited.state, added.id, "x", true);
    expect(stepped.state.tasks[3].steps[0].done).toBe(true);
    expect(stepped.undo!(stepped.state).tasks[3].steps[0].done).toBe(false);
  });

  it("undoes a backup import", () => {
    const before = base();
    const c = replaceBoard(before, normalizeBoard(DEFAULT_COURSES, []));
    expect(c.undo!(c.state)).toBe(before);
  });
});
