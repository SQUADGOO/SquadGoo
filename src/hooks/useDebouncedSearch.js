import {useState, useEffect, useMemo} from 'react';
import {debounce} from 'lodash';

export const useDebouncedSearch = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const debouncedSetter = useMemo(
    () => debounce(val => setDebouncedValue(val), delay),
    [delay],
  );

  useEffect(() => {
    debouncedSetter(value);

    return () => {
      debouncedSetter.cancel();
    };
  }, [value, debouncedSetter]);

  return debouncedValue;
};
