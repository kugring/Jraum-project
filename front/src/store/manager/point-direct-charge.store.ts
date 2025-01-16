import { SortedUser } from 'types/interface';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface PointDirectChargeStore {
  end: boolean,
  name: string;
  sort: string;
  page: number,
  limited: number;
  isLoading: boolean;
  users: SortedUser[];
  directPoint: string;
  setEnd: (boolean: boolean) => void;
  setName: (name: string) => void;
  setSort: (sort: string) => void;
  setUsers: (users: SortedUser[]) => void;
  setDirectPoint: (directPoint: string) => void;


  setPage: (page: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setLimited: (limited: number) => void;
  resetUsers: () => void;
}

// Zustand 상태 생성
const usePointDirectChargeStore = create<PointDirectChargeStore>()(
  devtools((set) => ({
    end: false,
    name: '',
    sort: '최근',
    page: 0,
    limited: 15,
    isLoading: false,
    users: [],
    directPoint: '',
    setEnd: (boolean) => set({ end: boolean }),
    setName: (name) => set({ name: name }),
    setSort: (sort) => set({ sort: sort }),
    setDirectPoint: (directPoint) => set({ directPoint: directPoint }),
    setPage: (page: number) => set({ page }),
    setUsers: (newUsers: SortedUser[]) =>
      set((state) => {
        // 기존 users와 newUsers를 합친 후 중복 제거
        const updatedUsers = [...state.users, ...newUsers];

        // 중복된 userId를 제거 (userId가 고유하다고 가정)
        const uniqueUsers = Array.from(new Set(updatedUsers.map(user => user.userId)))
          .map(id => updatedUsers.find(user => user.userId === id))
          .filter((user): user is SortedUser => user !== undefined); // undefined를 필터링

        return { users: uniqueUsers };
      }),
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setLimited: (limited: number) => set({ limited }),
    resetUsers: () => set({ users: [] }),  // users를 초기화하는 함수

  }))
);

export default usePointDirectChargeStore;
