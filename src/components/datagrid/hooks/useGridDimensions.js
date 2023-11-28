import { useRef, useState } from "react";
import { useLayoutEffect } from "./useLayoutEffect";

export function useGridDimensions() {
  const gridRef = useRef(null);
  const [inlineSize, setInlineSize] = useState(1);
  const [blockSize, setBlockSize] = useState(1);
  const [isWidthInitialized, setWidthInitialized] = useState(false);

  useLayoutEffect(() => {
    const { ResizeObserver } = window;

    if (ResizeObserver == null || !gridRef.current) return;

    const { clientWidth, clientHeight, offsetWidth, offsetHeight } =
      gridRef.current;
    const { width, height } = gridRef.current.getBoundingClientRect();
    const initialWidth = width - offsetWidth + clientWidth;
    const initialHeight = height - offsetHeight + clientHeight;

    setInlineSize(initialWidth);
    setBlockSize(initialHeight);
    setWidthInitialized(true);

    const resizeObserver = new ResizeObserver((entries) => {
      const size = entries[0].contentBoxSize[0];
      setInlineSize(size.inlineSize);
      setBlockSize(size.blockSize);
    });

    resizeObserver.observe(gridRef.current);
    console.log("resizeObserver", resizeObserver.observe);
    return () => {
      resizeObserver.disconnect();
    };
  }, [gridRef]);

  return [gridRef, inlineSize, blockSize, isWidthInitialized];
}
