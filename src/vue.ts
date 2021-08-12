import { WoowaVue } from './vue/vue';

declare global {
  interface Window {
    WoowaVue: typeof WoowaVue;
  }
}

window.WoowaVue = WoowaVue;
