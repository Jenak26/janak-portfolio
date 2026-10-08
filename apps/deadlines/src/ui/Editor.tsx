import { useRef, useState } from "preact/hooks";
import { plural } from "../domain/dates";
import type { TaskInput } from "../store/actions";
import { KINDS, LEAD_CHOICES, newId, type Course, type Kind, type Step, type Task } from "../store/schema";
import { Dialog } from "./Dialog";

export interface Draft extends Partial<TaskInput> { title: string }

interface Props {
  task: Task | null;
  draft?: Draft;
  courses: Course[];
  opener: HTMLElement | null;
  onSave: (input: TaskInput) => void;
  onDelete: (t: Task) => void;
  onClose: () => void;
}

const leadLabel = (n: number) => (n === 0 ? "None" : n === 7 ? "1 week" : n === 14 ? "2 weeks" : n === 21 ? "3 weeks" : plural(n, "day"));

export function Editor({ task, draft, courses, opener, onSave, onDelete, onClose }: Props) {
  const init = task ?? draft ?? { title: "" };
  const [title, setTitle] = useState(init.title ?? "");
  const [course, setCourse] = useState(init.course ?? "other");
  const [kind, setKind] = useState<Kind>(init.kind ?? "submit");
  const [due, setDue] = useState(init.due ?? "");
  const [notFixed, setNotFixed] = useState(!!init.from);
  const [from, setFrom] = useState(init.from ?? "");
  const [lead, setLead] = useState(init.lead ?? 0);
  const [note, setNote] = useState(init.note ?? "");
  const [steps, setSteps] = useState<Step[]>(init.steps ?? []);
  const [newStep, setNewStep] = useState("");
  const [err, setErr] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const stepRef = useRef<HTMLInputElement>(null);
  const warnedAt = useRef(0);
  const start = useRef(JSON.stringify({ title, course, kind, due, from, lead, note, steps }));
  const dirty = () => JSON.stringify({ title, course, kind, due, from, lead, note, steps }) !== start.current || !!newStep.trim();

  const addStep = () => {
    const text = newStep.trim();
    if (!text) return;
    setSteps([...steps, { id: newId("s"), text, done: false }]);
    setNewStep("");
    stepRef.current?.focus();
  };

  const submit = (e: Event) => {
    e.preventDefault();
    const name = title.trim();
    if (!name) { setErr("Write what is due."); titleRef.current?.focus(); return; }
    let d = due, f = notFixed ? from : "";
    if (f && !d) { setErr("Add the last possible day, or untick day not fixed."); return; }
    if (f && f > d) [f, d] = [d, f];
    if (f === d) f = "";
    const pending = newStep.trim() ? [...steps, { id: newId("s"), text: newStep.trim(), done: false }] : steps;
    onSave({ title: name, course, kind, due: d, from: f, lead, note: note.trim(), steps: pending.filter(s => s.text.trim()), done: task?.done ?? false });
  };

  const leads = LEAD_CHOICES.includes(lead) ? LEAD_CHOICES : [...LEAD_CHOICES, lead].sort((a, b) => a - b);

  return (
    <Dialog
      labelledBy="ed-h"
      opener={opener}
      initialFocus={() => (task ? document.getElementById("ed-h") : titleRef.current)}
      fallbackFocus={() => document.getElementById("main-h")}
      onDismiss={() => {
        // Unsaved edits: the first tap outside or Escape only warns.
        if (dirty() && Date.now() - warnedAt.current > 4000) {
          warnedAt.current = Date.now();
          setErr("You have unsaved changes. Do that again to discard them, or press Save.");
          return false;
        }
        onClose();
      }}
    >
      <form onSubmit={submit} noValidate>
        <h2 id="ed-h" tabIndex={-1}>{task ? "Edit deadline" : "Add a deadline"}</h2>
        <label class="f">What is due
          <input ref={titleRef} type="text" value={title} maxLength={200} autocomplete="off" enterKeyHint="next"
            onInput={e => { setTitle(e.currentTarget.value); setErr(""); }} aria-describedby="ed-err" />
        </label>
        <div class="two">
          <label class="f">Course
            <select value={course} onChange={e => setCourse(e.currentTarget.value)}>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label class="f">Type
            <select value={kind} onChange={e => setKind(e.currentTarget.value as Kind)}>
              {Object.entries(KINDS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
        </div>
        <div class="two">
          <label class="f">{notFixed ? "Last possible day" : "Due date"}
            <input type="date" value={due} onInput={e => setDue(e.currentTarget.value)} />
          </label>
          <label class="f">Prep needed
            <select value={String(lead)} onChange={e => setLead(+e.currentTarget.value)}>
              {leads.map(n => <option key={n} value={String(n)}>{leadLabel(n)}</option>)}
            </select>
          </label>
        </div>
        <label class="check">
          <input type="checkbox" checked={notFixed} onChange={e => setNotFixed(e.currentTarget.checked)} />
          Day not fixed yet
        </label>
        {notFixed && (
          <label class="f">Earliest possible day
            <small>It could land on any day from this one to the last possible day.</small>
            <input type="date" value={from} onInput={e => setFrom(e.currentTarget.value)} />
          </label>
        )}

        <fieldset>
          <legend>Steps</legend>
          {steps.map((s, i) => (
            <div class="step-edit" key={s.id}>
              <input type="checkbox" checked={s.done} aria-label={`Step done: ${s.text}`}
                onChange={e => setSteps(steps.map(x => (x.id === s.id ? { ...x, done: e.currentTarget.checked } : x)))} />
              <input type="text" value={s.text} maxLength={200} aria-label={`Step ${i + 1}`}
                onInput={e => setSteps(steps.map(x => (x.id === s.id ? { ...x, text: e.currentTarget.value } : x)))} />
              <button type="button" class="icon-btn" aria-label={`Remove step: ${s.text}`}
                onClick={() => { setSteps(steps.filter(x => x.id !== s.id)); stepRef.current?.focus(); }}>
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
              </button>
            </div>
          ))}
          <div class="add-step">
            <input ref={stepRef} type="text" value={newStep} maxLength={200} placeholder="Add a step, like write the ER diagram" aria-label="New step"
              enterKeyHint="done" onInput={e => setNewStep(e.currentTarget.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addStep(); } }} />
            <button type="button" class="btn" onClick={addStep}>Add step</button>
          </div>
        </fieldset>

        <label class="f">Note
          <input type="text" value={note} maxLength={300} autocomplete="off" onInput={e => setNote(e.currentTarget.value)} />
        </label>
        <p class="err" id="ed-err" role="alert">{err}</p>
        <div class="dlg-acts">
          {task && <button type="button" class="btn danger" onClick={() => onDelete(task)}>Delete</button>}
          <span class="sp" />
          <button type="button" class="btn" onClick={onClose}>Cancel</button>
          <button type="submit" class="btn solid">Save</button>
        </div>
      </form>
    </Dialog>
  );
}

