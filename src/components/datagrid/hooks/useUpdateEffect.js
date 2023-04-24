import { useEffect, useRef } from "react"

function useUpdateEffect(fn, deps) {
  const isFirst = useRef(true)
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    return fn()
  }, deps)
}

export default useUpdateEffect;
