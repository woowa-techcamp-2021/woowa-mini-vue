import { observify } from '../observable/observable';
import { compile } from './compile';

export class WoowaVue {
  $el: Element;
  $data: Record<string, unknown>;
  $methods: Record<string, WoowaVueMethod>;

  // for method binding
  [key: string]: unknown;

  constructor(options: WoowaVueOption) {
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el)! : options.el;
    this.$data = options.data;
    this.$methods = options.methods;

    observify(this.$data);

    this.proxy(this.$data);
    this.proxy(this.$methods);

    for (let method in this.$methods) {
      this[method] = this.$methods[method].bind(this);
    }

    compile(this.$el, this);
  }

  proxy(data: Record<string, unknown>) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key];
        },
        set(newValue) {
          if (data[key] === newValue) {
            return;
          }
          data[key] = newValue;
        },
      });
    });
  }
}
