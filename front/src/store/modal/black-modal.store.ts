import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface BlackModalStore {
  isModalOpen: boolean;
  whiteModal: string;
  openModal: () => void;
  closeModal: () => void;
  setWhiteModal: (modal: string) => void;
}

// devtools 미들웨어를 사용할 때 타입을 올바르게 지정
const useBlackModalStore = create<BlackModalStore>()(
  devtools(
    (set) => ({
      isModalOpen: false,
      whiteModal: '',
      setWhiteModal: (modal: string) => set({ whiteModal: modal }),
      openModal: () => set({ isModalOpen: true }),
      closeModal: () => set({ isModalOpen: false }),
    }),
  )
);

export default useBlackModalStore;
