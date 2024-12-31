import { User } from 'types/interface';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ManagerStore {
    pin: string;
    manager: User | null;
    message: string;
    popPin: () => void;
    setPin: (pin: string) => void;
    pushPin: (digit: string) => void;
    setMessage: (message: string) => void;
    setManager: (manager: User) => void;
    resetManager: () => void;
}

// Zustand 상태 생성
const useManagerStore = create<ManagerStore>()(
    devtools((set) => ({
        manager: null,
        message: '',
        pin: '',
        setPin: (pin) => set({ pin }),
        popPin: () => set((state) => ({ pin: state.pin.slice(0, -1) })),
        pushPin: (digit) => set((state) => ({ pin: state.pin.length < 4 ? state.pin + digit : state.pin })),
        setMessage: (message) => set({ message }),
        setManager: (manager) => set({ manager }),
        resetManager: () => set({manager: null}),

    }))
);
export default useManagerStore;
