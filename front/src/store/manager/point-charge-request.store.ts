import ChargeRequestListItem from 'types/interface/charge-request-list-item.interface';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface PointChargeRequestStore {
  chargeRequests: ChargeRequestListItem[];
  setChargeRequests: (chargeRequests: ChargeRequestListItem[]) => void;
  removeChargeRequest: (chargeRequest: ChargeRequestListItem) => void;
}

// Zustand 상태 생성
const usePointChargeRequestStore = create<PointChargeRequestStore>()(
  devtools((set) => ({
    chargeRequests: [],
    setChargeRequests: (chargeRequests) => set({ chargeRequests }),
    removeChargeRequest: (chargeRequest) => 
      set((state) => ({
          chargeRequests: state.chargeRequests.filter((request) => request.pointChargeId !== chargeRequest.pointChargeId)
      }))
  }))
);

export default usePointChargeRequestStore;
