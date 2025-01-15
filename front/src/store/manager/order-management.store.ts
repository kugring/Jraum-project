import { OrderManagement } from 'types/interface';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface OrderManagementStore {
    orders?: OrderManagement[];
    openTTS: boolean;
    showOrder: OrderManagement | null;
    addOrder: (order: OrderManagement) => void;
    setOrders: (orders: OrderManagement[]) => void;
    setOpenTTS: (boolean: boolean) => void;
    setShowOrder: (order: OrderManagement) => void;
    toggleOpenTTS: () => void;  // 토글 함수 추가
    removeOrderById: (orderId: number) => void;
}

// Zustand 상태 생성
const useOrderManagementStore = create<OrderManagementStore>()(
    devtools((set) => ({
        orders: [],
        openTTS: true,
        showOrder: null,
        addOrder: (order) => set((state) => ({ orders: [...state.orders!, order] })),
        setOrders: (orders) => set({ orders: orders }),
        setOpenTTS: (boolean) => set({ openTTS: boolean }),
        setShowOrder: (order) => set({ showOrder: order }),
        toggleOpenTTS: () => set((state) => ({ openTTS: !state.openTTS })),
        removeOrderById: (orderId: number) => set((state) => ({ orders: state.orders!.filter(order => order.orderId !== orderId) })),
    }))
);

export default useOrderManagementStore;
