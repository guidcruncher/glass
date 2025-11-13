import { type DirectiveBinding } from "vue";

const clickOutsideHandlers = new WeakMap<
  HTMLElement,
  (event: MouseEvent) => void
>();

export const clickOutside = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const handler = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        binding.value(event);
      }
    };

    clickOutsideHandlers.set(el, handler);
    document.addEventListener("click", handler);
  },

  unmounted(el: HTMLElement) {
    const handler = clickOutsideHandlers.get(el);
    if (handler) {
      document.removeEventListener("click", handler);
      clickOutsideHandlers.delete(el);
    }
  },
};
