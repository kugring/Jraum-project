import { MenuPageItem } from 'types/interface';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface MenuPageStore {
  category: string;
  menuList: MenuPageItem[];
  setCategory: (category: string) => void;
  setMenuList: (menuList: MenuPageItem[]) => void;
  editMenu: MenuPageItem | null;
  setEditMenu: (menu: MenuPageItem | null) => void;
}

// Zustand 상태 생성
const useMenuPageStore = create<MenuPageStore>()(
  devtools((set) => ({
    category: '커피', // 기본값 설정
    menuList: [], // 기본 메뉴 리스트 초기화
    editMenu: null,
    setEditMenu: (menu) => set({ editMenu: menu }),
    setCategory: (category) => set({ category: category }),
    setMenuList: (menuList) =>
      set({ menuList }, false, 'MenuPageStore/setMenuList'),
  }))
);

export default useMenuPageStore;
