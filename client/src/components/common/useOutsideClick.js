import {useEffect} from 'react';

const useOutsideClick = (ref, onOutside) => {
  useEffect(() => {
    function handleMousedownEvent(event) {
      if (!ref.current?.contains(event.target)) {
        onOutside();
      }
    }

    document.addEventListener('mousedown', handleMousedownEvent);
    return () => document.removeEventListener('mousedown', handleMousedownEvent);
  }, [ref]);
};

export default useOutsideClick;
