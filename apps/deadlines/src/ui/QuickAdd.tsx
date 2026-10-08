import { useMemo, useState } from "preact/hooks";
import { addDays, dayLabel, plural, rangeLabel, type ISODate } from "../domain/dates";
import { parseQuickAdd } from "../domain/parse";
import { DEFAULT_LEAD, KINDS, type Course } from "../store/schema";
import type { Draft } from "./Editor";

interface Props {
  courses: Course[];
  today: ISODate;
  defaultCourse: string | null;
  disabled: boolean;
  onAdd: (d: Draft) => void;
  onMore: (d: Draft, opener: HTMLElement) => void;
}

export function toDraft(text: string, today: ISODate, courses: Course[], defaultCourse: string | null): Draft {
  const p = parseQuickAdd(text, today, courses);
  const kind = p.kind ?? "submit";
  return { title: p.title, course: p.course ?? defaultCourse ?? "other", kind, due: p.due ?? "", from: p.from ?? "", lead: DEFAULT_LEAD[kind] };
}

export function QuickAdd({ courses, today, defaultCourse, disabled, onAdd, onMore }: Props) {
  const [text, setText] = useState("");
  const draft = useMemo(() => (text.trim() ? toDraft(text, today, courses, defaultCourse) : null), [text, today, courses, defaultCourse]);
  const course = draft && courses.find(c => c.id === draft.course);

  const submit = (e: Event) => {
    e.preventDefault();
    if (!draft || disabled) return;
    onAdd(draft);
    setText("");
  };

  return (
    <form class="qa" onSubmit={submit} aria-label="Quick add">
      <div class="qa-row">
        <label for="qa-input" class="sr-only">Add a deadline. Type the course, what it is and when, like CN quiz 15 oct.</label>
        <input id="qa-input" type="text" value={text} disabled={disabled} maxLength={200} autocomplete="off" autocapitalize="sentences"
          enterKeyHint="done" placeholder="Add: CN quiz 15 oct" aria-describedby="qa-hint"
          onInput={e => setText(e.currentTarget.value)}
          onKeyDown={e => { if (e.key === "Escape") setText(""); }} />
        <button type="submit" class="btn solid" disabled={disabled || !draft}>Add</button>
      </div>
      <div class="qa-hint" id="qa-hint" aria-live="polite">
        {draft ? (
          <>
            <span class="sr-only">Will add: </span>
            <span class="tag" style={{ "--c": `var(--c-${course?.color ?? "slate"})` }}><i aria-hidden="true" />{course?.name ?? "Other"}</span>
            <span class="tag">{KINDS[draft.kind!]}</span>
            <span class={"tag" + (draft.due ? "" : " dash")}>
              {draft.from ? `Day not fixed, ${rangeLabel(draft.from, draft.due!)}` : draft.due ? dayLabel(draft.due) : "No date yet"}
            </span>
            {draft.due && draft.lead ? <span class="tag dash">Start {dayLabel(addDays(draft.from || draft.due, -draft.lead))}, {plural(draft.lead, "day")} prep</span> : null}
            <button type="button" class="link-btn" onClick={e => { onMore(draft, e.currentTarget as HTMLElement); setText(""); }}>More details</button>
          </>
        ) : (
          <span>Type the course, what it is and when. Today, fri, next week, 15 oct and 12 to 16 oct all work.</span>
        )}
      </div>
    </form>
  );
}
