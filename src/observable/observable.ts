import { Dep } from './dep';
import { isObject } from '../utils';

export class Observable {
  private _dep: Dep = new Dep();
  private _isRoot: boolean;

  constructor(value: Record<string, unknown>, isRoot: boolean = true) {
    this._isRoot = isRoot;
    Object.defineProperty(value, '__observer__', {
      value: this,
      enumerable: false,
      writable: true,
      configurable: true,
    });

    Object.keys(value).forEach((key) => {
      defineReactive(value, key, value[key]);
    });
  }

  get isRoot() {
    return this._isRoot;
  }

  get dep() {
    return this._dep;
  }
}

export function observify(obj: Record<string, unknown>, isRoot: boolean = true): Observable | null {
  let ob: Observable;
  if (obj.__observer__) {
    ob = obj.__observer__ as Observable;
  } else {
    ob = new Observable(obj, isRoot);
  }

  return ob;
}

function defineReactive(obj: Record<string, unknown>, key: string, value: unknown) {
  const dep = new Dep();
  let op: Observable | null;
  if (isObject(value)) {
    op = observify(value as Record<string, unknown>, false);
  }
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      if (Dep.target) {
        dep.depend();
        if (op) {
          op.dep.depend();
        }
      }
      return value;
    },
    set(newValue) {
      if (newValue === value) {
        return;
      } else {
        value = newValue;
        if (isObject(value)) {
          op = observify(newValue, false);
        }
        dep.notify();
      }
    },
  });
}
