import { MenuPageItem } from 'types/interface';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface MenuPageStore {
  subPage: String;
  category: string;
  editMenu: MenuPageItem | null;
  menuList: MenuPageItem[];
  editSequence: boolean;
  menuSequence: { menuId: number; sequence: number }[];
  setSubPage: (subPage: string) => void;
  setCategory: (category: string) => void;
  setMenuList: (menuList: MenuPageItem[]) => void;
  setEditMenu: (menu: MenuPageItem | null) => void;
  setEditSequence: (boolean: boolean) => void;
  resetMenuSequence: () => void; // 추가된 함수
  toggleEditSequence: () => void;
  removeMenuSequence: (menuId: number) => void; // 추가된 함수
  appendMenuSequence: (menuId: number, sequence: number) => void; // 추가된 함수
  updateMenuListBySequence: () => MenuPageItem[];
}

// Zustand 상태 생성
const useMenuPageStore = create<MenuPageStore>()(
  devtools((set, get) => ({
    subPage: '메뉴관리',
    category: '커피', // 기본값 설정
    menuList: [], // 기본 메뉴 리스트 초기화
    editMenu: null,
    menuSequence: [],
    editSequence: false,
    setSubPage: (subPage) => set({ subPage: subPage }),
    setEditMenu: (menu) => set({ editMenu: menu }),
    setCategory: (category) => set({ category: category }),
    setMenuList: (menuList) => set({ menuList }, false, 'MenuPageStore/setMenuList'),
    setEditSequence: (boolean) => set({ editSequence: boolean }),
    resetMenuSequence: () => set({ menuSequence: [] }),
    toggleEditSequence: () => set(state => ({ editSequence: !state.editSequence })),
    removeMenuSequence: (menuId) => set(state => ({ menuSequence: state.menuSequence.filter(item => item.menuId !== menuId) })),
    appendMenuSequence: (menuId, sequence) => set(state => {
      // 기존 menuSequence 복사
      const updatedMenuSequence = [...state.menuSequence];
      // menuId가 이미 존재하는지 확인
      const existingIndex = updatedMenuSequence.findIndex((item) => item.menuId === menuId);
      if (existingIndex !== -1) {
        // 기존 항목이 있으면 업데이트
        updatedMenuSequence[existingIndex].sequence = sequence;
      } else {
        // 기존 항목이 없으면 새로 추가
        updatedMenuSequence.push({ menuId, sequence });
      }
      return { menuSequence: updatedMenuSequence };
    }),
    updateMenuListBySequence: () => {
      const updatedMenuList = get().menuList.map((menu) => {
        const matchedSequence = get().menuSequence.find((seq) => seq.menuId === menu.menuId);
        return matchedSequence ? { ...menu, sequence: matchedSequence.sequence } : menu;
      });

      const sortedMenuList = updatedMenuList.sort((a, b) => a.sequence - b.sequence);

      // 상태 업데이트
      set({ menuList: sortedMenuList });

      // 정렬된 menuList 반환
      return sortedMenuList;
    }
  }))
);

export default useMenuPageStore;
