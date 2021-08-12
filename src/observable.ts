import { observify } from './observable/observable';
import { watch } from './observable/watcher';

declare global {
  interface Window {
    observify: typeof observify;
    watch: typeof watch;
  }
}

window.watch = watch;
window.observify = observify;
