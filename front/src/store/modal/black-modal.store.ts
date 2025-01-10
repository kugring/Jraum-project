import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface BlackModalStore {
  isModalOpen: boolean;
  whiteModal: string;
  message: string;
  callback: (() => void) | null; // 콜백 함수를 상태로 저장
  openModal: () => void;
  closeModal: () => void;
  setMessage: (message: string) => void;
  setCallback: (cb: () => void) => void; // 콜백 함수 설정
  executeCallback: () => void; // 저장된 콜백 함수 실행
  setWhiteModal: (modal: string) => void;
}

// devtools 미들웨어를 사용할 때 타입을 올바르게 지정
const useBlackModalStore = create<BlackModalStore>()(
  devtools(
    (set, get) => ({
      isModalOpen: false,
      whiteModal: '',
      callback: null, // 초기 콜백은 null
      message: '',
      setMessage: (message) => set({ message }),
      openModal: () => set({ isModalOpen: true }),
      closeModal: () => set({ isModalOpen: false }),
      setCallback: (cb: () => void) => set({ callback: cb }), // 콜백 함수 설정
      executeCallback: () => {
        const { callback } = get(); // 저장된 콜백 함수 가져오기
        if (callback) {
          callback(); // 콜백 함수 실행
        } else {
          console.error("Callback function is not set.");
        }
      },
      setWhiteModal: (modal: string) => set({ whiteModal: modal }),
    }),
  ),
);

export default useBlackModalStore;
