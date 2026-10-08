import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { dayLabelLong, plural, todayISO, type ISODate } from "../domain/dates";
import { toICS } from "../domain/ics";
import { crunches, plate } from "../domain/plan";
import { addTask, deleteTask, replaceBoard, saveCourses, setDone, setStep, updateTask, type Change, type Inverse, type TaskInput } from "../store/actions";
import { MigrationError } from "../store/migrate";
import type { BoardState, Task } from "../store/schema";
import { backupText, readBackup } from "../store/storage";
import { registerSW } from "../sw/register";
import { DayGroups, Plate, Summary } from "./Board";
import { Editor, type Draft } from "./Editor";
import { reducedMotion, useBoard, usePrefs, useToday } from "./hooks";
import { isUnlocked, lock, Lock } from "./Lock";
import { QuickAdd } from "./QuickAdd";
import { Settings } from "./Settings";
import { shareFile } from "./share";
import { Skyline } from "./Skyline";

interface Toast { id: number; text: string; undo?: Inverse }
type EditorState = { task: Task | null; draft?: Draft; opener: HTMLElement | null } | null;

const TOAST_MS = 6000;

export function App() {
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [update, setUpdate] = useState<(() => void) | null>(null);
  // Registered before the lock check, so even a visit that stops at the lock screen is saved for offline.
  useEffect(() => registerSW(apply => setUpdate(() => apply)), []);
  if (!unlocked) return <Lock onUnlock={() => setUnlocked(true)} />;
  return <Board update={update} onLock={() => { lock(); setUnlocked(false); }} />;
}

function Board({ onLock, update }: { onLock: () => void; update: (() => void) | null }) {
  const board = useBoard();
  const { state, readOnly } = board;
  const today = useToday();
  const [prefs, setPrefs] = usePrefs();
  const [editor, setEditor] = useState<EditorState>(null);
  const [settingsFrom, setSettingsFrom] = useState<HTMLElement | null | false>(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [pendingImport, setPendingImport] = useState<{ state: BoardState; name: string } | null>(null);
  const [status, setStatus] = useState<{ text: string; bad?: boolean } | null>(null);
  const toastTimer = useRef(0);
  const toastHeld = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Filter falls back to everything when its course has no deadlines any more.
  const usedCourses = useMemo(() => state.courses.filter(c => state.tasks.some(t => t.course === c.id)), [state]);
  const filter = prefs.filter && usedCourses.some(c => c.id === prefs.filter) ? prefs.filter : null;
  const shown = useMemo(() => (filter ? state.tasks.filter(t => t.course === filter) : state.tasks), [state.tasks, filter]);
  const crunchList = useMemo(() => crunches(shown, today), [shown, today]);
  const plateItems = useMemo(() => plate(shown, today), [shown, today]);

  /* ---------- changes and undo ---------- */
  const showToast = useCallback((text: string, undo?: Inverse) => {
    clearTimeout(toastTimer.current);
    const id = Date.now();
    setToast({ id, text, undo });
    const arm = () => {
      toastTimer.current = window.setTimeout(() => {
        if (toastHeld.current) { arm(); return; }
        setToast(t => (t && t.id === id ? null : t));
      }, TOAST_MS);
    };
    arm();
  }, []);

  const apply = useCallback((c: Change, undoable = true) => {
    if (readOnly || c.state === board.current()) return;
    board.commit(c.state);
    showToast(c.label, undoable ? c.undo : undefined);
  }, [readOnly, board.commit, showToast]);

  const undo = useCallback(() => {
    if (!toast?.undo) return;
    board.commit(toast.undo(board.current()));
    showToast("Undone");
  }, [toast, board.commit, showToast]);

  const handlers = {
    readOnly,
    onToggle: (t: Task, done: boolean) => apply(setDone(board.current(), t.id, done)),
    onEdit: (t: Task, opener: HTMLElement) => setEditor({ task: t, opener }),
    onStep: (t: Task, stepId: string, done: boolean) => apply(setStep(board.current(), t.id, stepId, done)),
  };

  const onSave = (input: TaskInput) => {
    const ed = editor!;
    setEditor(null);
    if (ed.task) apply(updateTask(board.current(), ed.task.id, input));
    else apply(addTask(board.current(), input));
  };
  const onDelete = (t: Task) => {
    setEditor(null);
    apply(deleteTask(board.current(), t.id));
  };

  /* ---------- keyboard: n or / to add, ctrl or cmd z to undo ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing = el.closest("input, textarea, select, [contenteditable]") || document.querySelector("dialog[open]");
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !typing && toast?.undo) { e.preventDefault(); undo(); return; }
      if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "n" || e.key === "/") { e.preventDefault(); document.getElementById("qa-input")?.focus(); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [toast, undo]);

  /* ---------- skyline taps ---------- */
  const onPickDay = (date: ISODate, target: string | null) => {
    if (!target) {
      if (!readOnly) setEditor({ task: null, draft: { title: "", due: date, course: filter ?? "other", kind: "submit" }, opener: document.activeElement as HTMLElement });
      return;
    }
    const sec = document.getElementById(target);
    if (!sec) { setStatus({ text: `Nothing to show on ${dayLabelLong(date)} with the current filters.` }); return; }
    sec.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
    (sec.querySelector("h2") as HTMLElement | null)?.focus({ preventScroll: true });
    sec.classList.remove("flash");
    void sec.offsetWidth;
    sec.classList.add("flash");
  };

  /* ---------- backup ---------- */
  const exportBackup = async () => {
    const ok = await shareFile(backupText(board.current()), `deadlines-backup-${todayISO()}.json`, "application/json", "Deadlines backup");
    if (ok) setStatus({ text: "Backup exported." });
  };
  const pickImport = () => { if (fileRef.current) { fileRef.current.value = ""; fileRef.current.click(); } };
  const onFile = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    try {
      const next = readBackup(await file.text());
      setPendingImport({ state: next, name: file.name });
      setStatus(null);
      requestAnimationFrame(() => document.getElementById("import-confirm")?.focus());
    } catch (e) {
      setStatus({ bad: true, text: e instanceof MigrationError && e.reason === "future"
        ? "That backup is from a newer version of the app. Reload to update, then import it."
        : "That file is not a deadline backup, so nothing was changed." });
    }
  };
  const confirmImport = () => {
    if (!pendingImport) return;
    apply(replaceBoard(board.current(), pendingImport.state));
    setPendingImport(null);
  };

  const exportCalendar = async () => {
    const { text, count } = toICS(board.current(), today);
    if (!count) { setStatus({ text: "No upcoming dated deadlines to export." }); return; }
    const ok = await shareFile(text, "deadlines.ics", "text/calendar", "Deadlines calendar");
    if (ok) setStatus({ text: `Exported ${plural(count, "deadline")} to a calendar file.` });
  };

  const persistedText = board.persisted === true
    ? "This browser has agreed to keep it."
    : "The browser could clear it if the phone runs low on space, so export a backup now and then.";

  return (
    <>
      <a class="skip" href="#plate-h" onClick={e => { e.preventDefault(); document.getElementById("plate-h")?.focus?.(); document.getElementById("plate-h")?.scrollIntoView(); }}>Skip to your plate</a>
      <main>
        <div class="top">
          <h1 id="main-h" tabIndex={-1}>Deadlines</h1>
          <button type="button" class="icon-btn" aria-label="Settings" onClick={e => setSettingsFrom(e.currentTarget as HTMLElement)}>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 6h14M3 14h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" /><circle cx="7" cy="6" r="2.2" fill="var(--bg)" stroke="currentColor" stroke-width="2" /><circle cx="13" cy="14" r="2.2" fill="var(--bg)" stroke="currentColor" stroke-width="2" /></svg>
          </button>
        </div>
        <p class="today-line">{dayLabelLong(today)}</p>
        <Summary tasks={shown} today={today} />

        {board.notice && (
          <div class={"banner" + (board.notice.includes("could not") ? " bad" : "")} role="status">
            <p>{board.notice}</p>
            {!readOnly && <button type="button" class="btn" onClick={board.dismissNotice}>Got it</button>}
          </div>
        )}
        {board.saveError && (
          <div class="banner bad" role="alert">
            <p><strong>Not saved.</strong> {board.saveError.ok === false && board.saveError.reason === "quota"
              ? "Storage on this device is full. Your changes are still on screen. Export a backup so nothing is lost."
              : "This browser is blocking storage. Your changes are still on screen. Export a backup so nothing is lost."}</p>
            <button type="button" class="btn" onClick={board.retrySave}>Try again</button>
            <button type="button" class="btn solid" onClick={exportBackup}>Export backup</button>
          </div>
        )}

        <QuickAdd courses={state.courses} today={today} defaultCourse={filter} disabled={readOnly}
          onAdd={d => apply(addTask(board.current(), d))}
          onMore={(d, opener) => setEditor({ task: null, draft: d, opener })} />

        <Skyline tasks={shown} courses={state.courses} today={today} crunchList={crunchList} onPickDay={onPickDay} />

        {(usedCourses.length >= 2 || state.tasks.some(t => t.done)) && (
          <div class="chips" role="group" aria-label="Filters">
            {usedCourses.length >= 2 && usedCourses.map(c => (
              <button key={c.id} type="button" class="chip" style={{ "--c": `var(--c-${c.color})` }} aria-pressed={filter === c.id}
                onClick={() => setPrefs({ filter: filter === c.id ? null : c.id })}>
                <i aria-hidden="true" />{c.name}
              </button>
            ))}
            {state.tasks.some(t => t.done) && (
              <button type="button" class="chip plain" aria-pressed={prefs.hideDone} onClick={() => setPrefs({ hideDone: !prefs.hideDone })}>Hide done</button>
            )}
          </div>
        )}

        <Plate state={state} tasks={shown} items={plateItems} crunchList={crunchList} today={today} {...handlers} />
        <DayGroups state={state} tasks={shown} today={today} hideDone={prefs.hideDone} filtered={!!filter} {...handlers} />

        <div class="tools">
          <section aria-labelledby="bk-h">
            <h2 id="bk-h">Backup</h2>
            <p>Everything here is stored on this device only. {persistedText}</p>
            <div class="acts">
              <button type="button" class="btn" onClick={exportBackup}>Export backup</button>
              <button type="button" class="btn" disabled={readOnly} onClick={pickImport}>Import backup</button>
              <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onFile} aria-label="Backup file" />
            </div>
            {pendingImport && (
              <div class="confirm">
                <p>That backup holds {plural(pendingImport.state.tasks.length, "deadline")}. Importing replaces the {plural(state.tasks.length, "deadline")} on this device. You can undo it right after.</p>
                <div class="acts">
                  <button id="import-confirm" type="button" class="btn solid" onClick={confirmImport}>Replace with backup</button>
                  <button type="button" class="btn" onClick={() => setPendingImport(null)}>Cancel</button>
                </div>
              </div>
            )}
          </section>
          <section aria-labelledby="cal-h">
            <h2 id="cal-h">Reminders</h2>
            <p>This app cannot remind you by itself. A home screen app on iPhone has no way to schedule a notification without a server. Your calendar can, so this exports open deadlines with alerts at 9:00 on each start day and the day before each is due. Export again after changes. Importing twice can make duplicates.</p>
            <div class="acts">
              <button type="button" class="btn" onClick={exportCalendar}>Export to calendar</button>
            </div>
          </section>
          <p class={"status" + (status?.bad ? " err" : "")} role="status">{status?.text ?? ""}</p>
          <p class="meta-line">Deadlines 2. Built {__BUILD__}. Press n to add, Ctrl or Cmd Z to undo.</p>
        </div>
      </main>

      <div class="toasts">
        {update && (
          <div class="toast" role="status">
            <p>Update ready</p>
            <button type="button" onClick={update}>Reload</button>
          </div>
        )}
        <div role="status" aria-live="polite" class="sr-only">{toast?.text ?? ""}</div>
        {toast && (
          <div class="toast" onPointerEnter={() => (toastHeld.current = true)} onPointerLeave={() => (toastHeld.current = false)}
            onFocusIn={() => (toastHeld.current = true)} onFocusOut={() => (toastHeld.current = false)}>
            <p>{toast.text}</p>
            {toast.undo && <button type="button" onClick={undo}>Undo</button>}
            <button type="button" class="x" aria-label="Dismiss" onClick={() => setToast(null)}>
              <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
            </button>
          </div>
        )}
      </div>

      {editor && (
        <Editor key={editor.task?.id ?? "new"} task={editor.task} draft={editor.draft} courses={state.courses} opener={editor.opener}
          onSave={onSave} onDelete={onDelete} onClose={() => setEditor(null)} />
      )}
      {settingsFrom !== false && (
        <Settings state={state} theme={prefs.theme} readOnly={readOnly} opener={settingsFrom}
          onTheme={t => setPrefs({ theme: t })}
          onCourses={c => apply(saveCourses(board.current(), c), false)}
          onLock={() => { setSettingsFrom(false); onLock(); }}
          onClose={() => setSettingsFrom(false)} />
      )}
    </>
  );
}
