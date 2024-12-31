import { useState, useEffect } from 'react';

/**
 * useDebounced 훅
 * @param value 디바운싱할 값
 * @param delay 디바운스 딜레이 (밀리초 단위)
 * @returns 디바운싱된 값
 */
const useDebounced = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 클린업 함수: 값이 변경되면 기존 타이머를 취소
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounced;
