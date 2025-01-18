import { SortedUser } from 'types/interface';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserPageStore {

  end: boolean;
  name: string;
  sort: string;
  page: number,
  users: SortedUser[];
  limited: number;
  editUser: SortedUser | null;
  isLoading: boolean;
  directPoint: string;
  setEnd: (boolean: boolean) => void;
  setName: (name: string) => void;
  setSort: (sort: string) => void;
  setPage: (page: number) => void;
  addUsers: (users: SortedUser[]) => void;
  resetUsers: () => void;
  setLimited: (limited: number) => void;
  setEditUser: (user: SortedUser | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setDirectPoint: (directPoint: string) => void;
}

// Zustand 상태 생성
const useUserPageStore = create<UserPageStore>()(
  devtools((set) => ({

    end: false,
    name: '',
    sort: '최근',
    page: 0,
    users: [],
    limited: 10,
    editUser: null,
    isLoading: false,
    directPoint: '',
    setEnd: (boolean) => set({ end: boolean }),
    setName: (name) => set({ name: name }),
    setSort: (sort) => set({ sort: sort }),
    setPage: (page: number) => set({ page }),
    addUsers: (newUsers: SortedUser[]) =>
      set((state) => {
        // 기존 users를 복사
        const existingUsersMap = new Map(state.users.map((user) => [user.userId, user]));

        // 새로운 users를 기존 users에 병합
        newUsers.forEach((user) => {
          existingUsersMap.set(user.userId, user); // 기존 userId가 있으면 덮어씌움
        });

        // Map에서 고유한 users 배열 생성
        const uniqueUsers = Array.from(existingUsersMap.values());

        return { users: uniqueUsers };
      }),
    setLimited: (limited: number) => set({ limited }),
    resetUsers: () => set({ users: [] }),  // users를 초기화하는 함수
    setEditUser: (user) => set({ editUser: user }),
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setDirectPoint: (directPoint) => set({ directPoint: directPoint }),
  }))
);

export default useUserPageStore;
