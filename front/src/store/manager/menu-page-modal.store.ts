import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { MenuPageItem } from 'types/interface';

interface MenuPageModalStore {
  // 상태 변수들
  name: string;
  image: string;
  price: string;
  menuId: number;
  status: boolean;
  options: string[];
  openDropdowns: { category: boolean; temperature: boolean; espressoShot: boolean };
  selectedValues: { category: string; temperature: string; espressoShot: string };

  // 상태 업데이트 함수들
  setName: (name: string) => void;
  setImage: (image: string) => void;
  setPrice: (price: string) => void;
  setMenuId: (menuId: number) => void;
  setStatus: (status: boolean) => void;
  setOptions: (options: string[]) => void;
  setOpenDropdowns: (update: (prevState: { category: boolean; temperature: boolean; espressoShot: boolean }) => { category: boolean; temperature: boolean; espressoShot: boolean }) => void;
  setSelectedValues: (update: (prevState: { category: string; temperature: string; espressoShot: string }) => { category: string; temperature: string; espressoShot: string }) => void;
  resetState: (menu: MenuPageItem | null) => void;
  
  // 새로운 toggleOption 함수 추가
  toggleOption: (option: string) => void;
}

// Zustand 상태 생성
const useMenuPageModalStore = create<MenuPageModalStore>()(
  devtools((set) => ({
    // 초기 상태 값들
    name: '',
    image: '',
    price: '',
    menuId: 0,
    options: [],
    status: true,
    openDropdowns: { category: false, temperature: false, espressoShot: false },
    selectedValues: { category: '선택', temperature: '선택', espressoShot: '선택' },

    // 상태 업데이트 함수들
    setName: (name) => set({ name }),
    setImage: (image) => set({ image }),
    setPrice: (price) => set({ price }),
    setMenuId: (menuId) => set({ menuId }),
    setStatus: (status) => set({ status }),
    setOptions: (options) => set({ options }),
    setOpenDropdowns: (update) => set((state) => ({ openDropdowns: update(state.openDropdowns) })),
    setSelectedValues: (update) => set((state) => ({ selectedValues: update(state.selectedValues) })),
    resetState: (menu: MenuPageItem | null) => {
      const menuOptions: string[] = menu?.options
        ? menu.options
            .map((menuOption) =>
              menuOption.category === "시럽"
                ? menuOption.detail + "시럽"
                : menuOption.category
            )
            .filter((value, index, self) => self.indexOf(value) === index)
        : [];
    
      set({
        name: menu?.name || "",
        menuId: menu?.menuId || 0,
        status: menu?.status === 1 || true,
        price: String(menu?.price || 0),
        selectedValues: {
          category: menu?.category || "선택",
          temperature: menu?.temperature || "선택",
          espressoShot: String(menu?.espressoShot || 0),
        },
        image: menu?.image || "",
        options: menuOptions, // menu.options에서 파생된 값 설정
      });
    },
    // toggleOption 함수 추가
    toggleOption: (option) =>
      set((state) => {
        // 'options' 배열에서 'option'을 추가하거나 제거
        const options = state.options.includes(option)
          ? state.options.filter((item) => item !== option) // 옵션이 있으면 제거
          : [...state.options, option]; // 없으면 추가

        return { options };
      }),
  }))
);

export default useMenuPageModalStore;
