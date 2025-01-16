import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserPageModalStore {
  // 상태 변수들
  profileImage: string;
  pin: string;
  canPin: boolean;
  name: string;
  initialName: string;
  nickname: string;
  canNickname: boolean;
  phoneNumber: string;
  directPoint: string;
  openDropdowns: { office: boolean; position: boolean };
  selectedValues: { office: string; position: string };
  
  // 상태 업데이트 함수들
  setProfileImage: (profileImage: string) => void;
  setPin: (pin: string) => void;
  setCanPin: (canPin: boolean) => void;
  setName: (name: string) => void;
  setInitialName: (initialName: string) => void;
  setNickname: (nickname: string) => void;
  setCanNickname: (canNickname: boolean) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setDirectPoint: (directPoint: string) => void;

  setOpenDropdowns: (update: (prevState: { office: boolean; position: boolean }) => { office: boolean; position: boolean }) => void;
  setSelectedValues: (update: (prevState: { office: string; position: string }) => { office: string; position: string }) => void;
}

// Zustand 상태 생성
const useUserPageModalStore = create<UserPageModalStore>()(
  devtools((set) => ({
    // 초기 상태 값들
    profileImage: '',
    pin: '',
    canPin: false,
    name: '',
    initialName: '',
    nickname: '',
    canNickname: false,
    phoneNumber: '',
    directPoint: '0',
    openDropdowns: { office: false, position: false },
    selectedValues: { office: '선택', position: '선택' },

    // 상태 업데이트 함수들
    setProfileImage: (profileImage) => set({ profileImage }),
    setPin: (pin) => set({ pin }),
    setCanPin: (canPin) => set({ canPin }),
    setName: (name) => set({ name }),
    setInitialName: (initialName) => set({ initialName }),
    setNickname: (nickname) => set({ nickname }),
    setCanNickname: (canNickname) => set({ canNickname }),
    setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
    setDirectPoint: (directPoint) => set({ directPoint }),
    setOpenDropdowns: (update) => set((state) => ({ openDropdowns: update(state.openDropdowns) })),
    setSelectedValues: (update) => set((state) => ({ selectedValues: update(state.selectedValues) })),
  }))
);

export default useUserPageModalStore;
