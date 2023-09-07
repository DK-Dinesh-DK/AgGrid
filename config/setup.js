import { act } from "react-dom/test-utils";
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  window.ResizeObserver ??= class {
    callback;

    constructor(callback) {
      this.callback = callback;
    }

    observe() {
      // patch inlineSize/blockSize to pretend we're rendering DataGrid at 1920p/1080p
      // @ts-expect-error
      this.callback(
        [{ contentBoxSize: [{ inlineSize: 1920, blockSize: 1080 }] }],
        this
      );
    }

    unobserve() {}
    disconnect() {}
  };

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  window.HTMLElement.prototype.scrollIntoView ??= () => {};

  // patch clientWidth/clientHeight to pretend we're rendering DataGrid at 1080p
  Object.defineProperties(HTMLDivElement.prototype, {
    clientWidth: {
      get() {
        return this.classList.contains("rdg") ? 1920 : 0;
      },
    },
    clientHeight: {
      get() {
        return this.classList.contains("rdg") ? 1080 : 0;
      },
    },
  });

  // Basic scroll polyfill
  const scrollStates = new WeakMap();

  function getScrollState(div) {
    if (scrollStates.has(div)) {
      return scrollStates.get(div);
    }
    const scrollState = { scrollTop: 0, scrollLeft: 0 };
    scrollStates.set(div, scrollState);
    return scrollState;
  }

  Object.defineProperties(Element.prototype, {
    scrollTop: {
      get() {
        return getScrollState(this).scrollTop;
      },
      set(value) {
        getScrollState(this).scrollTop = value;
        act(() => {
          this.dispatchEvent(new Event("scroll"));
        });
      },
    },
    scrollLeft: {
      get() {
        return getScrollState(this).scrollLeft;
      },
      set(value) {
        getScrollState(this).scrollLeft = value;
        act(() => {
          this.dispatchEvent(new Event("scroll"));
        });
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  Element.prototype.setPointerCapture ??= () => {};
}
