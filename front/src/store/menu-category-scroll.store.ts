import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface MenuCategoryScrollStore {
    scrollCategory: string;
    setScrollCategory: (category: string) => void
}

// Zustand 상태 생성
const useMenuCategoryScrollStore = create<MenuCategoryScrollStore>()(
    devtools((set) => ({
        scrollCategory: '',
        setScrollCategory: (category) => set({scrollCategory: category})
    }))
);

export default useMenuCategoryScrollStore;
