import { OrderManagement } from 'types/interface';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface OrderManagementStore {
    orders?: OrderManagement[];
    showOrder: OrderManagement | null;
    setOrders: (orders: OrderManagement[]) => void;
    setShowOrder: (order: OrderManagement) => void;
    removeOrderById: (orderId: number) => void;
    addOrder: (order: OrderManagement) => void; // addOrder 함수 추가
}

// Zustand 상태 생성
const useOrderManagementStore = create<OrderManagementStore>()(
    devtools((set) => ({
        orders: [],
        showOrder: null,
        setOrders: (orders) => set({ orders: orders }),
        setShowOrder: (order) => set({ showOrder: order }),
        removeOrderById: (orderId: number) => set((state) => ({ orders: state.orders!.filter(order => order.orderId !== orderId) })),
        addOrder: (order) => set((state) => ({ orders: [...state.orders!, order] })),
    }))
);
export default useOrderManagementStore;
