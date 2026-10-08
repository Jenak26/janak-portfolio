/* A lock screen, not security. There is no server, so the code and the check ship to every
   visitor, and a 4-digit code is guessable. What it does: keeps the board out of sight for
   someone who opens the link or picks up the phone. Each device asks once, then remembers. */
import { useEffect, useRef, useState } from "preact/hooks";

const HASH = "1cfafff6d51a03662b85b93dc3417f51687034ba9a46682f5328257eff7133ed";
export const UNLOCK_KEY = "deadlines-unlocked";

export function isUnlocked(): boolean {
  try { return localStorage.getItem(UNLOCK_KEY) === HASH.slice(0, 16); } catch { return false; }
}
export function lock() {
  try { localStorage.removeItem(UNLOCK_KEY); } catch { /* nothing stored */ }
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

export function Lock({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { input.current?.focus(); }, []);

  const submit = async (e: Event) => {
    e.preventDefault();
    if ((await sha256(code.trim())) === HASH) {
      try { localStorage.setItem(UNLOCK_KEY, HASH.slice(0, 16)); } catch { /* unlocks for this visit only */ }
      onUnlock();
    } else {
      setErr("That code is not right. Try again.");
      setCode("");
      input.current?.focus();
    }
  };

  return (
    <main class="lock">
      <form onSubmit={submit}>
        <div class="mini-sky" aria-hidden="true">
          {["blue", "pink", "amber", "teal", "violet", "green", "pink"].map((c, i) => (
            <i key={i} style={{ "--c": `var(--c-${c})`, height: `${[18, 34, 12, 26, 40, 20, 30][i]}px` }} />
          ))}
        </div>
        <h1>Deadlines</h1>
        <p>This board is private. Enter the code to open it. This device will remember it.</p>
        <label for="pin" class="sr-only">Code</label>
        <input id="pin" ref={input} type="password" inputMode="numeric" autocomplete="off" maxLength={12} value={code}
          aria-describedby="pin-err" aria-invalid={err ? true : undefined}
          onInput={e => { setCode(e.currentTarget.value); setErr(""); }} />
        <p class="err" id="pin-err" role="alert">{err}</p>
        <button type="submit" class="btn solid">Open</button>
      </form>
    </main>
  );
}
