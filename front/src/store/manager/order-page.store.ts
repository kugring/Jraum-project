import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface OrderPageStore {
  subPage: String;
  setSubPage: (subPage: string) => void;
}

// Zustand 상태 생성
const useOrderPageStore = create<OrderPageStore>()(
  devtools((set) => ({
    subPage: '주문관리',
    setSubPage: (subPage) =>  set({subPage: subPage})
  }))
);

export default useOrderPageStore;
