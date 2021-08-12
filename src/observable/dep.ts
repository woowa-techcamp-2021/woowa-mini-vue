import { Watcher } from './watcher';

let uid = 1;

export class Dep {
  static target: Watcher<any> | null = null;

  private _id: number;
  private subs: Watcher<any>[] = [];

  constructor() {
    this._id = uid++;
  }

  get id(): number {
    return this._id;
  }

  addSub(sub: Watcher<any>) {
    this.subs.push(sub);
  }

  removeSub(sub: Watcher<any>) {
    const index = this.subs.indexOf(sub);
    if (index >= 0) {
      this.subs.splice(index, 1);
    }
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  }
}
