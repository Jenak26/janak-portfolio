import { useState } from "preact/hooks";
import { newId, OTHER_COURSE, PALETTE, type BoardState, type ColorKey, type Course } from "../store/schema";
import { Dialog } from "./Dialog";
import type { Theme } from "./hooks";

interface Props {
  state: BoardState;
  theme: Theme;
  readOnly: boolean;
  opener: HTMLElement | null;
  onTheme: (t: Theme) => void;
  onCourses: (c: Course[]) => void;
  onLock: () => void;
  onClose: () => void;
}

const COLOR_NAMES: Record<ColorKey, string> = {
  blue: "Blue", pink: "Pink", amber: "Amber", teal: "Teal", violet: "Violet", green: "Green", red: "Red", orange: "Orange", cyan: "Cyan", slate: "Grey",
};

export function Settings({ state, theme, readOnly, opener, onTheme, onCourses, onLock, onClose }: Props) {
  const [courses, setCourses] = useState<Course[]>(state.courses);
  const [err, setErr] = useState("");
  const used = new Set(state.tasks.map(t => t.course));
  const set = (id: string, patch: Partial<Course>) => setCourses(courses.map(c => (c.id === id ? { ...c, ...patch } : c)));
  const changed = JSON.stringify(courses) !== JSON.stringify(state.courses);

  const save = () => {
    const clean = courses.map(c => ({ ...c, name: c.name.trim() }));
    if (clean.some(c => !c.name)) { setErr("Every course needs a name."); return; }
    const names = clean.map(c => c.name.toLowerCase());
    if (new Set(names).size !== names.length) { setErr("Two courses have the same name."); return; }
    onCourses(clean);
    onClose();
  };

  const add = () => {
    const free = PALETTE.find(p => !courses.some(c => c.color === p)) ?? "slate";
    const c: Course = { id: newId("c"), name: "", color: free, aliases: [] };
    setCourses([...courses.filter(x => x.id !== OTHER_COURSE), c, ...courses.filter(x => x.id === OTHER_COURSE)]);
    requestAnimationFrame(() => document.getElementById(`cn-${c.id}`)?.focus());
  };

  return (
    <Dialog labelledBy="st-h" opener={opener} onDismiss={() => { onClose(); }}>
      <h2 id="st-h" tabIndex={-1}>Settings</h2>

      <fieldset>
        <legend>Theme</legend>
        <div class="seg">
          {(["system", "light", "dark"] as Theme[]).map(t => (
            <label key={t}>
              <input type="radio" name="theme" value={t} checked={theme === t} onChange={() => onTheme(t)} />
              <span>{t === "system" ? "Match phone" : t === "light" ? "Light" : "Dark"}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Courses</legend>
        <p class="f"><small>Words in quick add pick the course: its name, plus any short forms you list.</small></p>
        {courses.map(c => (
          <div class="course-edit" key={c.id} style={{ "--c": `var(--c-${c.color})` }}>
            <label class="f">Name
              <input id={`cn-${c.id}`} type="text" value={c.name} maxLength={30} disabled={readOnly || c.id === OTHER_COURSE}
                onInput={e => set(c.id, { name: e.currentTarget.value })} />
            </label>
            <label class="f"><span><span class="swatch" aria-hidden="true" />Colour</span>
              <select value={c.color} disabled={readOnly} onChange={e => set(c.id, { color: e.currentTarget.value as ColorKey })}>
                {PALETTE.map(p => <option key={p} value={p}>{COLOR_NAMES[p]}</option>)}
              </select>
            </label>
            <button type="button" class="icon-btn" disabled={readOnly || c.id === OTHER_COURSE || used.has(c.id)}
              aria-label={used.has(c.id) ? `${c.name} has deadlines, so it cannot be removed` : `Remove ${c.name || "this course"}`}
              title={used.has(c.id) ? "Has deadlines" : undefined}
              onClick={() => setCourses(courses.filter(x => x.id !== c.id))}>
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
            </button>
            {c.id !== OTHER_COURSE && (
              <label class="f wide">Short forms <small>Separated by commas, like dbms, database</small>
                <input type="text" value={c.aliases.join(", ")} disabled={readOnly} autocapitalize="none"
                  onInput={e => set(c.id, { aliases: e.currentTarget.value.split(",").map(a => a.trim().toLowerCase()).filter(Boolean) })} />
              </label>
            )}
          </div>
        ))}
        <div class="acts" style={{ marginTop: "12px" }}>
          <button type="button" class="btn" disabled={readOnly || courses.length >= 16} onClick={add}>Add a course</button>
        </div>
      </fieldset>

      <fieldset>
        <legend>Lock</legend>
        <p class="f"><small>Locking asks for the code again on this device. Your deadlines stay where they are.</small></p>
        <button type="button" class="btn" onClick={onLock}>Lock this device</button>
      </fieldset>

      <p class="err" role="alert">{err}</p>
      <div class="dlg-acts">
        <span class="sp" />
        <button type="button" class="btn" onClick={onClose}>{changed ? "Cancel" : "Close"}</button>
        {changed && <button type="button" class="btn solid" onClick={save}>Save courses</button>}
      </div>
    </Dialog>
  );
}
