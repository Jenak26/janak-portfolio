import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { dayLabelLong, dayOfMonth, MONTHS, plural, rangeLabel, weekday, WEEKDAYS, type ISODate } from "../domain/dates";
import { skyline, type Crunch } from "../domain/plan";
import type { Course, Task } from "../store/schema";

interface Props {
  tasks: Task[];
  courses: Course[];
  today: ISODate;
  crunchList: Crunch[];
  onPickDay: (date: ISODate, target: string | null) => void;
}

export const groupId = (t: Pick<Task, "due" | "from">) => (t.due ? (t.from ? `g-${t.from}_${t.due}` : `g-${t.due}`) : "g-none");

export function Skyline({ tasks, courses, today, crunchList, onPickDay }: Props) {
  const days = useMemo(() => skyline(tasks, today, crunchList), [tasks, today, crunchList]);
  const order = useMemo(() => new Map(courses.map((c, i) => [c.id, i])), [courses]);
  const color = useMemo(() => new Map(courses.map(c => [c.id, c.color])), [courses]);
  const todayIndex = Math.max(0, days.findIndex(d => d.date === today));
  const [focus, setFocus] = useState(todayIndex);
  const row = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const idx = Math.min(focus, Math.max(0, days.length - 1));

  // Start scrolled so today is near the left edge with a little of the past in view.
  useEffect(() => {
    const el = scroller.current, btn = row.current?.children[todayIndex] as HTMLElement | undefined;
    if (el && btn) el.scrollLeft = Math.max(0, btn.offsetLeft - el.clientWidth * 0.15);
  }, [days.length > 0, todayIndex]);

  if (!days.length) return null;
  const rows = Math.max(4, ...days.map(d => d.exact.length + d.maybe.length));
  const sortCourse = (a: Task, b: Task) => (order.get(a.course) ?? 99) - (order.get(b.course) ?? 99);
  const hasMaybe = days.some(d => d.maybe.length);
  const hasCrunch = days.some(d => d.crunch);

  const move = (to: number) => {
    const n = Math.max(0, Math.min(days.length - 1, to));
    setFocus(n);
    const btn = row.current?.children[n] as HTMLElement | undefined;
    btn?.focus();
    btn?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };
  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: idx + 1, ArrowLeft: idx - 1, Home: 0, End: days.length - 1, PageDown: idx + 7, PageUp: idx - 7 };
    if (e.key in map) { e.preventDefault(); move(map[e.key]); }
  };

  return (
    <section class="sky-wrap" aria-labelledby="sky-h">
      <h2 id="sky-h" class="sr-only">Skyline of due dates</h2>
      <div class="sky" ref={scroller}>
        <div class="sky-row" ref={row} role="group" aria-label={`Days from ${dayLabelLong(days[0].date)} to ${dayLabelLong(days[days.length - 1].date)}. Use the arrow keys to move between days.`} onKeyDown={onKey}>
          {days.map((d, i) => {
            const open = d.exact.filter(t => !t.done);
            const wd = weekday(d.date);
            const names = [...d.exact, ...d.maybe].map(t => t.title + (t.done ? ", done" : "") + (t.from ? ", day not fixed" : ""));
            const label = [
              dayLabelLong(d.date) + (d.date === today ? ", today" : ""),
              d.exact.length ? `${plural(d.exact.length, "thing")} due, ${open.length} open` : "nothing due",
              d.maybe.length ? `${d.maybe.length} could land on this day` : "",
              names.length ? names.join("; ") : "",
              d.crunch ? "inside a crunch" : "",
            ].filter(Boolean).join(". ");
            const target = d.exact.length ? `g-${d.date}` : d.maybe.length ? groupId(d.maybe[0]) : null;
            const first = i === 0 || dayOfMonth(d.date) === 1;
            return (
              <button
                key={d.date}
                type="button"
                class={["day", wd === 0 || wd === 6 ? "off" : "", wd === 1 && i > 0 ? "mon" : "", d.date === today ? "now" : "", open.length >= 3 ? "heavy" : "", d.crunch ? "crunch" : ""].filter(Boolean).join(" ")}
                tabIndex={i === idx ? 0 : -1}
                aria-current={d.date === today ? "date" : undefined}
                onFocus={() => setFocus(i)}
                onClick={() => onPickDay(d.date, target)}
              >
                <span class="sr-only">{label}</span>
                <span class="mo" aria-hidden="true">{first ? MONTHS[+d.date.slice(5, 7) - 1] : ""}</span>
                <span class="cnt" aria-hidden="true">{open.length >= 2 ? open.length : ""}</span>
                <span class="stack" style={{ height: `${rows * 15 + 3}px` }} aria-hidden="true">
                  {[...d.maybe].sort(sortCourse).map(t => <i key={t.id} class={"blk maybe" + (t.done ? " done" : "")} style={{ "--c": `var(--c-${color.get(t.course) ?? "slate"})` }} />)}
                  {[...d.exact].sort(sortCourse).map(t => <i key={t.id} class={"blk" + (t.done ? " done" : "")} style={{ "--c": `var(--c-${color.get(t.course) ?? "slate"})` }} />)}
                </span>
                <span class="band" aria-hidden="true" />
                <span class="wd" aria-hidden="true">{WEEKDAYS[wd][0]}</span>
                <span class="dn" aria-hidden="true">{dayOfMonth(d.date)}</span>
              </button>
            );
          })}
        </div>
      </div>
      <p class="sky-cap">
        <span>{rangeLabel(days[0].date, days[days.length - 1].date)}. One block is one thing due. Tap a day to see it, or an empty day to add to it.</span>
        {hasMaybe && <span class="key"><i class="k-maybe" aria-hidden="true" />Could land on that day</span>}
        {hasCrunch && <span class="key"><i class="k-crunch" aria-hidden="true" />Crunch: 3 or more preps at once</span>}
      </p>
    </section>
  );
}

