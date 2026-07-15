import { useEffect, useRef } from 'react';

export const useFocusOnMount = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      if (ref.current.tagName === 'H1' || ref.current.tagName === 'H2') {
        ref.current.setAttribute('tabindex', '-1');
        // Prevent default browser outline on focus for headings, but keep screen-reader reading it
        ref.current.style.outline = 'none';
      }
      ref.current.focus();
    }
  }, []);

  return ref;
};

export default useFocusOnMount;
