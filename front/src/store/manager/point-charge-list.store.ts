import PointChargeDetail from 'types/interface/point-charge-detail.interface';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface PointChargeListStore {
    name: string;
    page: number;
    status: string;
    limited: number;
    isLoading: boolean;
    chargeList: PointChargeDetail[];
    setName: (name: string) => void;
    setPage: (page: number) => void;
    setStatus: (status: string) => void;
    setChargeList: (chargeList: PointChargeDetail[]) => void;





    setIsLoading: (isLoading: boolean) => void;
    setLimited: (limited: number) => void;
    resetChargeList: () => void;
}

// Zustand 상태 생성
const usePointChargeListStore = create<PointChargeListStore>()(
    devtools((set) => ({
        name: '',
        page: 0,
        status: '모두',
        limited: 10,
        isLoading: false,
        chargeList: [],
        setName: (name: string) => set({ name }),
        setPage: (page: number) => set({ page }),
        setStatus: (status: string) => set({ status }),
        setChargeList: (newChargeList: PointChargeDetail[]) =>
            set((state) => {
                // 기존 chargeList와 newChargeList를 합친 후 중복 제거
                const updatedChargeList = [...state.chargeList, ...newChargeList];
                // 중복된 pointChargeId를 제거 (pointChargeId가 고유하다고 가정)
                const uniqueChargeList = Array.from(new Set(updatedChargeList.map(charge => charge.pointChargeId)))
                    .map(id => updatedChargeList.find(charge => charge.pointChargeId === id))
                    .filter((charge): charge is PointChargeDetail => charge !== undefined); // undefined를 필터링
                return { chargeList: uniqueChargeList };
            }),
        setIsLoading: (isLoading: boolean) => set({ isLoading }),
        setLimited: (limited: number) => set({ limited }),
        resetChargeList: () => set({ chargeList: [] }),
    }))
);

export default usePointChargeListStore;
