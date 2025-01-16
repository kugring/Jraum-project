import { SortedUser } from 'types/interface';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserPageModalStore {
  // 상태 변수들
  pin: string;
  name: string;
  userId: string;
  canPin: boolean;
  nickname: string;
  initialName: string;
  canNickname: boolean;
  phoneNumber: string;
  directPoint: string;
  profileImage: string;
  openDropdowns: { office: boolean; position: boolean };
  selectedValues: { office: string; position: string };
  
  // 상태 업데이트 함수들
  setPin: (pin: string) => void;
  setName: (name: string) => void;
  setUserId: (userId: string) => void;
  setCanPin: (canPin: boolean) => void;
  setNickname: (nickname: string) => void;
  setInitialName: (initialName: string) => void;
  setCanNickname: (canNickname: boolean) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setDirectPoint: (directPoint: string) => void;
  setProfileImage: (profileImage: string) => void;
  setOpenDropdowns: (update: (prevState: { office: boolean; position: boolean }) => { office: boolean; position: boolean }) => void;
  setSelectedValues: (update: (prevState: { office: string; position: string }) => { office: string; position: string }) => void;
  resetState: (user: SortedUser | null) => void;
}

// Zustand 상태 생성
const useUserPageModalStore = create<UserPageModalStore>()(
  devtools((set) => ({
    // 초기 상태 값들
    pin: '',
    name: '',
    userId: '',
    canPin: false,
    nickname: '',
    initialName: '',
    canNickname: false,
    phoneNumber: '',
    directPoint: '0',
    profileImage: '',
    openDropdowns: { office: false, position: false },
    selectedValues: { office: '선택', position: '선택' },

    // 상태 업데이트 함수들
    setPin: (pin) => set({ pin }),
    setName: (name) => set({ name }),
    setCanPin: (canPin) => set({ canPin }),
    setUserId: (userId) => set({ userId }),
    setNickname: (nickname) => set({ nickname }),
    setInitialName: (initialName) => set({ initialName }),
    setCanNickname: (canNickname) => set({ canNickname }),
    setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
    setDirectPoint: (directPoint) => set({ directPoint }),
    setProfileImage: (profileImage) => set({ profileImage }),
    setOpenDropdowns: (update) => set((state) => ({ openDropdowns: update(state.openDropdowns) })),
    setSelectedValues: (update) => set((state) => ({ selectedValues: update(state.selectedValues) })),
    resetState: (user: SortedUser | null = null) =>
      set({
        pin: user?.pin || "",
        name: user?.name || "",
        canPin: !!user?.pin,
        userId: user?.userId || "",
        nickname: user?.nickname || "",
        initialName: user?.initialName || "",
        phoneNumber: user?.phoneNumer || "",
        canNickname: !!user?.nickname,
        selectedValues: {
          position: user?.position || "선택",
          office: user?.office || "선택",
        },
        profileImage: user?.profileImage || undefined, // null 대신 undefined 사용
      }),
  }))
);

export default useUserPageModalStore;
