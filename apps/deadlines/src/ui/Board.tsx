import { dayLabel, dayOfMonth, diffDays, MONTHS, plural, rangeLabel, relative, WEEKDAYS, weekday, type ISODate } from "../domain/dates";
import { anchor, nextToStart, type Crunch, type PlateItem } from "../domain/plan";
import { courseById, type BoardState, type Task } from "../store/schema";
import { Row } from "./Row";
import { groupId } from "./Skyline";

interface RowHandlers {
  readOnly: boolean;
  onToggle: (t: Task, done: boolean) => void;
  onEdit: (t: Task, opener: HTMLElement) => void;
  onStep: (t: Task, stepId: string, done: boolean) => void;
}

interface PlateProps extends RowHandlers {
  state: BoardState;
  tasks: Task[];
  items: PlateItem[];
  crunchList: Crunch[];
  today: ISODate;
}

export function Plate({ state, tasks, items, crunchList, today, ...h }: PlateProps) {
  const open = tasks.filter(t => !t.done && t.due);
  if (!open.length) return null;
  const titles = new Map(tasks.map(t => [t.id, t.title]));
  const soon = crunchList.filter(c => diffDays(c.from, today) <= 21);
  const nx = items.length ? null : nextToStart(tasks, today);
  return (
    <section class="plate" aria-labelledby="plate-h">
      <div class="gh">
        <h2 id="plate-h">On your plate</h2>
        {items.length > 0 && <span class="rel">{plural(items.length, "thing")}, most urgent first</span>}
      </div>
      {items.length ? (
        <ul class="tasks">
          {items.map(it => <Row key={it.task.id} task={it.task} course={courseById(state, it.task.course)} today={today} plateItem={it} {...h} />)}
        </ul>
      ) : (
        <p class="plate-none">
          Nothing has to start today.{nx ? ` Next up is ${nx.task.title}, start ${relative(nx.inDays)}.` : ""}
        </p>
      )}
      {soon.map(c => (
        <p class="crunch-note" key={c.from}>
          <span class="stripe" aria-hidden="true" />
          <span>
            <b>Crunch {c.from === c.to ? `on ${dayLabel(c.from)}` : `${dayLabel(c.from)} to ${dayLabel(c.to)}`}.</b>{" "}
            Up to {c.peak} preps at once. Starting one early eases it.
            <small>{c.ids.map(id => titles.get(id)).join(", ")}</small>
          </span>
        </p>
      ))}
    </section>
  );
}

interface GroupsProps extends RowHandlers {
  state: BoardState;
  tasks: Task[];
  today: ISODate;
  hideDone: boolean;
  filtered: boolean;
}

export function DayGroups({ state, tasks, today, hideDone, filtered, ...h }: GroupsProps) {
  if (!state.tasks.length) {
    return <p class="empty">Nothing here yet. Add a deadline above to start the board.</p>;
  }
  const groups = new Map<string, Task[]>();
  for (const t of tasks) {
    if (hideDone && t.done) continue;
    const key = groupId(t);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }
  const keys = [...groups.keys()].sort((a, b) => {
    if (a === "g-none") return 1;
    if (b === "g-none") return -1;
    const sa = a.slice(2, 12), sb = b.slice(2, 12);
    return sa < sb ? -1 : sa > sb ? 1 : a.length - b.length;
  });
  const out = [];
  for (const key of keys) {
    const items = groups.get(key)!.sort((a, b) => Number(a.done) - Number(b.done) || a.title.localeCompare(b.title));
    const openN = items.filter(t => !t.done).length;
    const sample = items[0];
    // Past days with everything ticked are history; they drop off.
    if (sample.due && sample.due < today && openN === 0) continue;
    out.push(
      <section class="group" id={key} key={key} aria-labelledby={`${key}-h`}>
        <div class="gh">{header(sample, key, openN, today)}</div>
        <ul class="tasks">
          {items.map(t => <Row key={t.id} task={t} course={courseById(state, t.course)} today={today} {...h} />)}
        </ul>
      </section>,
    );
  }
  if (!out.length) {
    return <p class="empty">{hideDone ? "Nothing open here. Turn off Hide done to see finished work." : filtered ? "Nothing here for this course." : "Nothing to show."}</p>;
  }
  return <div>{out}</div>;
}

function header(t: Task, key: string, openN: number, today: ISODate) {
  const id = `${key}-h`;
  if (!t.due) {
    return <><h2 id={id} tabIndex={-1}>No date yet</h2><span class="rel">find out and set one</span></>;
  }
  if (!t.from) {
    const n = diffDays(t.due, today);
    return (
      <>
        <h2 id={id} tabIndex={-1}><span aria-hidden="true">{dayOfMonth(t.due)}</span><span class="sr-only">{dayLabel(t.due)}</span></h2>
        <span class="w" aria-hidden="true">{WEEKDAYS[weekday(t.due)]}, {MONTHS[+t.due.slice(5, 7) - 1]}</span>
        {openN >= 3 && <span class="load">{openN} due</span>}
        <span class={"rel" + (n < 0 && openN ? " late" : "")}>{relative(n)}</span>
      </>
    );
  }
  const na = diffDays(anchor(t), today), nb = diffDays(t.due, today);
  return (
    <>
      <h2 id={id} tabIndex={-1}>{rangeLabel(t.from, t.due).replace(/ [A-Z][a-z]{2}$/, "")}</h2>
      <span class="w">{MONTHS[+t.due.slice(5, 7) - 1]}, day not fixed</span>
      <span class={"rel" + (nb < 0 && openN ? " late" : "")}>{na > 0 ? "earliest " + relative(na) : nb >= 0 ? "any day now" : relative(nb)}</span>
    </>
  );
}

export function Summary({ tasks, today }: { tasks: Task[]; today: ISODate }) {
  if (!tasks.length) return null;
  const open = tasks.filter(t => !t.done);
  if (!open.length) return <p class="sum"><strong>Everything is ticked off.</strong></p>;
  const late = open.filter(t => t.due && t.due < today).length;
  const next = open.filter(t => t.due && t.due >= today).sort((a, b) => (anchor(a) < anchor(b) ? -1 : 1))[0];
  const byDay: Record<string, number> = {};
  for (const t of open) if (t.due && !t.from && t.due >= today) byDay[t.due] = (byDay[t.due] || 0) + 1;
  let top: string | null = null;
  for (const k of Object.keys(byDay).sort()) if (byDay[k] >= 3 && (!top || byDay[k] > byDay[top])) top = k;
  const undated = open.filter(t => !t.due).length;
  return (
    <p class="sum">
      <strong>{open.length} open.</strong>{" "}
      {late > 0 && <><span class="late">{late} overdue.</span>{" "}</>}
      {next && `Next is ${next.title}, ${next.from ? (anchor(next) > today ? "earliest " + relative(diffDays(anchor(next), today)) : "any day now") : relative(diffDays(next.due, today))}. `}
      {top && `Heaviest day is ${dayLabel(top)} with ${byDay[top]} due. `}
      {undated > 0 && `${undated} ${undated === 1 ? "has" : "have"} no date yet.`}
    </p>
  );
}
