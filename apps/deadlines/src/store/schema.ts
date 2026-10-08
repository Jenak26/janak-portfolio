import { isISODate, type ISODate } from "../domain/dates";

export const SCHEMA_VERSION = 2;

/* Colour keys map to CSS custom properties (--c-<key>) with a light and a dark value each. */
export const PALETTE = ["blue", "pink", "amber", "teal", "violet", "green", "red", "orange", "cyan", "slate"] as const;
export type ColorKey = (typeof PALETTE)[number];

export const KINDS = { test: "Test", submit: "Submit", present: "Present", attend: "Attend", other: "Other" } as const;
export type Kind = keyof typeof KINDS;

/** Prep days a quick add gets when nothing else is said. Editable afterwards. */
export const DEFAULT_LEAD: Record<Kind, number> = { test: 2, submit: 3, present: 2, attend: 0, other: 0 };

export const LEAD_CHOICES = [0, 1, 2, 3, 4, 5, 7, 10, 14, 21];

export interface Course {
  id: string;
  name: string;
  color: ColorKey;
  /** Lowercase words that mean this course in quick add. The name always counts too. */
  aliases: string[];
}

export interface Step {
  id: string;
  text: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  course: string;
  kind: Kind;
  /** Due date. With `from` set, the last possible day of a window whose exact day is not fixed. */
  due: ISODate | "";
  /** Earliest possible day when the exact day is not fixed yet, else "". */
  from: ISODate | "";
  /** Days of prep needed before the first possible day. */
  lead: number;
  note: string;
  done: boolean;
  doneAt: string | null;
  steps: Step[];
  updatedAt: number;
}

export interface BoardState {
  v: typeof SCHEMA_VERSION;
  courses: Course[];
  tasks: Task[];
}

export const OTHER_COURSE = "other";

/* v1 shipped exactly these courses and colours, so they are the defaults and the migration target. */
export const DEFAULT_COURSES: Course[] = [
  { id: "dbms", name: "DBMS", color: "blue", aliases: ["dbms", "dbs", "database", "databases"] },
  { id: "cn", name: "CN", color: "pink", aliases: ["cn", "network", "networks", "networking"] },
  { id: "os", name: "OS", color: "amber", aliases: ["os", "operating"] },
  { id: "cloud", name: "Cloud", color: "teal", aliases: ["cloud", "aws"] },
  { id: "compiler", name: "Compiler", color: "violet", aliases: ["compiler", "compilers", "cd"] },
  { id: "ai", name: "AI", color: "green", aliases: ["ai", "artificial"] },
  { id: OTHER_COURSE, name: "Other", color: "slate", aliases: [] },
];

export function newId(prefix = "t"): string {
  const rnd = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().replace(/-/g, "").slice(0, 10)
    : Math.random().toString(36).slice(2, 12);
  return prefix + Date.now().toString(36) + rnd;
}

const str = (x: unknown, max: number, fallback = "") => (typeof x === "string" ? x : fallback).slice(0, max);

export function normalizeStep(x: unknown): Step | null {
  if (!x || typeof x !== "object") return null;
  const o = x as Record<string, unknown>;
  const text = str(o.text, 200).trim();
  if (!text) return null;
  return { id: typeof o.id === "string" && o.id ? o.id : newId("s"), text, done: o.done === true };
}

/** Coerces anything task-shaped into a valid Task. Unknown courses fall back to Other. */
export function normalizeTask(x: unknown, courseIds: Set<string>, fallbackId?: string): Task {
  const o = (x && typeof x === "object" ? x : {}) as Record<string, unknown>;
  const due = isISODate(o.due) ? o.due : "";
  let from = due && isISODate(o.from) ? o.from : "";
  if (from && from >= due) from = "";
  const lead = Math.max(0, Math.min(60, Math.round(Number(o.lead)) || 0));
  const course = typeof o.course === "string" && courseIds.has(o.course) ? o.course : OTHER_COURSE;
  const kind = typeof o.kind === "string" && o.kind in KINDS ? (o.kind as Kind) : "other";
  const done = o.done === true;
  const steps = Array.isArray(o.steps) ? o.steps.map(normalizeStep).filter((s): s is Step => s !== null).slice(0, 50) : [];
  return {
    id: typeof o.id === "string" && o.id ? o.id.slice(0, 80) : fallbackId ?? newId(),
    title: str(o.title, 200, "Untitled").trim() || "Untitled",
    course, kind, due, from, lead,
    note: str(o.note, 300),
    done,
    doneAt: done ? (typeof o.doneAt === "string" ? o.doneAt : null) : null,
    steps,
    updatedAt: typeof o.updatedAt === "number" && Number.isFinite(o.updatedAt) ? o.updatedAt : 0,
  };
}

export function normalizeCourse(x: unknown): Course | null {
  if (!x || typeof x !== "object") return null;
  const o = x as Record<string, unknown>;
  const id = str(o.id, 40).trim();
  const name = str(o.name, 30).trim();
  if (!id || !name) return null;
  const color = PALETTE.includes(o.color as ColorKey) ? (o.color as ColorKey) : "slate";
  const aliases = Array.isArray(o.aliases)
    ? [...new Set(o.aliases.filter((a): a is string => typeof a === "string").map(a => a.trim().toLowerCase()).filter(Boolean))].slice(0, 12)
    : [];
  return { id, name, color, aliases };
}

/** Courses with duplicates dropped and Other always present. */
export function normalizeCourses(list: unknown): Course[] {
  const out: Course[] = [];
  const seen = new Set<string>();
  for (const c of Array.isArray(list) ? list.map(normalizeCourse) : []) {
    if (c && !seen.has(c.id)) { seen.add(c.id); out.push(c); }
  }
  if (!seen.has(OTHER_COURSE)) out.push({ ...DEFAULT_COURSES[DEFAULT_COURSES.length - 1] });
  return out;
}

export function normalizeBoard(courses: unknown, tasks: unknown): BoardState {
  const cs = normalizeCourses(courses);
  const ids = new Set(cs.map(c => c.id));
  const seen = new Set<string>();
  const ts: Task[] = [];
  (Array.isArray(tasks) ? tasks : []).forEach((x, i) => {
    let t = normalizeTask(x, ids, newId() + i);
    if (seen.has(t.id)) t = { ...t, id: newId() + i };
    seen.add(t.id);
    ts.push(t);
  });
  return { v: SCHEMA_VERSION, courses: cs, tasks: ts };
}

export const courseById = (state: BoardState, id: string): Course =>
  state.courses.find(c => c.id === id) ?? state.courses.find(c => c.id === OTHER_COURSE)!;
