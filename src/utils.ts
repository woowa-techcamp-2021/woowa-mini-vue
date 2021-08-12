import { WoowaVue } from './vue/vue';

export function isObject(value: any): boolean {
  return value && Object.prototype.toString.call(value) === '[object Object]';
}

export function isElementNode(node: Node): boolean {
  return node.nodeType === Node.ELEMENT_NODE;
}

export function isTextNode(node: Node): boolean {
  return node.nodeType === Node.TEXT_NODE;
}

export function isDirective(attrName: string): boolean {
  return attrName.startsWith('v-');
}

export function isEventDirective(directiveType: string): boolean {
  return /^on:/.test(directiveType);
}

export function getVMValue(vm: WoowaVue, exp: string): any {
  let data: Record<string, any> = vm.$data;
  exp.split('.').forEach((key) => {
    data = data[key];
  });
  return data;
}

export function setVMValue(vm: WoowaVue, exp: string, value: unknown): void {
  let data: Record<string, any> = vm.$data;
  const keys = exp.split('.');
  keys.forEach((key, index) => {
    if (index < keys.length - 1) {
      data = data[key];
    } else {
      data[key] = value;
    }
  });
}
