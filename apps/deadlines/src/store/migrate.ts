/* Schema migrations. Each step takes the previous version's shape to the next one.
   Saved data, imported backups and v1 data all come through here. */
import { DEFAULT_COURSES, normalizeBoard, SCHEMA_VERSION, type BoardState } from "./schema";

export class MigrationError extends Error {
  constructor(public reason: "shape" | "future", message: string) { super(message); }
}

type Raw = Record<string, unknown>;

/* v1: {v: 1, tasks}. Courses were fixed in code, so they become the default list.
   Tasks gain steps, doneAt and updatedAt. v1 backups added {app, exported}, which is ignored. */
function v1to2(d: Raw): Raw {
  return {
    v: 2,
    courses: DEFAULT_COURSES,
    tasks: (d.tasks as unknown[]).map(t => ({ ...(t as Raw), steps: [], doneAt: null, updatedAt: 0 })),
  };
}

const STEPS: Record<number, (d: Raw) => Raw> = { 1: v1to2 };

export function versionOf(data: unknown): number | null {
  if (Array.isArray(data)) return 1; // v1 import accepted a bare task array
  if (!data || typeof data !== "object") return null;
  const v = (data as Raw).v;
  return typeof v === "number" && Number.isInteger(v) && v >= 1 ? v : null;
}

/** Brings any known version up to the current schema and validates it. Throws MigrationError. */
export function migrate(data: unknown): { state: BoardState; from: number } {
  const from = versionOf(data);
  if (from === null) throw new MigrationError("shape", "No schema version");
  if (from > SCHEMA_VERSION) throw new MigrationError("future", `Saved by a newer version (v${from})`);
  let d: Raw = Array.isArray(data) ? { v: 1, tasks: data } : (data as Raw);
  if (!Array.isArray(d.tasks)) throw new MigrationError("shape", "No task list");
  if (!(d.tasks as unknown[]).every(t => t && typeof t === "object" && typeof (t as Raw).title === "string")) {
    throw new MigrationError("shape", "A task has no title");
  }
  for (let v = from; v < SCHEMA_VERSION; v++) d = STEPS[v](d);
  return { state: normalizeBoard(d.courses, d.tasks), from };
}
