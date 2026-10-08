import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { todayISO, type ISODate } from "../domain/dates";
import { migrate } from "../store/migrate";
import type { BoardState } from "../store/schema";
import { KEY, load, requestPersistence, save, type SaveResult } from "../store/storage";

export function useBoard() {
  const [boot] = useState(() => load());
  const [state, setState] = useState<BoardState>(boot.state);
  const [saveError, setSaveError] = useState<SaveResult | null>(null);
  const [notice, setNotice] = useState<string | undefined>(boot.notice);
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const ref = useRef(state);
  const readOnly = boot.readOnly;

  const write = useCallback((next: BoardState) => {
    if (readOnly) return;
    const r = save(next);
    setSaveError(r.ok ? null : r);
  }, [readOnly]);

  const commit = useCallback((next: BoardState) => {
    if (readOnly) return;
    ref.current = next;
    setState(next);
    write(next);
  }, [readOnly, write]);

  useEffect(() => {
    if (boot.needsSave) write(boot.state);
    requestPersistence().then(setPersisted);
    // Another tab or window changed the board: take its version.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY || !e.newValue) return;
      try { const next = migrate(JSON.parse(e.newValue)).state; ref.current = next; setState(next); } catch { /* keep ours */ }
    };
    addEventListener("storage", onStorage);
    return () => removeEventListener("storage", onStorage);
  }, []);

  return {
    state, current: () => ref.current, commit, readOnly, saveError, persisted,
    notice, dismissNotice: () => setNotice(undefined),
    retrySave: () => write(ref.current),
  };
}

/** Today's date, refreshed at midnight and whenever the app comes back to the foreground. */
export function useToday(): ISODate {
  const [today, setToday] = useState(todayISO);
  useEffect(() => {
    let timer = 0;
    const arm = () => {
      const now = new Date();
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
      timer = window.setTimeout(() => { setToday(todayISO()); arm(); }, next.getTime() - now.getTime());
    };
    const onShow = () => { if (!document.hidden) setToday(todayISO()); };
    arm();
    document.addEventListener("visibilitychange", onShow);
    return () => { clearTimeout(timer); document.removeEventListener("visibilitychange", onShow); };
  }, []);
  return today;
}

export type Theme = "system" | "light" | "dark";
export interface Prefs { hideDone: boolean; filter: string | null; theme: Theme }
const PREFS_KEY = "deadlines-prefs";

export function usePrefs() {
  const [prefs, setPrefs] = useState<Prefs>(() => {
    const base: Prefs = { hideDone: false, filter: null, theme: "system" };
    try { return { ...base, ...JSON.parse(localStorage.getItem(PREFS_KEY) || "{}") }; } catch { return base; }
  });
  useEffect(() => {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch { /* preferences are optional */ }
    const root = document.documentElement;
    if (prefs.theme === "system") delete root.dataset.theme; else root.dataset.theme = prefs.theme;
    const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
    metas.forEach(m => {
      const own = m.media.includes("dark") ? "#0E1424" : "#F1F3F8";
      m.content = prefs.theme === "system" ? own : prefs.theme === "dark" ? "#0E1424" : "#F1F3F8";
    });
  }, [prefs]);
  return [prefs, (p: Partial<Prefs>) => setPrefs(cur => ({ ...cur, ...p }))] as const;
}

export const reducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
