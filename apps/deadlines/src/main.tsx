import { render } from "preact";
import "./styles.css";
import { App } from "./ui/App";

/* Wait briefly for the preloaded font (served from the worker's cache after the first visit)
   so the board is laid out once in Bricolage instead of twice: fallback font, then swap. */
const font = document.fonts?.load('650 16px "Bricolage Grotesque"').catch(() => null);
const timeout = new Promise(r => setTimeout(r, 400));
Promise.race([font, timeout]).finally(() => render(<App />, document.getElementById("app")!));
