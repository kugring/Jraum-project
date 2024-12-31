import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface PointPageStore {
  subPage: String;
  setSubPage: (subPage: string) => void;
}

// Zustand 상태 생성
const usePointPageStore = create<PointPageStore>()(
  devtools((set) => ({
    subPage: '직접충전',
    setSubPage: (subPage) =>  set({subPage: subPage})
  }))
);

export default usePointPageStore;
