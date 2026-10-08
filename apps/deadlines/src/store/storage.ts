/* Loading and saving, written so that nothing already on the device is ever thrown away.

   Keys
   deadlines              current board, {v: 2, courses, tasks}
   deadlines-good         copy of the last board that loaded cleanly, refreshed on each clean load
   deadlines-v1           v1's data. Read once to migrate, never written or deleted
   deadlines-unreadable-* raw copies of anything that failed to load, kept for recovery */
import { migrate, MigrationError } from "./migrate";
import { normalizeBoard, type BoardState } from "./schema";
import { SEED_V1 } from "./seed";
import { DEFAULT_COURSES } from "./schema";

export const KEY = "deadlines";
export const GOOD_KEY = "deadlines-good";
export const V1_KEY = "deadlines-v1";
export const QUARANTINE_PREFIX = "deadlines-unreadable-";

export interface KV {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

export const localKV: KV = {
  get: k => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => localStorage.setItem(k, v),
};

export type Source = "saved" | "recovered" | "migrated" | "seeded" | "empty";

export interface Loaded {
  state: BoardState;
  source: Source;
  /** True when the saved data came from a newer app version. Nothing is written then. */
  readOnly: boolean;
  /** Plain message for the person, if something worth knowing happened. */
  notice?: string;
  /** Whether the result still needs writing to the main key. */
  needsSave: boolean;
}

function quarantine(kv: KV, raw: string, now: number) {
  try { kv.set(QUARANTINE_PREFIX + now, raw); } catch { /* full; the original key still holds it */ }
}

function tryParse(raw: string | null) {
  if (raw == null) return null;
  try { return migrate(JSON.parse(raw)); } catch (e) { return e instanceof MigrationError ? e : new MigrationError("shape", String(e)); }
}

export function seedState(): BoardState {
  return normalizeBoard(DEFAULT_COURSES, SEED_V1);
}

export function load(kv: KV = localKV, now = Date.now()): Loaded {
  const raw = kv.get(KEY);
  const main = tryParse(raw);

  if (main && !(main instanceof Error)) {
    try { if (kv.get(GOOD_KEY) !== raw) kv.set(GOOD_KEY, raw!); } catch { /* best effort */ }
    return { state: main.state, source: "saved", readOnly: false, needsSave: main.from !== 2 };
  }

  if (main instanceof MigrationError && main.reason === "future") {
    // Do not touch data a newer version wrote. Show what can be read, change nothing.
    let state = seedState();
    try { const d = JSON.parse(raw!); state = normalizeBoard(d.courses, d.tasks); } catch { /* shape unknown */ }
    return { state, source: "saved", readOnly: true, needsSave: false,
      notice: "This board was saved by a newer version of the app. Reload to update. Until then nothing here can be changed." };
  }

  if (main instanceof Error) {
    quarantine(kv, raw!, now);
    const good = tryParse(kv.get(GOOD_KEY));
    if (good && !(good instanceof Error)) {
      return { state: good.state, source: "recovered", readOnly: false, needsSave: true,
        notice: "The saved board could not be read, so the last good copy was restored. The unreadable copy is kept on this device." };
    }
  }

  const legacyRaw = kv.get(V1_KEY);
  const legacy = tryParse(legacyRaw);
  if (legacy && !(legacy instanceof Error)) {
    return { state: legacy.state, source: "migrated", readOnly: false, needsSave: true,
      notice: main instanceof Error
        ? "The saved board could not be read, so your deadlines from the old version were restored."
        : `Moved ${legacy.state.tasks.length} deadlines over from the old version.` };
  }
  if (legacy instanceof Error) quarantine(kv, legacyRaw!, now + 1);

  if (main instanceof Error || legacy instanceof Error) {
    return { state: normalizeBoard(DEFAULT_COURSES, []), source: "empty", readOnly: false, needsSave: false,
      notice: "The saved data on this device could not be read, so the board is empty. A raw copy is kept. Import a backup to restore your deadlines." };
  }
  return { state: seedState(), source: "seeded", readOnly: false, needsSave: true };
}

export type SaveResult = { ok: true } | { ok: false; reason: "quota" | "blocked" };

export function isQuotaError(e: unknown): boolean {
  if (!(e instanceof Error) && !(typeof DOMException !== "undefined" && e instanceof DOMException)) return false;
  const err = e as DOMException;
  return err.name === "QuotaExceededError" || err.name === "NS_ERROR_DOM_QUOTA_REACHED" || err.code === 22 || err.code === 1014;
}

export function save(state: BoardState, kv: KV = localKV): SaveResult {
  try {
    kv.set(KEY, JSON.stringify(state));
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: isQuotaError(e) ? "quota" : "blocked" };
  }
}

/** Asks the browser not to evict this site's storage. Resolves to whether it is persistent. */
export async function requestPersistence(): Promise<boolean | null> {
  try {
    if (!navigator.storage?.persist) return null;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch { return null; }
}

export const BACKUP_APP = "deadline-board";

export function backupText(state: BoardState, now = new Date()): string {
  return JSON.stringify({ app: BACKUP_APP, ...state, exported: now.toISOString() }, null, 2);
}

/** Reads a backup file's text. v1 and v2 backups and bare arrays all work. */
export function readBackup(text: string): BoardState {
  let data: unknown;
  try { data = JSON.parse(text); } catch { throw new MigrationError("shape", "Not JSON"); }
  return migrate(data).state;
}
