import { watch } from '../observable/watcher';
import { WoowaVue } from './vue';
import { getVMValue, setVMValue } from '../utils';

export class Parser {
  static eventHandler(node: Element, vm: WoowaVue, eventType: string, method: string) {
    node.removeAttribute(`v-on:${eventType}`);
    const handler = vm.$methods[method];
    if (handler) {
      node.addEventListener(eventType, handler);
    }
  }

  static template(text: Text, vm: WoowaVue) {
    const content = text.textContent!;
    const normalTexts = content.split(/{{.+}}/);
    const exps = content.match(/{{\s+[a-zA-Z]([\w.]+)?\s*}}/g)?.map((exp) => exp.match(/[a-zA-Z]([\w.]+)?/)![0]) || [];
    const vars = exps.map((exp) => getVMValue(vm, exp));
    const makeContent = () => {
      let normalIndex = 0;
      let varIndex = 0;
      const words = [];
      while (normalIndex < normalTexts.length || varIndex < vars.length) {
        if (normalIndex < normalTexts.length) {
          words.push(normalTexts[normalIndex++]);
        }
        if (varIndex < vars.length) {
          words.push(vars[varIndex++]);
        }
      }
      return words.join('');
    };
    exps.forEach((exp, index) => {
      watch(
        () => getVMValue(vm, exp),
        (newValue) => {
          vars[index] = newValue;
          text.textContent = makeContent();
        },
      );
    });
    text.textContent = makeContent();
  }

  static model(node: HTMLInputElement, vm: WoowaVue, exp: string) {
    node.removeAttribute('v-model');
    const callback = (newValue: any) => {
      if (node.type === 'checkbox') {
        node.checked = newValue;
      } else {
        node.value = newValue;
      }
    };
    callback(getVMValue(vm, exp));

    node.addEventListener('input', () => {
      if (node.type === 'checkbox') {
        setVMValue(vm, exp, node.checked);
      } else {
        setVMValue(vm, exp, node.value);
      }
    });

    watch(() => getVMValue(vm, exp), callback);
  }

  static html(node: Element, vm: WoowaVue, exp: string) {
    node.removeAttribute('v-html');
    node.innerHTML = getVMValue(vm, exp);

    watch(
      () => getVMValue(vm, exp),
      (newValue) => {
        node.innerHTML = newValue;
      },
    );
  }

  static show(node: HTMLElement, vm: WoowaVue, exp: string) {
    node.removeAttribute('v-show');
    const callback = (show: boolean) => {
      if (show) {
        node.style.display = '';
      } else {
        node.style.display = 'none';
      }
    };
    watch(() => getVMValue(vm, exp), callback);
    callback(getVMValue(vm, exp));
  }

  static [directiveType: string]: Function;
}
