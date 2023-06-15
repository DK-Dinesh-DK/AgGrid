import { useEffect, useRef } from 'react'; 
const useUpdateEffect = (effect, dependency) => { 
  const isFirstRender = useRef(true); 
  useEffect(() => { 
    if (isFirstRender.current) { 
      isFirstRender.current = false; 
      return; 
    } 
      return effect(); 
    }, dependency); 
  }; 
export default useUpdateEffect;