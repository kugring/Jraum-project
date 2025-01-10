import { User } from 'types/interface';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ManagerStore {
    pin: string;
    manager: User | null;
    message: string;
    cashPrice: number;
    cashPayWaiting: boolean;
    popPin: () => void;
    setPin: (pin: string) => void;
    pushPin: (digit: string) => void;
    setMessage: (message: string) => void;
    setManager: (manager: User) => void;
    resetManager: () => void;
    setCashPrice: (price: number) => void;
    setCashPayWaiting: (boolean: boolean) => void;
}

// Zustand 상태 생성
const useManagerStore = create<ManagerStore>()(
    devtools((set) => ({
        pin: '',
        message: '',
        manager: null,
        cashPrice: 0,
        cashPayWaiting: false,
        setPin: (pin) => set({ pin }),
        popPin: () => set((state) => ({ pin: state.pin.slice(0, -1) })),
        pushPin: (digit) => set((state) => ({ pin: state.pin.length < 4 ? state.pin + digit : state.pin })),
        setMessage: (message) => set({ message }),
        setManager: (manager) => set({ manager }),
        resetManager: () => set({ manager: null }),
        setCashPrice: (price) => set({ cashPrice: price }),
        setCashPayWaiting: (boolean) => set({ cashPayWaiting: boolean }),
    }))
);
export default useManagerStore;
