type WoowaVueMethod = (e: Event | null) => void;

interface WoowaVueOption {
  el: string | Element;
  data: Record<string, unknown>;
  methods: Record<string, WoowaVueMethod>;
}
