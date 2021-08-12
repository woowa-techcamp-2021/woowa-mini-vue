import { WoowaVue } from './vue';
import { isElementNode, isTextNode, isDirective, isEventDirective } from '../utils';
import { Parser } from './parser';

class Compile {
  constructor(private el: Element, private vm: WoowaVue) {
    const fragment = this.nodeToFragment();
    this.compile(fragment);
    this.el.appendChild(fragment);
  }

  nodeToFragment(): DocumentFragment {
    const fragment = document.createDocumentFragment();
    Array.from(this.el.childNodes).forEach((n) => {
      fragment.appendChild(n);
    });
    return fragment;
  }

  compile(node: Node): void {
    Array.from(node.childNodes).forEach((n) => {
      if (isElementNode(n)) {
        this.compileElement(n as Element);
      }

      if (isTextNode(n)) {
        this.compileText(n as Text);
      }

      if (n.childNodes && n.childNodes.length > 0) {
        this.compile(n);
      }
    });
  }

  compileElement(node: Element) {
    Array.from(node.attributes).forEach((attr) => {
      const name = attr.name;
      if (isDirective(name)) {
        const type = name.substr(2);
        const exp = attr.value;

        if (isEventDirective(type)) {
          const eventType = type.split(':')[1];
          Parser.eventHandler(node, this.vm, eventType, exp);
        } else if (type in Parser) {
          Parser[type](node, this.vm, exp);
        }
      }
    });
  }

  compileText(text: Text) {
    Parser.template(text, this.vm);
  }
}

export function compile(el: Element, vm: WoowaVue) {
  new Compile(el, vm);
}
