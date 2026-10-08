/* Pure board edits. Each returns the next state; the ones that can be undone also return
   an inverse that is applied to whatever the state is by then, so undoing one change never
   rolls back an unrelated change made in between. */
import { normalizeTask, newId, type BoardState, type Course, type Task } from "./schema";

export type Inverse = (s: BoardState) => BoardState;
export interface Change { state: BoardState; undo?: Inverse; label: string }

const courseIds = (s: BoardState) => new Set(s.courses.map(c => c.id));
const touch = (t: Task, now: number): Task => ({ ...t, updatedAt: now });

export type TaskInput = Partial<Omit<Task, "id" | "updatedAt">> & { title: string };

export function addTask(s: BoardState, input: TaskInput, now = Date.now()): Change & { id: string } {
  const id = newId();
  const t = normalizeTask({ ...input, id, updatedAt: now }, courseIds(s));
  return {
    id,
    state: { ...s, tasks: [...s.tasks, t] },
    undo: cur => ({ ...cur, tasks: cur.tasks.filter(x => x.id !== id) }),
    label: `Added ${t.title}`,
  };
}

export function updateTask(s: BoardState, id: string, input: TaskInput, now = Date.now()): Change {
  const before = s.tasks.find(t => t.id === id);
  if (!before) return { state: s, label: "" };
  const merged = { ...before, ...input, id };
  if (merged.done && !before.done) merged.doneAt = new Date(now).toISOString();
  const next = normalizeTask({ ...merged, updatedAt: now }, courseIds(s));
  return {
    state: { ...s, tasks: s.tasks.map(t => (t.id === id ? next : t)) },
    undo: cur => ({ ...cur, tasks: cur.tasks.map(t => (t.id === id ? before : t)) }),
    label: `Saved ${next.title}`,
  };
}

export function setDone(s: BoardState, id: string, done: boolean, now = Date.now()): Change {
  const before = s.tasks.find(t => t.id === id);
  if (!before || before.done === done) return { state: s, label: "" };
  const apply = (cur: BoardState, value: boolean, at: string | null): BoardState =>
    ({ ...cur, tasks: cur.tasks.map(t => (t.id === id ? touch({ ...t, done: value, doneAt: at }, now) : t)) });
  return {
    state: apply(s, done, done ? new Date(now).toISOString() : null),
    undo: cur => apply(cur, before.done, before.doneAt),
    label: done ? `Ticked off ${before.title}` : `Reopened ${before.title}`,
  };
}

export function deleteTask(s: BoardState, id: string): Change {
  const index = s.tasks.findIndex(t => t.id === id);
  if (index < 0) return { state: s, label: "" };
  const removed = s.tasks[index];
  return {
    state: { ...s, tasks: s.tasks.filter(t => t.id !== id) },
    undo: cur => {
      if (cur.tasks.some(t => t.id === id)) return cur;
      const tasks = cur.tasks.slice();
      tasks.splice(Math.min(index, tasks.length), 0, removed);
      return { ...cur, tasks };
    },
    label: `Deleted ${removed.title}`,
  };
}

export function setStep(s: BoardState, taskId: string, stepId: string, done: boolean, now = Date.now()): Change {
  const t = s.tasks.find(x => x.id === taskId);
  const step = t?.steps.find(x => x.id === stepId);
  if (!t || !step) return { state: s, label: "" };
  const apply = (cur: BoardState, value: boolean): BoardState => ({
    ...cur,
    tasks: cur.tasks.map(x => (x.id === taskId ? touch({ ...x, steps: x.steps.map(st => (st.id === stepId ? { ...st, done: value } : st)) }, now) : x)),
  });
  return { state: apply(s, done), undo: cur => apply(cur, step.done), label: done ? `Ticked ${step.text}` : `Unticked ${step.text}` };
}

/** Replaces the whole board, as a backup import does. Undo brings the old board back. */
export function replaceBoard(s: BoardState, next: BoardState): Change {
  return { state: next, undo: () => s, label: `Imported ${next.tasks.length} deadlines` };
}

export function saveCourses(s: BoardState, courses: Course[]): Change {
  const ids = new Set(courses.map(c => c.id));
  // A course still in use cannot disappear; the editor prevents it, this is the backstop.
  const kept = [...courses, ...s.courses.filter(c => !ids.has(c.id) && s.tasks.some(t => t.course === c.id))];
  return { state: { ...s, courses: kept }, label: "Courses saved" };
}
