import { Dep } from './dep';
import cloneDeep from 'lodash.cloneDeep';
import isEqual from 'lodash.isequal';

let uid = 1;

export class Watcher<T extends unknown> {
  private _uid: number;
  private depIds: Set<number> = new Set();
  private deps: Set<Dep> = new Set();
  private expFn: WatcherExpression<T>;
  private callback: WatcherCallback<T>;
  private value: T;
  private oldValue: T;

  constructor(expFn: WatcherExpression<T>, callback: WatcherCallback<T>) {
    this._uid = uid++;
    this.expFn = expFn;
    this.callback = callback;
    this.value = this.subAndGetValue();
    this.oldValue = cloneDeep(this.value);
  }

  get id() {
    return this._uid;
  }

  addDep(dep: Dep) {
    if (!this.depIds.has(dep.id)) {
      this.depIds.add(dep.id);
      this.deps.add(dep);
      dep.addSub(this);
    }
  }

  update() {
    // TODO: 값이 변하면 즉시 업데이트 하는 것이 아닌 stack의 모든 로직이 빠지고 한번에 처리되 되도록 수정
    const value = this.subAndGetValue();
    if (!isEqual(value, this.oldValue)) {
      this.value = value;
      this.callback.call(undefined, this.value, this.oldValue);
      this.oldValue = cloneDeep(this.value);
    }
  }

  private subAndGetValue(): T {
    Dep.target = this;
    const value = this.expFn();
    Dep.target = null;
    return value;
  }
}

export function watch<T>(expFn: WatcherExpression<T>, callback: WatcherCallback<T>): Watcher<T> {
  return new Watcher(expFn, callback);
}
