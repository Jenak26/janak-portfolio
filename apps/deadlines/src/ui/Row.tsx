import { useState } from "preact/hooks";
import { dayLabel, diffDays, plural, rangeLabel, relative, type ISODate } from "../domain/dates";
import { progress, startDate, type PlateItem } from "../domain/plan";
import { KINDS, type Course, type Task } from "../store/schema";

interface Props {
  task: Task;
  course: Course;
  today: ISODate;
  plateItem?: PlateItem;
  readOnly: boolean;
  onToggle: (t: Task, done: boolean) => void;
  onEdit: (t: Task, opener: HTMLElement) => void;
  onStep: (t: Task, stepId: string, done: boolean) => void;
}

const Chevron = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
);

function slackPill(item: PlateItem) {
  if (item.overdue) return <span class="pill late">{plural(item.overdue, "day")} overdue</span>;
  if (item.slack > 0) return <span class="pill ok">{plural(item.slack, "day")} spare</span>;
  if (item.slack === 0) return <span class="pill tight">No days spare</span>;
  return <span class="pill late">{plural(-item.slack, "day")} behind</span>;
}

function plateLine(t: Task, today: ISODate): { text: string; late: boolean } {
  const nb = diffDays(t.due, today);
  if (t.from) {
    const na = diffDays(t.from, today);
    if (na > 0) return { text: `Could be as early as ${dayLabel(t.from)}, ${relative(na)}`, late: false };
    if (nb >= 0) return { text: `Could be any day up to ${dayLabel(t.due)}`, late: false };
    return { text: `Was due by ${dayLabel(t.due)}`, late: true };
  }
  return nb >= 0 ? { text: `Due ${dayLabel(t.due)}, ${relative(nb)}`, late: false } : { text: `Was due ${dayLabel(t.due)}, ${relative(nb)}`, late: true };
}

function listLine(t: Task, today: ISODate): { text: string; late: boolean } | null {
  if (t.done || !t.due || !t.lead) return null;
  const s = startDate(t)!;
  const n = diffDays(s, today);
  if (n > 0) return { text: `Start by ${dayLabel(s)}`, late: false };
  if (n === 0) return { text: "Start today", late: false };
  return { text: `Should have started ${relative(n)}`, late: true };
}

export function Row({ task: t, course, today, plateItem, readOnly, onToggle, onEdit, onStep }: Props) {
  const [open, setOpen] = useState(false);
  const { done, total } = progress(t);
  const line = plateItem ? plateLine(t, today) : listLine(t, today);
  const stepsId = `steps-${plateItem ? "p" : "l"}-${t.id}`;
  const next = t.steps.find(s => !s.done);
  return (
    <li class={"task" + (t.done ? " done" : "")} style={{ "--c": `var(--c-${course.color})` }}>
      <label class="box">
        <input type="checkbox" checked={t.done} disabled={readOnly} aria-label={`Done: ${t.title}`}
          onChange={e => onToggle(t, (e.currentTarget as HTMLInputElement).checked)} />
      </label>
      <button class="body" type="button" disabled={readOnly} onClick={e => onEdit(t, e.currentTarget as HTMLElement)}>
        <span class="sr-only">Edit </span>
        <span class="t">{t.title}</span>
        <span class="m">
          <span class="c">{course.name}</span>
          {t.kind !== "other" && <span>{KINDS[t.kind]}</span>}
          {!plateItem && t.from && <span>{rangeLabel(t.from, t.due)}</span>}
          {plateItem && slackPill(plateItem)}
        </span>
        {line && <span class={"s" + (line.late ? " late" : "")}>{line.text}</span>}
        {plateItem && next && <span class="n">Next step: {next.text}</span>}
        {!plateItem && t.note && <span class="n">{t.note}</span>}
        {total > 0 && (
          <span class="prog" aria-hidden="true">
            <span class="bar"><span style={{ width: `${(done / total) * 100}%` }} /></span>
          </span>
        )}
      </button>
      {total > 0 && (
        <button type="button" class="steps-toggle" aria-expanded={open} aria-controls={stepsId} onClick={() => setOpen(!open)}>
          <Chevron />{done} of {total} steps done
        </button>
      )}
      {total > 0 && (
        <ul class="steps" id={stepsId} aria-label={`Steps for ${t.title}`} hidden={!open}>
          {t.steps.map(s => (
            <li key={s.id} class={s.done ? "done" : ""}>
              <label>
                <input type="checkbox" checked={s.done} disabled={readOnly} onChange={e => onStep(t, s.id, (e.currentTarget as HTMLInputElement).checked)} />
                <span>{s.text}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
