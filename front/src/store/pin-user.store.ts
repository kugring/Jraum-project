import { User } from 'types/interface';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface PinUserStore {
    pin: string;
    message: string;
    payment: string;
    pinUser: User | null;
    popPin: () => void;
    setPin: (pin: string) => void;
    pushPin: (digit: string) => void;
    setPinUser: (pinUser: User) => void;
    setMessage: (message: string) => void;
    setPayment: (payment: string) => void;
    resetPinUser: () => void;
}

// Zustand 상태 생성
const usePinUserStore = create<PinUserStore>()(
    devtools((set) => ({
        pin: '',
        message: '',
        payment: '',
        pinUser: null,
        popPin: () => set((state) => ({ pin: state.pin.slice(0, -1) })),
        setPin: (pin) => set({ pin }),
        pushPin: (digit) => set((state) => ({ pin: state.pin.length < 4 ? state.pin + digit : state.pin })),
        setPayment: (payment) => set({ payment }),
        setMessage: (message) => set({ message }),
        setPinUser: (pinUser) => set({ pinUser }),
        resetPinUser: () => set({ pinUser: null }),
    }))
);

export default usePinUserStore;
