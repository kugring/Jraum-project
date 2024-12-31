import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface PointChargeStore {
  charging: boolean;
  chargePoint: number;
  pointChargeId: number;
  badgeEdit: (value: number) => void;
  buttonEdit: (value: string) => void;
  setCharging: (boolean: boolean) => void;
  handleDelete: () => void;
  setChargePoint: (value: number) => void;
  setPointChargeId: (value: number) => void;
}

// Zustand 스토어 생성
const usePointChargeStore = create<PointChargeStore>()(
  devtools(
    (set) => ({
      charging: false,
      chargePoint: 0,
      pointChargeId: 0,


      // 뱃지 버튼으로 충전 입력
      badgeEdit: (value) => set((state) => ({ chargePoint: state.chargePoint + value })),

      // 숫자 버튼으로 충전 입력
      buttonEdit: (value) => set((state) => ({ chargePoint: parseInt(`${state.chargePoint}${value}`, 10) })),

      // 충전 상태를 설정
      setCharging: (boolean) => set((state) => ({ charging: state.charging = boolean })),

      // 숫자 뒤 한 자리 삭제
      handleDelete: () => set((state) => ({ chargePoint: state.chargePoint === 0 ? 0 : Math.floor(state.chargePoint / 10) })),

      // 충전 금액 직접 설정
      setChargePoint: (value) => set({ chargePoint: value }),

      // 충전 요청 Id 직접 설정
      setPointChargeId: (value) => set({ pointChargeId: value }),
    })
  )
);

// 충전 금액 제한 로직 (chargePoint가 1,000,000을 초과하지 않도록 설정)
usePointChargeStore.subscribe((state) => {
  if (state.chargePoint > 1000000) {
    state.setChargePoint(1000000);
  }
});

export default usePointChargeStore;
