import { OrderList } from 'types/interface';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface OrderListPageStore {
    end: boolean;
    name: string;
    page: number;
    status: string;
    limited: number;
    isLoading: boolean;
    orders: OrderList[];
    setEnd: (boolean: boolean) => void;
    setName: (name: string) => void;
    setPage: (page: number) => void;
    setStatus: (status: string) => void;
    setOrders: (orders: OrderList[]) => void;
    setIsLoading: (isLoading: boolean) => void;
    setLimited: (limited: number) => void;
    resetOrders: () => void;  // resetOrders 함수 추가
}

// Zustand 상태 생성
const useOrderListPageStore = create<OrderListPageStore>()(
    devtools((set) => ({
        end: false,
        name: '',
        page: 0,
        status: '모두',
        limited: 10,
        isLoading: false,
        orders: [],
        setEnd: (boolean: boolean) => set({ end: boolean }),
        setName: (name: string) => set({ name }),
        setPage: (page: number) => set({ page }),
        setStatus: (status: string) => set({ status }),
        setOrders: (newOrders: OrderList[]) =>
            set((state) => {
                // 기존 orders와 newOrders를 합친 후 중복 제거
                const updatedOrders = [...state.orders, ...newOrders];

                // 중복된 orderId를 제거 (orderId가 고유하다고 가정)
                const uniqueOrders = Array.from(new Set(updatedOrders.map(order => order.orderId)))
                    .map(id => updatedOrders.find(order => order.orderId === id))
                    .filter((order): order is OrderList => order !== undefined); // undefined를 필터링

                return { orders: uniqueOrders };
            }),
        setIsLoading: (isLoading: boolean) => set({ isLoading }),
        setLimited: (limited: number) => set({ limited }),
        resetOrders: () => set({ orders: [] }),  // orders를 초기화하는 함수
    }))
);

export default useOrderListPageStore;
