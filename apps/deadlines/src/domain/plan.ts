/* Planning maths. All pure, all on ISO date strings. */
import { addDays, diffDays, type ISODate } from "./dates";
import type { Task } from "../store/schema";

/** First day the thing could happen: the earliest possible day, or the due date. */
export const anchor = (t: Task): ISODate => t.from || t.due;

/** The day prep has to begin: the first possible day minus the prep days. */
export const startDate = (t: Task): ISODate | null => (t.due ? addDays(anchor(t), -t.lead) : null);

export function progress(t: Task): { done: number; total: number } {
  return { done: t.steps.filter(s => s.done).length, total: t.steps.length };
}

/** Prep days still needed. Ticking checklist steps shrinks it in proportion. */
export function remainingPrep(t: Task): number {
  if (!t.steps.length) return t.lead;
  const left = t.steps.filter(s => !s.done).length;
  return Math.ceil((t.lead * left) / t.steps.length);
}

/** Days to spare: days left before the first possible day, minus prep still needed. Negative means behind. */
export function slack(t: Task, today: ISODate): number {
  return diffDays(anchor(t), today) - remainingPrep(t);
}

/** Days past the last possible day, or 0. */
export function overdueBy(t: Task, today: ISODate): number {
  return !t.done && t.due && t.due < today ? diffDays(today, t.due) : 0;
}

export interface PlateItem {
  task: Task;
  slack: number;
  overdue: number;
  /** Days until the first possible day. */
  daysLeft: number;
}

/** Open, dated work whose start day has arrived, most urgent first:
    overdue (longest first), then least slack, then earliest day, then title. */
export function plate(tasks: Task[], today: ISODate): PlateItem[] {
  return tasks
    .filter(t => !t.done && t.due && startDate(t)! <= today)
    .map(task => ({ task, slack: slack(task, today), overdue: overdueBy(task, today), daysLeft: diffDays(anchor(task), today) }))
    .sort((a, b) =>
      (b.overdue - a.overdue) ||
      (a.slack - b.slack) ||
      (anchor(a.task) < anchor(b.task) ? -1 : anchor(a.task) > anchor(b.task) ? 1 : 0) ||
      a.task.title.localeCompare(b.task.title));
}

/** The open dated item that starts soonest, for when nothing is on the plate yet. */
export function nextToStart(tasks: Task[], today: ISODate): { task: Task; inDays: number } | null {
  const later = tasks.filter(t => !t.done && t.due && startDate(t)! > today)
    .sort((a, b) => (startDate(a)! < startDate(b)! ? -1 : startDate(a)! > startDate(b)! ? 1 : 0));
  return later.length ? { task: later[0], inDays: diffDays(startDate(later[0])!, today) } : null;
}

export interface Crunch {
  from: ISODate;
  to: ISODate;
  /** Most prep windows open on a single day in the stretch. */
  peak: number;
  /** Every deadline whose prep window touches the stretch. */
  ids: string[];
}

/** Prep window of an open, dated, still-ahead item: from its start day (or today) to its first possible day. */
export function prepWindow(t: Task, today: ISODate): [ISODate, ISODate] | null {
  if (t.done || !t.due || t.lead === 0) return null;
  const end = anchor(t);
  if (end < today) return null;
  const start = startDate(t)!;
  return [start < today ? today : start, end];
}

/** Stretches of days where at least `min` prep windows overlap. */
export function crunches(tasks: Task[], today: ISODate, min = 3): Crunch[] {
  const wins = tasks.map(t => ({ t, w: prepWindow(t, today) })).filter((x): x is { t: Task; w: [ISODate, ISODate] } => x.w !== null);
  if (wins.length < min) return [];
  const first = wins.reduce((m, x) => (x.w[0] < m ? x.w[0] : m), wins[0].w[0]);
  const last = wins.reduce((m, x) => (x.w[1] > m ? x.w[1] : m), wins[0].w[1]);
  const out: Crunch[] = [];
  let cur: Crunch | null = null;
  for (let d = first; d <= last; d = addDays(d, 1)) {
    const open = wins.filter(x => x.w[0] <= d && d <= x.w[1]);
    if (open.length >= min) {
      if (!cur) { cur = { from: d, to: d, peak: 0, ids: [] }; out.push(cur); }
      cur.to = d;
      cur.peak = Math.max(cur.peak, open.length);
      for (const x of open) if (!cur.ids.includes(x.t.id)) cur.ids.push(x.t.id);
    } else cur = null;
  }
  return out;
}

export interface SkyDay {
  date: ISODate;
  /** Due on this exact day. */
  exact: Task[];
  /** Day not fixed, and this day is inside the window. */
  maybe: Task[];
  crunch: boolean;
}

/** The skyline's day range: from the oldest open item (at most 14 days back) to at least 13 days ahead
    and at most 60 days in all, then one entry per day. */
export function skyline(tasks: Task[], today: ISODate, crunchList: Crunch[]): SkyDay[] {
  const dated = tasks.filter(t => t.due);
  if (!dated.length) return [];
  let start = today;
  const firstOpen = dated.filter(t => !t.done).map(anchor).sort()[0];
  if (firstOpen && firstOpen < today) start = firstOpen;
  if (diffDays(today, start) > 14) start = addDays(today, -14);
  let end = addDays(today, 13);
  const lastDue = dated.map(t => t.due).sort().pop()!;
  if (lastDue > end) end = lastDue;
  if (diffDays(end, start) > 59) end = addDays(start, 59);
  const days: SkyDay[] = [];
  for (let d = start; d <= end; d = addDays(d, 1)) {
    days.push({
      date: d,
      exact: dated.filter(t => !t.from && t.due === d),
      maybe: dated.filter(t => t.from && t.from <= d && d <= t.due),
      crunch: crunchList.some(c => c.from <= d && d <= c.to),
    });
  }
  return days;
}
