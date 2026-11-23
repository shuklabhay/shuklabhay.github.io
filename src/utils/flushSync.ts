import { options } from "preact";

export function flushSync(update: () => void): void {
  const previous = options.debounceRendering;
  options.debounceRendering = (callback: () => void) => callback();
  try {
    update();
  } finally {
    options.debounceRendering = previous;
  }
}
