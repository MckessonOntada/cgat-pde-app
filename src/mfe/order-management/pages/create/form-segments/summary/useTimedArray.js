import CommonUtils from '@src/util/CommonUtils';
import { useState, useCallback, useEffect, useRef } from 'react';

const useTimedArray = (timeout) => {
  const [items, setItems] = useState([]);
  const timers = useRef(new Map());

  const add = useCallback(
    (obj) => {
      const id = CommonUtils.generateUniqueCode(
        obj.description + Math.random()
      );
      const newObj = { ...obj, id };

      setItems((prev) => [...prev, newObj]);

      if (obj.isSticky) {
        return;
      }

      const timer = setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.id !== id));
        timers.current.delete(id);
      }, timeout);

      timers.current.set(id, timer);
    },
    [timeout]
  );

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (timers.current.has(id)) {
      clearTimeout(timers.current.get(id));
      timers.current.delete(id);
    }
  }, []);

  const removeAll = useCallback(() => setItems([]));

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current.clear();
    };
  }, []);

  return { items, add, remove, removeAll };
};

export default useTimedArray;
